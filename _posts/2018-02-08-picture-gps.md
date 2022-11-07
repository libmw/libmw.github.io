---
  layout: main
  title: 照片位置查看器
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
    
    table{
        border-collapse: collapse;
        border-spacing: 0;
        empty-cells: show;
        border: 1px solid #cbcbcb;

    }
    td,th{
        border-left: 1px solid #cbcbcb;
        border-width: 0 0 0 1px;
        font-size: inherit;
        margin: 0;
        overflow: visible;
        padding: .5em 1em;
        border-bottom: 1px solid #cbcbcb;
    }
    .container{
        height: 500px;
    }
    .picker{
            display: none;
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

<h2>把图片拖进来</h2>
<div class="picker"><input type="file" id="filePicker"></div>
<div id="makeAndModel" style="height: 30px; "></div>
<div class="map_shift" id="mapShift">

    <button data-type="baidu">百度地图</button>
    <button data-type="google">谷歌地图</button>
    <button data-type="googleSatellite">谷歌卫星</button>
    <label for="satellite">卫星图</label><checkbox id="satellite" />

</div>
<div class="container" id="baiduMapCtn"></div>
<div class="container" id="googleMapCtn"></div>
<div class="detail" id="picDetail"></div>
<script type="text/javascript" src="//api.map.baidu.com/api?v=3.0&ak=XwGhtOZnTOQk7lFssFiI1GR3"></script>
<script src="/resource/2018/exif.js"></script>
<script src="/resource/2019/map_convertor.js"></script>

<script>

    var pageControl = {
        init: function(){
            this.baiduMapCtn = document.getElementById("baiduMapCtn");
            this.googleMapCtn = document.getElementById("googleMapCtn");
            this.baiduMap.init(this.baiduMapCtn);
            this.googleMap.init(this.googleMapCtn);
            this.currentMap = null;            
            var _this = this;
            //拖动
            var dragW = document.body;
            dragW.addEventListener("dragenter", function(e){
                e.preventDefault();
            });
            dragW.addEventListener("dragover", function(e){
                //console.log('dragover:', e);
                e.preventDefault();
            });
            dragW.addEventListener("dragleave", function(e){
                //console.log('dragleave:', e);
                e.preventDefault();
            });
            dragW.addEventListener("drop", function(e){
                e.preventDefault();
                _this.getFiles(e.dataTransfer.files);
            });
            var filePicker = document.getElementById("filePicker");
            filePicker.addEventListener("change", function(e){
                console.log(this);
                _this.getFiles(this.files);
            });
            //地图切换
            document.getElementById('mapShift').addEventListener('click', function(e){
                var target = e.target;
                if(target.nodeName == 'BUTTON'){
                    _this.changeMapTo(target.dataset.type);
                }
            })
            //图片
            this.picDetail = document.getElementById("picDetail");
            this.changeMapTo('baidu');
        },
        changeMapTo: function(type){
            if(type == 'baidu'){
                this.currentMap = this.baiduMap;
                this.baiduMapCtn.style.display = 'block';
                this.googleMapCtn.style.display = 'none';
            }else{
                this.currentMap = this.googleMap;
                this.baiduMapCtn.style.display = 'none';
                this.googleMapCtn.style.display = 'block';
            }
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
            setPosition: function(x,y){
                var bdGps = GPS.GPSToBaidu(y, x);
                var bdPoint = new BMap.Point(bdGps.lng, bdGps.lat);
                var bdMarker = new BMap.Marker(bdPoint); // 创建点
                this.map.addOverlay(bdMarker); 
                
                return bdPoint;
                return;
                

                var ggPoint = new BMap.Point(x,y);
                var convertor = new BMap.Convertor();
                var pointArr = [];
                pointArr.push(ggPoint);
                var _this = this;
                convertor.translate(pointArr, 1, 5, function(data){
                    _this.marker.setPosition(data.points[0]);
                    _this.map.centerAndZoom(data.points[0], 15);
                })
            }
        },
        googleMap: {
            init: function(ctn){
                return;
                var point = new google.maps.LatLng(42.882688, -90.579412);
                //初始化
                var mapOptions = {
                    center: point,
                    zoom: 3,
                    zooms: [2,30]
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };
                var map = new google.maps.Map(ctn, mapOptions);
                map.setCenter(point);
                //设置级别
                map.setZoom(15);
                var marker = new google.maps.Marker({
                    position: point,
                    map: map
                });
                this.marker = marker;
                this.map = map;
            },
            setPosition: function(x,y){
                //设置中心点
                var point = new google.maps.LatLng(x,y);
                this.map.setCenter(point);
                this.marker.setPosition(point);
            }
        },
        getFiles: function (fileList){
            var _this = this;
            var imgCtn = document.getElementById('imgCtn');
            const zoomPoints = [];
            for(let i = 0; i < fileList.length; i++){
                var file = fileList[i];
                if(file.type.indexOf('image') === -1){
                    console.log('此文件不是图片：', file.name);
                    continue;
                }
                if(window.URL.createObjectURL){ //使用完成后可以通过revokeObjectURL释放内存
                    var tempImg = document.createElement('img');
                    tempImg.src = window.URL.createObjectURL(file);
                    console.log('通过URL创建图片',file);
                    //imgCtn.appendChild(tempImg);
                    EXIF.getData(file, function() {
                        var lon = EXIF.getTag(this, "GPSLongitude");
                        var lat = EXIF.getTag(this, "GPSLatitude");
                        var GPSLongitudeRef = EXIF.getTag(this, "GPSLongitudeRef");
                        var GPSLatitudeRef = EXIF.getTag(this, "GPSLatitudeRef");
                        makeAndModel.innerHTML = `${lon} ${GPSLongitudeRef} ${lat} ${GPSLatitudeRef}` ;
                        const {x, y} = _this.renderPoint(lon, lat, GPSLongitudeRef, GPSLatitudeRef);
                        console.log(x,y)
                        const bdPoints = _this.currentMap.setPosition(x, y);
                        console.log(i)
                        zoomPoints.push(bdPoints);
                        if(zoomPoints.length === 1){
                            _this.currentMap.map.centerAndZoom(bdPoints, 15);
                        }
                        _this.renderPictureDetail(this);
                    });
                }
            }
        },
        ConvertDMSToDD: function (degrees, minutes, seconds, direction) {
            var dd = degrees + minutes/60 + seconds/(60*60);
            if (direction == "S" || direction == "W") {
                dd = dd * -1;
            } // Don't do anything for N or E
            return dd;
        },
        renderPoint: function (lon, lat, GPSLongitudeRef, GPSLatitudeRef){
            var x = this.ConvertDMSToDD(+lon[0], +lon[1], +lon[2], GPSLongitudeRef);
            var y = this.ConvertDMSToDD(+lat[0], +lat[1], +lat[2], GPSLatitudeRef);
            return {
                x,
                y
            };
        },
        renderPictureDetail: function (obj){
            this.picDetail.innerHTML = '';
            var detailFields = {
                DateTimeOriginal: "拍摄时间",
                Make: "品牌",
                Model: "型号"
            };
            for(var field in detailFields){
                this.dumpDetail(detailFields[field], EXIF.getTag(obj, field));
            }
        },
        dumpDetail: function (name, value){
            var div = document.createElement('div');
            div.innerHTML = `
                <em>${name}<em>:<span>${value}</span>
            `;
            this.picDetail.appendChild(div);
        }
    };
    function initializegooglemap(){
        pageControl.init();  
    }
    pageControl.init();  

</script>
<script src="//ditu.google.com/maps/api/js?v=3&amp; sensor=false&amp; language=en&amp; callback=initializegooglemap"></script>
