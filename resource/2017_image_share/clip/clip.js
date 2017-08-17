    var clipper = {
        initial : function($container, imgSrc){
            this._$container = $container; //执行裁剪的容器
            this._imgSrc = imgSrc; //执行裁剪的容器
            //this.clipRectData = {};
            this._image = new Image();
            this._$image = $(this._image);
            this._initUI();
        },
        _initUI: function(){
            var _this = this;
            var img = this._image;
            img.onload = function(){
                _this._createClipUI();
            };
            img.src = this._imgSrc;
        }

        /**
         * @private _CreateClipUI 创建裁剪ui
         */
        ,_createClipUI: function(){
            var _this = this;
            var $ctn = this._$container; //执行裁剪的容器
            var img = this._image;
            var ctnWidth = $ctn.width();
            var ctnHeight = $ctn.height();
            var imgWidth = img.width;
            var imgHeight = img.height;
            var aspectRatio = img.width / img.height;
            if(imgWidth > ctnWidth && aspectRatio >= 1){ //图片宽度超过容器
                img.width = ctnWidth;
                img.height = img.width / aspectRatio;
            }else if(imgHeight > ctnHeight && aspectRatio < 1){ //图片高度超过容器
                img.height = ctnHeight;
                img.width = img.height * aspectRatio;
            }

            var imageRect = { //图片的坐标、大小
                width: img.width,
                height: img.height,
                left: (ctnWidth - img.width) / 2,
                top: (ctnHeight - img.height) / 2
            };

            $(img).css({
                position: 'absolute',
                left: imageRect.left,
                top: imageRect.top
            });
            $ctn.append(img);

            this._$mask = $('<div></div>').css({
                width: img.width,
                height: img.height,
                opacity: 0.5,
                'background-color': 'gray',
                position: 'absolute',
                left: imageRect.left,
                top: imageRect.top
            }); //裁剪阴影
            $ctn.append(this._$mask);

            var cliperSize = { //默认120 * 120
                width: img.width / 2 > 100 ? img.width / 2 : 100,
                height: img.height / 2 > 100 ? img.height / 2 : 100
            };

            this._$clipTabel = $('<div class="clipContainer">'
                +'<div class="resize-image"><img src="'+ this._imgSrc +'" width="'+ img.width +'" height="'+ img.height +'" /></div>'
                +'  <table style="background-image:url()" unselectable="on">'
                +'	<tbody>'
                +'		<tr class="">'
                +'			<td width="33.33%"></td><td width="33.33%"></td><td width="33.33%"></td>'
                +'		</tr>'
                +'		<tr class="">'
                +'			<td></td><td></td><td></td>'
                +'		</tr>'
                +'		<tr class="">'
                +'			<td></td><td></td><td></td>'
                +'		</tr>'
                +'	</tbody>'
                +'</table>'
                +'<div class="clip-handle-btn"><span class="btn-ok"></span><span class="btn-cancel"></span></div>'
                +'<div class="resize-btn r-nw"></div>'
                +'<div class="resize-btn r-sw"></div>'
                +'<div class="resize-btn r-ne"></div>'
                +'<div class="resize-btn r-se"></div>'
                +'</div>').css({
                    position: 'absolute',
                    width: cliperSize.width,
                    height: cliperSize.height,
                    left: imageRect.left + (imageRect.width - cliperSize.width) / 2,
                    top:  imageRect.top + (imageRect.height - cliperSize.height) / 2
                }); //裁剪框
            $ctn.append(this._$clipTabel);
            this._$clipImage = this._$clipTabel.find('.resize-image img');
            this._setClipImagePosition();

            this._bindClipEvent();

            return;


            this.maskCtx = this.maskCanvas.getContext('2d');
            $(this.maskCanvas).css({position: 'absolute',display:'none',zIndex:1});
            this.editor.viewer.append(this.cliper);
            this.editor.viewer.append(this.maskCanvas);
            this._btnOk = this.cliper.find('.btn-ok').on('click', function(){
                self._doClip();
            });
            this._btnCancel = this.cliper.find('.btn-cancel').on('click', function(){
                self._endClip();
            });
            this._btnCtn = this.cliper.find('.clip-handle-btn');
        },
        _setClipImagePosition: function(){
            var imgPosition = $(this._image).position();
            var clipperPosition = this._$clipTabel.position();
            this._$clipImage.css({
                left: imgPosition.left - clipperPosition.left,
                top: imgPosition.top - clipperPosition.top
            });
        },
        _bindClipEvent: function(){
            var _this = this;
            var clipper = this._$clipTabel;
            this.resizeHandler = resize.initial({
                container: clipper,
                handlers: {
                    nw: {handle: clipper.find('.r-nw')}
                    ,ne: {handle: clipper.find('.r-ne')}
                    ,sw: {handle: clipper.find('.r-sw')}
                    ,se: {handle: clipper.find('.r-se')}
                    ,move: {handle: clipper}
                },
                onbeforeMove: function(){
                    var targetRect = this.targetRect;
                    var img = _this._image;
                    var position = _this._$image.position();
                    var offset;
                    var rangeRect = {
                            width: img.width,
                            height: img.height,
                            left: position.left,
                            top: position.top
                        };
                    if(targetRect.width <= 100){ //最大裁切100 * 100
                        offset = targetRect.width - 100;
                        targetRect.width = 100;
                        targetRect.left += offset * this.CONF.vector[this.direction].left;
                    }
                    if(targetRect.height <= 100){ //最大裁切100 * 100
                        offset = targetRect.height - 100;
                        targetRect.height = 100;
                        targetRect.top += offset * this.CONF.vector[this.direction].top;
                    }
                    if(targetRect.left < rangeRect.left){
                        offset = targetRect.left - rangeRect.left;
                        targetRect.left = rangeRect.left;
                        targetRect.width -= offset * this.CONF.vector[this.direction].width;
                    }
                    if(targetRect.top < rangeRect.top){
                        offset = targetRect.top - rangeRect.top;
                        targetRect.top = rangeRect.top;
                        targetRect.height -= offset * this.CONF.vector[this.direction].height;
                    }
                    if(targetRect.left + targetRect.width > rangeRect.left + rangeRect.width){ //右边跨界
                        offset = targetRect.left + targetRect.width - rangeRect.left - rangeRect.width;
                        targetRect.width -= offset * this.CONF.vector[this.direction].width;
                        targetRect.left = rangeRect.left + rangeRect.width - targetRect.width;
                    }
                    if(targetRect.top + targetRect.height > rangeRect.top + rangeRect.height){ //底部跨界
                        offset = targetRect.top + targetRect.height - rangeRect.top - rangeRect.height;
                        targetRect.height -= offset * this.CONF.vector[this.direction].height;
                        targetRect.top = rangeRect.top + rangeRect.height - targetRect.height;
                    }
                    //检测按钮是否还有地方放置
                    //self._setClipBtnOverflow(rangeRect.top + rangeRect.height, targetRect.top + targetRect.height);
                    return true;
                },
                onafterMove: function(){
                    _this._setClipImagePosition();
                }

            });
            return;


            this.bind('add_to_editor_success', function(){
                self.editor.aside.find('.xeditor_clip').on('click', function(e){
                    if(!editor.isLocked()){
                        editor.addLock('clip');
                        self._beginClip();
                    }
                    return false;
                });
            });
            this.bind('restart', function(){ //重新开始的处理
                self._endClip();
            });
        }
        /**
         * @private beginClip 开始裁剪
         */
        ,_beginClip: function(){
            var editor = this.editor
                ,preCanvas = editor.preCanvas
                ,preCanvasXY = { //jq的position获取不仅仅有offset
                    left: preCanvas.offsetLeft
                    ,top: preCanvas.offsetTop
                }
                ,preCanvasSize = {
                    width: preCanvas.width
                    ,height: preCanvas.height
                }
                ,cliperSize = { //默认120 * 120
                    width: ~~(preCanvasSize.width / 2 > 100 ? preCanvasSize.width / 2 : 100)
                    ,height: ~~(preCanvasSize.height / 2 > 100 ? preCanvasSize.height / 2 : 100)
                }
                ,cliperPosition = null;

            this.maskCanvas.width = preCanvas.width;
            this.maskCanvas.height = preCanvas.height;
            $(this.maskCanvas).css({
                left: preCanvasXY.left
                ,top: preCanvasXY.top
            });

            this.cliper.css({
                width: cliperSize.width
                ,height: cliperSize.height
            });
            cliperPosition = {
                left: preCanvasXY.left + (preCanvasSize.width - this.cliper.outerWidth()) / 2
                ,top: preCanvasXY.top + (preCanvasSize.height - this.cliper.outerHeight()) / 2
            };
            this.cliper.css({
                left: ~~cliperPosition.left
                ,top: ~~cliperPosition.top
            }).show();

            this._setClipBtnOverflow(preCanvasXY.top + preCanvasSize.height, cliperPosition.top + cliperSize.height);
            this._getClipRect();
            this.buildMaskCanvas(this.clipRectData);
            $(this.maskCanvas).show();
        }
        /**
         * 生成遮罩
         * @param {Object} clipRect 遮罩挖空的矩形 clipRect.x、clipRect.y：挖空矩形的xy坐标，clipRect.width、clipRect.height：挖空矩形的宽度高度
         */
        ,buildMaskCanvas: function(clipRect){
            var maskCtx = this.maskCtx;
            this.maskCtx.fillStyle='rgba(255,255,255,.5)';
            maskCtx.clearRect(0,0,maskCtx.canvas.width,maskCtx.canvas.height);
            maskCtx.fillRect(0,0,maskCtx.canvas.width,maskCtx.canvas.height);
            if(clipRect){
                maskCtx.clearRect(clipRect.x, clipRect.y, clipRect.width, clipRect.height);
            }
        }
        /**
         * @private 获取需要裁剪的rect
         */
        ,_getClipRect: function(){
            var currentRect = this.resizeHandler.getCurrentRect();
            var x = currentRect.left + 5 - this.editor.preCanvas.offsetLeft
                ,y = currentRect.top + 5 - this.editor.preCanvas.offsetTop
                ,w = currentRect.width
                ,h = currentRect.height;
            //防止获取不准确而超出canvas范围
            x = x > 0 ? x : 0;
            y = y > 0 ? y : 0;
            if(x + w > editor.preCanvas.width){
                w -= x + w - editor.preCanvas.width;
            }
            if(y + h > editor.preCanvas.height){
                h -= y + h - editor.preCanvas.height;
            }
            this.clipRectData = {
                x: x
                ,y: y
                ,width: w
                ,height: h
            }
        }
        /**
         * @private 执行裁剪
         */
        ,_doClip: function(){
            this.editor.clip(this.clipRectData);
            this._endClip();
        }
        /**
         * @private beginClip 开始裁剪
         */
        ,_endClip: function(){
            this.cliper.hide();
            $(this.maskCanvas).hide();
            this.editor.releaseLock();
        }
        /**
         * @private _setClipBtnOverflow 检测按钮是否超出范围，超出则加上overflow类
         * @param canvasLong canvas底部到顶部距离
         * @param rectLong 裁剪框底部到顶部距离
         */
        ,_setClipBtnOverflow: function(canvasLong, rectLong){
            if(canvasLong - rectLong < this._btnCtn.height()){
                this._btnCtn.addClass('clip-handle-btn-overflow');
            }else{
                this._btnCtn.removeClass('clip-handle-btn-overflow');
            }
        }
    };