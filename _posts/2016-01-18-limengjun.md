---
  layout: post
  title: 图片裁剪上传组件
---
<link rel="stylesheet" type="text/css" href="/resource/201601/limengjun/jquery.fullPage.css" />
<!--[if IE]>
<script type="text/javascript">
    var console = { log: function() {} };
</script>
<![endif]-->
<style>


body{
    color: #333;
    font-family: "Lucida Grande", "Lucida Sans Unicode", Helvetica, Arial, Verdana, sans-serif;
}


    /* Style for our header texts
    * --------------------------------------- */
h1{
    font-size: 5em;
    font-family: arial,helvetica;
    margin:0;
    padding:0;
}
h2{
    font-size: 2em;
    margin: 0 0 18px 0;
    font-family: arial,helvetica;
}




    /* Common styles
    * --------------------------------------- */
img{
    -webkit-transition: all 0.7s ease-out;
    -moz-transition: all 0.7s ease-out;
    -o-transition: all 0.7s ease-out;
    transition: all 0.7s ease-out;
}
.section{
    text-align:center;
    overflow:hidden;
}
.wrap{
    width: 1180px;
    height: 100%;
    margin-left: auto;
    margin-right: auto;
    position: relative;
}
.box{
    text-align: left;
    color: #808080;
    font-size: 1.2em;
    line-height: 1.6em;
}




    /* Section 0
    * --------------------------------------- */
#section0{
    padding: 60px 0;
}
#section0 img{
    height: 100%;
    margin: 40px 0 0 0;
}




    /* Section 1
    * --------------------------------------- */


#section1 .box{
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -192px;
    margin-left: 89px;
    width: 395px;
    z-index: 1;
}
#section1 .imgsContainer{
    display: block;
    position: absolute;
    z-index: 1;
    top: 42%;
    left: 58%;
    margin-top: -325px;
    margin-left: -747px;
    width: 800px;
    height: 696px;
}
#section1 img{
    height: 100%;
}
    /*screen resolutions between 620px and 800px*/
@media all and (min-width: 620px) and (max-width: 800px){
    #section1 .imgsContainer{
        margin-top: -278px;
        margin-left: -685px;
        width: 647px;
        height: 563px;
    }
}

    /*screen resolutions lower than 620px*/
@media all and (max-width: 620px){
    #section1 .imgsContainer{
        margin-top: -208px;
        margin-left: -516px;
        width: 534px;
        height: 464px;
    }
}
#iphone2{
    z-index: 10;
}
#iphone2.active{
    -webkit-transform: translate3d(-134px, 0px, 0px);
    -moz-transform: translate3d(-134px, 0px, 0px);
    -ms-transform:translate3d(-134px, 0px, 0px);
    transform: translate3d(-134px, 0px, 0px);
}

#iphone3{
    z-index: 12;
}
#iphone3.active{
    -webkit-transform: translate3d(213px, 0px, 0px);
    -moz-transform: translate3d(213px, 0px, 0px);
    -ms-transform:translate3d(213px, 0px, 0px);
    transform: translate3d(213px, 0px, 0px);
}

#iphone4{
    z-index: 11;
    left: 140px;
}

#iphone4.active{
    -webkit-transform: translate3d(548px, 0px, 0px);
    -moz-transform: translate3d(548px, 0px, 0px);
    -ms-transform:translate3d(548px, 0px, 0px);
    transform: translate3d(548px, 0px, 0px);
}




    /* Section 2
    * --------------------------------------- */
#section2 img{
    position:absolute;
}
#section2 .imgsContainer,
#staticImg .imgsContainer,
#section3 .imgsContainer{
    position: absolute;
    z-index: 1;
    left: 50%;
    display: block;
    margin-top: -288px;
    margin-left: -636px;
    width: 0;
    height: 0;

    -webkit-transition: all 1.2s ease-in-out;
    -moz-transition: all 1.2s ease-in-out;
    -o-transition: all 1.2s ease-in-out;
    transition: all 1.2s ease-in-out;
}

#section2.moveUp .imgsContainer{
    top: 50%;
}

#section2.moveDown .imgsContainer,
#staticImg .imgsContainer{
    top: 90%;
}

#section2.active .imgsContainer{
    top: 50%;
}

#section2 .box{
    top: 22%;
    left: 42%;
    position: absolute;
    width: 582px;
}

#iphone-yellow{
    top: -35px;
    left: -222px;
}

#iphone-red{
    top: -194px;
    left: 106px;
}

#iphone-blue{
    top: 320px;
    left: 448px;
}

#iphone-green{
    left: 106px;
    position:absolute;
}

#staticImg{
    display: block;
    position: absolute;
    z-index: 1;
    top: 200%;
    left: 0;
    width: 100%;
    min-width: 980px;
    height: 100%;

    -webkit-transition: all 0.7s ease-out;
    -moz-transition: all 0.7s ease-out;
    -o-transition: all 0.7s ease-out;
    transition: all 0.7s ease-out;

    -webkit-backface-visibility: hidden;
    -webkit-perspective: 1000;
}
#staticImg.moveDown{
    -webkit-transform: translate3d(0, 100%, 0);
    -ms-transform: translate3d(0, 100%, 0);
    transform: translate3d(0, 100%, 0);
}
#staticImg.moveUp{

    -webkit-transform: translate3d(0, 0, 0);
    -ms-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
}
#staticImg.moveDown .imgsContainer{
    top: 50%;
}
#staticImg.moveDown img{
    top: 155px;
}

#staticImg.active .imgsContainer{
    top: 50%;
}


#staticImg.active img{
    top: 487px;
}





    /* Section 3
    * --------------------------------------- */
#section3 .imgsContainer{
    top: 50%;
}

#section3 img{
    top: 155px;
    left: 455px;
    position: absolute;
}
#section3 .box{
    text-align: center;
    margin: 10% 0 0 0;
}



    /* Overwriting fullPage.js tooltip color
    * --------------------------------------- */
.fp-tooltip{
    color: #AAA;
}
#fp-nav span, .fp-slidesNav span{
    border-color: #AAA;
}
#fp-nav li .active span, .fp-slidesNav .active span{
    background: #AAA;
}

</style>
<script src="/resource/201601/limengjun/jquery.min.js"></script>

<script type="text/javascript" src="/resource/201601/limengjun/jquery.fullPage.js"></script>

<script type="text/javascript">
    $(document).ready(function() {
        $('#fullpage').fullpage({
            'verticalCentered': false,
            'css3': true,
            'sectionsColor': ['#F0F2F4', '#fff', '#fff', '#fff'],
            'navigation': true,
            'navigationPosition': 'right',
            'navigationTooltips': ['fullPage.js', 'Powerful', 'Amazing', 'Simple'],

            'afterLoad': function(anchorLink, index){
                if(index == 2){
                    $('#iphone3, #iphone2, #iphone4').addClass('active');
                }
            },

            'onLeave': function(index, nextIndex, direction){
                if (index == 3 && direction == 'down'){
                    $('.section').eq(index -1).removeClass('moveDown').addClass('moveUp');
                }
                else if(index == 3 && direction == 'up'){
                    $('.section').eq(index -1).removeClass('moveUp').addClass('moveDown');
                }

                $('#staticImg').toggleClass('active', (index == 2 && direction == 'down' ) || (index == 4 && direction == 'up'));
                $('#staticImg').toggleClass('moveDown', nextIndex == 4);
                $('#staticImg').toggleClass('moveUp', index == 4 && direction == 'up');
            }
        });
    });
</script>

<div id="fullpage">
    <div id="staticImg">
        <div class="imgsContainer">
            <img src="imgs/iphone-green.png" alt="iphone" id="iphone-green" />
        </div>
    </div>

    <div class="section " id="section0">
        <h1>主动与进取</h1>

        <h2>14年7月加入onenet</h2>
        <h2>组建onenet前端开发团队</h2>
        <img src="/resource/201601/limengjun/1.png" alt="iphone" />
    </div>

    <div class="section " id="section1">
        <h1>主动与进取</h1>

        <h2>onenet1.0设计者</h2>
        <h2>onenet1.0前端架构者</h2>
        <h3>业界领先的前端开发框架
            自主知识产权的组件库</h3>
        <img src="/resource/201601/limengjun/2.png" alt="iphone" />
        <img src="/resource/201601/limengjun/3.png" alt="iphone" />
    </div>

    <div class="section" id="section1">
        <div class="wrap">
            <div class="imgsContainer">
                <img src="imgs/iphone2.png" alt="iphone" id="iphone2" />
                <img src="imgs/iphone3.png" alt="iphone" id="iphone3" />
                <img src="imgs/iphone4.png" alt="iphone" id="iphone4" />
            </div>

            <div class="box">
                <h2>A powerful plugin</h2>
                <strong>fullPage.js</strong>  callbacks allow you to create amazing dynamic sites with a bit of imagination. This example tries to reproduce the Apple iPhone-5c website animations as an example of what fullPage.js is capable of.
            </div>
        </div>
    </div>

    <div class="section moveDown" id="section2">
        <div class="wrap">
            <div class="imgsContainer">
                <img src="imgs/iphone-yellow.png" alt="iphone" id="iphone-yellow" />
                <img src="imgs/iphone-red.png" alt="iphone" id="iphone-red" />
                <img src="imgs/iphone-blue.png" alt="iphone" id="iphone-blue" />
            </div>

            <div class="box">
                <h2>Amazing stuff</h2>
                Combining <strong>fullPage.js</strong> with your own CSS styles and animations, you will be able to create something remarkable.
            </div>
        </div>
    </div>
    <div class="section moveDown" id="section3">
        <div class="wrap">
            <div class="box">
                <h2>Just a demo</h2>
                This is, of course, just a demo. I didn't want to spend much time on it.
                Don't expect it to work perfectly in all kind of screens.
                It has been designed to work on 1180px width or over on modern browsers with CSS3.
            </div>
        </div>
        <div class="imgsContainer">
            <img src="imgs/iphone-two.png" alt="iphone" id="iphone-two" />
        </div>
    </div>
</div>