/*
 name: jsbridge-wk
 version: 4.0.0
 description: bridge of js and native
 author： Li Juanxia, Mo Xiaomeng
 time: 2018-1-30
 */
(function(win) {
    /**
     * @func
     * @desc 打印出错误信息
     * @param {object} err - 错误信息
     */
    win.onerror = function(err) {
        console.log('window.onerror: ' + err);
    };
    /**
     * @func
     * @desc 判断是否是IOS环境
     */
    function isIOS() {
        return navigator.userAgent.match(/(iPad|iPhone)/);
    }
    /**
     * @func
     * @desc android 注册事件监听
     * @param {object} cb - 回调参数
     */
    function connectWebViewJavascriptBridge(cb) {

        if (win.WebViewJavascriptBridge) {
            typeof cb === 'function' && cb.call(this, win.WebViewJavascriptBridge);
            return;
        }

        document.addEventListener(
            'WebViewJavascriptBridgeReady',
            function() {
                typeof cb === 'function' && cb.call(this, win.WebViewJavascriptBridge);
            },
            false
        );
    }
    /**
     * @func
     * @desc IOS  web环境初始化
     * @param {object} cb - 回调参数
     */
    function setupWebViewJavascriptBridge(cb) {
        //第一次调用这个方法的时候，为false
        if (win.WebViewJavascriptBridge) {
            return typeof cb === 'function' && cb.call(this, win.WebViewJavascriptBridge);
        }
        //第一次调用的时候，也是false
        if (window.WVJBCallbacks) {
            return window.WVJBCallbacks.push(cb);
        }
        //把cb对象赋值给对象。
        window.WVJBCallbacks = [cb];

        //这段代码的意思就是执行加载WebViewJavascriptBridge_JS.js中代码的作用
        var WVJBIframe = document.createElement('iframe');

        WVJBIframe.style.display = 'none';
        WVJBIframe.src = 'https://__bridge_loaded__';
        document.documentElement.appendChild(WVJBIframe);
        setTimeout(function() {
            document.documentElement.removeChild(WVJBIframe);
        }, 0);
    }
    /**
     * @func
     * @desc IOS js调用native插件
     * @param {string} moduleName - 模块名 (Jump: 跳转模块；Comebiz: 其他插件模块)
     * @param {object} params - 是传入参数对象,
     * @param {string} params.key - 跳转路径 || 插件名称
     * @param {object} params.params - 对应的具体参数
     * @param {object} cb - 回调函数
     */
    function iosHandler(moduleName, params, cb) {
        setupWebViewJavascriptBridge(function(bridge) {
            bridge.callHandler(moduleName, params, function(responseData) {
                typeof cb === 'function' && cb.apply(this, responseData);
            });
        });
    }
    /**
     * @func
     * @desc Android js调用native插件
     * @param {string} moduleName - 模块名 (Jump: 跳转模块；Comebiz: 其他插件模块)
     * @param {object} params - 是传入参数对象,
     * @param {string} params.key - 跳转路径 || 插件名称
     * @param {object} params.params - 对应的具体参数
     * @param {object} cb - 回调函数
     */
    function androidHandler(moduleName, params, cb) {
        // 调用本地java方法
        win.WebViewJavascriptBridge.callHandler(moduleName, params, function(responseData) {
            typeof cb === 'function' && cb.apply(this, responseData);
        });
    }
    /**
     * @func
     * @desc js调用native插件
     * @param {string} moduleName - 模块名 (Jump: 跳转模块；Comebiz: 其他插件模块)
     * @param {object} methodName - 对应的url || 方法名,
     * @param {object} params.params - 对应的具体参数
     * @param {object} cb - 回调函数
     */
    function exec(moduleName, methodName, cb, params) {
        params = params || {};
        isIOS() ? iosHandler(moduleName, {
            key: methodName,
            params: params
        }, cb) : androidHandler(moduleName, {
            key: methodName,
            params: params
        }, cb);
    }
    /**
     * @func
     * @desc IOS js注册事件，让native调用
     * @param {string} method -  事件名
     * @param {object} cb - 注册的具体事件
     */
    function registeIOSEvent(method, cb) {
         //把WEB中要注册的方法注册到bridge里面
        setupWebViewJavascriptBridge(function(bridge) {
            bridge.registerHandler(method, function(data, responseCallback) {
                typeof cb === 'function' && cb.apply(this, arguments);
                responseCallback(data);
            });
        });
    }
    /**
     * @func
     * @desc Android js注册事件，让native调用
     * @param {string} method -  事件名
     * @param {object} cb - 注册的具体事件
     */
    function registeAndroidEvent(method, cb) {
        connectWebViewJavascriptBridge(function(bridge) {
            if (!win.WebViewJavascriptBridge._messageHandler) {
                bridge.init(function(message, responseCallback) {
                    var responseData = 'from js';

                    responseCallback(responseData);
                });
            }
            //把WEB中要注册的方法注册到bridge里面
            bridge.registerHandler(method, function(data, responseCallback) {
                var responseData = 'Javascript Says Right back aka!';

                typeof cb === 'function' && cb.apply(this, arguments);
                responseCallback(responseData);
            });

        });
    }
    /**
     * @func
     * @desc js注册事件，让native调用
     * @param {string} method -  事件名
     * @param {object} cb - 注册的具体事件
     */
    function registerEvent(method, cb) {
        isIOS() ? registeIOSEvent(method, cb) : registeAndroidEvent(method, cb);
    }

    /**
     * @func
     * @desc 判断是否是app环境的具体事件
     */
    function isApp() {
        var useragent = navigator.userAgent;
        return useragent.indexOf("tuandaiapp_android") != -1 || useragent.indexOf("tuandaiapp_IOS") != -1;
    }
    /**
     * @func
     * @desc 版本对比 对比v1版本是否>=v2
     * @param {string} v1 - 需要对比的版本 例：4.0.0
     * @param {string} v2 - 被对比的版本 例：3.9.9
     */
    function compareVersion(v1, v2) {
        var arr = v1 && v1.split('.'),
            list = v2 && v2.split('.');

        if (!arr || !list) {
            return;
        }

        var i = 0,
            arrlength = arr.length,
            listlength = list.length,
            length = arrlength > listlength ? arrlength : listlength, // 取最长的数组长度
            item1 = '',
            item2 = '';

        for (; i < length; i++) {
            item1 = Number(arr[i]);
            item2 = Number(list[i]);

            arr[i] = isNaN(item1) ? 0 : item1;
            list[i] = isNaN(item2) ? 0 : item2;
        }

        return arr.join('') >= list.join('');
    }
    /**
     * @func
     * @desc 判断app版本号，当前版本是否比指定版本高
     * @param {string} v - 指定的版本 例：3.9.9
     */
    function isCorrectVersion(v) {
        var str = navigator.userAgent,
            arr = str.match(/\[([^\[\]]*)\]/);

        if (arr && arr[1]) {
            var vst = arr[1].split('_'),
                curVersion = vst[vst.length - 1];

            return compareVersion(curVersion, v);
        }

        return false;
    }


    var Jsbridge = function() {};

    Jsbridge.prototype = {
        isApp: isApp,
        isCorrectVersion: isCorrectVersion,
        exec: exec, // js 调用 native
        JUMP: function(methodName, cb, params) {
            params = params || {};
            this.exec('tuandaiwangJump', methodName, cb, params);
        },
        COM: function(methodName, cb, params) {
            params = params || {};
            this.exec('COM', methodName, cb, params);
        },
        registerEvent: registerEvent,

        /**
         * @func
         * @desc 生命周期
         * @param {object} readyCb - 打开活动页回调（只执行一次）
         * @param {object} webonPauseCb - 离开活动页回调
         * @param {object} webonResumeHomeCb - 离开后回到页面时回调
         * @param {object} webonDestroyCb - 销毁进程回调
         */
        appLifeHook: function(readyCb, webonPauseCb, webonResumeHomeCb, webonDestroyCb) {
            if (isIOS()) {

                /*
                step:
                1： h5界面加载完毕 注册h5调用原生的方法， 此时原生调用h5 传参数1
                2： 当前的h5界面 将进入了下一个界面或者上一个界面。 此时传参2
                3: 用户按home键 将程序退至后台， 此时传参3
                4: 用户重新启动程序(程序由后台切换至前台), 此时传数4
                */
                registeIOSEvent('ToAppLifeCycle', function(data, responseCallback) {
                    switch (+data) {
                        case 1:
                            typeof readyCb === 'function' && readyCb.apply(this, arguments);
                            break;
                        case 2:
                            typeof webonPauseCb === 'function' && webonPauseCb.apply(this, arguments);
                            break;
                        case 3:
                            typeof webonPauseCb === 'function' && webonPauseCb.apply(this, arguments);
                            break;
                        case 4:
                            typeof webonResumeHomeCb === 'function' && webonResumeHomeCb.apply(this, arguments);
                            break;
                    }
                });
            } else {
                registeAndroidEvent('WebonResume', readyCb);
                registeAndroidEvent('WebonResumeHome', webonResumeHomeCb);
                registeAndroidEvent('WebonPause', webonPauseCb);
                registeAndroidEvent('WebonDestroy', webonDestroyCb);

            }
        }
    };

    win.Jsbridge = new Jsbridge();
})(window);
