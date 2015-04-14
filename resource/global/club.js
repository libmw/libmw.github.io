(function() {
    if (!/autohome/.test(location.host)) {
        location.href = 'http://www.autohome.com.cn/';
        return
    };
    if (window.libmwToolBar) {
        return false
    };
    window.libmwToolBar = true;
    var imgs = $('img'),
        btn = document.createElement('button'),
        aLeft = document.createElement('a'),
        aRight = document.createElement('a');
    aLeft.className = '_libmw_turn';
    aLeft.innerHTML = '左转';
    aLeft.style.cursor = 'pointer';
    aRight.className = '_libmw_turn';
    aRight.innerHTML = '右转';
    aLeft.style.cursor = 'pointer';
    aRight.style.marginLeft = '5px';
    btn.innerHTML = "立即加载";
    var pos = window.scrollY;
    var locHash = location.hash.match(/pos=(\d+)/);
    if(locHash && locHash[1]){
        pos = +locHash[1];
    }
    $('img').each(function(i, o) {
        if (!o.getAttribute('src9')) {
            return true
        }

        o.removeAttribute('onerror');
        o.onerror = null;

        var $target = $(this);

        if($target.attr('x-style')){
            var styleWH = $target.attr('x-style').match(/\d+/g);
            $target.css({
                width: styleWH[0],
                height: styleWH[1]
            });
        }
        if($target.offset().top < pos){ //此图片已经被卷去
            $target.attr('src-cache', $target.attr('src9'));
            o.removeAttribute('src9');
            o.src = 'http://x.autoimg.cn/club/lazyload.png';
        }


        var tempBtn = btn.cloneNode(true);
        tempBtn.onclick = function() {
            o.src = o.getAttribute('src9') || o.getAttribute('src-cache');
        };
        o.parentNode.insertBefore(tempBtn, o);
        var tempLeft = aLeft.cloneNode(true),
            tempRight = aRight.cloneNode(true);
        tempLeft.setAttribute('degree', 270);
        tempRight.setAttribute('degree', 90);
        o.parentNode.insertBefore(tempLeft, o);
        o.parentNode.insertBefore(tempRight, o)
    });
    $('#cont_main').bind('click',
        function(e) {
            var t = e.target;
            if (t.className == '_libmw_turn') {
                var offsetDegree = +t.getAttribute('degree'),
                    img = $(t.parentNode).find('img')[0];
                if (img) {
                    var degree = +(img.degree || 0) + offsetDegree,
                        w = img.width;
                    h = img.height,
                        translate = '0, 0';
                    if (degree % 180 == 90) {
                        translate = w > h ? ('0, ' + (w - h) / 2 + 'px') : ((h - w) / 2 + 'px, 0');
                        img.parentNode.style.height = (w + 30) + 'px'
                    } else {
                        img.parentNode.style.height = h + 'px'
                    }
                    img.style['-webkit-transform'] = 'translate(' + translate + ') rotate(' + degree + 'deg)';
                    img.degree = degree
                }
            }
        });
    var threadList = localStorage.getItem('autoToolThreadList') || '';
    threadList = threadList.split(',');
    function saveThreadList() {
        localStorage.setItem('autoToolThreadList', threadList.join(','))
    }
    var listHtml = '';
    for (var i = 0; i < threadList.length; i++) {
        if (threadList[i]) {
            var thread = threadList[i].split('|');
            var page = ((localStorage.getItem(thread[0]) || '').split('|')[0]) || 1;
            listHtml += '<a href="http://club.autohome.com.cn/bbs/' + thread[0] + '-' + page + '.html" target="_blank">' + thread[1] + '</a>&nbsp;&nbsp;'
        }
    }
    var msg = $('<a onclick="return false;" href="#">aa</a>');
    var saveBtn = $('<a onclick="return false;" href="#">bb</a>').bind('click',
        function() {
            storageNow = true;
            setStorage();
            this.innerHTML = 'cc';
            for (var i = 0; i < threadList.length; i++) {
                if (thread_key == threadList[i].split('|')[0]) {
                    return
                }
            }
            threadList.push(thread_key + '|' + document.title.slice(0, 15));
            saveThreadList();
            $.get('http://club.autohome.com.cn/Detail/CollectTopic?topicId=' + tz.topicId + '&isAdd=true&_=' + Date.now());
        });
    var delBtn = $('<a onclick="return false;" href="#">dd</a>').bind('click',
        function() {
            localStorage.removeItem(thread_key);
            for (var i = 0; i < threadList.length; i++) {
                if (thread_key == threadList[i].split('|')[0]) {
                    threadList.splice(i, 1);
                    saveThreadList();
                    this.innerHTML = 'ff';
                    return
                }
            }
        });
    var thread = location.href.match(/(thread.*)-(\d+)\.html/);
    var thread_key = thread[1];
    var thread_page = +thread[2];
    var thread_storage = localStorage.getItem(thread_key);
    storageNow = false;
    function setStorage() {
        if (storageNow) {
            localStorage.setItem(thread_key, thread_page + '|' + document.body.scrollTop)
        }
    }
    $(document).bind('scroll', setStorage);
    if (thread_storage) {
        var storagePage = +thread_storage.split('|')[0],
            pageTop = thread_storage.split('|')[1];
        if (storagePage == thread_page) {
            msg.html('gg' + pageTop).bind('click',
                function() {
                    document.body.scrollTop = pageTop;
                    storageNow = true
                })
        } else {
            msg.html('hh' + storagePage + 'ii').bind('click',
                function() {
                    location.href = location.href.replace(/(thread.*)-(\d+)\.html/,
                        function(a, $1, $2) {
                            return $1 + '-' + storagePage + '.html'
                        })
                })
        }
    } else {
        delBtn = null
    }
    var myTool = $('<div>').css('background-color', '#4b67a1').append(delBtn).append(saveBtn).append(msg).append($(listHtml)).appendTo($('#headDiv'));
    $('#content').css('padding-top', 80);
    $('<a style="float:left;" href="#" onclick="return false;">jj</a>').prependTo($('.t_inner')).bind('click',
        function() {
            myTool.toggle()
        })
})();
