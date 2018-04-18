---
  layout: pure
  title: 照片位置查看器
---
<style>
    html{
        height: 100%;
    }
    body{
        height: 100%;
        padding: 0;
        margin: 0;
        font-family: '微软雅黑';
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
</style>
<h2>把图片拖进来</h2>
<div id="makeAndModel" style="height: 30px;"></div>
<div class="container" id="ctn"></div>
<div class="detail" id="picDetail"></div>
<script type="text/javascript" src="//api.map.baidu.com/api?v=3.0&ak=XwGhtOZnTOQk7lFssFiI1GR3"></script>
<script src="/resource/2018/exif.js"></script>
<script>

    var map = new BMap.Map("ctn");
    // 创建地图实例  
    var point = new BMap.Point(116.404, 39.915);
    // 创建点坐标  
    map.centerAndZoom(point, 15);
    // 初始化地图，设置中心点坐标和地图级别 
    var marker = new BMap.Marker(point); // 创建点
    map.enableScrollWheelZoom(true);
    map.addOverlay(marker);   
    //拖动
    var dragW = document.body;
	dragW.addEventListener('dragenter', function(e){
		//console.log('dragenter:', e);
		e.preventDefault();
	});
	dragW.addEventListener('dragover', function(e){
		//console.log('dragover:', e);
		e.preventDefault();
	});
	dragW.addEventListener('dragleave', function(e){
		//console.log('dragleave:', e);
		e.preventDefault();
	});
	dragW.addEventListener('drop', function(e){
		//console.log('drop:',e, e.dataTransfer.files);
		
		e.preventDefault();
		getFiles(e);
	});
	function getFiles(evt){
		var fileList = evt.dataTransfer.files;
		var imgCtn = document.getElementById('imgCtn');
		for(var i = 0; i < fileList.length; i++){
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
                    makeAndModel.innerHTML = `${lon} ${GPSLongitudeRef} ${lat} ${GPSLatitudeRef}`;
                    renderPoint(lon, lat, GPSLongitudeRef, GPSLatitudeRef);
                    renderPictureDetail(this);
                });
			}
		}
	} 
    function ConvertDMSToDD(degrees, minutes, seconds, direction) {
        var dd = degrees + minutes/60 + seconds/(60*60);

        if (direction == "S" || direction == "W") {
            dd = dd * -1;
        } // Don't do anything for N or E
        return dd;
    }
    function renderPoint(lon, lat, GPSLongitudeRef, GPSLatitudeRef){
        var x = ConvertDMSToDD(+lon[0], +lon[1], +lon[2], GPSLongitudeRef);
        var y = ConvertDMSToDD(+lat[0], +lat[1], +lat[2], GPSLatitudeRef);
        console.log(x,y)
        var ggPoint = new BMap.Point(x,y);
        var convertor = new BMap.Convertor();
        var pointArr = [];
        pointArr.push(ggPoint);
        convertor.translate(pointArr, 1, 5, function(data){
        marker.setPosition(data.points[0]);
            map.centerAndZoom(data.points[0], 15);
        })


    }

    var picDetail = document.getElementById('picDetail');
    const detailFields = {
        'DateTimeOriginal': '拍摄时间',
        'Make': '品牌',
        'Model': '型号',
    };
    function renderPictureDetail(obj){
        picDetail.innerHTML = '';
        for(var field in detailFields){
            dumpDetail(detailFields[field], EXIF.getTag(obj, field));
        }
    }
    function dumpDetail(name, value){
        var div = document.createElement('div');
        div.innerHTML = `
            <em>${name}<em>:<span>${value}</span>
        `;
        picDetail.appendChild(div);
    }
    
</script>