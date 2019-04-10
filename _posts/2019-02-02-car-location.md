---
  layout: pure
  title: car-location
---
<style>
    
    h2{
        font-size: 1rem;
    }
    html{
        height: 100%;
    }
    body{
        height: 100%;
        padding: 0;
        margin: 0;
        font-family: '微软雅黑';
        font-size: 14px;
    }
    .container{
        height: 500px;
    }
    .log{
        height: 1.5rem;
        height: 1.5rem;
        color: #d60000;
    }
    @media screen and (max-width: 500px) {
        body,html {
            font-size: 28px;
            
        }
        h2{
            display: none;
        }
    }
</style>
<div id="head">
    <h1>car-location</h1>
    <form id="searchForm">
        <label for="apiKey">ApiKey：</label>
        <input id="apiKey" type="text" value="0XlwMJm8U42KEZ394N4p8hm2p=s=" />
        <label for="deviceId">设备ID：</label>
        <input id="deviceId" type="text" value="517162506" />
        <label for="startTime">开始时间：</label>
        <input id="startTime" type="datetime-local" />
        <label for="endTime">结束时间：</label>
        <input id="endTime" type="datetime-local" />
        <label for="pointCount">点数量：</label>
        <input id="pointCount" type="text" value="500" />
        <input id="searchButton" type="submit" value="查询" />
        <input id="prevButton" type="button" value="前一天" />
        <input id="nextButton" type="button" value="后一天" />
    </form>
    <div id="log" class="log"></div>
</div>
<div class="container" id="baiduMapCtn"></div>
<script type="text/javascript" src="//api.map.baidu.com/api?v=3.0&ak=XwGhtOZnTOQk7lFssFiI1GR3"></script>
<script src="/resource/2019/onenetsdk.min.js"></script>
<script src="/resource/2019/map_convertor.js"></script>
<script>
    function $(id){
        return document.getElementById(id);
    }
    /* function getNormalizedDateTimeString(date){//date是标准的Date对象
        var iosString = date.toISOString();
        return iosString.replace(/\..+/, '');
    } */
    function getDoubleDigit(number){
        return number < 10 ? ('0' + number) : number;
    }
    function calcVelocity(pointStart, pointEnd){
        var timeCost = new Date(pointEnd.at) - new Date(pointStart.at);
        var distance = GPS.distance(pointStart.value.lat, pointStart.value.lon, pointEnd.value.lat, pointEnd.value.lon);
        return distance / timeCost;
    }
    function getVelocityGroup(velocity){ //计算单位为米/微秒
        /* 
        5 0.00138
        10 0.00278 
        15 0.00417 
        20 0.00556
        30 0.00833
        40 0.01111
        */
        if(velocity < 0.00138){
            return 5;
        }else if(velocity < 0.00417){
            return 15;
        }else if(velocity < 0.00833){
            return 30;
        }else{
            return 100;
        }
    }
    var VelocityGroupColor = {
        5: '#b40000',
        15: '#e80e0e',
        30: '#f3ed49',
        100: '#4fd27d',
    }
    function splitDatapointsByVelocity(dataPoints){
        let splitedPoints = [];
        let currentVelocityGroup, 
            previousVelocityGroup = getVelocityGroup(calcVelocity(dataPoints[0], dataPoints[1])),
            tempPoints = {
                points: [getBMapPoint(dataPoints[0].value)],
                velocityGroup: previousVelocityGroup
            };
        splitedPoints.push(tempPoints);
        for(let i = 1; i < dataPoints.length - 1; i++){
            currentVelocityGroup = getVelocityGroup(calcVelocity(dataPoints[i], dataPoints[i + 1]));
            if(currentVelocityGroup == previousVelocityGroup){ //当前两个点的速度和前两个点的速度属于同一个组
                tempPoints.points.push(getBMapPoint(dataPoints[i].value));
            }else{
                tempPoints = {
                    points: [getBMapPoint(dataPoints[i-1].value), getBMapPoint(dataPoints[i].value)],
                    velocityGroup: currentVelocityGroup
                };
                splitedPoints.push(tempPoints);
            }
            previousVelocityGroup = currentVelocityGroup;
        }
        return splitedPoints;
    }
    function getBMapPoint(point){
        var bdGps = GPS.GPSToBaidu(point.lat, point.lon);
        return new BMap.Point(bdGps.lng, bdGps.lat);
    }
    var $apiKey = $('apiKey');
    var $deviceId = $('deviceId');
    var $startTime = $('startTime');
    var $endTime = $('endTime');
    var $pointCount = $('pointCount');
    var $prevButton = $('prevButton');
    var $nextButton = $('nextButton');
    var $searchButton = $('searchButton');
    var $log = $('log');
    $('baiduMapCtn').style.height = (document.body.offsetHeight - $('head').offsetHeight) + 'px'
    function CarMarker(deviceId, start, end){
        var _this = this;
        this.start = start;
        this.end = end;
        var api = new OneNetApi($apiKey.value);
        this._api = api;
        api.getDeviceInfo(deviceId).then(function(res){
            console.log('api调用完成，服务器返回data为：', res);
            _this._deviceTitle = res.data.title;
            _this.showHistory(deviceId);
        });
    }
    CarMarker.prototype.showHistory = function(deviceId){
        this._api.getDataPoints(deviceId, {datastream_id:'Gps', start: this.start, end: this.end, limit: $pointCount.value}).then(function(res){
            console.log('api调用完成，服务器返回data为：', res);
            $log.innerHTML = '本次共渲染' + res.data.count + '个点';
            pageControl.baiduMap.resetMarker(splitDatapointsByVelocity(res.data.datastreams[0].datapoints));
        });
    }
    var pageControl = {
        init: function(){
            this.baiduMapCtn = document.getElementById("baiduMapCtn");
            this.baiduMap.init(this.baiduMapCtn);
            var _this = this;
            this.initTimeRound(new Date());
            if(localStorage.getItem('apiKey')){
                //0XlwMJm8U42KEZ394N4p8hm2p=s=
                $apiKey.value = localStorage.getItem('apiKey');
            }
            $searchButton.onclick = function(e){
                if($apiKey.value.trim()){
                    localStorage.setItem('apiKey', $apiKey.value.trim());
                }
                e.preventDefault();
                new CarMarker($deviceId.value, $startTime.value, $endTime.value);
            }
            $prevButton.onclick = function(){
                var dateCurrent = new Date($startTime.value);
                var dateNew = new Date(+dateCurrent - 3600 * 1000 * 24);
                _this.initTimeRound(dateNew);
                $searchButton.click();
            }
            $nextButton.onclick = function(){
                var dateCurrent = new Date($startTime.value);
                var dateNew = new Date(+dateCurrent + 3600 * 1000 * 24);
                _this.initTimeRound(dateNew);
                $searchButton.click();
            }
        },
        initTimeRound: function(date){
            var dateNow = new Date(date);
            $startTime.value = `${dateNow.getFullYear()}-${getDoubleDigit(dateNow.getMonth() + 1)}-${getDoubleDigit(dateNow.getDate())}T00:00:01`;
            $endTime.value = `${dateNow.getFullYear()}-${getDoubleDigit(dateNow.getMonth() + 1)}-${getDoubleDigit(dateNow.getDate())}T23:59:59`;
        },
        baiduMap: {
            init: function(ctn){
                var map = new BMap.Map(ctn);
                // 创建地图实例  
                var point = new BMap.Point(116.404, 39.915);
                // 创建点坐标  
                map.centerAndZoom(point, 15);
                // 初始化地图，设置中心点坐标和地图级别 
                var marker = new BMap.Marker(point); // 创建点
                map.enableScrollWheelZoom(true);
                map.addOverlay(marker);  
                this.marker = marker;
                this.map = map;
            },
            generateMarker: function(point){
                // 初始化地图，设置中心点坐标和地图级别 
                var marker = new BMap.Marker(point); // 创建点
                this.map.addOverlay(marker);  
                return marker;
            },
            resetMarker: function(splitedPoints){
                this.map.clearOverlays();
                var _this = this;
                console.log(splitedPoints)
                splitedPoints.forEach(item => {
                    _this.drawLine(item.points, VelocityGroupColor[item.velocityGroup]);
                });
                //加入marker
                var iconStart = new BMap.Icon('/resource/2019/markers_bg.png', new BMap.Size(25,40), {
                    imageSize: new BMap.Size(50, 40),
                    anchor: new BMap.Size(12, 40)
                });
                var markerStart = new BMap.Marker(splitedPoints[0].points[0], {icon:iconStart});
                var iconEnd = new BMap.Icon('/resource/2019/markers_bg.png', new BMap.Size(25,40), {
                    imageOffset: new BMap.Size(-25,0),
                    imageSize: new BMap.Size(50, 40),
                    anchor: new BMap.Size(12, 40)
                });
                var endPoints = splitedPoints[splitedPoints.length - 1].points;
                var markerEnd = new BMap.Marker(endPoints[endPoints.length - 1], {icon:iconEnd});
                this.map.addOverlay(markerStart); 
                this.map.addOverlay(markerEnd); 
            },
            drawLine: function(pointsArr, color){
                 var sy = new BMap.Symbol(BMap_Symbol_SHAPE_BACKWARD_OPEN_ARROW, {
                    scale: 0.6,//图标缩放大小
                    strokeColor:'#fff',//设置矢量图标的线填充颜色
                    strokeWeight: '2',//设置线宽
                });
                var icons = new BMap.IconSequence(sy, '10', '30'); 
                var polyline =new BMap.Polyline(pointsArr, {
                    enableEditing: false,//是否启用线编辑，默认为false
                    enableClicking: false,//是否响应点击事件，默认为true
                    //icons:[icons],
                    strokeWeight:'7',//折线的宽度，以像素为单位
                    strokeOpacity: 1,//折线的透明度，取值范围0 - 1
                    strokeColor: color //折线颜色
                });
                this.map.addOverlay(polyline);
                this.map.centerAndZoom(pointsArr[0], 15);
            }
        }        
    };
    pageControl.init(); 
    /* new CarMarker(517341974);
    new CarMarker(517341975);
    new CarMarker(517341976);
    new CarMarker(517341977);
    new CarMarker(517341978); */
</script>
