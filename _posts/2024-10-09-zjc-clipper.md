---
  layout: pure
  title: 珠江城小学学籍照片裁剪
---

<style>
body {
        font-size: 16px;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        text-align: center;
      }
      img {
        max-width: 100%;
      }
      #cropper {
        margin-top: 10px;
      }
</style>
<link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.12/cropper.min.css"
    />
  <div class="container">
      <div class="btns">
        <input type="file" id="inputImage" accept="image/*" />
        <button id="exportBtn">导出图片</button>
      </div>
      <!-- <div class="btns">
        <input id="unsharpAmount" value="160" />
        <input id="unsharpThreshold" value="0.1" />
      </div> -->
      <br />
      <img id="image" src="" style="display: none" />
      <div id="cropper"></div>
      <br />
    </div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.12/cropper.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.0.0/html2canvas.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/pica/7.0.0/pica.min.js"></script>
<script src="/resource/2024/2024-10-09-zjc-clipper-app.js"></script>
