---
  layout: main
  title: car-location
---
<style>
    h2{
        font-size: 1rem;
    }
    input{
        font-size: 0.8rem;
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
            font-size: 20px;
        }
        h2{
            display: none;
        }
    }
    #apiKey{
        width: 18em;
    }
</style>
<div id="head">
    <form id="searchForm">
        <label for="apiKey">ApiKey：</label>
        <input id="apiKey" type="text" />
        <label for="deviceId">设备ID：</label>
        <input id="deviceId" type="text" />
        <label for="startTime">开始时间：</label>
        <input id="startTime" type="datetime-local" />
        <label for="endTime">结束时间：</label>
        <input id="endTime" type="datetime-local" />
        <label for="pointCount">点数量：</label>
        <input id="pointCount" type="text" value="500" />
        <input id="searchButton" type="submit" value="查询" />
        <input id="prevDateButton" type="button" value="前一天" />
        <input id="nextDateButton" type="button" value="后一天" />
        <input id="prevPageButton" type="button" value="上一页" />
        <input id="nextPageButton" type="button" value="下一页" />
    </form>
    <div id="log" class="log">
    </div>
    <div id="lineGroupControl"></div>
</div>
<div class="container" id="baiduMapCtn"></div>
<script type="text/javascript" src="//api.map.baidu.com/api?v=3.0&ak=XwGhtOZnTOQk7lFssFiI1GR3"></script>
<script src="/resource/2019/onenetsdk.min.js"></script>
<script src="/resource/2019/map_convertor.js"></script>
<script>
    function $(id){
        return document.getElementById(id);
    }
    function getParameter(key){
        var searchArr = location.search.slice(1).split('&');
        for(let i = 0; i < searchArr.length; i++){
            let searchItem = searchArr[i].split('=');
            if(searchItem[0] == key){
                return decodeURIComponent(searchItem[1]);
            }
        }
    }
    /* function getNormalizedDateTimeString(date){//date是标准的Date对象
        var iosString = date.toISOString();
        return iosString.replace(/\..+/, '');
    } */
    function getDoubleDigit(number){
        return number < 10 ? ('0' + number) : number;
    }
    function calcVelocityAndDistance(pointStart, pointEnd){
        var timeCost = new Date(pointEnd.at) - new Date(pointStart.at);
        var distance = GPS.distance(pointStart.value.lat, pointStart.value.lon, pointEnd.value.lat, pointEnd.value.lon);
        return {distance: distance, velocity: distance / timeCost};
    }
    function calcDistanceOfPoints(points){
        if(points.length < 2){
            return 0;
        }
        let pointStart = points[0], pointEnd = points[points.length - 1];
        return GPS.distance(pointStart.lat, pointStart.lng, pointEnd.lat, pointEnd.lng);
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
    function splitDatapointsByTime(dataPoints){
        let splitedPoints = [];
        let tempPoints = [dataPoints[0]];
        for(let i = 1; i < dataPoints.length; i++){
            if(new Date(dataPoints[i].at) - new Date(dataPoints[i - 1].at) > 600000){ //10分钟
                splitedPoints.push(tempPoints);
                tempPoints = [dataPoints[i]];
            }else{
                tempPoints.push(dataPoints[i]);
            }
        }
        splitedPoints.push(tempPoints); //最后一组
        return splitedPoints;
    }
    function splitDatapointsByVelocity(dataPoints){
        let splitedPoints = [];
        splitedPoints.count = dataPoints.length;
        splitedPoints.startTime = dataPoints[0].at;
        splitedPoints.endTime = dataPoints[dataPoints.length - 1].at;
        let currentVelocityGroup,
            currentPointsCost = calcVelocityAndDistance(dataPoints[0], dataPoints[1]);
            previousVelocityGroup = getVelocityGroup(currentPointsCost.velocity),
            reallyDistance = currentPointsCost.distance,
            airDistance = reallyDistance,
            distancePointCount = 1,
            currentStartPoint = dataPoints[0],
            tempPoints = {
                points: [getBMapPoint(dataPoints[0].value), getBMapPoint(dataPoints[1].value)],
                velocityGroup: previousVelocityGroup
            };
        splitedPoints.push(tempPoints);
        //根据速度分组并只保留长直线的端点
        for(let i = 2; i < dataPoints.length - 1; i++){
            currentPointsCost = calcVelocityAndDistance(dataPoints[i - 1], dataPoints[i]);
            reallyDistance += currentPointsCost.distance; //实际距离
            airDistance = GPS.distance(currentStartPoint.value.lat, currentStartPoint.value.lon, dataPoints[i].value.lat, dataPoints[i].value.lon); //航空距离
            currentVelocityGroup = getVelocityGroup(currentPointsCost.velocity);
            //console.log('reallyDistance:',reallyDistance,'airDistance',airDistance);
            if(currentVelocityGroup == previousVelocityGroup){ //当前两个点的速度和前两个点的速度属于同一个组
                if(reallyDistance - airDistance < 0.02 * ++distancePointCount){
                    tempPoints.points.length = tempPoints.points.length - 1;
                }else{
                    reallyDistance = currentPointsCost.distance;
                    currentStartPoint = dataPoints[i - 1];
                    distancePointCount = 1;
                }
                tempPoints.points.push(getBMapPoint(dataPoints[i].value));
            }else{
                tempPoints = {
                    points: [getBMapPoint(dataPoints[i-1].value), getBMapPoint(dataPoints[i].value)],
                    velocityGroup: currentVelocityGroup
                };
                currentStartPoint = dataPoints[i - 1];
                reallyDistance = currentPointsCost.distance;
                splitedPoints.push(tempPoints);
            }
            previousVelocityGroup = currentVelocityGroup;
        }
        //去掉毛刺点 TODO: 目前算法会把长直线与周边合并掉，因为长直线的点数量小于10
        let concatedPoints = [splitedPoints[0]];
        let j;
        for(j = 1; j < splitedPoints.length - 1; j++){
            //console.log(splitedPoints[i].velocityGroup,concatedPoints[concatedPoints.length-1].velocityGroup,splitedPoints[i+1].velocityGroup);
            //console.log('端点距离：',calcDistanceOfPoints(splitedPoints[j].points));
            if(splitedPoints[j].points.length < 10 && calcDistanceOfPoints(splitedPoints[j].points) < 50 && concatedPoints[concatedPoints.length-1].velocityGroup == splitedPoints[j+1].velocityGroup){
                //console.log('等于：' ,concatedPoints[concatedPoints.length - 1].points,splitedPoints[i].points)
                concatedPoints[concatedPoints.length - 1].points = concatedPoints[concatedPoints.length - 1].points.concat(splitedPoints[j].points).concat(splitedPoints[j+1].points);
                ++j;
                //splitedPoints[i].points.length = 0;
                //splitedPoints[i] = null;
            }else{
                concatedPoints.push(splitedPoints[j]);
            }
        }
        if(j < splitedPoints.length){ //倒数第二段不是毛刺的时候，j只能到length-1，这个时候需要把最后一项加进concatedPoints
            concatedPoints.push(splitedPoints[splitedPoints.length - 1]);
        }
        concatedPoints.startTime = splitedPoints.startTime;
        concatedPoints.endTime = splitedPoints.endTime;
        return concatedPoints;
    }
    function convertPoints(points){
        var pointsGroupByTime = splitDatapointsByTime(points);
        pointsGroupByTime = pointsGroupByTime.map(pointsGroup => splitDatapointsByVelocity(pointsGroup));
        pointsGroupByTime.count = points.length;
        return pointsGroupByTime;
    };
    function getBMapPoint(point){
        var bdGps = GPS.GPSToBaidu(point.lat, point.lon);
        return new BMap.Point(bdGps.lng, bdGps.lat);
    }
    var $apiKey = $('apiKey');
    var $deviceId = $('deviceId');
    var $startTime = $('startTime');
    var $endTime = $('endTime');
    var $pointCount = $('pointCount');
    var $prevDateButton = $('prevDateButton');
    var $nextDateButton = $('nextDateButton');
    var $prevPageButton = $('prevPageButton');
    var $nextPageButton = $('nextPageButton');
    var $searchButton = $('searchButton');
    var $searchForm = $('searchForm');
    var $log = $('log');
    var $lineGroupControl = $('lineGroupControl');
    $searchForm.onsubmit = function(e){
        e.preventDefault();
    }
    $('baiduMapCtn').style.height = (document.body.offsetHeight - $('head').offsetHeight) + 'px'
    function CarMarker(deviceId, start, end){
        var _this = this;
        this.start = start;
        this.end = end;
        this.pointsCache = {};
        this.cursorListOfPageIndex = [1];
        this.currentPageIndex = 0;
        var api = new OneNetApi($apiKey.value);
        this._api = api;
        api.getDeviceInfo(deviceId).then(function(res){
            console.log('api调用完成，服务器返回data为：', res);
            _this._deviceTitle = res.data.title;
            _this.showHistory(deviceId);
        });
    }
    CarMarker.prototype.showHistory = function(deviceId){
        var _this = this;
        this._api.getDataPoints(deviceId, {datastream_id:'Gps', start: this.start, end: this.end, limit: $pointCount.value}).then(function(res){
            console.log('api调用完成，服务器返回data为：', res);
            if(res.data.cursor){ //加入第二页的corsor
                _this.cursorListOfPageIndex[1] = res.data.cursor;
            }            
            var splitedPoints = convertPoints(res.data.datastreams[0].datapoints);
            $log.innerHTML = '当前第1页，本次共渲染' + splitedPoints.count + '个点';
            pageControl.renderLineGroup(splitedPoints);
            _this.pointsCache[1] = splitedPoints;
        });
    }
    CarMarker.prototype.showDataByPageIndex = function(pageIndex){
        var cursor = this.cursorListOfPageIndex[pageIndex];
        if(!cursor){
            $log.innerHTML = '当前第' + (pageIndex + 1) + '页，本次共渲染0个点';
            return;
        }
        var splitedPoints = this.pointsCache[cursor];
        if(splitedPoints){
            pageControl.renderLineGroup(splitedPoints);
            $log.innerHTML = '当前第' + (pageIndex + 1) + '页，本次共渲染' + splitedPoints.count + '个点';
            return;
        }
        var _this = this;
        this._api.getDataPoints($deviceId.value, {datastream_id:'Gps', start: this.start, end: this.end, limit: $pointCount.value, cursor: cursor}).then(function(res){
            if(res.data.cursor){ //加入下一页的corsor
                _this.cursorListOfPageIndex[pageIndex + 1] = res.data.cursor;
            }
            //var pointsTimeGroup = splitDatapointsByTime(res.data.datastreams[0].datapoints);
            var splitedPoints = convertPoints(res.data.datastreams[0].datapoints);
            pageControl.renderLineGroup(splitedPoints);
            _this.pointsCache[cursor] = splitedPoints;
            $log.innerHTML = '当前第' + (pageIndex + 1) + '页，本次共渲染' + splitedPoints.count + '个点';
        });
    }
    CarMarker.prototype.renderPrevPage = function(){
        if(this.currentPageIndex == 0){
            return;
        }
        this.showDataByPageIndex(--this.currentPageIndex);
    };
    CarMarker.prototype.renderNextPage = function(){
        this.showDataByPageIndex(++this.currentPageIndex);
    };
    var pageControl = {
        init: function(){
            this.baiduMapCtn = document.getElementById('baiduMapCtn');
            this.baiduMap.init(this.baiduMapCtn);
            var _this = this;
            this.initTimeRound(new Date());
            if(getParameter('apikey')){
                $apiKey.value = getParameter('apikey');
            }else if(localStorage.getItem('apiKey')){//0XlwMJm8U42KEZ394N4p8hm2p=s=
                $apiKey.value = localStorage.getItem('apiKey');
            }
            if(getParameter('deviceid')){
                $deviceId.value = getParameter('deviceid');
            }else if(localStorage.getItem('deviceId')){//517162506
                $deviceId.value = localStorage.getItem('deviceId');
            }
            if(localStorage.getItem('pointCount')){//500
                $pointCount.value = localStorage.getItem('pointCount');
            }
            $searchButton.onclick = function(e){
                if($apiKey.value.trim()){
                    localStorage.setItem('apiKey', $apiKey.value.trim());
                }
                if($deviceId.value.trim()){
                    localStorage.setItem('deviceId', $deviceId.value.trim());
                }
                if($pointCount.value.trim()){
                    localStorage.setItem('pointCount', $pointCount.value.trim());
                }
                e.preventDefault();
                _this.carMarker = new CarMarker($deviceId.value, $startTime.value, $endTime.value);
            }
            $prevDateButton.onclick = function(){
                _this.dateChange(-1);
            }
            $nextDateButton.onclick = function(){
                _this.dateChange(1);
            }
            $prevPageButton.onclick = function(){
                _this.carMarker.renderPrevPage();
            }
            $nextPageButton.onclick = function(){
                _this.carMarker.renderNextPage();
            }
            $lineGroupControl.onclick = function(e){
                //console.log(e,e.target.nodeName,e.target.checked,e.target.getAttribute('data-index'));
                var target = e.target;
                var currentLineGroup;
                if(target.nodeName.toUpperCase() == 'INPUT'){
                    var index = parseInt(target.getAttribute('data-index'));
                    var showCurrent = target.checked;
                    currentLineGroup = _this.lineGroupArr[index];
                    currentLineGroup[showCurrent ? 'show' : 'hide']();
                }
            }
        },
        initTimeRound: function(date){
            var dateNow = new Date(date);
            $startTime.value = `${dateNow.getFullYear()}-${getDoubleDigit(dateNow.getMonth() + 1)}-${getDoubleDigit(dateNow.getDate())}T00:00:01`;
            $endTime.value = `${dateNow.getFullYear()}-${getDoubleDigit(dateNow.getMonth() + 1)}-${getDoubleDigit(dateNow.getDate())}T23:59:59`;
        },
        dateChange: function(offset){
            var dateCurrent = new Date($startTime.value);
            var dateNew = new Date(+dateCurrent + offset* 3600 * 1000 * 24);
            this.initTimeRound(dateNew);
            $searchButton.click();
        },
        baiduMap: {
            init: function(ctn){
                var map = new BMap.Map(ctn);
                // 创建地图实例  
                var point = new BMap.Point(116.404, 39.915);
                // 创建点坐标  
                map.centerAndZoom(point, 15);
                // 初始化地图，设置中心点坐标和地图级别 
                map.enableScrollWheelZoom(true);
                this.map = map;
            }
        },
        renderLineGroup: function(splitedPoints){
            var map = this.baiduMap.map;
            map.clearOverlays();
            var edgePoints = [];
            var lineGroupArr = [];
            splitedPoints.forEach(pointsGroup => {
                let lineGroup = new LineGroup(map, pointsGroup);
                edgePoints = edgePoints.concat([lineGroup.startPoint, lineGroup.endPoint]);
                lineGroupArr.push(lineGroup);
            });
            map.setViewport(edgePoints);
            this.lineGroupArr = lineGroupArr;
            this.renderLineGroupController(lineGroupArr);
            this.asyncLogReallyPointsCount(splitedPoints);
        },
        renderLineGroupController: function(lineGroupArr){
            var html = '';
            lineGroupArr.forEach((i, index) => {
                html += `<label><input type="checkbox" data-index="${index}" checked />第${index + 1}段</label>`;
            });
            $lineGroupControl.innerHTML = html;
        },
        asyncLogReallyPointsCount: function(splitedPoints){
            setTimeout(function(){
                var count = 0;
                splitedPoints.forEach(i => {
                    i.forEach(j => count += j.points.length);
                });
                $log.innerHTML += `&nbsp;实际渲染${count}个点`;
            }, 100);
        }
    };
    pageControl.init(); 
    function LineGroup(baiduMap, pointsGroup){
        this.baiduMap = baiduMap;
        this.startPoint = pointsGroup[0].points[0];
        var endPoints = pointsGroup[pointsGroup.length - 1].points;
        this.endPoint = endPoints[endPoints.length - 1];
        this.overlayGroup = [];
        this.draw(pointsGroup);
    }
    LineGroup.prototype.draw = function(pointsGroup){
        var _this = this;
        var count = 0;
        pointsGroup.forEach(item => {
            count += item.points.length;
            var polyline = _this.drawLine(item.points, VelocityGroupColor[item.velocityGroup]);
            this.overlayGroup.push(polyline);
        });
        //起始点
        var startIcon = new BMap.Icon('/resource/2019/markers_bg.png', new BMap.Size(25,40), {
            imageSize: new BMap.Size(50, 40),
            anchor: new BMap.Size(12, 40)
        });
        var startMarker = new BMap.Marker(this.startPoint, {icon: startIcon});
        startMarker.setLabel(new BMap.Label(pointsGroup.startTime, {offset: new BMap.Size(-20,-20)}));
        //结束点
        var endIcon = new BMap.Icon('/resource/2019/markers_bg.png', new BMap.Size(25,40), {
            imageOffset: new BMap.Size(-25,0),
            imageSize: new BMap.Size(50, 40),
            anchor: new BMap.Size(12, 40)
        });
        var endMarker = new BMap.Marker(this.endPoint, {icon: endIcon});
        endMarker.setLabel(new BMap.Label(pointsGroup.endTime, {offset: new BMap.Size(-20,-20)}));
        this.baiduMap.addOverlay(startMarker); 
        this.baiduMap.addOverlay(endMarker); 
        this.overlayGroup.push(startMarker);
        this.overlayGroup.push(endMarker);
    }
    LineGroup.prototype.drawLine = function(pointsArr, color){
        var sy = new BMap.Symbol(BMap_Symbol_SHAPE_BACKWARD_OPEN_ARROW, {
            scale: 0.6,//图标缩放大小
            strokeColor:'#fff',//设置矢量图标的线填充颜色
            strokeWeight: '2',//设置线宽
        });
        var icons = new BMap.IconSequence(sy, '10', '30'); 
        var polyline = new BMap.Polyline(pointsArr, {
            enableEditing: false,//是否启用线编辑，默认为false
            enableClicking: false,//是否响应点击事件，默认为true
            //icons:[icons],
            strokeWeight:'7',//折线的宽度，以像素为单位
            strokeOpacity: 1,//折线的透明度，取值范围0 - 1
            strokeColor: color //折线颜色
        });
        this.baiduMap.addOverlay(polyline);
        return polyline;
    }
    LineGroup.prototype.show = function(){
        this._setVisible(1);
    }
    LineGroup.prototype.hide = function(){
        this._setVisible(0);
    }
    LineGroup.prototype._setVisible = function(visible){
        var map = this.baiduMap;
        this.overlayGroup.forEach(overlay => overlay[visible ? 'show' : 'hide']());
    }
</script>