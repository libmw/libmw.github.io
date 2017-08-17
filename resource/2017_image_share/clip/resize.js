
	var resize = {
        initial : function(options){
            //console.log('resizeeeeeeeeeeee')
            this.isMoving = false;
            this.startRect = {}; //mouseDown的时候拖动元素的rect
            this.currentRect = {}; //当前拖动元素的rect
            this.targetRect = {}; //move的targetrect
            this.startXY = {}; //mouseDown的时候鼠标的XY
            this.container = options.container; //拖动元素
            this.handlers = options.handlers; //触发拖动事件的元素集合
            //各个事件
            this.onbeforeDown = options.onbeforeDown;
            this.onafterDown = options.onafterDown;
            this.onbeforeMove = options.onbeforeMove;
            this.onafterMove = options.onafterMove;
            this.onbeforeUp = options.onbeforeUp;
            this.onafterUp = options.onafterUp;
            this.onUp = options.onUp;

            this._mouseDown = null; //拖动实例的mouseDown方法
            this._mouseMove = null; //拖动实例的mouseMove方法
            this._mouseUp = null; //拖动实例的mouseUp方法
            this.bindEvent(); //绑定事件
            //console.log('resizeeeeeeeeeeeend')
        }
        /**
         * @desc 为触发拖动事件的元素绑定事件
         */
        ,bindEvent: function(){
            var self = this;

            this._mouseDown = function(e){
                e.preventDefault(); //阻止浏览器的默认事件
                document.onselectstart = function(){ return false; }; //防止选中
                self.mouseDown.call(this, self, e);
                return false; //阻止浏览器的默认事件
            }

            this._mouseUp = function(e){
                document.onselectstart = null; //解除禁止选中
                self.mouseUp.call(this, self, e);
            }

            this._mouseMove = function(e){
                self.mouseMove.call(this, self, e);
            };

            /*
             # 每个handle对象都可以具有direction和direction对应的向量对象
             # 向量对象指定了拖动本handle的时候如何影响拖动目标
             # 默认的direction和向量对象有nw，ne，sw，se，move
             */

            for(var direction in this.handlers){
                var handleConf = this.handlers[direction]
                    ,handle = handleConf.handle;
                handle.data('resizeDirection', direction); //handle.direction是向量配置conf中的key，把它帮到data里用于mousemove的时候直接取得
                handle.bind('mousedown', this._mouseDown);
                if(handleConf.vector){ //如果指定了本方向的向量配置，则加入到conf中
                    this.CONF.vector[direction] = handleConf.vector;
                }
            }
            $(document).bind('mouseup', this._mouseUp);
        }
        /**
         * @desc 获得当前拖动目标的rect
         */
        ,getCurrentRect: function(){
            var ctn = this.container;
            return {
                left: ctn[0].offsetLeft
                ,top: ctn[0].offsetTop
                ,width: ctn.width()
                ,height: ctn.height()
            }
        }
        /**
         * @desc 取得移动的模板rect，这个rect由startRect，changeXY（鼠标当前XY和mouseDown的时候的xy的差），当前方向的向量配置决定
         */
        ,getTargetRect: function(){
            var changeXY = this.changeXY
                ,conf = this.CONF.vector
                ,startRect = this.startRect
                ,targetRect = {
                    left: this.getVector(startRect.left, changeXY.x, conf[this.direction].left)
                    ,top: this.getVector(startRect.top, changeXY.y, conf[this.direction].top)
                    ,width: this.getVector(startRect.width, changeXY.x, conf[this.direction].width)
                    ,height: this.getVector(startRect.height, changeXY.y, conf[this.direction].height)
                };
            return targetRect;
        }
        /**
         * @desc 向量函数
         */
        ,getVector: function(start, change, vector){
            return start + change * vector;
        }
        ,CONF: {
            vector: { //默认向量配置
                nw: {
                    left: 1 //鼠标X轴每移动1像数，left应移动的像数值
                    ,top: 1 //鼠标Y轴每移动1像数，top应移动的像数值
                    ,width: -1 //鼠标X轴每移动1像数，width应移动的像数值
                    ,height: -1 //鼠标Y轴每移动1像数，height应移动的像数值
                }
                ,ne: {
                    left: 0
                    ,top: 1
                    ,width: 1
                    ,height: -1
                }
                ,sw: {
                    left: 1
                    ,top: 0
                    ,width: -1
                    ,height: 1
                }
                ,se: {
                    left: 0
                    ,top: 0
                    ,width: 1
                    ,height: 1
                }
                ,move: {
                    left: 1
                    ,top: 1
                    ,width: 0
                    ,height: 0
                }
            }
        }

        /**
         * @desc 核心mouseDown方法
         * @param {Resize} obj Resize实例
         * @param {JQEvent} e 当前的事件句柄
         */
        ,mouseDown: function(obj, e){
            e.stopPropagation();
            if(obj.onbeforeDown && obj.onbeforeDown.call(obj, e) === false){
                return false;
            }

            obj.isMoving = true;
            obj.direction = $(this).data('resizeDirection'); //移动方向
            obj.startRect = obj.getCurrentRect();
            obj.startXY = {
                x: e.clientX
                ,y: e.clientY
            };
            $(document).bind('mousemove', obj._mouseMove);
            obj.onafterDown && obj.onafterDown.call(obj, e)
        }
        /**
         * @desc 核心mouseMove方法
         * @param {Resize} obj Resize实例
         * @param {JQEvent} e 当前的事件句柄
         */
        ,mouseMove: function(obj, e){
            e.preventDefault();
            var curXY = {
                x: e.clientX
                ,y: e.clientY
            };
            obj.changeXY = { //鼠标的改变量
                x: curXY.x - obj.startXY.x
                ,y: curXY.y - obj.startXY.y
            };
            obj.targetRect = obj.getTargetRect();
            if(obj.onbeforeMove && obj.onbeforeMove.call(obj, e) === false){
                return false;
            }
            obj.container.css(obj.targetRect);
            obj.prevChangXY = obj.changeXY;
            obj.onafterMove && obj.onafterMove.call(obj, e);
        }
        /**
         * @desc 核心mouseUp方法
         * @param {Resize} obj Resize实例
         * @param {JQEvent} e 当前的事件句柄
         */
        ,mouseUp: function(obj, e){
            if(obj.onbeforeUp && obj.onbeforeUp.call(obj, e) === false){
                return false;
            }
            $(document).unbind('mousemove', obj._mouseMove);
            obj.onafterUp && obj.onafterUp.call(obj, e);
        },
        bind: function(evt, func, scope){
            this.events[evt] = {
                func: func,
                scope: scope || this
            };
        },
        trigger: function(evt){
            if(this.events[evt]){
                var evtTarget = this.events[evt];
                var args = $.makeArray(arguments);
                args[0] = {target: this, type: evt};
                evtTarget.func.apply(evtTarget.scope, args);
            }
        },
        unbind: function(evt){
            this.events[evt] = null;
        }
    };