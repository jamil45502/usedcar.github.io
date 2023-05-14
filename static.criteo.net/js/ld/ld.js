! function() {
    "use strict";

    function s(e, t) {
        var n, i, o = null === (n = window.Criteo) || void 0 === n ? void 0 : n.oneTagConfig;
        return null !== (i = o && o[e]) && void 0 !== i ? i : t
    }
    var c = "5.16.0";

    function o(e) {
        try {
            return JSON.parse(e)
        } catch (e) {
            return
        }
    }
    var a = (e.prototype.getCMPFrame = function() {
        for (var e, t = this.currentWindow, n = 0; n < 10; ++n) {
            try {
                t.frames.__cmpLocator && (e = t)
            } catch (e) {}
            if (t === this.currentWindow.top) break;
            t = t.parent
        }
        return e
    }, e.prototype.hasCallerFunctionInFrame = function() {
        return "function" == typeof this.currentWindow.__cmp
    }, e.prototype.readyToRetrieve = function() {
        return this.hasCallerFunctionInFrame() || void 0 !== this.getCMPFrame()
    }, e.prototype.pingWithTimeout = function(i, e, t, n) {
        function o(e, t) {
            r.logger(t), clearTimeout(e), n()
        }
        var r = this;
        return window.setTimeout(function() {
            var n = window.setTimeout(function() {
                o(i, "Timeout: Unable to get ping return after " + e + "ms")
            }, e);
            r.executeCommand("ping", null, function(e, t) {
                clearTimeout(n), t ? (r.logger("GDPR CMP ping returned"), !0 !== e.cmpLoaded && o(i, "GDPR ping returned cmpLoaded which is not true"), r.logger("GDPR ping returned cmpLoaded which is true")) : o(i, "Error sending ping to GDPR CMP")
            })
        }, t)
    }, e.prototype.retrieveConsent = function(e) {
        this.executeRetrieveConsent("getConsentData", null, e)
    }, e.prototype.retrieveConsentForPassback = function(e) {
        this.executeRetrieveConsent("getVendorConsents", [91], e)
    }, e.prototype.executeRetrieveConsent = function(e, t, n) {
        var i = this,
            o = !1,
            r = window.setTimeout(function() {
                o = !0, i.logger("Timeout: Unable to resolve GDPR consent after " + i.timeout + "ms"), n(void 0)
            }, this.timeout),
            a = this.pingWithTimeout(r, this.pingTimeout, this.pingDelay, function() {
                o = !0, i.logger("Timeout: Unable to ping GDPR API after " + i.pingTimeout + "ms"), n(void 0)
            });
        this.executeCommand(e, t, function(e, t) {
            clearTimeout(a), o || (clearTimeout(r), t ? (i.logger("GDPR consent retrieved"), i.processConsentData(e, n)) : (i.logger("Error retrieving GDPR consent data from CMP"), n(void 0)))
        })
    }, e.prototype.processConsentData = function(e, t) {
        if (e) {
            var n = {};
            void 0 !== e.consentData && (n.consentData = e.consentData), void 0 !== e.gdprApplies && (n.gdprApplies = !!e.gdprApplies), t(n)
        } else this.logger("Unable to read GDPR consent data from CMP"), t(void 0)
    }, e.prototype.executeCommand = function(e, t, n) {
        var r = this;
        if (!this.hasCallerFunctionInFrame()) {
            this.logger("No GDPR CMP defined on current frame");
            var a = this.getCMPFrame();
            this.currentWindow.__cmp = function(e, t, n) {
                if (!a) return r.logger("GDPR CMP not found in any frame"), void n({
                    msg: "GDPR CMP not found in any frame"
                }, !1);
                var i = Math.random().toString(10),
                    o = {
                        __cmpCall: {
                            command: e,
                            parameter: t,
                            callId: i
                        }
                    };
                r.cmpCallbacks[i] = n, a.postMessage(o, "*")
            }, this.currentWindow.addEventListener("message", function(e) {
                var t = "string" == typeof e.data ? o(e.data) : e.data;
                if (t && t.__cmpReturn && t.__cmpReturn.callId && t.__cmpReturn.returnValue) {
                    var n = t.__cmpReturn;
                    r.cmpCallbacks && r.cmpCallbacks[n.callId] && (r.cmpCallbacks[n.callId](n.returnValue, n.success), delete r.cmpCallbacks[n.callId])
                }
            }, !1)
        }
        this.currentWindow.__cmp(e, t, n)
    }, e);

    function e(e, t, n) {
        void 0 === n && (n = function(e) {}), this.cmpCallbacks = {}, this.currentWindow = e, this.timeout = t.tcfTimeout, this.pingTimeout = t.tcfPingTimeout, this.pingDelay = t.tcfPingDelay, this.logger = n
    }
    var u = (t.prototype.getCMPFrame = function() {
        for (var e, t = this.currentWindow, n = 0; n < 10; ++n) {
            try {
                t.frames.__tcfapiLocator && (e = t)
            } catch (e) {}
            if (t === this.currentWindow.top) break;
            t = t.parent
        }
        return e
    }, t.prototype.hasCallerFunctionInFrame = function() {
        return "function" == typeof this.currentWindow.__tcfapi
    }, t.prototype.readyToRetrieve = function() {
        return this.hasCallerFunctionInFrame() || void 0 !== this.getCMPFrame()
    }, t.prototype.pingWithTimeout = function(n, e, t, i) {
        function o(e, t) {
            r.logger(t), clearTimeout(e), i()
        }
        var r = this;
        return window.setTimeout(function() {
            var t = window.setTimeout(function() {
                o(n, "Timeout: Unable to get TCFv2 ping return after " + e + "ms")
            }, e);
            r.executeCommand("ping", 2, function(e) {
                clearTimeout(t), r.logger("TCFv2 CMP ping returned in ms"), "error" === e.cmpStatus ? o(n, "Error status on ping to TCFv2 CMP") : !0 !== e.cmpLoaded ? o(n, "TCFv2 ping returned cmpLoaded = false") : r.logger("TCFv2 ping returned cmpLoaded = true")
            })
        }, t)
    }, t.prototype.retrieveConsent = function(n) {
        var i = this,
            o = !1,
            r = window.setTimeout(function() {
                o = !0, i.logger("Timeout: Unable to resolve TCFv2 consent after " + i.timeout + "ms"), n(void 0)
            }, this.timeout),
            a = this.pingWithTimeout(r, this.pingTimeout, this.pingDelay, function() {
                o = !0, i.logger("Timeout: Unable to ping TCFv2 API after " + i.pingTimeout + "ms"), n(void 0)
            });
        this.executeCommand("getTCData", 2, function(e, t) {
            clearTimeout(a), o || (clearTimeout(r), t ? (i.logger("TCFv2 consent retrieved in ms"), i.processResponseData(e, n)) : (i.logger("Error retrieving TCFv2 consent data from CMP"), n(void 0)))
        }, [91])
    }, t.prototype.processResponseData = function(e, t) {
        var n;
        if (e) {
            var i = {};
            void 0 !== e.tcString && (i.consentData = e.tcString), void 0 !== e.gdprApplies && (i.gdprApplies = !!e.gdprApplies), i.version = e.tcfPolicyVersion ? e.tcfPolicyVersion : 2, i.purposes = null === (n = null == e ? void 0 : e.purpose) || void 0 === n ? void 0 : n.consents, t(i)
        } else this.logger("Unable to read GDPR consent data from CMP"), t(void 0)
    }, t.prototype.executeCommand = function(e, t, n, i) {
        var a = this;
        if (!this.hasCallerFunctionInFrame()) {
            this.logger("No TCFv2 CMP defined on current frame");
            var s = this.getCMPFrame();
            this.currentWindow.__tcfapi = function(e, t, n, i) {
                if (!s) return a.logger("TCFv2 CMP not found in any frame"), void n({
                    msg: "TCFv2 CMP not found in any frame"
                }, !1);
                var o = Math.random().toString(10),
                    r = {
                        __tcfapiCall: {
                            command: e,
                            version: t,
                            parameter: i,
                            callId: o
                        }
                    };
                a.cmpCallbacks[o] = n, s.postMessage(r, "*")
            }, this.currentWindow.addEventListener("message", function(e) {
                var t = "string" == typeof e.data ? o(e.data) : e.data;
                if (t && t.__tcfapiReturn && t.__tcfapiReturn.callId && t.__tcfapiReturn.returnValue) {
                    var n = t.__tcfapiReturn;
                    a.cmpCallbacks && a.cmpCallbacks[n.callId] && "function" == typeof a.cmpCallbacks[n.callId] && (a.cmpCallbacks[n.callId](n.returnValue, n.success), delete a.cmpCallbacks[n.callId])
                }
            }, !1)
        }
        this.currentWindow.__tcfapi(e, t, n, i)
    }, t);

    function t(e, t, n) {
        void 0 === n && (n = function(e) {}), this.cmpCallbacks = {}, this.currentWindow = e, this.timeout = t.tcfTimeout, this.pingTimeout = t.tcfPingTimeout, this.pingDelay = t.tcfPingDelay, this.logger = n
    }
    var l = (n.prototype.getCMPFrame = function() {
        for (var e, t = this.currentWindow, n = 0; n < 10; ++n) {
            try {
                t.frames.__uspapiLocator && (e = t)
            } catch (e) {}
            if (t === this.currentWindow.top) break;
            t = t.parent
        }
        return e
    }, n.prototype.hasCallerFunctionInWindow = function() {
        return "function" == typeof this.currentWindow.__uspapi
    }, n.prototype.readyToRetrieve = function() {
        return this.hasCallerFunctionInWindow() || void 0 !== this.getCMPFrame()
    }, n.prototype.retrieveConsent = function(n) {
        var i = this,
            o = !1,
            r = window.setTimeout(function() {
                o = !0, i.logger("Timeout: Unable to resolve CCPA consent after " + i.timeout + "ms"), n(void 0)
            }, this.timeout);
        this.executeCommand("getUSPData", 1, function(e, t) {
            o || (clearTimeout(r), t ? (i.logger("CCPA consent retrieved"), i.processResponseData(e, n)) : (i.logger("Error retrieving CCPA consent data from CMP"), n(void 0)))
        })
    }, n.prototype.processResponseData = function(e, t) {
        e ? t(e) : (this.logger("Unable to read CCPA consent data from CMP"), t(void 0))
    }, n.prototype.executeCommand = function(e, t, n) {
        var r = this;
        if (!this.hasCallerFunctionInWindow()) {
            this.logger("No CCPA CMP defined on current frame");
            var a = this.getCMPFrame();
            this.currentWindow.__uspapi = function(e, t, n) {
                if (!a) return r.logger("CCPA CMP not found in any frame"), void n({
                    msg: "CCPA CMP not found in any frame"
                }, !1);
                var i = Math.random().toString(10),
                    o = {
                        __uspapiCall: {
                            command: e,
                            parameter: t,
                            callId: i
                        }
                    };
                r.uspapiCallbacks[i] = n, a.postMessage(o, "*")
            }, this.currentWindow.addEventListener("message", function(e) {
                var t = "string" == typeof e.data ? o(e.data) : e.data;
                if (t && t.__uspapiReturn && t.__uspapiReturn.callId && t.__uspapiReturn.returnValue) {
                    var n = t.__uspapiReturn;
                    r.uspapiCallbacks && r.uspapiCallbacks[n.callId] && (r.uspapiCallbacks[n.callId](n.returnValue, n.success), delete r.uspapiCallbacks[n.callId])
                }
            }, !1)
        }
        this.currentWindow.__uspapi(e, t, n)
    }, n.prototype.hasUserOptOut = function(e) {
        return !(!e || !e.uspString || "1YNY" === e.uspString.toUpperCase() || "1YNN" === e.uspString.toUpperCase() || "1YN-" === e.uspString.toUpperCase() || "1-N-" === e.uspString.toUpperCase() || "1---" === e.uspString)
    }, n);

    function n(e, t, n) {
        void 0 === n && (n = function(e) {}), this.uspapiCallbacks = {}, this.currentWindow = e, this.timeout = t.uspApiTimeout, this.logger = n
    }
    var p, i, r = "OneTag",
        d = ["color: #fff;", "background: #ff4f00;", "display: inline-block;", "padding: 1px 4px;", "border-radius: 3px;"].join(" ");
    (i = p = p || {})[i.Off = 0] = "Off", i[i.Error = 1] = "Error", i[i.Warning = 2] = "Warning", i[i.Info = 3] = "Info", i[i.Debug = 4] = "Debug";
    var O = (h.setLogLevel = function(e) {
        h.level = e, this.debug("Log level set to " + p[e])
    }, h.debug = function() {
        for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
        h.log(console.log, p.Debug, e)
    }, h.info = function() {
        for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
        h.log(console.log, p.Info, e)
    }, h.warn = function() {
        for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
        h.log(console.warn, p.Warning, e)
    }, h.error = function() {
        for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
        h.log(console.error, p.Error, e)
    }, h.log = function(e, t, n) {
        if (t <= h.level) {
            var i = window.navigator.userAgent,
                o = 0 < i.indexOf("MSIE ") || 0 < i.indexOf("Trident/") ? ["[" + r + "]"] : ["%c" + r, d];
            e.apply(console, o.concat(n))
        }
    }, h.level = p.Warning, h);

    function h() {}
    var f = (g.prototype.getProvider = function() {
        return this.tcfv2ConsentProvider.readyToRetrieve() ? this.tcfv2ConsentProvider : this.ccpaConsentProvider.readyToRetrieve() ? this.ccpaConsentProvider : this.tcfv1ConsentProvider.readyToRetrieve() ? this.tcfv1ConsentProvider : void 0
    }, g.prototype.retrieveConsent = function(e) {
        var t = this.getProvider();
        t ? t.retrieveConsent(e) : e(void 0)
    }, g);

    function g(e, t, n, i) {
        void 0 === t && (t = 1e4), void 0 === n && (n = 50), void 0 === i && (i = 1e3);
        var o = {
                tcfTimeout: t,
                tcfPingTimeout: n,
                tcfPingDelay: i
            },
            r = {
                uspApiTimeout: t
            };
        this.tcfv1ConsentProvider = new a(e, o, O.info), this.tcfv2ConsentProvider = new u(e, o, O.info), this.ccpaConsentProvider = new l(e, r, O.info)
    }

    function x(e) {
        return "gdprApplies" in e || "consentData" in e
    }

    function M(e) {
        return "uspString" in e
    }
    var v = (m.prototype.catchAndStoreException = function(e, t) {
        try {
            return void 0 === t ? e() : e.apply(this, t)
        } catch (e) {
            e instanceof Error ? this.exceptions.push(e) : this.exceptions.push(new Error(e))
        }
    }, m.prototype.setProtectedTimeout = function(e, t) {
        var n = this;
        if ("undefined" != typeof window && "function" == typeof window.setTimeout) return window.setTimeout(function() {
            return n.catchAndStoreException(e)
        }, t)
    }, m.prototype.addProtectedEventListener = function(e, t, n, i) {
        var o = this;
        if (void 0 !== e && "function" == typeof e.addEventListener) return e.addEventListener(t, function() {
            for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
            return o.catchAndStoreException(n, e)
        }, i)
    }, m.prototype.attachProtectedEvent = function(e, t, n) {
        var i = this;
        if (void 0 !== e && "function" == typeof e.attachEvent) return e.attachEvent(t, function() {
            for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
            return i.catchAndStoreException(n, e)
        })
    }, m);

    function m() {
        this.exceptions = []
    }

    function y(e, t) {
        if (e instanceof Array)
            for (var n = 0, i = e; n < i.length; n++) {
                y(i[n], t)
            } else W(t, e) || t.push(e)
    }

    function W(e, t) {
        for (var n = JSON.stringify || encodeURIComponent || escape, i = n(t), o = 0, r = e; o < r.length; o++) {
            var a = r[o];
            if (a === t || n(a) === i) return !0
        }
        return !1
    }

    function C(e, t) {
        var n = [];
        if (void 0 === e) return void 0 === t ? n : t.slice();
        if (void 0 === t) return e.slice();
        for (var i = 0, o = t; i < o.length; i++) {
            var r = o[i];
            W(e, r) || n.push(r)
        }
        return e.concat(n)
    }

    function N(e) {
        for (var t = [], n = 0, i = e; n < i.length; n++) {
            var o = i[n];
            null != o && t.push(o)
        }
        return t
    }

    function V(e, t) {
        if (void 0 === e && void 0 === t) return !0;
        if (void 0 === e || void 0 === t) return !1;
        if (!(e instanceof Array)) return V([e], t);
        if (!(t instanceof Array)) return V(e, [t]);
        if (e.length !== t.length) return !1;
        for (var n = 0, i = e; n < i.length; n++) {
            if (!W(t, i[n])) return !1
        }
        return !0
    }
    var w, k, L = (b.extractHostname = function(e) {
        var t = document.createElement("a");
        return t.href = e, t.hostname
    }, b.getAnchorWithReferrer = function(e) {
        if (e && e.referrer) {
            var t = e.createElement("a");
            return t.href = e.referrer, t
        }
        return null
    }, b.getQueryString = function(t) {
        var n;
        try {
            n = t.top.location.search
        } catch (e) {
            var i = t;
            try {
                for (; i.parent.document !== i.document && i.parent.document;) i = i.parent
            } catch (e) {}
            if (i) {
                var o = b.getAnchorWithReferrer(i.document);
                o && (n = o.search)
            }
        }
        return n
    }, b.getHighestAccessibleUrl = function(e) {
        var t, n = b.getHighestAccessibleWindow(e),
            i = n.topFrame;
        if (n.err) try {
            try {
                t = i.top.location.href
            } catch (e) {
                var o = i.location.ancestorOrigins;
                t = o[o.length - 1]
            }
        } catch (e) {
            t = i.document.referrer
        } else t = i.location.href;
        return t
    }, b.getPreviousUrl = function(e) {
        var t, n, i = b.getHighestAccessibleWindow(e),
            o = i.topFrame,
            r = "";
        if (i.err || (r = o.document.referrer || (null === (t = o.top) || void 0 === t ? void 0 : t.document.referrer) || ""), !r) {
            var a = null === (n = o.location) || void 0 === n ? void 0 : n.ancestorOrigins;
            a && 0 < a.length && (r = a[a.length - 1])
        }
        return r
    }, b.onBodyReady = function(t, n) {
        ! function e() {
            document.body ? t.setProtectedTimeout(n, 0) : t.setProtectedTimeout(e, 10)
        }()
    }, b.onDocumentReady = function(n, i) {
        if ("complete" === document.readyState) i();
        else if (document.addEventListener) n.addProtectedEventListener(document, "DOMContentLoaded", i, !1), n.addProtectedEventListener(window, "load", i, !1);
        else {
            n.attachProtectedEvent(document, "onreadystatechange", i), n.attachProtectedEvent(window, "onload", i);
            var e = !1;
            try {
                e = null === window.frameElement && document.documentElement
            } catch (e) {}
            if (e && e.doScroll) ! function t() {
                if (e) {
                    try {
                        e.doScroll("left")
                    } catch (e) {
                        return void n.setProtectedTimeout(t, 50)
                    }
                    i()
                }
            }();
            else {
                var t = !1,
                    o = null === document.onload ? null : function(e, t) {
                        return e.onload(t)
                    },
                    r = null === document.onreadystatechange ? null : function(e, t) {
                        return e.onreadystatechange(t)
                    };
                document.onload = document.onreadystatechange = function(e) {
                    r instanceof Function && r(document, e), t || document.readyState && "complete" !== document.readyState || (o instanceof Function && o(document, e), t = !0, i())
                }
            }
        }
    }, b.removeLater = function(e, t) {
        e.setProtectedTimeout(function() {
            null !== t && null !== t.parentElement && t.parentElement.removeChild(t)
        }, 3e4)
    }, b.appendCriteoContainer = function(e) {
        if (!e) return null;
        var t = document.createElement("div");
        return t.setAttribute("id", "criteo-tags-div"), t.style.display = "none", e.appendChild(t), t
    }, b.getHighestAccessibleWindow = function(e) {
        var t = e,
            n = !1;
        try {
            for (; t.parent.document !== t.document;) {
                if (!t.parent.document) {
                    n = !0;
                    break
                }
                t = t.parent
            }
        } catch (e) {
            n = !0
        }
        return {
            topFrame: t,
            err: n
        }
    }, b);

    function b() {}

    function U(e) {
        var t = e;
        if (e instanceof Function) return (t = e()) instanceof Function ? t : U(t);
        if (e instanceof Array) {
            t = [];
            for (var n = 0; n < e.length; ++n) t[n] = U(e[n])
        } else if (e && "[object Object]" === e.toString()) {
            t = {};
            for (var i = 0, o = Object.getOwnPropertyNames(e); i < o.length; i++) {
                var r = o[i];
                t[r] = U(e[r])
            }
        }
        return t
    }

    function B(e, t) {
        for (var n = 0, i = e; n < i.length; n++) {
            var o = i[n];
            if (o.event === t.event && V(t.account, o.account)) {
                for (var r in t) t.hasOwnProperty(r) && "account" !== r && (o[r] = t[r]);
                return
            }
        }
        e.push(t)
    }

    function j(e, t) {
        for (var n = 0, i = e; n < i.length; n++) {
            var o = i[n];
            if (o.event === t.event && V(t.account, o.account) && o.hash_method === t.hash_method) return void(void 0 !== t.email && (o.email = C(o.email instanceof Array || void 0 === o.email ? o.email : [o.email], t.email instanceof Array ? t.email : [t.email])))
        }
        e.push(t)
    }

    function G(e, t, n) {
        var i = U(n);
        return q(e, i), B(t, U(i)), 1
    }

    function q(e, t) {
        for (var n = 0, i = e; n < i.length; n++) {
            var o = i[n];
            if (o.event === t.event && void 0 === t.account && void 0 === o.account || V(t.account, o.account)) {
                for (var r in t) t.hasOwnProperty(r) && "account" !== r && (o[r] = t[r]);
                return
            }
        }
        e.push(t)
    }

    function z(e) {
        if (void 0 !== e.identity && JSON.stringify) {
            var t = e.identity instanceof Array ? e.identity : [e.identity];
            e.raw_identity = JSON.stringify(t), delete e.identity
        }
    }(k = w = w || {})[k.None = 0] = "None", k[k.Cookie = 1] = "Cookie", k[k.LocalStorage = 2] = "LocalStorage";
    var H = (P.checkLocalStorageIsWritable = function() {
        try {
            if (!window.localStorage) return !1;
            var e = "criteo_localstorage_check";
            return window.localStorage.setItem(e, e), window.localStorage.removeItem(e), !0
        } catch (e) {
            return !1
        }
    }, P.checkCookiesAreWritable = function() {
        var e = new P("criteo_write_test", 1e4);
        e.setValueWithNoDomain("1");
        var t = "1" === e.cookieValue;
        return e.removeWithNoDomain(), t
    }, P.prototype.setCookieRead = function() {
        this.isCookieRead = !0
    }, P.prototype.setValue = function(e, t) {
        void 0 === t && (t = !0), this.cookieValue = e, this.isCookieValueExternallySet = !0, t && this.writeOnAllStorages(e)
    }, P.prototype.setValueFromExistingCookie = function() {
        var e = this.getValue();
        void 0 !== e && (this.cookieValue = e, this.cookieOrigin |= w.Cookie)
    }, P.prototype.setValueFromAllStorages = function() {
        var e = this.getFromAllStorages();
        this.cookieValue = e.value, this.cookieOrigin = e.origin
    }, P.prototype.getValue = function() {
        for (var e = 0, t = document.cookie.split(";"); e < t.length; e++) {
            var n = t[e];
            if (n.substr(0, n.indexOf("=")).replace(/^\s+|\s+$/g, "") === this.cookieName) {
                var i = n.substr(n.indexOf("=") + 1);
                return (decodeURIComponent || unescape)(i)
            }
        }
    }, P.prototype.removeWithNoDomain = function() {
        this.setValueWithNoDomainWithExpiration("", 0)
    }, P.prototype.removeOnMainDomain = function() {
        this.setOnMainDomainWithExpiration("", 0)
    }, P.prototype.setOnMainDomain = function(e) {
        return this.setOnMainDomainWithExpiration(e, this.cookieRetentionTimeInMs)
    }, P.prototype.writeOnAllStorages = function(e) {
        this.setOnMainDomain(e), this.useLocalStorage && window.localStorage.setItem(this.cookieName, e)
    }, P.prototype.getFromAllStorages = function() {
        var e = null;
        this.useLocalStorage && (e = window.localStorage.getItem(this.cookieName));
        var t = this.getValue() || null;
        return {
            value: t || e,
            origin: this.computeStorageOrigin(t, e)
        }
    }, P.prototype.removeFromAllStorages = function() {
        this.removeOnMainDomain(), this.useLocalStorage && window.localStorage.removeItem(this.cookieName)
    }, P.prototype.setValueWithNoDomainWithExpiration = function(e, t) {
        var n = new Date;
        n.setTime(n.getTime() + t);
        var i = "expires=" + n.toUTCString(),
            o = encodeURIComponent || escape;
        document.cookie = this.cookieName + "=" + o(e) + ";" + i + ";path=/";
        var r = this.getValue();
        void 0 !== r && (this.cookieValue = r)
    }, P.prototype.setValueWithNoDomain = function(e) {
        this.setValueWithNoDomainWithExpiration(e, this.cookieRetentionTimeInMs)
    }, P.prototype.toFragmentData = function() {
        return {
            origin: this.cookieOrigin,
            value: this.cookieValue
        }
    }, P.prototype.setOnMainDomainWithExpiration = function(e, t) {
        var n = new Date;
        n.setTime(n.getTime() + t);
        for (var i = "expires=" + n.toUTCString(), o = null === document.location ? [] : document.location.hostname.split("."), r = null, a = 0; a < o.length; ++a) {
            var s = "domain=." + (r = o.slice(o.length - a - 1, o.length).join(".")),
                c = encodeURIComponent || escape;
            document.cookie = this.cookieName + "=" + c(e) + ";" + i + ";" + s + ";path=/";
            var u = this.getValue();
            if (u && u === e) break
        }
        return r || document.location
    }, P.prototype.computeStorageOrigin = function(e, t) {
        var n = w.None;
        return e && (n |= w.Cookie), t && (n |= w.LocalStorage), n
    }, P);

    function P(e, t) {
        this.cookieValue = null, this.isCookieValueExternallySet = !1, this.isCookieRead = !1, this.cookieName = e, this.cookieRetentionTimeInMs = t, this.cookieOrigin = w.None, this.useLocalStorage = P.checkLocalStorageIsWritable()
    }
    var J = (T.prototype.fillQueryStringParams = function(e, t) {
        var n = this.config.trackingCallData.firstPartyIdentifier;
        n && e.push("fpid=" + n), this.gaid && e.push("ai=" + this.gaid), this.idfa && e.push("idfa=" + this.idfa), null !== this.axidCookie.cookieValue && e.push("axid=" + this.axidCookie.cookieValue), null !== this.pxsigCookie.cookieValue && e.push("pxsig=" + this.pxsigCookie.cookieValue), this.canWriteCookie && e.push("adce=1"), null !== this.clickOriginPayload && e.push("cop=" + this.clickOriginPayload), null !== this.optoutCookie.cookieValue && e.push("optout=1"), null != this.bundleCookie.cookieValue && e.push("bundle=" + this.bundleCookie.cookieValue), null !== this.secureIdCookie.cookieValue && (e.push("sid=" + this.secureIdCookie.cookieValue), e.push("sid_read=" + (this.secureIdCookie.isCookieValueExternallySet ? "1" : "0"))), null !== this.tld && e.push("tld=" + this.tld), t.privateModeDetectionEnabled && null !== this.privateMode && 0 !== this.privateMode ? e.push("pm=" + this.privateMode) : t.privateModeDetectionEnabled || e.push("pm=3"), void 0 !== new H("cto_clc", this.readonlyCookieRetentionTime).getValue() && e.push("clc=1")
    }, T.prototype.checkAcid = function() {
        void 0 !== this.optoutCookie.getValue() ? this.axidCookie.setValue("optout") : this.axidCookie.setValueFromExistingCookie(), this.pxsigCookie.setValueFromExistingCookie(), this.setCanWriteCookie(), this.setCanWriteLocalStorage()
    }, T.prototype.setCop = function(e) {
        var t = L.getQueryString(e);
        if (void 0 !== t && (this.clickOriginPayload = this.getParameterValueByName(t, "cto_pld")), null === this.clickOriginPayload) try {
            var n = L.getAnchorWithReferrer(e.top.document);
            n && n.search && (this.clickOriginPayload = this.getParameterValueByName(n.search, "cto_pld"))
        } catch (e) {}
    }, T.prototype.checkClientSideIdentityStatus = function() {
        this.optoutCookie.getFromAllStorages(), this.secureIdCookie.setValueFromAllStorages(), this.bundleCookie.setValueFromAllStorages(), this.ifaCookie.setValueFromAllStorages()
    }, T.prototype.checkCookies = function(e) {
        var t = !0;
        if (e.callbacks) {
            for (var n = 0, i = "string" == typeof e.callbacks ? [e.callbacks] : e.callbacks; n < i.length; n++) {
                var o = i[n],
                    r = document.createElement("img");
                r.setAttribute("style", "display:none;"), r.setAttribute("width", "1"), r.setAttribute("height", "1"), r.setAttribute("data-owner", "criteo-tag"), r.setAttribute("src", o);
                var a = document.getElementsByTagName("script")[0];
                a.parentNode.insertBefore(r, a), L.removeLater(this.exceptionHandler, r)
            }
            t = !1
        }
        e.optout ? (this.optoutCookie.setValue("1", t), this.secureIdCookie.removeFromAllStorages(), this.bundleCookie.removeFromAllStorages()) : (e.bundle && this.bundleCookie.setValue(e.bundle, t), e.removeSid ? this.secureIdCookie.removeFromAllStorages() : e.sid && this.secureIdCookie.setValue(e.sid, t))
    }, T.prototype.getParameterValueByName = function(e, t) {
        if (e && 1 < e.length) {
            "?" === e[0] && (e = "&" + e.substr(1));
            var n = "&" + t + "=",
                i = e.indexOf(n);
            if (-1 !== i) {
                var o = e.indexOf("&", i + n.length);
                return e.slice(i + n.length, o < 0 ? void 0 : o)
            }
        }
        return null
    }, T.prototype.setCanWriteCookie = function() {
        null === this.axidCookie.cookieValue && null === this.pxsigCookie.cookieValue ? this.canWriteCookie = H.checkCookiesAreWritable() : this.canWriteCookie = !0
    }, T.prototype.setCanWriteLocalStorage = function() {
        this.canWriteLocalStorage = H.checkLocalStorageIsWritable()
    }, T.prototype.getTld = function() {
        var e = new H("cto_tld_test", 36e5),
            t = e.setOnMainDomain("woot");
        return e.removeOnMainDomain(), t
    }, T.prototype.getPrivateMode = function(e, t) {
        if (e.isSafari) try {
            if ("function" == typeof t.openDatabase) return t.openDatabase(null, null, null, null), 1
        } catch (e) {
            return 2
        }
        return 0
    }, T);

    function T(e, t, n, i) {
        this.readonlyCookieRetentionTime = 0, this.optoutCookieRetentionTime = 15768e7, this.identificationCookieRetentionTime = 34164e6, this.axidCookie = new H("cto_axid", this.readonlyCookieRetentionTime), this.optoutCookie = new H("cto_optout", this.optoutCookieRetentionTime), this.pxsigCookie = new H("cto_pxsig", this.readonlyCookieRetentionTime), this.secureIdCookie = new H("cto_sid", this.identificationCookieRetentionTime), this.bundleCookie = new H("cto_bundle", this.identificationCookieRetentionTime), this.ifaCookie = new H("id_controller_ifa", this.identificationCookieRetentionTime), this.canWriteCookie = !1, this.canWriteLocalStorage = !1, this.clickOriginPayload = null, this.tld = this.getTld(), this.privateMode = this.getPrivateMode(t, n), this.exceptionHandler = e, this.config = i
    }
    var Y = (S.prototype.createIframe = function(e, t, n, i, o) {
        var r = document.createElement("iframe"),
            a = encodeURIComponent || escape,
            s = L.getHighestAccessibleUrl(window),
            c = a(L.extractHostname(s)),
            u = window.SYNCFRAME_ORIGIN || "onetag",
            l = {
                bundle: e.bundleCookie.toFragmentData(),
                cw: e.canWriteCookie,
                optout: e.optoutCookie.toFragmentData(),
                origin: u,
                sid: e.secureIdCookie.toFragmentData(),
                tld: e.tld,
                topUrl: c,
                version: t.replace(/\./g, "_"),
                ifa: e.ifaCookie.toFragmentData(),
                lsw: e.canWriteLocalStorage,
                pm: o ? e.privateMode : 3
            },
            d = this.gumSyncFrameEndPoint;
        return "#gum-debug-mode" === window.location.hash ? d += "?debug=1&topUrl=" + c : d += "?topUrl=" + c, u && (d += "&origin=" + u), n && (x(n) ? (void 0 !== n.gdprApplies && (d += "&gdpr=" + (n.gdprApplies ? 1 : 0)), void 0 !== n.consentData && (d += "&gdpr_consent=" + n.consentData)) : M(n) && void 0 !== n.uspString && (d += "&us_privacy=" + n.uspString)), d += "#" + JSON.stringify(l), r.src = d, r.id = this.gumSyncFrameId, r.width = "0", r.height = "0", r.frameBorder = "0", r.setAttribute("style", "border-width:0px; margin:0px; display:none"), r.title = "Criteo GUM iframe", L.removeLater(i, r), r
    }, S.prototype.setWaitingFlag = function(e) {
        this.waitingForSyncframe = this.waitingForSyncframe && null === e.bundleCookie.cookieValue && null === e.optoutCookie.cookieValue
    }, S.prototype.shouldInjectSyncframe = function() {
        return void 0 !== window.addEventListener || this.forceSyncFrame
    }, S);

    function S(e) {
        this.forceSyncFrame = !1, this.gumSyncFrameOrigin = "https://" + s("gumDomain", "gum.criteo.com"), this.gumSyncFrameEndPoint = window.CriteoSyncFrameUrlOverride || this.gumSyncFrameOrigin + "/syncframe", this.gumSyncFrameId = "criteo-syncframe-onetag", this.waitingForSyncframe = e.hasItp || s("waitForGum", !0)
    }
    var X = new RegExp(/^Mozilla\/5\.0 \([^)]+\) AppleWebKit\/[^ ]+ \(KHTML, like Gecko\) Version\/([^ ]+)( Mobile\/[^ ]+)? Safari\/[^ ]+$/i),
        Q = (_.prototype.canRetrieveMetrics = function() {
            return this.hasPerformanceApi
        }, _.prototype.startRecordingInit = function() {
            this.canRetrieveMetrics() && (this.beginInit = performance.now())
        }, _.prototype.stopRecordingInit = function() {
            if (this.canRetrieveMetrics() && null === this.timings.initTime && null !== this.beginInit) {
                var e = performance.now();
                this.timings.initTime = e - this.beginInit
            }
        }, _.prototype.startRecordingPush = function() {
            this.canRetrieveMetrics() && (this.beginPush = performance.now())
        }, _.prototype.stopRecordingPush = function() {
            if (this.canRetrieveMetrics() && null === this.timings.pushTime && null !== this.beginPush && null !== this.timings.initTime) {
                var e = performance.now();
                this.timings.pushTime = e - this.beginPush
            }
        }, _.prototype.getPerformanceOrDegradedNow = function() {
            return this.canRetrieveMetrics() ? performance.now() : (new Date).getTime()
        }, _);

    function _() {
        this.timings = {
            initTime: null,
            pushTime: null
        }, this.beginInit = null, this.beginPush = null, this.hasPerformanceApi = void 0 !== window.performance && "function" == typeof window.performance.now
    }
    var K = (I.prototype.trySetPageId = function(e, t) {
        this.isCbsEnabled && this.checkNotExistOrEmpty(e.page_id) && (e.page_id = t)
    }, I.prototype.tryForceViewListPageId = function(e) {
        this.isCbsEnabled && this.checkNotExistOrEmpty(e.page_id) && (this.checkNotExistOrEmpty(e.category) ? this.checkNotExistOrEmpty(e.keywords) ? e.page_id = "viewList" : e.page_id = "viewSearchResult" : e.page_id = "viewCategory")
    }, I.prototype.tryRunActionAfterAdBlockDetectionOrImmediate = function(t, e) {
        var n = this,
            i = window.criteo_q;
        if (null != i) {
            var o = i.adBlockDetector;
            this.isCbsEnabled && void 0 !== o ? (o(function(e) {
                n.abe = e, t()
            }), e(t)) : t()
        } else t()
    }, I.prototype.tryAppendAdBlockerParameter = function(e) {
        void 0 !== this.abe && e.push("abe=" + (this.abe ? 1 : 0))
    }, I.prototype.tryAppendUatParameter = function(e) {
        if (this.isCbsEnabled && void 0 !== this.uat) {
            var t = encodeURIComponent || escape;
            e.push("uat=" + t(this.uat))
        }
    }, I.prototype.clean = function() {
        this.abe = void 0, this.isCbsEnabled = !1, this.uat = void 0
    }, I.prototype.enable = function() {
        this.isCbsEnabled = !0
    }, I.prototype.setUat = function(e) {
        this.uat = e
    }, I.prototype.checkNotExistOrEmpty = function(e) {
        return void 0 === e || "" === e
    }, I);

    function I() {
        this.abe = void 0, this.isCbsEnabled = !1, this.uat = void 0
    }
    var R = /^#(enable|disable)-criteo-tag-debug-mode(=(\d+))?$/;

    function Z(e, t, n, i, o) {
        if (function() {
                if (!document || !window.location.hash) return;
                var e = R.exec(window.location.hash);
                if (!e || 4 !== e.length) return;
                var t = "enable" === e[1],
                    n = Number(e[3]);
                new H("criteoTagDebugMode", t ? 864e5 : 0).setValueWithNoDomain(t && n && !isNaN(n) ? String(n) : "0"), window.location.href = window.location.href.substr(0, window.location.href.indexOf("#"))
            }(), !document || "function" != typeof Array.prototype.indexOf || -1 === document.cookie.indexOf("criteoTagDebugMode=")) return e;
        var r = function(e, t, n, i, o) {
            var a = {
                exceptions: e.exceptions,
                m_config: n,
                m_state: i,
                originalPush: e.push,
                performances: e.performances,
                push: function() {
                    for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
                    0 < e.length && this.stagedPushes.push(e), o.stopRecordingInit()
                },
                pushError: function(e) {
                    this.stagedPushes.push(e)
                },
                removeLater: e.removeLater,
                setProtectedTimeout: t.setProtectedTimeout,
                stagedErrors: [],
                stagedPushes: []
            };
            return window.onerror = function(r) {
                return function(e, t, n, i) {
                    var o = {
                        column: i,
                        lineNumber: n,
                        message: e,
                        url: t
                    };
                    return a.pushError(o), !(!r || "function" != typeof r) && r.apply(window, [e, t, n, i])
                }
            }(window.onerror), a
        }(e, t, n, i, o);
        return function() {
            if (!document) return;
            var e = "ld-tag-debug." + c + ".js",
                t = document.createElement("script");
            t.setAttribute("type", "text/javascript"), t.setAttribute("src", document.location.protocol + "//static.criteo.net/js/ld/" + e);
            var n = document.getElementsByTagName("script")[0];
            n.parentNode.insertBefore(t, n)
        }(), r
    }
    var $ = (D.prototype.isChrome = function() {
        return !!window.chrome
    }, D.prototype.addTrialToken = function(e) {
        var t = document.createElement("meta");
        t.httpEquiv = "origin-trial", t.content = e, document.head.appendChild(t)
    }, D.prototype.registerTrigger = function(e) {
        if (this.isFeatureAllowed("attribution-reporting")) {
            var t = document.createElement("img");
            t.setAttribute("style", "display:none;"), t.setAttribute("width", "1"), t.setAttribute("height", "1"), t.setAttribute("attributionsrc", D.ATTRIBUTION_TRIGGER_URL_PREFIX + "?" + e);
            var n = document.getElementsByTagName("script")[0];
            t.setAttribute("data-owner", "criteo-tag"), n.parentNode.insertBefore(t, n), L.removeLater(this.exceptionHandler, t)
        }
    }, D.prototype.isFeatureAllowed = function(t) {
        return !(!document.featurePolicy || !document.featurePolicy.features()) && document.featurePolicy.features().some(function(e) {
            return e === t
        })
    }, D.CRITEO_NET_TOKEN = "A8JfNlJkey0MFKnz6XNz8nRPAhS9Pk1KdhzNHXdfaz7ediAYHhDf/bW0PKE8IDoMWFZG6uRlHwzxV6IR+zh0EAsAAACAeyJvcmlnaW4iOiJodHRwczovL2NyaXRlby5uZXQ6NDQzIiwiZmVhdHVyZSI6IlByaXZhY3lTYW5kYm94QWRzQVBJcyIsImV4cGlyeSI6MTY4ODA4MzE5OSwiaXNTdWJkb21haW4iOnRydWUsImlzVGhpcmRQYXJ0eSI6dHJ1ZX0=", D.CRITEO_COM_TOKEN = "A8+GUOvok5j8ovF5eDgcRkHjjwMRBeKryCemTXvbp0vtb//sDFgNbQ+1h5AEm6m7NkU/FuBEEqP3YH/3StuCyQ4AAACAeyJvcmlnaW4iOiJodHRwczovL2NyaXRlby5jb206NDQzIiwiZmVhdHVyZSI6IlByaXZhY3lTYW5kYm94QWRzQVBJcyIsImV4cGlyeSI6MTY4ODA4MzE5OSwiaXNTdWJkb21haW4iOnRydWUsImlzVGhpcmRQYXJ0eSI6dHJ1ZX0=", D.ATTRIBUTION_TRIGGER_URL_PREFIX = "https://measurement-api.criteo.com/conversiontracking", D);

    function D(e, t) {
        this.document = e, this.exceptionHandler = t, this.isChrome() && (this.addTrialToken(D.CRITEO_NET_TOKEN), this.addTrialToken(D.CRITEO_COM_TOKEN))
    }
    var A, ee = (E.generateUUID = function() {
        for (var e = "", t = 0; t < 36; t++) e += 8 === t || 13 === t || 18 === t || 23 === t ? "-" : 14 === t ? "4" : 19 === t ? (Math.floor(4 * Math.random()) + 8).toString(16) : Math.floor(16 * Math.random()).toString(16);
        return e
    }, E);

    function E() {}

    function te(e, t, n, i, o) {
        if (e && 0 !== (e = e.trim()).length) {
            var r = encodeURIComponent || escape,
                a = r(e);
            n < a.length && (t.push(o + "=" + a.length), a = a.substr(0, n));
            var s = r(a);
            t.push(i + "=" + s)
        }
    }
    if (!window.criteo_q || window.criteo_q instanceof Array) {
        var F = window.criteo_q || [];
        window.criteo_q = function() {
            var e;
            void 0 !== (null === (e = null === window || void 0 === window ? void 0 : window.location) || void 0 === e ? void 0 : e.hash) && -1 !== window.location.hash.indexOf("onetag-debug") && O.setLogLevel(p.Debug);
            var _ = new v,
                o = new Q;
            o.startRecordingInit();
            var w = {
                    app: {
                        accounts: [],
                        actions: [],
                        bodyReady: !1,
                        disingScheduled: [],
                        domReady: !1,
                        eventSent: !1,
                        queue: []
                    },
                    cbs: new K
                },
                k = function() {
                    var e = {
                            account: s("partnerId") || null,
                            firstPartyIdentifier: s("fpIdentifier") || null,
                            customerInfo: [],
                            extraData: [],
                            handlerParams: {
                                v: c
                            },
                            handlerResponseType: "single",
                            handlerUrlPrefix: "https://sslwidget.criteo.com/event",
                            partnerPayload: null,
                            requestType: "pixel",
                            responseType: "js",
                            tagVersion: c,
                            dynamic: s("dynamic") || null,
                            fullUrlMaxLength: s("fullUrlMaxLength", 2e3),
                            previousUrlMaxLength: s("previousUrlMaxLength", 400),
                            privateModeDetectionEnabled: s("privateModeDetectionEnabled", !0)
                        },
                        t = {
                            item: !0,
                            "item.id": !0,
                            product: !0,
                            "product.id": !0
                        },
                        n = {
                            item: !0,
                            product: !0
                        };
                    return {
                        hooks: {},
                        shortNameMap: {
                            events: {
                                applaunched: "al",
                                viewitem: "vp",
                                viewhome: "vh",
                                viewlist: "vl",
                                viewbasket: "vb",
                                viewsearch: "vs",
                                viewpage: "vpg",
                                tracktransaction: "vc",
                                addtocart: "ac",
                                calldising: "dis",
                                setdata: "exd",
                                setemail: "ce",
                                setidentity: "id"
                            },
                            properties: {
                                event: "e",
                                account: "a",
                                first_party_identifier: "fpid",
                                currency: "c",
                                product: "p",
                                item: "p",
                                "item.id": "i",
                                "item.price": "pr",
                                "item.quantity": "q",
                                "item.availability": "pav",
                                "item.buy_box": "bb",
                                "item.sku_parent": "psp",
                                "item.store_id": "ps",
                                item_whitelist: "iw",
                                "product.id": "i",
                                "product.price": "pr",
                                "product.quantity": "q",
                                "product.availability": "pav",
                                "product.buy_box": "bb",
                                "product.sku_parent": "psp",
                                "product.store_id": "ps",
                                data: "d",
                                keywords: "kw",
                                checkin_date: "din",
                                checkout_date: "dout",
                                deduplication: "dd",
                                delivery: "dl",
                                attribution: "at",
                                "attribution.channel": "ac",
                                "attribution.value": "v",
                                user_segment: "si",
                                new_customer: "nc",
                                customer_id: "ci",
                                email: "m",
                                hash_method: "h",
                                identity: "id",
                                raw_identity: "rid",
                                transaction_value: "tv",
                                client_revenue: "cr",
                                responseType: "rt",
                                page_name: "pn",
                                page_id: "pi",
                                page_number: "pnb",
                                category: "ca",
                                filters: "f",
                                "filters.name": "fn",
                                "filters.operator": "fo",
                                "filters.value": "fv",
                                retailer_visitor_id: "rvi",
                                price: "pr",
                                availability: "av",
                                sub_event_type: "se",
                                store_id: "s",
                                item_group_id: "sp",
                                sku_parent: "sp",
                                zipcode: "z",
                                nocall: "noc",
                                block: "bl"
                            }
                        },
                        trackingCallData: e,
                        workflow: {
                            container: null,
                            disOnce: !1,
                            manualDising: !1,
                            manualFlush: !1,
                            noPartialFlush: !1,
                            partialDis: !1
                        },
                        encodingConfig: {
                            shouldEncodeField: function(e) {
                                return t[e]
                            }
                        },
                        parsingConfig: {
                            shouldParseField: function(e) {
                                return n[e]
                            }
                        },
                        identifierScrappingConfig: {
                            firstPartyCookiesToRead: {
                                FirstId: "firstId"
                            }
                        }
                    }
                }(),
                t = function(e) {
                    var t = e.match(X),
                        n = null !== t;
                    return {
                        hasItp: null !== t && 11 <= parseFloat(t[1]),
                        isSafari: n
                    }
                }(window.navigator.userAgent),
                b = new J(_, t, window, k),
                P = new Y(t),
                n = new f(window),
                I = new $(document, _),
                R = function(t) {
                    var i = !1,
                        o = void 0,
                        r = [];
                    return function(e) {
                        i ? e(o) : (r.push(e), 1 === r.length && t(function(e) {
                            i = !0, o = e;
                            for (var t = 0, n = r; t < n.length; t++) {
                                (0, n[t])(o)
                            }
                        }))
                    }
                }(n.retrieveConsent.bind(n));

            function h(e, t, n, i, o, r, a, s, c, u, l) {
                e.waitingForSyncframe && (e.waitingForSyncframe = !1, d(e, t, n, i, o, r, a, s, c, u, l))
            }

            function i(t, n, i, o, r, a, s, c, u, l, d, e) {
                if (t.shouldInjectSyncframe()) {
                    var p = t.createIframe(o, c.tagVersion, e, _, c.privateModeDetectionEnabled);
                    window.addEventListener && (_.addProtectedEventListener(window, "message", function(e) {
                        ! function(e, t, n, i, o, r, a, s, c, u, l, d) {
                            var p = d.data;
                            if (!(p && d.origin == e.gumSyncFrameOrigin || window.BypassSyncframeMessageSanityCheck)) return;
                            d.stopPropagation(), i.checkCookies(p), e.waitingForSyncframe && h(e, t, n, i, o, r, a, s, c, u, l)
                        }(t, n, i, o, r, a, s, c, u, l, d, e)
                    }, !0), A(n, l, u, {
                        event: "appendtag",
                        element: p
                    }))
                }
            }

            function r(e, t) {
                ! function(e) {
                    var t = !1;
                    if (200 < e.length) t = !0;
                    else
                        for (var n = 0, i = e; n < i.length; n++) {
                            var o = i[n],
                                r = 0;
                            if (Object.keys) r = Object.keys(o).length;
                            else
                                for (var a in o) Object.prototype.hasOwnProperty.call(o, a) && (r += 1);
                            if (200 < r) {
                                t = !0;
                                break
                            }
                        }
                    t && (e.length = 0)
                }(e.extraData), e.customerInfo = [], t.clean()
            }

            function a() {
                for (var i = [], e = 0; e < arguments.length; e++) i[e] = arguments[e];
                _.catchAndStoreException(function() {
                    o.startRecordingPush();
                    for (var e = 0, t = i; e < t.length; e++) {
                        var n = t[e];
                        w.app.queue.push(n)
                    }
                    d(P, w.app, w.cbs, b, k.shortNameMap, k.encodingConfig, k.parsingConfig, k.trackingCallData, k.hooks, k.workflow, k.identifierScrappingConfig), r(k.trackingCallData, w.cbs), o.stopRecordingPush()
                }, i), o.stopRecordingInit()
            }

            function d(e, t, n, i, o, r, a, s, c, u, l) {
                for (var d = [], p = t.queue, h = 0; h < p.length; ++h) {
                    var f = p[h];
                    if (f instanceof Array) {
                        var g = [h + 1, 0];
                        p.splice.apply(p, g.concat(f))
                    }
                    if (f instanceof Function) p.splice(h + 1, 0, f());
                    else if (f && "[object Object]" === f.toString()) switch (m(t, n, i, o, r, a, s, c, u, l, f, h, p, d)) {
                        case 0:
                            d.push(f);
                            break;
                        case -1:
                            d = d.concat(p.slice(h)), h = p.length
                    }
                }
                c.afterEval instanceof Function && c.afterEval(), t.queue = d || [], u.manualFlush || u.noPartialFlush && 0 !== t.queue.length || e.waitingForSyncframe || S(t, n, i, o, r, a, s, c, u, l, 0 !== t.queue.length)
            }

            function D(e, t, n) {
                n.hasOwnProperty("account") || (n.account = t.accounts);
                var i = e.handlerResponseType;
                n.hasOwnProperty("type") && (i = n.type, delete n.type), y(n.account, t.disingScheduled), "sequential" === i && (n.dc = !0)
            }

            function A(e, t, n, i) {
                var o = E(e, i);
                return null !== o ? o : T(e, t, n, i)
            }

            function T(e, t, n, i) {
                if (!e.bodyReady || t.container && document.body.contains(t.container) || (t.container = L.appendCriteoContainer(document.body)), i.url) {
                    var o = void 0;
                    i.isImgUrl ? ((o = document.createElement("img")).setAttribute("style", "display:none;"), o.setAttribute("width", "1"), o.setAttribute("height", "1")) : ((o = document.createElement("script")).setAttribute("async", "true"), o.setAttribute("type", "text/javascript")), o.setAttribute("src", i.url), i.element = o
                }
                if (n.beforeAppend instanceof Function && (i.element = n.beforeAppend(i.element)), U(i), i.element && (i.element.tagName || i.isImgUrl))
                    if (t.container || "script" !== i.element.tagName.toLowerCase() && !i.isImgUrl) {
                        if (!t.container) return 0;
                        t.container.appendChild(i.element), L.removeLater(_, i.element)
                    } else {
                        var r = document.getElementsByTagName("script")[0];
                        i.element.setAttribute("data-owner", "criteo-tag"), r.parentNode.insertBefore(i.element, r), L.removeLater(_, i.element)
                    }
                return 1
            }

            function E(e, t) {
                return !e.domReady && t.requiresDOM && "no" !== t.requiresDOM ? "blocking" === t.requiresDOM ? -1 : 0 : (delete t.requiresDOM, t.event ? (t.account && y(t.account, e.accounts), t.event = t.event.toLowerCase(), null) : (U(t), 1))
            }

            function m(e, t, n, i, o, r, a, s, c, u, l, d, p, h) {
                var f = l.event,
                    g = E(e, l);
                if (null !== g) return g;
                switch (l.event) {
                    case "setdata":
                        return G(a.extraData, e.actions, l);
                    case "setparameter":
                        for (var m in l) "event" !== m.toLowerCase() && l.hasOwnProperty(m) && (a.handlerParams[m] = l[m]);
                        return 1;
                    case "calldising":
                        D(a, e, l);
                        break;
                    case "setzipcode":
                    case "setstore":
                        return l.event = "setdata", G(a.extraData, e.actions, l);
                    case "setcustomerid":
                        return l.event = "setdata", l.customer_id = l.id, delete l.id, G(a.extraData, e.actions, l);
                    case "setretailervisitorid":
                        return t.enable(), l.event = "setdata", l.retailer_visitor_id = l.id, delete l.id, G(a.extraData, e.actions, l);
                    case "setgoogleadvertisingid":
                        return n.gaid = l.gaid, G(a.extraData, e.actions, {
                            event: "setdata",
                            site_type: "aa"
                        });
                    case "setappleadvertisingid":
                        return n.idfa = l.idfa, G(a.extraData, e.actions, {
                            event: "setdata",
                            site_type: "aios"
                        });
                    case "setemail":
                    case "sethashedemail":
                    case "ceh":
                        l.event = "setemail", l.hasOwnProperty("email") && (l.email instanceof Array || (l.email = [l.email]), l.email = N(l.email));
                        var v = U(l);
                        return a.customerInfo.push(v), j(e.actions, U(l)), 1;
                    case "setidentity":
                        if (l.hasOwnProperty("identity")) {
                            var y = l.identity instanceof Array ? l.identity : [l.identity];
                            if (0 < (y = N(y)).length) return l.identity = y, e.actions.push(U(l)), 1
                        }
                        return 0;
                    case "setsitetype":
                        var C = "d";
                        return "mobile" !== l.type && "m" !== l.type || (C = "m"), "tablet" !== l.type && "t" !== l.type || (C = "t"), l.event = "setdata", delete l.type, l.site_type = C, G(a.extraData, e.actions, l);
                    case "appendtag":
                        return T(e, c, s, l);
                    case "gettagstate":
                        return l.callback instanceof Function ? l.callback(w, k, b, P) : 1;
                    case "setuat":
                        return t.setUat(l.uat), 1;
                    case "viewsearchresult":
                    case "viewcategory":
                        t.trySetPageId(l, f), l.event = "viewlist";
                        break;
                    case "viewlist":
                        t.tryForceViewListPageId(l);
                        break;
                    case "viewitem":
                    case "viewhome":
                    case "viewbasket":
                    case "tracktransaction":
                    case "addtocart":
                        t.trySetPageId(l, f);
                        break;
                    case "viewstore":
                        t.trySetPageId(l, f), l.event = "viewHome", l.sub_event_type = "s";
                        break;
                    case "checkavailability":
                        t.trySetPageId(l, f), l.event = "viewBasket", l.sub_event_type = "a";
                        break;
                    case "reserveinstore":
                        t.trySetPageId(l, f), l.event = "viewBasket", l.sub_event_type = "r";
                        break;
                    case "flush":
                    case "flushevents":
                        return S(e, t, n, i, o, r, a, s, c, u, d !== p.length - 1 || 0 !== h.length), 1;
                    case "setaccount":
                        return a.account = l.account, 1;
                    case "seturl":
                        return a.handlerUrlPrefix = l.url, 1;
                    case "setcalltype":
                        return a.handlerResponseType = l.type, 1;
                    case "setresponsetype":
                        return a.responseType = l.type, 1;
                    case "setrequesttype":
                        return a.requestType = l.type, 1;
                    case "setpartnerpayload":
                        return a.partnerPayload = l.payload, 1;
                    case "oninitialized":
                        return s.onInitialized = l.callback, 1;
                    case "ondomready":
                        return s.onDOMReady = l.callback, 1;
                    case "beforeappend":
                        return s.beforeAppend = l.callback, 1;
                    case "aftereval":
                        return s.afterEval = l.callback, 1;
                    case "onflush":
                        return s.onFlush = l.callback, 1;
                    case "onurlgenerated":
                        return s.onUrlGenerated = l.callback, 1;
                    case "disonce":
                        return c.disOnce = !0, 1;
                    case "manualdising":
                        return c.manualDising = !0, 1;
                    case "manualflush":
                        return c.manualFlush = !0, 1;
                    case "nopartialflush":
                        return c.noPartialFlush = !0, 1;
                    case "disonpartialflush":
                        return c.partialDis = !0, 1
                }
                return e.actions.push(U(l)), 1
            }

            function S(n, i, e, t, o, r, a, s, c, u, l) {
                if (s.onFlush instanceof Function && (s.onFlush(), O.warn("on flush hook is deprecated and will soon be removed. Please do not use it and contact criteo if you think this may break your integration")), 0 !== n.actions.length) {
                    for (var d = 0, p = a.extraData; d < p.length; d++) {
                        var h = p[d];
                        B(n.actions, h)
                    }
                    for (var f = 0, g = a.customerInfo; f < g.length; f++) {
                        var m = g[f];
                        j(n.actions, m)
                    }
                    for (var v = 0, y = n.actions; v < y.length; v++) {
                        z(y[v])
                    }
                    if (!c.manualDising && (!l || c.partialDis)) {
                        for (var C = [], w = 0, k = n.accounts; w < k.length; w++) {
                            var b = k[w];
                            W(n.disingScheduled, b) || C.push(b)
                        }
                        0 < C.length && function(e, t, n) {
                            var i = E(t, n);
                            null !== i || (D(e, t, n), t.actions.push(U(n)))
                        }(a, n, {
                            event: "callDising",
                            account: C
                        })
                    }
                    var P = !1,
                        T = function(e, t, n, i, o, r, a, s) {
                            var c = e.actions,
                                u = [];
                            1 === e.accounts.length && (o.account = e.accounts[0]);
                            null !== o.account && u.push("a=" + F(i, r, a, o.account, []));
                            "js" !== o.responseType && u.push("rt=" + F(i, r, a, o.responseType, []));
                            if (o.handlerParams) {
                                var l = decodeURIComponent(F(i, r, a, o.handlerParams, []));
                                l && u.push(l)
                            }
                            var d = function() {
                                for (var e = document.getElementsByTagName("script"), t = 0; t < e.length; t++) {
                                    var n = e[t],
                                        i = n.nonce || n.getAttribute("nonce");
                                    if (null != i && "" !== i) return i
                                }
                                return
                            }();
                            if (void 0 !== d) {
                                var p = encodeURIComponent || escape;
                                u.push("csp-nonce=" + p(d))
                            }
                            t.tryAppendUatParameter(u);
                            for (var h = 0; h < c.length; ++h) {
                                var f = c[h];
                                f.account && V(null === o.account ? void 0 : o.account, null === f.account ? void 0 : f.account) && delete f.account, u.push("p" + h + "=" + F(i, r, a, f, []))
                            }
                            n.fillQueryStringParams(u, o), null !== o.partnerPayload && u.push("pp=" + F(i, r, a, o.partnerPayload, []));
                            o.dynamic && u.push("dy=1");
                            te(L.getHighestAccessibleUrl(window), u, o.fullUrlMaxLength, "fu", "ful"), te(L.getPreviousUrl(window), u, o.previousUrlMaxLength, "pu", "pul"), u.push("ceid=" + ee.generateUUID()), u.push("dtycbr=" + Math.floor(1e5 * Math.random()));
                            var g = function(i) {
                                return Object.keys(i.firstPartyCookiesToRead).map(function(e) {
                                    var t = i.firstPartyCookiesToRead[e],
                                        n = new H(t, 0).getValue();
                                    return null != n && 0 < n.length ? JSON.stringify({
                                        type: e,
                                        value: n
                                    }) : ""
                                }).filter(function(e) {
                                    return 0 < e.length
                                }).join(",")
                            }(s);
                            0 < g.length && u.push("external_advids=" + encodeURIComponent("[" + g + "]"));
                            return u
                        }(n, i, e, t, a, o, r, u);
                    n.actions = [];
                    var S = function() {
                        if (!P) {
                            P = !0, i.tryAppendAdBlockerParameter(T);
                            var e = function(e) {
                                    return e.join("&")
                                }(T),
                                t = function(e, t) {
                                    return {
                                        event: "appendTag",
                                        isImgUrl: "gif" === e.responseType,
                                        url: e.handlerUrlPrefix + "?" + t
                                    }
                                }(a, e);
                            "function" == typeof s.onUrlGenerated ? s.onUrlGenerated(t.url) : "beacon" === a.requestType && navigator.sendBeacon ? navigator.sendBeacon(t.url) : A(n, c, s, t), O.info("DIS call triggered", t.url, T), n.eventSent = !0, I.registerTrigger(e), c.disOnce || (n.disingScheduled = [])
                        }
                    };
                    R(function(e) {
                        e && T.push.apply(T, function(e) {
                            var t = [];
                            return x(e) ? (void 0 !== e.gdprApplies && t.push("gra=" + (e.gdprApplies ? 1 : 0)), void 0 !== e.consentData && t.push("grs=" + e.consentData), void 0 !== e.version && t.push("grv=" + e.version)) : M(e) && (void 0 !== e.uspString && t.push("cs=" + e.uspString), void 0 !== e.version && t.push("cv=" + e.version)), t
                        }(e)), i.tryRunActionAfterAdBlockDetectionOrImmediate(S, function(e) {
                            return _.setProtectedTimeout(e, 500)
                        })
                    })
                }
            }

            function F(e, t, n, i, o) {
                var r, a, s, c = encodeURIComponent || escape,
                    u = "";
                if (i instanceof Function) u = F(e, t, n, i(), o);
                else if (i instanceof Array) {
                    for (var l = [], d = 0; d < i.length; ++d) l[d] = F(e, t, n, i[d], o);
                    u += "[" + l.join(",") + "]"
                } else if (i && "[object Object]" === i.toString()) {
                    var p = [];
                    for (var h in i)
                        if (i.hasOwnProperty(h)) {
                            var f = o.concat([h]);
                            p.push((r = e, a = h, void 0, s = f.join("."), (r.properties[s] ? r.properties[s] : a) + "=" + F(e, t, n, i[h], f)))
                        }
                    u += p.join("&")
                } else if (1 === o.length && "event" === o[0]) u += e.events[i.toLowerCase()] ? e.events[i.toLowerCase()] : i;
                else {
                    var g = function(e, t, n) {
                        var i = t.join(".");
                        return "string" == typeof n && e.shouldParseField(i) && 0 != n.length && "[" == n.charAt(0) && "]" == n.charAt(n.length - 1) ? n.substring(1, n.length - 1).split(",", -1).map(function(e) {
                            return e.trim()
                        }) : []
                    }(n, o, i);
                    if (0 < g.length) return F(e, t, n, g, o);
                    ! function(e, t) {
                        var n = t.join(".");
                        return e.shouldEncodeField(n)
                    }(t, o) ? u += i: u += c(i)
                }
                return c(u)
            }
            return _.catchAndStoreException(function() {
                return b.checkAcid(), b.checkClientSideIdentityStatus(), b.setCop(window),
                    function(e, t, n, i, o, r, a, s, c, u, l) {
                        e.setWaitingFlag(i), e.waitingForSyncframe && _.setProtectedTimeout(function() {
                            h(e, t, n, i, o, r, a, s, c, u, l)
                        }, 1e4)
                    }(P, w.app, w.cbs, b, k.shortNameMap, k.encodingConfig, k.parsingConfig, k.trackingCallData, k.hooks, k.workflow, k.identifierScrappingConfig), L.onBodyReady(_, function() {
                        k.hooks.onInitialized instanceof Function ? (w.app.bodyReady = k.hooks.onInitialized(), O.warn("onInitialized hook is deprecated and will soon be removed. Please do not use it and contact criteo if you think this may break your integration")) : w.app.bodyReady = !0, R(function(e) {
                            i(P, w.app, w.cbs, b, k.shortNameMap, k.encodingConfig, k.parsingConfig, k.trackingCallData, k.hooks, k.workflow, k.identifierScrappingConfig, e)
                        }), d(P, w.app, w.cbs, b, k.shortNameMap, k.encodingConfig, k.parsingConfig, k.trackingCallData, k.hooks, k.workflow, k.identifierScrappingConfig)
                    }), L.onDocumentReady(_, function() {
                        k.hooks.onDOMReady instanceof Function ? (w.app.domReady = k.hooks.onDOMReady(), O.warn("on DOM ready hook is deprecated and will soon be removed. Please do not use it and contact criteo if you think this may break your integration")) : w.app.domReady = !0, d(P, w.app, w.cbs, b, k.shortNameMap, k.encodingConfig, k.parsingConfig, k.trackingCallData, k.hooks, k.workflow, k.identifierScrappingConfig)
                    }),
                    function(e) {
                        try {
                            var t = L.getAnchorWithReferrer(document);
                            if (t)
                                if (t.hostname !== document.location.hostname) q(e, {
                                    event: "setData",
                                    ref: t.protocol + "//" + t.hostname
                                })
                        } catch (e) {}
                    }(k.trackingCallData.extraData), s("visitEventEnabled", !1) && function(e, t) {
                        function n() {
                            t.eventSent || (e({
                                event: "setRequestType",
                                type: "beacon"
                            }), e({
                                event: "viewPage"
                            }))
                        }
                        window.addEventListener && window.addEventListener("pagehide", n);
                        var i = s("visitEventDelay", 3e4);
                        0 <= i && setTimeout(n, i)
                    }(a, w.app), Z({
                        exceptions: _.exceptions,
                        performances: o.timings,
                        push: a,
                        removeLater: function(e) {
                            return L.removeLater(_, e)
                        }
                    }, _, k, w, o)
            })
        }(), F.adBlockDetector, window.criteo_q.adBlockDetector = F.adBlockDetector, (A = window.criteo_q).push.apply(A, F)
    }
}();