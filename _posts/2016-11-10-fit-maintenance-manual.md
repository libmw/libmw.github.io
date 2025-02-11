---
  layout: main
  title: 飞度保养手册
---
<style>
    html{
        height: 100%;
    }
    body{
        height: 100%;
        padding: 0;
        margin: 0;
        font-family: '微软雅黑';
    }
    table{
        border-collapse: collapse;
        border-spacing: 0;
        empty-cells: show;
        border: 1px solid #cbcbcb;

    }
    td,th{
        border-left: 1px solid #cbcbcb;
        border-width: 0 0 0 1px;
        font-size: inherit;
        margin: 0;
        overflow: visible;
        padding: .5em 1em;
        border-bottom: 1px solid #cbcbcb;
    }
    .level1{
        color: red;
    }
    .level2{
        color: pink;
    }
    .level3{
        color: green;
    }
    .level4{
        color: orange;
    }
    .level5{
        color: indigo;
    }
</style>
<h2>14款飞度保养手册，参照官方保养手册生成，仅供参考</h2>
<p>注：轮胎无法用公里数准确衡量保养方案，请参考轮胎厂商说明</p>
<p>注：喷油嘴清洁剂之家论坛里大家用得较多的是雪佛龙（Chevron）特劲 TCP 浓缩汽油添加剂[京东最低价时50能买到]或者红线添加剂</p>
<div id="issueTable"></div>
<script>
    var issueList = {
        5000: [
            '更换发动机机油',
            '添加喷油嘴清洁剂',
            '清洁空气滤清器滤芯'
        ],
        10000: [
            '更换发动机机油滤清器',
            '检查前后制动器',
            '轮胎换位(至少每月检查一次胎压及磨耗情况)',
            '目视检查横拉杆接头、方向机壳体及防尘罩、悬架部分、传动轴防尘罩'
        ],
        20000: [
            '更换灰尘与花粉滤清器',
            '更换空气滤清器滤芯',
            '检查制动软管和管路（包括ABS）',
            '检查所有的液位及油液状态、检查排气系统、燃油管路及其连接'
        ],
        40000: [
            '更换变速器油（手动变速器每6万公里一换）',
            '检查气门间隙',
            '检查和调节传动皮带',
            '检查驻车制动调节'
        ],
        60000: [
            '每3年更换制动液'
        ],
        80000: [
            '更换汽油滤清器'
        ],
        100000: [
            '更换火花塞'
        ],
        120000:[
            '检查发动机怠速转速'
        ],
        200000:[
            '更换发动机冷却液'
        ]
    };

    var constIssueList = { //固定公里数要做的事情
        20000: [
            '检查驻车制动调节'
        ]
    };

    var tableHTML = '<table><tr><td>公里数</td><td>事项</td></tr>';

    for(var i = 1; i <= 40; i++){
        var km = i * 5000;
        tableHTML += '<tr><td>'+ km +'KM</td>';
        tableHTML += '<td>'+ getIssueByKm(km) +'</td></tr>';
    }

    tableHTML += '</table>';

    document.getElementById('issueTable').innerHTML = tableHTML;

    function getIssueByKm(km){
        var issueArr = [];
        for(var issueKm in issueList){
            if(km % issueKm === 0){
                issueArr = issueArr.concat(issueList[issueKm]);
            }
        }
        return decorateIssue(issueArr.concat((constIssueList[km] || [])), km);
    }

    /*function groupIssue(issues){
     var issuesHtmlArr = [];
     for(var i = 0; i < issues.length; i++){
     issuesHtmlArr.push(decorateIssue(issues[i]));
     }
     return issuesHtmlArr.join(',');
     }*/
    function decorateIssue(issueArr, km){
        var issuesArr = [];
        var issuesByLevel = {
            1: [],
            2: [],
            3: [],
            4: [],
            5: [],
            6: []
        };
        for(var i = 0; i < issueArr.length; i++){
            var issue = issueArr[i];

            if(issue.indexOf('更换') > -1){
                issuesByLevel[1].push(issue);
            }else if(issue.indexOf('添加') > -1){
                issuesByLevel[2].push(issue);
            }else if(issue.indexOf('换位') > -1){
                issuesByLevel[3].push(issue);
            }else if(issue.indexOf('清洁') > -1){
                if(km % 10000 != 0){ //万公里直接更换空滤，不需清洁
                    issuesByLevel[4].push(issue);
                }
            }else if(issue.indexOf('检查') > -1){
                issuesByLevel[5].push(issue);
            }else{
                issuesByLevel[6].push(issue);
            }
        }

        for (var level in issuesByLevel){
            if(issuesByLevel[level].length){
                issuesArr.push('<span class="level'+ level +'">'+ issuesByLevel[level].join('，') +'</span>');
            }
        }

        return issuesArr.join('；');
    }
</script>