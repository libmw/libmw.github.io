---
  layout: post
  title: 图片裁剪上传组件
---

# 我是开朗我自豪，我是超哥儿，我为自己带盐

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
            container: container,
            flashUrl: '/resource/2015/headimagecliper/headImageCliper.swf',
            width: container.clientWidth,
            height: container.clientHeight,
            uploadUrl: '/resource/2015/headimagecliper/upload.php',
            isPreview: true,
            previewSize: '180|100|50',
            resourceUrl: '/resource/2015/headimagecliper/'
        });

        imageCliper.bind("complete",function(evt, response){
            alert('上传成功，请查看console');
            console.log('jsjsjsjsjsjsjsjsjsjsjsjsjsjsjs**********complete', response);
        });

        imageCliper.bind("error",function(evt, response){
            console.log('jsjsjsjsjsjsjsjsjsjsjsjsjsjsjs**********error', response);
        });

        //imageCliper.setImageSrc('http://127.0.0.1/imageCliper/demo/img_1432626207571.jpg'); 设置默认图片地址

    }
</script>

<footer>
    [View On Github](https://github.com/libmw/headImageCliper)
</footer>