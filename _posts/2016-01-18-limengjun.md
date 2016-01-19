---
  layout: pure
  title: 李孟君-中移物联网先进员工评选宣传页
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

    max-height: 65%;
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
    <div class="section " id="section0">
        <h1>中移物联网优秀员工评选</h1>
        <h2>姓名：李孟君</h2>
        <h2>职务：OneNet前端开发团队负责人</h2>
        <h2>入职：14年7月</h2>
        <img src="/resource/201601/limengjun/1.png" alt="iphone" />

    </div>

    <div class="section " id="section1">
        <h1>主动与进取-OneNet1.0设计者</h1>
        <h2>独立设计了oneNet1.0的所有页面功能</h2>
        <h2>组织外包团队开发了OneNet1.0页面UI</h2>
        <img src="/resource/201601/limengjun/3.png" alt="iphone" />
    </div>



    <div class="section" id="section2">
        <h1>主动与进取-OneNet1.0前端架构师</h1>
        <h2>设计了业界领先的前端框架：开发效率高、运行效率快</h2>
        <h2>设计了具有自主知识产权的前端组件库：功能强大，升级方便</h2>
        <img src="/resource/201601/limengjun/4.png" alt="iphone" />
    </div>



    <div class="section " id="section4">
        <h1>创新-OneNet应用编辑器</h1>
        <h2>独立设计和开发了OneNet应用编辑器</h2>
        <h2>应用编辑器是业界首创，具核心竞争力</h2>
        <h2>为各大厂商带来方便，深受业界欢迎</h2>
        <img src="/resource/201601/limengjun/6.png" alt="iphone" />
    </div>

    <div class="section " id="section5">
        <h1>创新-OneNet头像编辑器</h1>
        <h2>独立设计开发了OneNet头像编辑器</h2>
        <h2>在github上开源了OneNet头像编辑器</h2>
        <h2>猪八戒等网站均使用了此编辑器</h2>
        <img src="/resource/201601/limengjun/7.png" alt="iphone" />
    </div>

    <div class="section " id="section6">
        <h1>合作-谷歌开发者大会</h1>
        <h2>与谷歌重庆开发者合作举办谷歌开发者大会</h2>
        <h2>担任大会讲师，宣传了公司的前端技术</h2>
        <h2>与其他开发者深入交流，共同学习最新技术</h2>
        <img src="/resource/201601/limengjun/8.png" alt="iphone" />
    </div>

    <div class="section " id="section7">
        <h1>坚韧-OneNet2.0技术带头人</h1>
        <h2>在另一技术带头人突然离职的情况下：</h2>
        <h2>带领只有5人的技术团队，完成了OneNet2.0的开发</h2>
        <h2>在界面上和访问速度上得到了巨大的提升</h2>
        <h2>OneNet2.0已经成为开放平台部的核心产品之一</h2>
        <img src="/resource/201601/limengjun/5.png" alt="iphone" />
    </div>

    <div class="section " id="section8">
        <h1>坚韧-顶住人员压力</h1>
        <h2>在技术人员严重不足的情况下：</h2>
        <h2>果断认命新的后端负责人，共同填补人员缺口</h2>
        <h2>独立完成了部门前端笔试题库</h2>
        <h2>承担了大部分招聘任务，为公司招聘大量人才</h2>
        <img src="/resource/201601/limengjun/9.png" alt="iphone" />
    </div>

    <div class="section " id="section9">
        <h1>高效-优化文档和流程</h1>
        <h2>探索团队重要目标，分离出主要任务和次要任务</h2>
        <h2>组织整理团队文档，增加新人上手效率</h2>
        <h2>优化了团队各项流程，增加开发效率</h2>
        <img src="/resource/201601/limengjun/10.png" alt="iphone" />
    </div>
</div>
