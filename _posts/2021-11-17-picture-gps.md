---
  layout: pure
  title: 照片位置查看器谷歌地球版
---

<style>

  h2 {
    font-size: 1rem;
  }
  html {
    height: 100%;
  }
  body {
    height: 100%;
    padding: 0;
    margin: 0;
    font-family: '微软雅黑';
    font-size: 14px;
  }

  table {
    border-collapse: collapse;
    border-spacing: 0;
    empty-cells: show;
    border: 1px solid #cbcbcb;

  }
  td,
  th {
    border-left: 1px solid #cbcbcb;
    border-width: 0 0 0 1px;
    font-size: inherit;
    margin: 0;
    overflow: visible;
    padding: 0.5em 1em;
    border-bottom: 1px solid #cbcbcb;
  }
  .container {
    height: 500px;
  }
  .picker {
    display: none;
  }
  @media screen and (max-width: 500px) {
    body,
    html {
      font-size: 28px;

    }
    h2 {
      display: none;
    }
    .picker {
      display: block;
    }
  }
</style>
<script type="text/javascript" src="https://webapi.amap.com/maps?v=1.4.15&key=05fb23d2c6d3ce6323793cd981030e9f&plugin=AMap.Geocoder"></script>
<script src="/resource/2018/exif.js"></script>
<script src="/resource/2019/map_convertor.js"></script>
<script src="/resource/2021/gpsConvert.js"></script>
<h2>把图片拖进来</h2>
<div class="picker"><input type="file" id="filePicker"></div>
<div id="makeAndModel" style="height: 30px; "></div>
<div class="map_shift" id="mapShift">

  <label for="satellite">卫星图</label><input type="checkbox" id="satellite"/>

</div>
<div class="container" id="mapCtn"></div>
<div class="detail" id="picDetail"></div>

<script>
  function $(selector) {
    return document.querySelector(selector);
  }

  var pageControl = {
    init: function () {
      const mapContainer = $('#mapCtn');
      const googleLayer = new AMap.TileLayer({tileUrl: 'http://mt2.google.cn/vt/lyrs=y&hl=zh-CN&gl=cn&x=[x]&y=[y]&z=[z]&s=Galil', zIndex: 3});
      const map = new AMap.Map(mapContainer, {
        resizeEnable: true,
        zoom: 15,
        center: [
          116.397428, 39.90923
        ],
        layers: [googleLayer]
      });
      var marker = new AMap.Marker({
        position: new AMap.LngLat(116.397428, 39.90923), // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
        title: '北京'
      });

      // 将创建的点标记添加到已有的地图实例：
      map.add(marker);

      this.map = map;
      const _this = this;
      //拖动
      var dragW = document.body;
      dragW.addEventListener("dragenter", function (e) {
        e.preventDefault();
      });
      dragW.addEventListener("dragover", function (e) {
        //console.log('dragover:', e);
        e.preventDefault();
      });
      dragW.addEventListener("dragleave", function (e) {
        //console.log('dragleave:', e);
        e.preventDefault();
      });
      dragW.addEventListener("drop", function (e) {
        e.preventDefault();
        _this.getFiles(e.dataTransfer.files);
      });
      var filePicker = document.getElementById("filePicker");
      filePicker.addEventListener("change", function (e) {
        console.log(this);
        _this.getFiles(this.files);
      });
      //图片
      this.picDetail = document.getElementById("picDetail");

      //this.changeMapTo('baidu');
    },
    addMarker: function (x, y) {
      var bdGps = coordtransform.wgs84togcj02(x, y);
      var bdPoint = new AMap.LngLat(bdGps[0], bdGps[1]);
      var bdMarker = new AMap.Marker(bdPoint); // 创建点
      Promise
        .resolve()
        .then(() => {
          this
            .map
            .add(bdMarker);
        })

      return bdPoint;
    },
    baiduMap: {
      init: function (ctn) {
        // 参考文章：https://its304.com/article/wclwksn2019/106992429
        var googleLayer = new AMapGL.TileLayer();
        googleLayer.getTilesUrl = function (tileCoord, zoom) {
          var tileX = tileCoord.x;
          var tileY = tileCoord.y;
          var pixelX = 10;
          var pixelY = 10;
          var level = zoom;
          const coord = TileLnglatTransformBaidu.pixelToLnglat(pixelX, pixelY, tileX, tileY, level);
          console.log('coord: ', coord);

          const longitude = coord.lng;
          const latitude = coord.lat;

          const googleTile = TileLnglatTransformGoogle.lnglatToTile(longitude, latitude, level);

          var url = `http://mt2.google.cn/vt/lyrs=s&hl=zh-CN&gl=cn&x=${googleTile.tileX}&y=${googleTile.tileY}&z=${zoom}&s=Galil`;
          return url;
        }
        googleLayer.zIndex = 0;

        var map = new AMapGL.Map(ctn);

        var isTilesPng = true;
        var tileSize = 256;
        var tstyle = 'pl';
        var udtVersion = '20190102';
        var tilelayer = new AMapGL.TileLayer({transparentPng: isTilesPng});
        tilelayer.zIndex = 110;
        // point为图块坐标，level为图块的级别
        // 当地图需要显示特定级别的特定位置的图块时会自动调用此方法，并提供这两个参数
        tilelayer.getTilesUrl = function (tileCoord, zoom) {
          var tileX = tileCoord.x;
          var tileY = tileCoord.y;
          var pixelX = 128;
          var pixelY = 128;
          var level = zoom;
          const coord = TileLnglatTransformBaidu.pixelToLnglat(pixelX, pixelY, tileX, tileY, level);
          console.log('coord: ', coord, zoom);

          const gc02 = coordtransform.bd09togcj02(coord.lng, coord.lat);
          const wgs84 = coordtransform.gcj02towgs84(gc02[0], gc02[1]);

          const longitude = gc02[0];
          const latitude = gc02[1];

          const googleTile = TileLnglatTransformGoogle.lnglatToTile(longitude, latitude, level);

          var url = `http://mt2.google.cn/vt/lyrs=s&hl=zh-CN&gl=cn&x=${googleTile.tileX}&y=${googleTile.tileY}&z=${zoom}&s=Galil`;
          //var url = `https://khms0.google.com/kh/v=908?x=${googleTile.tileX}&y=${googleTile.tileY}&z=${zoom}`;
          return url;
        };
        map.addTileLayer(tilelayer);

        console.log('googleLayer: ', googleLayer);

        // 创建地图实例
        var point = new AMapGL.LngLat(116.404, 39.915);
        // 创建点坐标
        map.setZoomAndCenter(15, point);
        // 初始化地图，设置中心点坐标和地图级别
        var marker = new AMapGL.Marker(point); // 创建点
        map.enableScrollWheelZoom(true);
        map.add(marker);
        this.marker = marker;
        this.map = map;
      },
      addMarker: function (x, y) {
        var bdGps = GPS.GPSToBaidu(y, x);
        var bdPoint = new AMap.LngLat(bdGps.lng, bdGps.lat);
        var bdMarker = new AMap.Marker(bdPoint); // 创建点
        this
          .map
          .add(bdMarker);
        return bdPoint;
      }
    },
    getFiles: function (fileList) {
      var _this = this;
      var imgCtn = document.getElementById('imgCtn');
      const zoomPoints = [];
      for (let i = 0; i < fileList.length; i++) {
        var file = fileList[i];
        if (file.type.indexOf('image') === -1) {
          console.log('此文件不是图片：', file.name);
          continue;
        }
        if (window.URL.createObjectURL) { //使用完成后可以通过revokeObjectURL释放内存
          var tempImg = document.createElement('img');
          tempImg.src = window
            .URL
            .createObjectURL(file);
          console.log('通过URL创建图片', file);
          //imgCtn.appendChild(tempImg);
          EXIF.getData(file, function () {
            var lon = EXIF.getTag(this, "GPSLongitude");
            var lat = EXIF.getTag(this, "GPSLatitude");
            var GPSLongitudeRef = EXIF.getTag(this, "GPSLongitudeRef");
            var GPSLatitudeRef = EXIF.getTag(this, "GPSLatitudeRef");
            makeAndModel.innerHTML = `${lon} ${GPSLongitudeRef} ${lat} ${GPSLatitudeRef}`;
            const {x, y} = _this.renderPoint(lon, lat, GPSLongitudeRef, GPSLatitudeRef);
            console.log(x, y)
            const bdPoints = _this.addMarker(x, y);
            console.log(i)
            zoomPoints.push(bdPoints);
            if (zoomPoints.length === 1) {
              _this
                .map
                .setZoomAndCenter(15, bdPoints);
            }
            _this.renderPictureDetail(this);
          });
        }
      }
      //this.map.setFitView(zoomPoints);
    },
    ConvertDMSToDD: function (degrees, minutes, seconds, direction) {
      var dd = degrees + minutes / 60 + seconds / (60 * 60);
      if (direction == "S" || direction == "W") {
        dd = dd * -1;
      } // Don't do anything for N or E
      return dd;
    },
    renderPoint: function (lon, lat, GPSLongitudeRef, GPSLatitudeRef) {
      var x = this.ConvertDMSToDD(+ lon[0], + lon[1], + lon[2], GPSLongitudeRef);
      var y = this.ConvertDMSToDD(+ lat[0], + lat[1], + lat[2], GPSLatitudeRef);
      return {x, y};
    },
    renderPictureDetail: function (obj) {
      console.log('orenderPictureDetailbj: ', obj);
      this.picDetail.innerHTML = '';
      var detailFields = {
        DateTimeOriginal: "拍摄时间",
        Make: "品牌",
        Model: "型号"
      };
      for (var field in detailFields) {
        this.dumpDetail(detailFields[field], EXIF.getTag(obj, field));
      }
    },
    dumpDetail: function (name, value) {
      var div = document.createElement('div');
      div.innerHTML = `
                <em>${name}<em>:<span>${value}</span>
            `;
      this
        .picDetail
        .appendChild(div);
      console.log('this.picDetail: ', this.picDetail);
    }
  };
  function initializegooglemap() {
    pageControl.init();
  }
  pageControl.init();
</script>