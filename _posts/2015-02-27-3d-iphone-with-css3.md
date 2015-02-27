---
  layout: post
  title: 用css3绘制3d手机
---

# 使用css3绘制3d手机

> 首先来看例子：

<style>
        .phone-container {
            position: relative;
            width: 251px;
            height: 537px;
            top: -127px;

            -webkit-perspective: 800px;
            -moz-perspective: 800px;
            -ms-perspective: 800px;
            -o-perspective: 800px;
            perspective: 800px;
            -webkit-transform: translate(0) scale(0.7);
            -moz-transform: translate(0) scale(0.7);
            -ms-transform: translate(0) scale(0.7);
            -o-transform: translate(0) scale(0.7);
            transform: translate(0) scale(0.7);
        }
        .phone-container * {
            position: absolute;
            -webkit-transition: all 1500ms;
            -moz-transition: all 1500ms;
            -o-transition: all 1500ms;
            transition: all 1500ms;
        }
        .phone-container .phone {
            left: 125px;
            transform-origin: left center;
            width: 251px;
            height: 537px;
            -webkit-transform-style: preserve-3d;
            -moz-transform-style: preserve-3d;
            -ms-transform-style: preserve-3d;
            -o-transform-style: preserve-3d;
            transform-style: preserve-3d;
            -webkit-transform: rotateX(1deg) rotateY(1deg);
            -moz-transform: rotateY(-80deg);
            -ms-transform: rotateY(-80deg);
            -o-transform: rotateY(-80deg);
            transform: rotateX(1deg) rotateY(1deg);

        }
        .phone-container .front {
            width: 251px;
            height: 537px;
            background: url(http://www.heclouds.com/static/try/img/front.png) no-repeat;
            -webkit-transform: translateX(-125px) rotateY(0deg) translateZ(14px);
            -moz-transform: translateX(-125px) rotateY(0deg) translateZ(14px);
            -ms-transform: translateX(-125px) rotateY(0deg) translateZ(14px);
            -o-transform: translateX(-125px) rotateY(0deg) translateZ(14px);
            transform: translateX(-125px) rotateY(0deg) translateZ(14px);
        }
        .phone-container .back {
            width: 251px;
            height: 537px;
            background: url(http://www.heclouds.com/static/try/img/back.png) no-repeat;
            -webkit-transform: translateX(-125px) rotateY(180deg) translateZ(13px);
            -moz-transform: translateX(-125px) rotateY(180deg) translateZ(13px);
            -ms-transform: translateX(-125px) rotateY(180deg) translateZ(13px);
            -o-transform: translateX(-125px) rotateY(180deg) translateZ(13px);
            transform: translateX(-125px) rotateY(180deg) translateZ(13px);
        }
        .phone-container .top {
            background: black;
            width: 218px;
            height: 31px;
            /* -webkit-transform: translateZ(15px) translateX(-125px) rotateX(90deg); */
            -webkit-transform: translateX(-110px) translateZ(0px) rotateX(90deg);
            -moz-transform: translateX(-110px) translateZ(0px) rotateX(90deg);
            -ms-transform: translateX(-110px) translateZ(0px) rotateX(90deg);
            -o-transform: translateX(-110px) translateZ(0px) rotateX(90deg);
            transform: translateX(-110px) translateZ(0px) rotateX(90deg);
        }
        .phone-container .bottom {
            background: black;
            width: 218px;
            height: 31px;
            /* -webkit-transform: translateZ(15px) translateX(-125px) rotateX(90deg); */
            -webkit-transform: translateX(-110px) translateY(500px) translateZ(0px) rotateX(90deg);
            -moz-transform: translateX(-110px) translateY(500px) translateZ(0px) rotateX(90deg);
            -ms-transform: translateX(-110px) translateY(500px) translateZ(0px) rotateX(90deg);
            -o-transform: translateX(-110px) translateY(500px) translateZ(0px) rotateX(90deg);
            transform: translateX(-110px) translateY(500px) translateZ(0px) rotateX(90deg);
        }
        .phone-container .left {
            width: 31px;
            height: 537px;
            background: url(http://www.heclouds.com/static/try/img/left_side.png) no-repeat;
            -webkit-transform: translateX(-138px) rotateY(-90deg);
            -moz-transform: translateX(-138px) rotateY(-90deg);
            -ms-transform: translateX(-138px) rotateY(-90deg);
            -o-transform: translateX(-138px) rotateY(-90deg);
            transform: translateX(-138px) rotateY(-90deg);
            -webkit-border-radius: 20px;
            -moz-border-radius: 20px;
            -ms-border-radius: 20px;
            -o-border-radius: 20px;
            border-radius: 20px;
            -webkit-backface-visibility: hidden;
            -moz-backface-visibility: hidden;
            -ms-backface-visibility: hidden;
            -o-backface-visibility: hidden;
            backface-visibility: hidden;
        }
        .phone-container .left-top {
            background: black;
            width: 29px;
            height: 30px;
            top: 4px;
            -webkit-transform: translateX(-129px) rotateY(-90deg) rotateX(30deg);
            -moz-transform: translateX(-129px) rotateY(-90deg) rotateX(30deg);
            -ms-transform: translateX(-129px) rotateY(-90deg) rotateX(30deg);
            -o-transform: translateX(-129px) rotateY(-90deg) rotateX(30deg);
            transform: translateX(-129px) rotateY(-90deg) rotateX(30deg);
        }
        .phone-container .left-bottom {
            background: black;
            width: 29px;
            height: 25px;
            -webkit-transform: translateX(-131px) translateY(490px) rotateY(-90deg) rotateX(-30deg);
            -moz-transform: translateX(-131px) translateY(490px) rotateY(-90deg) rotateX(-30deg);
            -ms-transform: translateX(-131px) translateY(490px) rotateY(-90deg) rotateX(-30deg);
            -o-transform: translateX(-131px) translateY(490px) rotateY(-90deg) rotateX(-30deg);
            transform: translateX(-131px) translateY(490px) rotateY(-90deg) rotateX(-30deg);
        }
        .phone-container .right {
            width: 31px;
            height: 537px;
            background: url(http://www.heclouds.com/static/try/img/right_side.png) no-repeat;
            -webkit-transform: translateX(105px) rotateY(90deg);
            -moz-transform: translateX(105px) rotateY(90deg);
            -ms-transform: translateX(105px) rotateY(90deg);
            -o-transform: translateX(105px) rotateY(90deg);
            transform: translateX(105px) rotateY(90deg);
            -webkit-backface-visibility: hidden;
            -moz-backface-visibility: hidden;
            -ms-backface-visibility: hidden;
            -o-backface-visibility: hidden;
            backface-visibility: hidden;
        }
        .phone-container .right-top {
            background: black;
            width: 29px;
            height: 29px;
            top: 4px;
            -webkit-transform: translateX(98px) rotateY(-90deg) rotateX(-30deg);
            -moz-transform: translateX(98px) rotateY(-90deg) rotateX(-30deg);
            -ms-transform: translateX(98px) rotateY(-90deg) rotateX(-30deg);
            -o-transform: translateX(98px) rotateY(-90deg) rotateX(-30deg);
            transform: translateX(98px) rotateY(-90deg) rotateX(-30deg);
        }
        .phone-container .right-bottom {
            background: black;
            width: 29px;
            height: 25px;
            -webkit-transform: translateX(100px) translateY(490px) rotateY(-90deg) rotateX(30deg);
            -moz-transform: translateX(100px) translateY(490px) rotateY(-90deg) rotateX(30deg);
            -ms-transform: translateX(100px) translateY(490px) rotateY(-90deg) rotateX(30deg);
            -o-transform: translateX(100px) translateY(490px) rotateY(-90deg) rotateX(30deg);
            transform: translateX(100px) translateY(490px) rotateY(-90deg) rotateX(30deg);
        }
        .phone-container .shadow {
            width: 250px;
            height: 20px;
            -webkit-transform: translateX(-125px) translateY(530px) rotateX(90deg) translateY(-60px);
            -moz-transform: translateX(-125px) translateY(530px) rotateX(90deg) translateY(-60px);
            -ms-transform: translateX(-125px) translateY(530px) rotateX(90deg) translateY(-60px);
            -o-transform: translateX(-125px) translateY(530px) rotateX(90deg) translateY(-60px);
            transform: translateX(-125px) translateY(530px) rotateX(90deg) translateY(-60px);
            -webkit-box-shadow: 0 60px 60px black;
            -moz-box-shadow: 0 60px 60px black;
            box-shadow: 0 60px 60px black;
            -webkit-animation: lower-shadow 2.5s ease-in-out infinite alternate;
            -moz-animation: lower-shadow 2.5s ease-in-out infinite alternate;
            -o-animation: lower-shadow 2.5s ease-in-out infinite alternate;
            -ms-animation: lower-shadow 2.5s ease-in-out infinite alternate;
            animation: lower-shadow 2.5s ease-in-out infinite alternate;
        }


        .animate-rotation {
            -moz-animation: rotation 5s infinite linear;
            -o-animation: rotation 5s infinite linear;
            -webkit-animation: rotation 5s infinite linear;
            animation: rotation 5s infinite linear;
        }
        @-moz-keyframes rotation {
          0% {
                      -moz-transform: rotateX(30deg) rotateY(0deg);
                      -o-transform: rotateX(30deg) rotateY(0deg);
                      -webkit-transform: rotateX(30deg) rotateY(0deg);
                      transform: rotateX(30deg) rotateY(0deg);
                    }
                    100% {
                      -moz-transform: rotateX(30deg) rotateY(360deg);
                      -o-transform: rotateX(30deg) rotateY(360deg);
                      -webkit-transform: rotateX(30deg) rotateY(360deg);
                      transform: rotateX(30deg) rotateY(360deg);
                    }
        }
        @-webkit-keyframes rotation {
          0% {
            -moz-transform: rotateX(30deg) rotateY(0deg);
            -o-transform: rotateX(30deg) rotateY(0deg);
            -webkit-transform: rotateX(30deg) rotateY(0deg);
            transform: rotateX(30deg) rotateY(0deg);
          }
          100% {
            -moz-transform: rotateX(30deg) rotateY(360deg);
            -o-transform: rotateX(30deg) rotateY(360deg);
            -webkit-transform: rotateX(30deg) rotateY(360deg);
            transform: rotateX(30deg) rotateY(360deg);
          }
        }
        @-o-keyframes rotation {
          0% {
                      -moz-transform: rotateX(30deg) rotateY(0deg);
                      -o-transform: rotateX(30deg) rotateY(0deg);
                      -webkit-transform: rotateX(30deg) rotateY(0deg);
                      transform: rotateX(30deg) rotateY(0deg);
                    }
                    100% {
                      -moz-transform: rotateX(30deg) rotateY(360deg);
                      -o-transform: rotateX(30deg) rotateY(360deg);
                      -webkit-transform: rotateX(30deg) rotateY(360deg);
                      transform: rotateX(30deg) rotateY(360deg);
                    }
        }
        @-ms-keyframes rotation {
         0% {
                     -moz-transform: rotateX(30deg) rotateY(0deg);
                     -o-transform: rotateX(30deg) rotateY(0deg);
                     -webkit-transform: rotateX(30deg) rotateY(0deg);
                     transform: rotateX(30deg) rotateY(0deg);
                   }
                   100% {
                     -moz-transform: rotateX(30deg) rotateY(360deg);
                     -o-transform: rotateX(30deg) rotateY(360deg);
                     -webkit-transform: rotateX(30deg) rotateY(360deg);
                     transform: rotateX(30deg) rotateY(360deg);
                   }
        }
        @keyframes rotation {
          0% {
                      -moz-transform: rotateX(30deg) rotateY(0deg);
                      -o-transform: rotateX(30deg) rotateY(0deg);
                      -webkit-transform: rotateX(30deg) rotateY(0deg);
                      transform: rotateX(30deg) rotateY(0deg);
                    }
                    100% {
                      -moz-transform: rotateX(30deg) rotateY(360deg);
                      -o-transform: rotateX(30deg) rotateY(360deg);
                      -webkit-transform: rotateX(30deg) rotateY(360deg);
                      transform: rotateX(30deg) rotateY(360deg);
                    }
        }
</style>

<div class="touch-rotate">
    <!--[if lte IE 10]><div class="ie-tip highlight">您的浏览器不支持查看旋转状态，请使用IE10以上版本浏览器或谷歌、火狐浏览器</div><![endif]-->

    <div class="phone-container">
        <div class="phone animate-rotation" id="box">
            <div class="front"> </div>
            <div class="back"> </div>
            <div class="left"> </div>
            <div class="right"> </div>
            <div class="top"> </div>
            <div class="bottom"> </div>
            <div class="left-top"> </div>
            <div class="left-bottom"> </div>
            <div class="right-top"> </div>
            <div class="right-bottom"> </div>
            <div class="shadow"> </div>
        </div>
    </div>
</div>

### css3对3D的支持
> css3有一个简单的3d模型，包括旋转，平移，透视等概念都有对应的属性实现。
  通过旋转和在x、y、z轴上的移动，我们不难画出一个立方体出来，具体步骤就是设置父级的transform-style:preserve-3d，通过perspective来设置景深，然后通过translateX，translateY，translateZ来拉开各个子元素的距离，通过rotateX，rotateY，rotateZ来旋转子元素。
  具体例子参考[这里](http://jsfiddle.net/24yqrw3g/)

## 创建3d手机

有了立方体的模型，我们只需要把每个面改为iphone的图片即可，素材来源于网上。

但是仅仅这样还不行，因为手机四个角都是一个弧形，
所以我们需要单独对四个角进行处理，使用四个div进行平移旋转即可。最后我们加上shadow阴影，使我们的手机看起来更加真实。