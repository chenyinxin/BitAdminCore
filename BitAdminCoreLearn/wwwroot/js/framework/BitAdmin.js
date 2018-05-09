﻿/***********************
 * BitAdmin2.0框架文件
 * 全局功能
 ***********************/
var BitAdmin = {
    RedirectToLoginPage: function () {
        window.location.href = "../../pages/account/login.html";
    },
    RedirectToHomePage: function () {
        window.location.href = "../../pages/home/index.html";
    },
    //是否已登录
    IsLogin: function (success,sign) {
        $.get("../../account/isLogin", function (result) {
            if (result == "true" && sign == "login") BitAdmin.RedirectToHomePage();
            if (result == "false" && sign == "page") BitAdmin.RedirectToLoginPage();
            if ($.isFunction(success)) success(result);
        });
    },
    //初始权限按制
    InitRight: function (sign) {
        if (sign == undefined) { return; }
        $.post("../../account/getOperationCode?sign=" + sign, function (result) {
            if (result.code == 0 && result.data) {
                $.adminSetting.addLogs($(document).attr("title"), "页面访问", "访问");//添加访问日志

                if (result.data.Operation == true)
                    return;

                if (result.data.Operation == false) {
                    window.location.href = "../../pages/error/false.html";
                    return;
                }

                $.each($("[type='button'],:button,a"), function (i) {
                    var attrVal = $(this).attr("action");
                    if (attrVal != undefined && attrVal != "undefined" && attrVal != "" && attrVal != null && attrVal != "null") {
                        if (result.data.Operation.toLocaleLowerCase().indexOf(attrVal.toLocaleLowerCase()) == -1) {
                            $(this).remove();
                        }
                    }
                });
            }
            else {
                alert(result.msg);
            }
        });
    },
    AddLogs: function (title, type, msg) {
        $.get("../../system/addLog", {
            title: title,
            Type: type,
            Description: msg
        });
    }
}
var BitPage = {
    GetQueryString: function (name, url) {
        if (url == undefined) url = window.location.search;
        var reg = new RegExp("(\\?|&)" + name + "=([^&]*)(&|$)");
        var r = url.match(reg);
        if (r != null) return unescape(r[2]); return null;
    },
    LoadContent: function () {
        var pageUrl = BitPage.GetQueryString("page").split("?")[0];
        pageUrl = pageUrl.indexOf('.') > -1 ? pageUrl : pageUrl + '.html';
        $("section.content").load("../" + pageUrl);
        var sign = BitPage.GetQueryString("sign");
        BitAdmin.InitRight(sign);           //初始化操作权限

        var modulePage;
        if (window.parent.BitAdmin.Pages)
            modulePage = window.parent.BitAdmin.Pages[sign];
        else if (window.BitAdmin.Pages)
            modulePage = window.BitAdmin.Pages[sign];

        if (modulePage != null) {
            $(document).attr("title", modulePage.PageName);
            $(".header-moduleName").text(modulePage.ModuleName);
            $(".header-pageName").text(modulePage.PageName);
            //$(".header-PageDesc").text(modulePage.Description);
        }
    },
    Redirect: function (tabUrl, param, tabSign, type) {
        var options = { "tabUrl": tabUrl, "param": param, "tabSign": tabSign }
        var pageUrl = BitPage.GetRedirect(options);
        switch (type) {
            case 1:
                window.parent.window.location.href = pageUrl;
                break;
            default:
                window.location.href = pageUrl;
                break;
        }
    },
    GetRedirect: function (options) {
        var param = '';
        $.each(options.param, function (key, val) {
            param += "&" + key + '=' + val;
        });
        param = param.replace('&', '?');
        var pageUrl = '';
        var urlArr = options.tabUrl.split('.');
        var suffix = urlArr[urlArr.length - 1].toLocaleLowerCase();
        if (suffix == '_blank') {
            var el = document.createElement("a");
            document.body.appendChild(el);
            el.href = options.tabUrl.replace("." + urlArr[urlArr.length - 1], '') + param;
            el.target = '_blank';
            el.click();
            document.body.removeChild(el);
            return;
        }
        else if (suffix == 'null') {
            pageUrl = options.tabUrl.replace("." + urlArr[urlArr.length - 1], '') + param;
        }
        else {
            var layout = "layout.html";
            if (urlArr.length > 1)
                layout = suffix + ".html";
            pageUrl = "../../pages/shared/" + layout + "?page=" + encodeURIComponent(options.tabUrl.split('.')[0] + param) + "&sign=" + options.tabSign;
        }
        return pageUrl;
    },
}
var string = {
	/*
	 *	方法名：字符串格式项替换
	 *	描述：将指定字符串中的格式项替换为指定数组中相应对象的字符串表示形式。 指定的参数提供区域性特定的格式设置信息。
	 *	示例：var data = string.format('{0},{1}...', params object[] args);
	*/
    format: function (source, params) {
        if (arguments.length == 1)
            return function () {
                var args = $.makeArray(arguments);
                args.unshift(source);
                return BitAdminTools.format.apply(this, args);
            };
        if (arguments.length > 2 && params.constructor != Array) {
            params = $.makeArray(arguments).slice(1);
        }
        if (params.constructor != Array) {
            params = [params];
        }
        $.each(params, function (i, n) {
            source = source.replace(new RegExp("\\{" + i + "\\}", "g"), n);
        });
        return source;
    },
    subString : function (val, len) {
        if (val.length > len) {
            val = val.substr(0, len - 3) + '...';
        }
        return val;
    }
}
var time = {
    // 日期格式化
    // 示例：time.format(json, "yyyy-MM-dd HH:mm:ss.fff")
    format: function (JSONDateString, fmt) {
        if (JSONDateString == "" || JSONDateString == undefined || JSONDateString == "undefined" || JSONDateString == null)
            return "";
        var date;
        if (JSONDateString.toString().indexOf("Date") > 0) {
            date = new Date(parseInt(JSONDateString.replace("/Date(", "").replace(")/", ""), 10));
        } else {
            date = new Date(JSONDateString);
        }
        var o = {
            "M+": date.getMonth() + 1,               //月份    
            "d+": date.getDate(),                    //日    
            "H+": date.getHours(),                   //小时    
            "h+": date.getHours(),                   //小时    
            "m+": date.getMinutes(),                 //分    
            "s+": date.getSeconds(),                 //秒    
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度    
            "f": date.getMilliseconds()             //毫秒    
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }

}
var guid = {
	/*
	 *	方法名：guid.new()
	 *	描述：创建一个新GUID字符串
	*/
    new: function () {
        var temp = "";
        for (var i = 1; i <= 32; i++) {
            var n = Math.floor(Math.random() * 16.0).toString(16);
            temp += n;
            if (i == 8 || i == 12 || i == 16 || i == 20) {
                temp += "-";
            }
        }
        return temp;
    }
}

var array = {
    remove: function (list, item) {
        list.splice($.inArray(item, list), 1);
        return list;
    },
    removeAll: function (data) {
        data.splice(0, data.length);
        return data;
    }
}

$.extend({
    //加载中......
    showLoading: function () {
        $("body").append('<div class="pageLoading"></div>');
    },
    hideLoading: function () {
        $(".pageLoading").remove();
    }
});

$.ajaxSetup({
    statusCode: {
        405: function (data) {
            BitAdmin.RedirectToLoginPage();
        }
    },
    cache: false
});

$(function () {
    //setInterval(function () {
    //    var msg = "", ex = "";
    //    $.each($("[id]"), function (i, e) {
    //        var id = $(this).attr("id");
    //        if (ex.indexOf(id) >= 0)
    //            return;
    //        var num = $("[id=" + id + "]").length;
    //        if (num > 1) {
    //            ex += id;
    //            msg += "[" + id + "]:" + num + "次；"
    //        }
    //    });
    //    if (msg.length > 0)
    //        alert("id重复使用：\r\n" + msg);
    //}, 30000);
})