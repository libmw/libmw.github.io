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

<h1>car-location</h1>
<form>
    <label for="apiKey">ApiKey：</label>
    <input id="apiKey" type="text" value="WVoJzD5Mr2JZX1mLJKgxiUC2NuQ=" />
    <label for="deviceId">设备ID：</label>
    <input id="deviceId" type="text" value="517341974" />
    <label for="startTime">开始时间：</label>
    <input id="startTime" type="datetime-local" />
    <label for="endTime">结束时间：</label>
    <input id="endTime" type="datetime-local" />
    <input type="button" value="查询" />
</form>
<div class="container" id="baiduMapCtn"></div>
<script type="text/javascript" src="//api.map.baidu.com/api?v=3.0&ak=XwGhtOZnTOQk7lFssFiI1GR3"></script>
<script src="/resource/2019/onenetsdk.min.js"></script>
<script>
    function CarMarker(deviceId){
        var api = new OneNetApi('WVoJzD5Mr2JZX1mLJKgxiUC2NuQ=');
        this._api = api;
        api.getDeviceInfo(deviceId).done(function(res){
            console.log('api调用完成，服务器返回data为：', res);
        });
    }
    CarMarker.prototype.showHistory = function(start, end){
        this._api.getDataPoints(deviceId, {datastream_id:'Gps', start: start, end: end}).done(function(res){
            console.log('api调用完成，服务器返回data为：', res);
            var xy = res.data.datastreams[0].datapoints[0].value;
            pageControl.baiduMap.resetMarker(xy.lon, xy.lat, null, deviceId);
        });
    }
    CarMarker.prototype.showLast = function(){
        this._api.getDataPoints(deviceId, {datastream_id:'Gps'}).done(function(res){
            console.log('api调用完成，服务器返回data为：', res);
            var xy = res.data.datastreams[0].datapoints[0].value;
            pageControl.baiduMap.resetMarker(xy.lon, xy.lat, null, deviceId);
        });
    }
    var pageControl = {
        init: function(){
            this.baiduMapCtn = document.getElementById("baiduMapCtn");
            this.baiduMap.init(this.baiduMapCtn);
            var _this = this;
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
            resetMarker: function(x, y, marker, deviceId){
                var ggPoint = new BMap.Point(x,y);
                var convertor = new BMap.Convertor();
                var pointArr = [];
                pointArr.push(ggPoint);
                var _this = this;
                convertor.translate(pointArr, 1, 5, function(data){
                    if(!marker){
                        marker = _this.generateMarker(data.points[0]);
                        marker.setLabel(new BMap.Label(deviceId));
                    }
                    marker.setPosition(data.points[0]);
                    _this.map.centerAndZoom(data.points[0], 15);
                });
            }
        }        
    };
    pageControl.init(); 
    new CarMarker(517341974);
    new CarMarker(517341975);
    new CarMarker(517341976);
    new CarMarker(517341977);
    new CarMarker(517341978);
</script>
