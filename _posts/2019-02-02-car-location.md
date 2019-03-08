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
   
    @media screen and (max-width: 500px) {
        body,html {
            font-size: 28px;
            
        }
        h2{
            display: none;
        }
        .picker{
            display: block;
        }
    }
</style>
<div id="head">
    <h1>car-location</h1>
    <form>
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
        <input id="searchButton" type="button" value="查询" />
    </form>
</div>
<div class="container" id="baiduMapCtn"></div>
<script type="text/javascript" src="//api.map.baidu.com/api?v=3.0&ak=XwGhtOZnTOQk7lFssFiI1GR3"></script>
<script src="/resource/2019/onenetsdk.min.js"></script>
<script src="/resource/2019/map_convertor.js"></script>
<script>
    function $(id){
        return document.getElementById(id);
    }
    function getNormalizedDateTimeString(date){//date是标准的Date对象
        var iosString = date.toISOString();
        return iosString.replace(/\..+/, '');
    }
    var $apiKey = $('apiKey');
    var $deviceId = $('deviceId');
    var $startTime = $('startTime');
    var $endTime = $('endTime');
    var $pointCount = $('pointCount');
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
            var pointsArr = res.data.datastreams[0].datapoints.map(function(item){
                var bdGps = GPS.GPSToBaidu(item.value.lat, item.value.lon);
                return new BMap.Point(bdGps.lng, bdGps.lat);
            });
            pageControl.baiduMap.resetMarker(pointsArr);
        });
    }
    var pageControl = {
        init: function(){
            this.baiduMapCtn = document.getElementById("baiduMapCtn");
            this.baiduMap.init(this.baiduMapCtn);
            var _this = this;
            this.initTimeRound();
            $('searchButton').onclick = function(){
                new CarMarker($deviceId.value, $startTime.value, $endTime.value);
            }
        },
        initTimeRound: function(){
            var dateNow = new Date();
            var dateWeekAgo = new Date(dateNow - 1000 * 60 * 60 * 24 * 7);
            $startTime.value = getNormalizedDateTimeString(dateWeekAgo);
            $endTime.value = getNormalizedDateTimeString(dateNow);
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
            resetMarker: function(pointsArr){
                var sy = new BMap.Symbol(BMap_Symbol_SHAPE_BACKWARD_OPEN_ARROW, {
                    scale: 0.6,//图标缩放大小
                    strokeColor:'#fff',//设置矢量图标的线填充颜色
                    strokeWeight: '2',//设置线宽
                });
                var icons = new BMap.IconSequence(sy, '10', '30');
                var polyline =new BMap.Polyline(pointsArr, {
                    enableEditing: false,//是否启用线编辑，默认为false
                    enableClicking: true,//是否响应点击事件，默认为true
                    //icons:[icons],
                    strokeWeight:'8',//折线的宽度，以像素为单位
                    strokeOpacity: 0.8,//折线的透明度，取值范围0 - 1
                    strokeColor:"#18a45b" //折线颜色
                });
                var _this = this;
                /* pointsArr.forEach(function(item){
                    var marker = new BMap.Marker(item); // 创建点
                    _this.map.addOverlay(marker);  
                }); */
                this.map.clearOverlays(); 
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
