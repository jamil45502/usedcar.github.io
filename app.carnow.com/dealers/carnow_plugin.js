var CarNowPlugin = {
    extListeners: [],
    init: function(options) {
        try {
            CarNowPlugin.initOptions = options;
            CarNowPlugin.initParams = {
                debugOn: false,
                baseUrl: "https://app.carnow.com",
                bnUrl: "https://app.carnow.com",
                orgBaseUrl: "/dealers",
                orgId: 42662,
                orgName: "Super Car Guys",
                settings: {
                    "access_key": "eohhpAmDrnvoL1bsBGn0fb4Aw0suIptlDHjxaBDkK2fgn7HE",
                    "inv_map_vin_selector": [".cn-buy-now, .cn-bn-action"],
                    "inv_map_vin_attr": ["data-vin"],
                    "inv_map_search_vin_selector": [".cn-buy-now, .cn-bn-action"],
                    "inv_map_search_vin_attr": ["data-vin"],
                    "gaEnabled": true,
                    "gtmEnabled": true,
                    "gaFuncName": "ga",
                    "gaSiteId": "UA-8436346-3",
                    "gtmId": "",
                    "sdEnabled": false,
                    "manual_poke": false,
                    "dept_selector": true,
                    "allow_direct_agent": false,
                    "location_service_enabled": false,
                    "location_service_forced": false,
                    "chat_icon_align_left": false,
                    "after_hours_enabled": false,
                    "server": "production",
                    "session_per_dealer": false,
                    "bn_opens_new_window": "",
                    "access_keys": [],
                    "buynow": true,
                    "products": {
                        "buynow": true,
                        "upnow": false,
                        "comparenow": false,
                        "offernow": false,
                        "protectnow": false,
                        "searchnow": true
                    },
                    "questionnaire": {}
                },
                parameters: CarNowPlugin.getParameters(),
                cookiePrefix: "42662"
            };
            CarNowPlugin.initializePlugin(options);
        } catch (initEx) {
            CarNowPlugin.reportError(initEx);
        }
    },
    loadPluginAndInit: function() {
        var me = this;
        var jsUrl = "https://d29f71cuc8ityh.cloudfront.net/js2/cn-client-z3-20230503114617.js.gz";
        var cnHead = document.getElementsByTagName('head')[0];
        var cnJS = document.createElement('script');
        cnJS.src = jsUrl;
        cnJS.type = "text/javascript";
        cnHead.appendChild(cnJS, cnHead);
        setupSuperAdminWidgets();
    },
    cnpcInit: function() {
        try {
            CNPC.init(CarNowPlugin.initParams);
            if (this.customChatContainerId) {
                CNPC.customChatContainerId = this.customChatContainerId;
                CNPC.departmentId = this.departmentId;
                CNPC.isEmbedded = this.isEmbedded;
            }
        } catch (ex) {
            CarNowPlugin.reportError(ex);
        }
    },
    initializePlugin: function(options) {
        if (this.getParameter("cn_reset") == "1") {
            document.cookie = CarNowPlugin.initParams.cookiePrefix + '_cn_vid=;expires=Thu, 01 Jan 1970 00:00:01 GMT;;path=/';
            url = window.location.href.replace("cn_reset=1", "__reset=1");
            if (history) history.pushState({
                cnReset: 1
            }, document.title, url);
        }
        if (this.getParameter("clear") == "1") {
            this.clearSession(true);
            return;
        }
        var me = this;
        var blacklist = [];
        if (blacklist.indexOf(document.URL) > -1) {
            return;
        }
        try {
            me.loadPluginAndInit();
        } catch (e) {
            if (document.attachEvent) { /* IE */
                window.attachEvent("onreadystatechange", function() {
                    if (document.readyState == "loaded" || document.readyState == "complete") {
                        me.loadPluginAndInit();
                    }
                });
            } else {
                window.addEventListener("load", function() {
                    me.loadPluginAndInit();
                });
            };
        }
    },
    clearSession: function(fromInit) {
        document.cookie = CarNowPlugin.initParams.cookiePrefix + '_cn_vid=;expires=Thu, 01 Jan 1970 00:00:01 GMT;;path=/';
        localStorage.clear();
        if (sessionStorage) sessionStorage.clear();
        if (fromInit) {
            window.location.href = "https://app.carnow.com/_clear_?org_id=42662";
        } else {
            var me = this;
            CNJQ.ajax({
                url: "https://app.carnow.com/_clear_?org_id=42662",
                success: function() {
                    CNPC.visitorId = null;
                    me.cnpcInit();
                }
            });
        }
        return;
    },
    loadJS: function(url, onLoadCallback) {
        var me = this;
        var cnHead = document.getElementsByTagName('head')[0];
        var cnJS = document.createElement('script');
        cnJS.src = url;
        cnJS.type = "text/javascript";
        cnHead.appendChild(cnJS, cnHead);
        if (onLoadCallback) {
            cnJS.addEventListener("load", function() {
                onLoadCallback();
            });
        }
    },
    reportError: function(e, sessionData) {
        try {
            var moduleName = "CarNowPlugin";
            var callstack = [e.message];
            if (e.stack) {
                var lines = e.stack.split('\n');
                for (var i = 0, len = lines.length; i < len; i++) {
                    var links = lines[i].split("@");
                    var lineStr = "at ";
                    if (links.length > 1) {
                        lineStr += links[0] + " (" + links[1] + ")";
                    } else {
                        lineStr += links[0];
                    };
                    if (lineStr.indexOf("CNChatLite") > -1) {
                        moduleName = "CNChatLite";
                    }
                    callstack.push(lineStr);
                };
            }
            var errorInfo = {
                "level": "error",
                "body": {
                    "message": {
                        "body": moduleName + " ERROR: " + e.message,
                        "trace": {
                            "exception": {
                                "message": e.message
                            }
                        },
                        "stack": callstack.join("\n ")
                    }
                }
            };
            this.postError(errorInfo, sessionData);
        } catch (ex) {
            throw e;
        }
    },
    postError: function(data, sessionData) {
        var http = new XMLHttpRequest();
        var url = "https://api.rollbar.com/api/1/item/";
        data["environment"] = "production";
        data["code_version"] = "f3e4de3bfb6c545aca7a7d7409fc6396495d234e";
        data["platform"] = "browser";
        data["language"] = "javascript";
        data["framework"] = "CarNowPlugin";
        data["client"] = {
            "javascript": {
                "browser": navigator.userAgent
            }
        };
        data["request"] = {
            "url": location.href,
            "query_string": "",
            "user_ip": "98.186.174.185"
        };
        data["session"] = sessionData ? sessionData : {};
        data["session"]["dealer_id"] = 42662;
        var payload = {
            access_token: "fb2c0f113f614a9983dfaa5c5dcd6a64",
            data: data
        };
        http.open("POST", url, true);
        http.setRequestHeader("Content-type", "application/json");
        http.send(JSON.stringify(payload));
    },
    getParameter: function(name) {
        var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
        if (results == null) {
            return null;
        } else {
            return results[1] || 0;
        }
    },
    getParameters: function() {
        var qs = window.location.search.split('+').join(' ');
        var params = {},
            tokens, re = /[?&]?([^=]+)=([^&]*)/g;
        while (tokens = re.exec(qs)) {
            try {
                params[decodeURIComponent(tokens[1].replace("amp;", ""))] = decodeURIComponent(tokens[2]);
            } catch (e) {}
        }
        return params;
    },
    mwtp: function() {},
    getTimestamp: function() {
        var now = new Date();
        var hour = now.getHours();
        var minute = now.getMinutes();
        var second = now.getSeconds();
        var ms = now.getMilliseconds();
        var hourFormatted = hour < 10 ? "0" + hour : hour;
        var minuteFormatted = minute < 10 ? "0" + minute : minute;
        var secondsFormatted = second < 10 ? "0" + second : second;
        var msFormatted = ("00" + ms).slice(-3);
        return hourFormatted + ":" + minuteFormatted + ":" + secondsFormatted + "." + msFormatted;
    }
};
CarNowPlugin.postMessage = function(data) {
    if (!data.api_key) {
        data.api_key = CarNowPlugin.partnerAccessKey;
    }
    var messageData = {
        event: {
            type: "post_chat_message",
            data: data
        },
    };
    if (typeof(CNPC) != 'undefined' && CNPC.chatSessionLoaded) {
        CNPC.interSocket.postMessage(JSON.stringify(messageData));
    } else {
        onCNChatSessionLoadQueue.push(data)
    }
};
CarNowPlugin.addListener = function(listener) {
    this.extListeners.push(listener);
    return listener;
};
CarNowPlugin.removeListener = function(listener) {
    var index = this.extListeners.indexOf(listener);
    this.extListeners.splice(index, 1);
};
CarNowPlugin.setupPartnerParams = function(params) {
    if (typeof(CNPC) != 'undefined') {
        CNPC.partnerKey = params.key;
        CNPC.customChatContainerId = params.containerId;
        CNPC.departmentId = params.department;
        CNPC.additionalChatParams.pt = params.pt;
        CNPC.contact = {
            ccn: params.name,
            ccfn: params.firstName,
            ccln: params.lastName,
            cce: params.email,
            ccp: params.phone,
            cczip: params.zip,
        }
    } else {
        this.initParams.partnerParams = {
            partnerKey: params.key,
            customChatContainerId: params.containerId,
            departmentId: params.department,
            pt: params.pt,
            contact: {
                ccn: params.name,
                ccfn: params.firstName,
                ccln: params.lastName,
                cce: params.email,
                ccp: params.phone,
                cczip: params.zip,
            }
        }
    }
};

function _sendCustomAnalyticEvent(eventData) {}

function onCNPluginLoad() {}

function beforeCNPluginLoad() {}
var onCNChatSessionLoadQueue = [];

function onCNChatSessionLoad() {
    if (onCNChatSessionLoadQueue.length > 0) {
        for (var i = 0; i < onCNChatSessionLoadQueue.length; i++) {
            CarNowPlugin.postMessage(onCNChatSessionLoadQueue[i]);
        }
    }
}

function setupSuperAdminWidgets() {}