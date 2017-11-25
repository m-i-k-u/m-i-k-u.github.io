window.onload = (function(){
    /*
     * IE BROWSER NOTICE
     * Let IE user choice other browser
     */
    if (!!window.ActiveXObject || "ActiveXObject" in window) {
        var BwNotice = document.createElement("div");
        BwNotice.innerHTML = '<div style="background:#f2f2f2; width:100%; height:72px;"> <div style="width:1245px; height:72px; margin:0 auto;"> <div style="float:left;width:72px;height:72px;"> <img width="45px" height="45px" src="https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/REZlo1?ver=5722" style="margin:13.5px"/> </div> <div style="float:left;margin-top:18px;"> <a href="https://www.microsoft.com/zh-cn/windows/microsoft-edge" target="_blank" style="color:#000000;font-weight:bold;font-size:16px;text-decoration:none;">浏览器 - Microsoft Edge</a><br/> <a href="https://www.microsoft.com/zh-cn/windows/microsoft-edge" target="_blank" style="color:#888888;font-size:13px;text-decoration:none;">您的浏览器过于古老将影响使用，试用专为 Windows 10 设计的快速安全的浏览器</a> </div> <div style="float:right;"> <a href="https://www.microsoft.com/zh-cn/windows/microsoft-edge" target="_blank" style="background: #0078d7;color: #ffffff;text-decoration: none;padding: 8px 15px;margin-top: 18px;display: block;">立即试用</a> </div> </div></div>';
        document.getElementsByTagName("body")[0].insertBefore(BwNotice, document.getElementsByTagName("body")[0].firstChild);
    }
})();

$(function() {
    /*
     * NAV MAKER
     * marking current page
     * in navbar
     */
    var currentUri = window.location.href;
    if (currentUri.indexOf('?') > -1) {
        currentUri = currentUri.substr(0,currentUri.indexOf('?'));
    }
    $('a[href="' + currentUri + '"] li','#header .main-menu').addClass('current');

    /*
     * SEARCH POST
     * process search request
     */
    // search post
    $("#globalSearch").submit(function(e) {
        if($("input","#globalSearch").val() === "") {
            return false;
        }
        window.location.href='http://www.acgdraw.com/search?kw='+$("input","#globalSearch").val();
        e.preventDefault();
    });
    // show search box
    $("nav .extra .search").click(function(){
        var seachBox = $('nav .extra .searchbox');
        if(seachBox.css('display') === "none") {
            // show search box
            seachBox.animate({width:'toggle'},300);
            $("input", seachBox).focus();
        } else {
            // overwrite search button
            seachBox.animate({width:'toggle'},150);
            $("#globalSearch").submit();
        }
    });

    /*
     * USER LOGIN BOX
     * control quick login box and
     * post data to server.
     */
    function showUserMenu(revert) {
        var $this = $('#loginBox-logged'),
            $avatarOut = $('.l-box-login', $this),
            $avatar = $('.avatar', $avatarOut),
            $infoOut = $('.r-box-login', $this),
            $userName = $('.username', $infoOut),
            $menu = $('.menu-box-login', $this);
        var speed = Number(200);
        $this.stop().animate({  // Change the User Info box size
            width: revert ? 215: 290,
            height:revert ? 90: 210,
            marginTop:revert ? -45: -60,
            borderRadius: revert ? 5: 0
        }, speed);
        if(revert)  // Background color same as Header Bg
            $this.css('background-color','')
                .css('border', '');
        else
            $this.css('background-color','rgba(255,255,255,1)')
                .css('border', '2px solid #E4ACC9');
        $avatarOut.stop().animate({
            marginLeft: revert ? 0: 25,
            marginRight: revert ? 0: 12,
            marginTop: revert ? 0: 30
        }, speed);
        $avatar.stop().animate({
            width: revert ? 60: 85,
            height: revert ? 60: 85
        }, revert ? speed-50 : speed+50);

        $infoOut.stop().animate({
            marginTop: revert ? 0: 26,
            width: revert ? 115: 140
        }, speed);
        $userName.stop().animate({
            fontSize: revert ? 18: 20
        }, revert ? speed-50 : speed+50);
        revert ? $menu.stop().hide() : $menu.stop().fadeIn(300);
    }
    $("#linkShowQuickLogin").click(function() {
        if (window.location.pathname === "/") { // Return login page in homepage
            window.location.href="https://auth.acgdraw.com/login";
            return ;
        }
        $('#loginBox-logged').hide();
        $('#loginBox-logout').hide();
        $('#loginBox-quick').show();
    });
    function doLoadUserInfo() {
        $.ajax({
            type: "GET",
            url: "https://auth.acgdraw.com/facilitateLogin",
            xhrFields: {
                withCredentials: true
            },
            success: function(data)
            {
                if (data.login === 1) {
                    $('#loginBox-logged .avatar').attr('src', data.userinf.head);
                    $('#loginBox-logged .username').html('<a href="/u/'+data.userinf.id+'">'+data.userinf.name+'</a>');
                    $('#loginBox-logged #mySpaceUrl').attr('href','/u/'+data.userinf.id);
                    $('#loginBox-logged .info').text('积分 ' + data.userinf.score);
                    $('#loginBox-logout').hide();
                    $('#loginBox-quick').hide();
                    $('#loginBox-logged').show();
                    window.loginStatus = true;
                } else {
                    $('#loginBox-logged').hide();
                    $('#loginBox-quick').hide();
                    $('#loginBox-logout').show();
                    window.loginStatus = false;
                }
            }
        });
    }
    function doQuickLogin() {
        // Validate Form Input
        if( $("#loginBox-quick #quickLogin-username").val().length < 2 ) {
            layer.msg('昵称/邮箱忘填或太短（最少2位）');
            return;
        }
        else if( $("#loginBox-quick #quickLogin-password").val().length < 6 ) {
            layer.msg('密码忘填或太短（最少6位）');
            return;
        }
        layer.load(1, {shade: 0.5});
        $.ajax({
            type: "POST",
            url: "https://auth.acgdraw.com/login",
            xhrFields: {
                withCredentials: true
            },
            data: {
                username: $("#loginBox-quick #quickLogin-username").val(),
                password: $("#loginBox-quick #quickLogin-password").val(),
                _token: $('meta[name="token"]').attr("content")
            },
            error: function(data)
            {
                layer.msg('登录失败！可能不小心把密码填错了');
                layer.closeAll('loading');
            },
            success: function(data)
            {
                switch(data.code) {
                    case 101: doLoadUserInfo(); window.location.reload(); break;
                    default: layer.msg('登录失败！可能不小心把密码填错了');
                }
                layer.closeAll('loading');
            }
        });
    }
    // If user pressed enter on password then do login
    $('#loginBox-quick #quickLogin-password').keydown(function (event) {
        var keypressed = event.keyCode || event.which;
        if (keypressed == 13) {
            doQuickLogin();
        }
    });
    // Press Login in QuickLogin box
    $("#linkDoQuickLogin").click(function(){
        doQuickLogin();
    });
    // Loading userinfo while page start loading
    doLoadUserInfo();
    // Click out of Header Inner hide it
    $(document).mouseup(function (e) {
        if(window.loginStatus == false) { // If not logged but quick opened then do
            var quicklogin_mouseup = $("#header .main-header .inner");
            if (!quicklogin_mouseup.is(e.target) && quicklogin_mouseup.has(e.target).length === 0) {
                $('#loginBox-logged').hide();
                $('#loginBox-quick').hide();
                $('#loginBox-logout').show();
            }
        }
    });
    // show user's menu
    $("#loginBox-logged").mouseover(function() {
        showUserMenu(false);
    });
    $("#loginBox-logged").mouseleave(function() {
        showUserMenu(true);
    });

    /*
     * FEEDBACK
     * initialing feedback plugin
     */
    $.feedback({
        ajaxURL: 			'/AdFeedback',
        csrfToken:			$('meta[name="token"]').attr("content"),
        html2canvasURL: 	'https://cdn.bootcss.com/html2canvas/0.4.1/html2canvas.min.js',
        postHTML:			false,

        initButtonText: 	'<i class="fa fa-paper-plane" aria-hidden="true"></i><span class="tooltiptext">提意见反馈问题</span>',
        tpl: {
            highlighter:	'<div id="feedback-highlighter"><div class="feedback-logo">提意见反馈问题</div><p>由于萌绘图站本身存在设计上的不足，可能存在部分问题。欢迎吐槽给技术君以便解决这些问题。如果有更好的建议或者想要新的功能或者奇葩的想法也欢迎在这里提出来。</p><button class="feedback-setblackout"><div class="ico"></div><span>遮盖隐私</span></button><label>请先遮盖好自己的隐私内容不给技术君看</label><button class="feedback-sethighlight feedback-active"><div class="ico"></div><span>圈选问题</span></button><label class="lower">请用鼠标圈出有问题的地方（非必要）</label><div class="feedback-buttons"><button class="feedback-next-btn feedback-btn-gray" onclick="window.location.href=\'/feedbackList\'" style="margin-left:15px">反馈列表</button><button id="feedback-highlighter-next" class="feedback-next-btn feedback-btn-blue">下一步</button><button id="feedback-highlighter-back" class="feedback-back-btn feedback-btn-gray">Back</button></div><div class="feedback-wizard-close"></div></div>',
            overview:		'<div id="feedback-overview"><div class="feedback-logo">提意见反馈问题</div><div id="feedback-overview-description"><div id="feedback-overview-description-text"><h3>问题描述或者建议内容</h3><h3 class="feedback-additional">以下信息将会被提交</h3><div id="feedback-additional-none"><span>没有信息被提交</span></div><div id="feedback-browser-info"><span>您的浏览器版本信息</span></div><div id="feedback-page-info"><span>问题网页的信息</span></div><div id="feedback-page-structure"><span>问题网页的源代码</span></div></div></div><div id="feedback-overview-screenshot"><h3>当前问题网页截图</h3></div><div class="feedback-buttons"><button id="feedback-submit" class="feedback-submit-btn feedback-btn-blue">提交反馈</button><button id="feedback-overview-back" class="feedback-back-btn feedback-btn-gray">重新圈选</button></div><div id="feedback-overview-error">还有没有输入问题或者建议内容啦</div><div class="feedback-wizard-close"></div></div>',
            submitSuccess:	'<div id="feedback-submit-success"><div class="feedback-logo">提意见反馈问题</div><p>感谢您的反馈与建议，反馈建议的内容已经提交给技术君，在技术君回复之后反馈内容将会显示在反馈列表中。 <a href="/feedbackList">查看反馈列表</a></p><button class="feedback-close-btn feedback-btn-blue">知道了</button><div class="feedback-wizard-close"></div></div>',
            submitError:	'<div id="feedback-submit-error"><div class="feedback-logo">提意见反馈问题</div><p>抱歉，反馈内容提交到服务器的时候出现了一些问题，烦请重新提交一下，感谢您的理解与支持。</p><button class="feedback-close-btn feedback-btn-blue">知道了</button><div class="feedback-wizard-close"></div></div>'
        },
    });

    /*
     * App Download
     * active "App Download" button
     */
    $('.quick-access').append('<button class="btn-appdown"><font style="font-size:12px">APP</font><span class="tooltiptext">下载手机应用</span></button>');
    $('.btn-appdown').click(function() {
        window.location.href= 'http://233.acgdraw.com/acgdraw_app.htm';
    });

    /*
     * SCROLL TO TOP
     * active "top" button
     */
    $('.quick-access').append('<button class="btn-backtop"><i class="fa fa-angle-up" aria-hidden="true"></i><span class="tooltiptext">回到网页顶部</span></button>');
    $('.btn-backtop').click(function() {
        $("body,html").animate({ scrollTop: 0 }, "slow");
    });

    /*
     * ABUSE MAIL
     * abuse mail render and
     * abuse mail decoder
     */
    // Abuse report email render
    $("#InfringementReport").click(function(){
        $('#abusemail').css('background-color','yellow').delay(1000).promise().done(function(){
            $(this).css('background-color','');
        });
    });
    // Loading Support Mail Address
    $('#abusemail').text($.base64.decode('c3VwcG9ydEBhY2dkcmF3LmNvbQ=='));
    $('#abusemail').attr('href', 'mailto:' + $.base64.decode('c3VwcG9ydEBhY2dkcmF3LmNvbQ=='));
});

/*
 * GeeTest 验证码验证
 */
function checkVerifyCode()
{
    var f1 = $('input[name="geetest_challenge"]').val().length;
    var f2 = $('input[name="geetest_validate"]').val().length;
    var f3 = $('input[name="geetest_seccode"]').val().length;

    if (f1 && f2 && f3)
        return true;

    return false;
}