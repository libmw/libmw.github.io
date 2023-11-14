---
  layout: main
  title: 照片位置查看器谷歌地球版
---

<style>

  h2 {
    font-size: 1rem;
  }
  html,body,.main {
    height: 100%;
  }
  body{
    margin: 0;
    padding: 0;
  }

  .gps-container{
    height: 100%;
    display: flex;
    flex-flow: column nowrap;
  }

  .container{
    flex: 1;
  }

  .map-ctn{
    height:100%;
  }

  .tools{
    position: absolute;
    z-index: 1;
    color: #e6e6e6;
    font-weight: 400;
    cursor: pointer;
  }
  .fullscreen-btn{
    
  }

  .picker {
    display: none;
  }

  footer{
    display: flex;
  }

  .buttons{
    padding: 0 10px;
  }
  .buttons button{
      display: block;
      margin: 10px 0;
  }

  .otherMsg{
    padding-left: 10px;
  }

  .img-marker{
    display: block;
    width: 200px;
    height: 100px;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }

  h5{
    margin-top: 0;
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
  .fullscreen{
    position: fixed;
    top:0;
    left:0;
    right:0;
    bottom:0;
  }
</style>
<script type="text/javascript" src="https://webapi.amap.com/maps?v=1.4.15&key=05fb23d2c6d3ce6323793cd981030e9f&plugin=AMap.Geocoder"></script>
<script src="/resource/2018/exif.js"></script>
<script src="/resource/2021/gpsConvert.js"></script>

<div class="gps-container">
  <h2>把图片拖进来</h2>
  <div class="container">
    <div class="map-ctn" id="mapCtn">
      <div class="tools">
        <div class="fullscreen-btn">全屏</div>
      </div>
    </div>
  </div>
  <div id="makeAndModel" style="height: 30px; "></div>
  <footer>
    <div class="buttons">
      <h5>图层：</h5>
      <p><input type="checkbox" id="btnAmapRoad" /><label for="btnAmapRoad">高德路网</label></p>
      <p><input type="checkbox" id="btnAmapSatellite" /><label for="btnAmapSatellite">高德卫星</label></p>
      <p><input type="checkbox" id="btnGoogleSatellite" /><label for="btnGoogleSatellite">谷歌带标注</label></p>
      <p><input type="checkbox" id="btnGoogleSatellitePure" /><label for="btnGoogleSatellitePure">谷歌无标注</label></p>
    </div>
    <div class="detail" id="picDetail"></div>
    <div class="otherMsg"></div>
  </footer>
</div>

<script src="/resource/2021/1117_gps.js">
</script>
