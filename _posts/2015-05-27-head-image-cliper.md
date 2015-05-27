---
  layout: post
  title: 图片裁剪上传组件
---

# 图片裁剪上传

多用于用户头像的裁剪。在本地对图片进行裁剪压缩后，再传递到后端，后端只需要保存最终的图片即可。支持按尺寸预览。

本案例上传按钮点击后会上传失败，因为demo里指定的上传地址仅仅作为示例，是一个无法访问的地址。

<style>
    #avg {z-index:999;position:absolute;top:5px;left:5px;font-size:12px;color:#000;}
}
</style>


<button onclick="imageCliper.submit();">上传</button>

<div id="headImage" style="width:730px;height:730px;margin-left: 10px;">

</div>

<script src="/resource/2015/headimagecliper/headImageCliper.js"></script>
<script>
    window.onload = function(){

        var container = document.getElementById('headImage');
        window.imageCliper = new HeadImageCliper({
            container: container, //上传界面的容器，原生dom
            flashUrl: '/resource/2015/headimagecliper/headImageCliper.swf?v=0527', //上传flash的地址,加上版本号，防止flash被缓存
            width: container.clientWidth, //flash的宽度
            height: container.clientHeight, //flash的高度
            uploadUrl: '/resource/2015/headimagecliper/upload.php', //上传路径
            file: 'file', //上传的字段名，默认为file
            isPreview: true, //是否显示预览图
            previewSize: '180|100|50', //预览图尺寸。'200|100'代表显示200*200和100*100的预览图。注意预览图的尺寸如果过大，可能会超出flash的可视范围，此时应该设置不显示预览图或者增大flash的宽高度
            resourceUrl: '/resource/2015/headimagecliper/' //flash包含的按钮、光标等静态文件的放置路径
        });

        imageCliper.bind("complete",function(evt, response){
            alert('上传成功，请查看console');
            console.log('jsjsjsjsjsjsjsjsjsjsjsjsjsjsjs**********complete', response);
        });

        imageCliper.bind("error",function(evt, response){
            alert('上传失败，请查看console');
            console.log('jsjsjsjsjsjsjsjsjsjsjsjsjsjsjs**********error', response);
        });

        //imageCliper.setImageSrc('http://127.0.0.1/imageCliper/demo/img_1432626207571.jpg'); 设置默认图片地址

    }
</script>

<footer>
    <a href="https://github.com/libmw/headImageCliper">View On Github</a>
</footer>