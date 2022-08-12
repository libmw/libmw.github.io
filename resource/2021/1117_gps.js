function $(selector) {
  return document.querySelector(selector);
}

function gps2Float(gpsCoord) {
  return gpsCoord[0] + gpsCoord[1] / 60 + gpsCoord[2] / 3600;
}

function gps2Google(gpsCoord) {
  return `${gpsCoord[0]}°${gpsCoord[1]}'${gpsCoord[2] < 10 ? "0" : ""}${
    gpsCoord[2]
  }"`;
}

var pageControl = {
  init: function () {
    const mapContainer = $("#mapCtn");
    const fullBtn = $(".fullscreen");

    fullBtn.addEventListener("click", () => {
      if (document.fullscreenElement) {
        document.exitFullscreen();
        return;
      }
      mapContainer.requestFullscreen().catch((err) => {
        alert(
          `Error attempting to enable full-screen mode: ${err.message} (${err.name})`
        );
      });
    });

    const googleLayer = new AMap.TileLayer({
      tileUrl:
        "http://mt2.google.cn/vt/lyrs=y&hl=zh-CN&gl=cn&x=[x]&y=[y]&z=[z]&s=Galil",
      zIndex: 3,
    });

    const amapSatelliteLayer = new AMap.TileLayer.Satellite();
    const amapRoadNetLayer = new AMap.TileLayer.RoadNet();

    const map = new AMap.Map(mapContainer, {
      resizeEnable: true,
      zoom: 15,
      center: [116.397428, 39.90923],
      layers: [amapSatelliteLayer, amapRoadNetLayer],
    });

    const testGoogleImage = new Image();
    testGoogleImage.src = `//mt2.google.cn/vt/lyrs=y&hl=zh-CN&gl=cn&x=17294&y=15469&z=15&s=Galil?t=${+Math.random()}`;
    testGoogleImage.onload = () => {
      map.setLayers([googleLayer]);
    };
    /* var marker = new AMap.Marker({
      position: new AMap.LngLat(116.397428, 39.90923), // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
      title: "北京",
    }); */

    // 将创建的点标记添加到已有的地图实例：
    // map.add(marker);

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
    //图片
    this.picDetail = document.getElementById("picDetail");

    //this.changeMapTo('baidu');
    //点击地图显示坐标
    map.on("click", this.onMapClick);
  },
  generateMarker: function (pictureDetail, imgSrc) {
    const { lon, lat } = this.getPointByPictureDetail(pictureDetail);
    const _this = this;
    var bdGps = coordtransform.wgs84togcj02(lon, lat);
    console.log("bdGps: ", bdGps);
    var bdPoint = new AMap.LngLat(
      isNaN(bdGps[0]) ? "116.397428" : bdGps[0],
      isNaN(bdGps[1]) ? "39.90923" : bdGps[1]
    );
    const normalMarker = new AMap.Marker({
      position: bdPoint,
    });
    normalMarker.setExtData({
      pictureDetail,
    });
    normalMarker.on("click", (e) => {
      this.onMarkerClick.call(_this, e);
    });

    const markers = [normalMarker];

    if (imgSrc) {
      markers.push(
        new AMap.Marker({
          position: bdPoint,
          content: imgSrc
            ? `<a href="${imgSrc}" target="_blank" class="img-marker" style='background-image: url(${imgSrc})'></a>`
            : "",
          // 以 icon 的 [center bottom] 为原点
          offset: new AMap.Pixel(-100, -135),
        })
      );
    }

    return markers;
  },
  getFiles: function (fileList) {
    var _this = this;
    var imgCtn = document.getElementById("imgCtn");
    const zoomPoints = [];
    var markerList = [];
    for (let i = 0; i < fileList.length; i++) {
      var file = fileList[i];
      if (file.type.indexOf("image") === -1) {
        console.log("此文件不是图片：", file.name);
        continue;
      }
      if (window.URL.createObjectURL) {
        //使用完成后可以通过revokeObjectURL释放内存
        var tempImg = document.createElement("img");
        //tempImg.src =
        const imgSrc = window.URL.createObjectURL(file);
        console.log("通过URL创建图片", file);
        //imgCtn.appendChild(tempImg);
        EXIF.getData(file, function () {
          const pictureDetail = _this.getPictureDetail(this);
          console.log("pictureDetail: ", pictureDetail);
          markerList = markerList.concat(
            _this.generateMarker(pictureDetail, imgSrc)
          );
          _this.renderPictureDetail(pictureDetail);
          if (markerList.length === fileList.length * 2) {
            _this.map.add(markerList);
            _this.map.setFitView(markerList);
          }
        });
      }
    }
  },
  ConvertDMSToDD: function (degrees, minutes, seconds, direction) {
    var dd = degrees + minutes / 60 + seconds / (60 * 60);
    if (direction == "S" || direction == "W") {
      dd = dd * -1;
    } // Don't do anything for N or E
    return dd;
  },
  getPointByPictureDetail({
    GPSLongitude,
    GPSLatitude,
    GPSLongitudeRef,
    GPSLatitudeRef,
  }) {
    if (!GPSLongitude) {
      return {
        lon: undefined,
        lat: undefined,
      };
    }
    const lon = this.ConvertDMSToDD(
      GPSLongitude[0],
      GPSLongitude[1],
      GPSLongitude[2],
      GPSLongitudeRef
    );
    const lat = this.ConvertDMSToDD(
      GPSLatitude[0],
      GPSLatitude[1],
      GPSLatitude[2],
      GPSLatitudeRef
    );
    return {
      lon,
      lat,
    };
  },
  getPictureDetail: function (obj) {
    const tagList = [
      "GPSLongitude",
      "GPSLatitude",
      "GPSLongitudeRef",
      "GPSLatitudeRef",
      "DateTimeOriginal",
      "Make",
      "Model",
    ];
    const detail = {};
    for (let i = 0; i < tagList.length; i++) {
      const tag = tagList[i];
      detail[tag] = EXIF.getTag(obj, tag);
    }
    return detail;
  },
  renderPictureDetail: function (pictureDetail) {
    const {
      GPSLongitude,
      GPSLatitude,
      GPSLongitudeRef,
      GPSLatitudeRef,
      DateTimeOriginal,
      Make,
      Model,
    } = pictureDetail;
    const { lon, lat } = this.getPointByPictureDetail(pictureDetail);

    this.picDetail.innerHTML = "";
    if (lon && lat) {
      const googleUrl = `https://www.google.com/maps/place/${encodeURIComponent(
        gps2Google(GPSLatitude)
      )}${GPSLatitudeRef}+${encodeURIComponent(
        gps2Google(GPSLongitude)
      )}${GPSLongitudeRef}`;
      this.dumpDetail("gps坐标", `${lon},${lat}`, googleUrl);
    } else {
      this.dumpDetail("gps坐标", "无GPS坐标，统一显示在天安门");
    }

    var detailFields = {
      DateTimeOriginal: "拍摄时间",
      Make: "品牌",
      Model: "型号",
    };
    for (var field in detailFields) {
      this.dumpDetail(detailFields[field], pictureDetail[field]);
    }
    /* console.log("orenderPictureDetailbj: ", obj);
    this.picDetail.innerHTML = "";
    var lon = EXIF.getTag(obj, "GPSLongitude");
    console.log("lon: ", lon);
    var lat = EXIF.getTag(obj, "GPSLatitude");
    var GPSLongitudeRef = EXIF.getTag(obj, "GPSLongitudeRef");
    var GPSLatitudeRef = EXIF.getTag(obj, "GPSLatitudeRef");

    if (lon && lat) {
      const googleUrl = `https://www.google.com/maps/place/${encodeURIComponent(
        gps2Google(lat)
      )}${GPSLatitudeRef}+${encodeURIComponent(
        gps2Google(lon)
      )}${GPSLongitudeRef}`;
      this.dumpDetail(
        "gps坐标",
        `${GPSLatitudeRef === "N" ? "" : "-"}${gps2Float(lat)},${
          GPSLongitudeRef === "E" ? "" : "-"
        }${gps2Float(lon)}`,
        googleUrl
      );
    }
    var detailFields = {
      DateTimeOriginal: "拍摄时间",
      Make: "品牌",
      Model: "型号",
    };
    for (var field in detailFields) {
      this.dumpDetail(detailFields[field], EXIF.getTag(obj, field));
    } */
  },
  dumpDetail: function (name, value, url) {
    var div = document.createElement("div");
    const mainHTML = `
              <em>${name}<em>:<span>${value}</span>
          `;
    if (url) {
      div.innerHTML = `<a href=${url} target="_blank">${mainHTML}</a>`;
    } else {
      div.innerHTML = mainHTML;
    }
    this.picDetail.appendChild(div);
    console.log("this.picDetail: ", this.picDetail);
  },
  onMarkerClick(e) {
    console.log("onMarkerClick: ", e);
    const { target } = e;
    const extData = target.getExtData();
    console.log("extData: ", extData);
    this.renderPictureDetail(extData.pictureDetail);
  },
  onMapClick(e) {
    const msgCtn = $(".otherMsg");
    const amapLng = e.lnglat.getLng();
    const amapLat = e.lnglat.getLat();

    const coordList = [
      {
        name: "高德",
        value: [amapLng, amapLat],
      },
      {
        name: "百度",
        value: coordtransform.gcj02tobd09(amapLng, amapLat),
      },
      {
        name: "GPS",
        value: coordtransform.gcj02towgs84(amapLng, amapLat),
      },
    ];

    const coordHtml = coordList
      .map((coordItem) => `<p>${coordItem.name}：${coordItem.value}</p>`)
      .join("\n");

    msgCtn.innerHTML = `
      <h5>当前点击点坐标(经度,纬度)：</h5>
      ${coordHtml}
    `;
    //alert('您在[ '+e.lnglat.getLng()+','+e.lnglat.getLat()+' ]的位置点击了地图！');
  },
};
function initializegooglemap() {
  pageControl.init();
}
pageControl.init();
