---
  layout: post
  title: 图片裁剪上传组件
---

# 图片裁剪上传

本组件是 [HeadImageCliper](https://github.com/libmw/headImageCliper)组件的升级版本，HeadImageCliper将不再进行更新。

在本地对图片进行裁剪压缩后，再传递到后端，后端只需要保存最终的图片即可。

本案例上传按钮点击后会上传失败，因为demo里指定的上传地址仅仅作为示例，是一个无法访问的地址。

<style>
    #avg {z-index:999;position:absolute;top:5px;left:5px;font-size:12px;color:#000;}
}
</style>


<button onclick="imageClipper.submit();">上传</button>

<div id="headImage" style="width:730px;height:730px;margin-left: 10px;">

</div>

<script src="/resource/2015/imageclipper/imageClipper.js"></script>
<script>
    window.onload = function(){
        var container = document.getElementById('headImage');
        window.imageClipper = new ImageClipper({
            container: container, //上传界面的容器，原生dom
            width: container.clientWidth, //flash的宽度
            height: container.clientHeight, //flash的高度
            ratio: 1, //长宽比。默认为1。若为浮点数则会根据此比例裁剪图片。若不需要按比例裁剪，请设置为0
            flashUrl: '/resource/2015/imageclipper/imageClipper.swf?v=08101', //上传flash的地址
            resourceUrl: '/resource/2015/imageclipper/', //flash包含的按钮、光标等静态文件的放置路径
            uploadUrl: '/resource/2015/imageclipper/upload.php', //上传路径
            uploadSize: '200*160', //上传到服务器的图片的尺寸，若不指定，将直接上传裁剪后的图片区域
            file: 'file', //上传的字段名，默认为file
            isPreview: true, //是否显示预览图
            previewSize: '200*160|100*80', //显示哪些尺寸的预览图
            defaultPreview: '/resource/2015/imageclipper/test.jpg' //默认显示的预览图
        });

        imageClipper.bind("complete",function(evt, response){
            alert('上传成功，请查看console');
            console.log('jsjsjsjsjsjsjsjsjsjsjsjsjsjsjs**********complete', response);
        });

        imageClipper.bind("error",function(evt, response){
            alert('上传失败，请查看console');
            console.log('jsjsjsjsjsjsjsjsjsjsjsjsjsjsjs**********error', response);
        });

        //imageClipper.setImageSrc('http://127.0.0.1/imageClipper/demo/img_1432626207571.jpg'); 设置默认图片地址

    }
</script>

<footer>
    <a href="https://github.com/libmw/imageClipper">View On Github</a>
</footer>