/*
 * Tiemu System Plugin
 *
 * @Version: 1.0.2018.0224
 * @Author: MoeArt Dev. Team
 *
 * Required:
 *    jQuery          >= 3.1.0
 *    jQuery Toggles  >= 4.0.0
 *    jQuery JAIL     >= 1.0
 *    js.Cookies      >= 2.1.3
 *    Layer UI        >= 2.4
 *    tips.acgdraw    == *
 *    Font Awesome    >= 4.6.3
 *    Moment.js       >= 2.14.1
 *    download.js     >= 1.4.6
 */

(function( $ ){

    /* ------------------------------
     * DEAFULT OPTIONS
     * The default values for tiemu
     * -----------------------------*/
    var settings = ({
        'version'          : '1.0.2018.0224',             // Plugin Version
        'draft_wrapper'    : '.wrap-draft',               // Where to wrap the elements of draft attachments
        'comment_list'     : '.wrap-comment-list',        // Where to wrap the elements of tiemu comments list
        'comment_wrapper'  : '.wrap-comment',             // Which wrapper can be scroll of tiemu comments (used load avatar on demand)
        'draft_panel'      : true,                        // Show the panel with download and report abuse buttons
        'is_login'         : 1,                           // Check user login, 0: Guest, 1: User. guest no tiemu submit

        'tiemu_showtime'   : 5,                           // Tiemu Player defaults
        'tiemu_interval'   : 2,
        'tiemu_opacity'    : 1.0,
        'tiemu_scale'      : 1.0,
        'tiemu_maximum'    : 20,
        'tiemu_switch'     : 'on',

        'attachment_json'  : '',                          // Raw-data of the json contains attachment information
        'avatar_prefix'    : 'http://avatar.acgdraw.com/',// The url prefix of avatar server or oss
        'user_prefix'      : 'http://www.acgdraw.com/u/', // The url prefix of user profile, when click on username jump to
        'csrf_enable'      : true,                        // If framework need csrf verify, try to enable
        'debug_enable'     : true,                        // Debug and logging switch, allow to logging

        'AtchRenderFinish' : function() {},               // Attachment full loaded callback function
    });

    var i18n = ({
        'ln_tiemu_input'   : '贴幕内容',
        'ln_tiemu_submit'  : '贴上',
        'ln_tiemu_failed'  : '贴幕粘贴失败',
        'ln_report_abuse'  : '举报',
        'ln_full_screen'   : '全屏',
        'ln_download'      : '下载',
        'ln_server_err'    : '服务器错误',
        'ln_nologin'       : '请先登录',
        'ln_overmax'       : '未填写或字数受限，请少于',
        'ln_timeshort'     : '贴幕发送过快，请休息 30 秒',
        'ln_showtime'      : '显示时间',
        'ln_interval'      : '显示间隔',
        'ln_opacity'       : '透明度',
        'ln_scale'         : '缩放级别',
        'ln_second'        : '秒',
        'ln_deg'           : '度',
        'ln_times_size'    : '倍',
        'ln_restored'      : '设置已经还原',
        'ln_restore'       : '还原默认设置',
        'ln_option_note'   : '注意：参数修改后将会立即生效',
        'ln_option_title'  : '贴幕设置',
        'ln_load_failed'   : '贴幕加载失败',
        'ln_atch_loading'  : '作品努力加载中',
        'ln_dl_dling'      : '下载中',
        'ln_dl_error'      : '抱歉，作品下载失败请重试',
        'ln_dl_forbidden'  : '抱歉，由于画师设置了画作保护，下载被禁止',
        'ln_like_err'      : '抱歉，赞被点飞了 ……',
        'ln_no_comment'    : '贴幕空空如也<br/>快在作品上点击来一发贴幕吧！',
    });

    var tiemu_showtime, tiemu_interval, tiemu_opacity, tiemu_scale, tiemu_switch;
    var debug_enable, atch_finish, tiemu_object, tiemu_fullscreen;

    var uriPath = window.location.href; // get real url of current page without `/full` or `#`
    if(uriPath.match(/\/full/i)) {
        uriPath = uriPath.substring(0, uriPath.indexOf('/full'));
    }
    if(uriPath.match(/#/i)) {
        uriPath = uriPath.substring(0, uriPath.indexOf('#'));
    }


    /* ------------------------------
     * Tiemu Plugin
     * Global function define
     * -----------------------------*/
    /**
     * Debugger and Logger: Logging all the information to console
     * @param  info           Debug or log message
     * @param  level          Information Level, e.g. Warning or Error
     */
    function debug(info, level) {
        level = typeof level !== 'undefined' ?  level : 'info';

        if(debug_enable) {
            // Timezone convert
            d=new Date();
            localTime = d.getTime();
            localOffset = d.getTimezoneOffset() * 60000;
            utc = localTime + localOffset;
            offset = 8;
            CST = utc + (3600000 * offset);
            dateObj = new Date(CST);

            // Time or date value
            var month = (dateObj.getMonth()+1) < 10 ? '0' + (dateObj.getMonth()+1) : (dateObj.getMonth()+1);
            var day = dateObj.getDate() < 10 ? '0' + dateObj.getDate() : dateObj.getDate();
            var hour = dateObj.getHours() < 10 ? '0' + dateObj.getHours() : dateObj.getHours();
            var min = dateObj.getMinutes() < 10 ? '0' + dateObj.getMinutes() : dateObj.getMinutes();
            var sec = dateObj.getSeconds() < 10 ? '0' + dateObj.getSeconds() : dateObj.getSeconds();

            // Time format
            var dateFormat = month + "/" + day + " " + hour + ":" + min + ":" + sec;
            var infoFormat = "[" + dateFormat + "] " + info;

            switch (level) {
                case 'info': console.log(infoFormat); break;
                case 'succ': console.log('%c' + infoFormat, 'color:#2d9c00'); break;
                case 'warn': console.log('%c' + infoFormat, 'color:#ff7800'); break;
                case 'err': console.log('%c' + infoFormat, 'color:#ff00f5'); break;
                case 'tiemu': console.log('%c' + infoFormat, 'color:#00aafc'); break;
                default: console.log(infoFormat);
            }
        }
    }

    /**
     * Attachment Downloader: Replace browser default download because it does not support HTTP Referer
     * @param url     Attachment original url with token auth
     */
    function atchDownloader(url) {
        debug('[atchDownloader] Attachment downloader loaded');
        var loading = layer.msg(i18n.ln_dl_dling + ' <span class="dl-progress"></span>', {icon:16, time:0, shade:0.5, id:"dl-loading"});
        var xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';

        xhr.onprogress = function(e) {      // while downloading on progress changed
            var progress = (e.loaded / e.total * 100) >> 0;
            $("#dl-loading .dl-progress").text(progress + "%");
        };
        xhr.onreadystatechange = function(){    // while xhr finished succ or err close loading
            if ( xhr.readyState == 4 ) {
                layer.close(loading);

                if( xhr.status != 200 ) {   // if not HTTP 200 means download failed
                    debug('[atchDownloader] Attachment downloader file download failed!', 'err');
                    msgText(i18n.ln_dl_error, "err");
                }
            }
        };
        xhr.onload = function() {       // while file full downloaded
            switch(xhr.getResponseHeader('content-type')) { // do a file ext process
                case 'image/x-windows-bmp':
                case 'image/bmp':       var fileExt = '.bmp';    break;
                case 'image/gif':       var fileExt = '.gif';    break;
                case 'image/x-icon':    var fileExt = '.ico';    break;
                case 'image/pjpeg':
                case 'image/jpeg':      var fileExt = '.jpg';    break;
                case 'image/png':       var fileExt = '.png';    break;
                case 'image/x-tiff':
                case 'image/tiff':      var fileExt = '.tif';    break;
                default:                var fileExt = '.jpg';
            }
            download(xhr.response, $(document).attr('title') + fileExt, xhr.getResponseHeader('content-type')); // save to file
        };

        xhr.open('GET', url);
        xhr.send();
    }

    /**
     * Attachment Render: Rendering all the attachments in the draft wrapper
     * @param  atchData       Attachment raw data (json format)
     */
    function atchRender(atchData) {
        debug('[atchRender] Attachment render start working ...', 'warn');
        var loadCount = 0; // A counter used to count attachment full loaded

        // Attachment Pre-Render: Pre-Rendering create the wrapper of attachments
        for ( key in atchData ) {

            debug('[atchRender] Pre-rendering attachment ' + key);
            if(settings.draft_panel) {
                var renderFormat = $(' \
                    <div class="tiemu-attachment" data-key="' + key + '" data-url="' + atchData[key] + '"> \
                        <div class="tiemu-attachment-panel"> \
                            <i class="fa fa-download" aria-hidden="true" title="' + i18n.ln_download + '"></i><br/> \
                            <i class="fa fa-exclamation-triangle" aria-hidden="true" title="' + i18n.ln_report_abuse + '"></i> \
                        </div> \
                        <div class="tiemu-attachment-placeholder">' + i18n.ln_atch_loading + '</div>\
                    </div> \
                ');
            } else {
                debug('[atchRender] Attachment panel disabled for ' + key, 'err');
                var renderFormat = $(' \
                    <div class="tiemu-attachment" data-key="' + key + '" data-url="' + atchData[key] + '"> \
                    </div> \
                ');
            }

            // If not fullscreen to Insert fullscreen sign
            if(!tiemu_fullscreen) {
                $('.tiemu-attachment-panel', renderFormat).prepend('<i class="fa fa-arrows-alt" aria-hidden="true"  title="' + i18n.ln_full_screen + '" onclick="window.location.href = window.location.href + \'/full#' + key + '\'"></i><br/>');
            }

            // Download attachment event
            $('.fa-download', renderFormat).click(function() {
                var url = uriPath + "/" + $(this).parent().parent().attr('data-key') + "/Download";
                var data = {    // Initize data object
                };
                if(settings.csrf_enable) {   // If csrf enabled insert csrf token
                    data['_token'] = $('meta[name="_token"]').attr('content');
                }

                $.ajax({
                    type: "POST",
                    url: url,
                    data: data,
                    error: function(data)			// Server failed
                    {
                        msgText(i18n.ln_server_err, 'err');
                    },
                    success: function(data)			// Init data from server
                    {
                        switch(data.code) {
                            case 320: atchDownloader(data.authUrl); break;
                            case 321: msgText(i18n.ln_dl_forbidden, 'err'); break;
                            case 105: msgText(i18n.ln_nologin, 'err'); break;
                            default: msgText(i18n.ln_server_err, 'err');
                        }
                    }
                });
            });

            // Start pre-rendering
            var canvasObj = $('<canvas></canvas>'); // Initize a new canvas
            canvasObj.click(function(e) {$.tiemu('new', e)}); // Click event for create a new tiemu canvas
            canvasObj.bind("contextmenu",function(e){return false;}); // Disallow context Menu on canvas (disallow download)
            renderFormat.append(canvasObj); // Append canvas object into wrapper
            $(settings.draft_wrapper).append(renderFormat); // Rendering the attachment wrapper

            loadCount++; // Create a new div to count plus

        }

        // Attachment Post-Render: Post-Rendering attachment images data into canvas.
        $(settings.draft_wrapper + ' .tiemu-attachment').each(function() {

            var wrap = $(this);
            var holder = $('.tiemu-attachment-placeholder', this);
            var url = $(this).attr('data-url');
            var id = $(this).attr('id');
            var key = $(this).attr('data-key');
            var canvas = $(this).find("canvas")[0];
            var ctx = canvas.getContext("2d");
            var img = new Image;
            var xWidth,xHeight;
            var wait;

            img.onload = function() {
                debug('[atchRender] Post-rendering attachment ' + key);

                // If in fullscreen mode and size over screen width to adjust it.
                if(tiemu_fullscreen && img.width > window.screen.availWidth * 0.9) {
                    xWidth = window.screen.availWidth * 0.9;
                    xHeight = (xWidth / img.width) * img.height;
                } else {
                    if (img.width > 780) {
                        xWidth = 780;
                        xHeight = (xWidth / img.width) * img.height;
                    } else {
                        xWidth = img.width;
                        xHeight = img.height;
                    }
                }

                // FIXED: White Screen in Lower speed Network
                // Caused by: after images load will do `wait` one more time to break images
                clearInterval(wait);
                if(wrap.css('width') == "0px" || wrap.css('height') == "0px") {
                    wrap.css('width', xWidth);  // Setting up wrapper size
                    wrap.css('height', xHeight);
                    canvas.width = xWidth;  // Setting up canvas size
                    canvas.height = xHeight;
                }

                ctx.drawImage(this, 0, 0, xWidth, xHeight);
                holder.fadeOut('fast').delay(100).promise().done(function(){ // 100ms to wait animation finish
                    $(this).remove();   // remove Placeholder while loading finished
                });

                wrap.removeAttr('data-url');

                if (--loadCount == 0) { // When an attachment loaded minus, when 0 means full loaded
                    debug('[atchRender] Render task finished, do a callback', 'err');
                    settings.AtchRenderFinish.call('ads'); // Full loaded do a callback
                    atch_finish = 'finish'; // set a global to check atch is full loaded?
                }
            };
            img.src = url;

            // Preload image with a placeholder
            wait = setInterval(function() {
                var w = img.naturalWidth,
                    h = img.naturalHeight;
                if (w && h) {
                    clearInterval(wait);

                    if(tiemu_fullscreen && w > window.screen.availWidth * 0.9) {
                        var xWidth = window.screen.availWidth * 0.9;
                        var xHeight = (xWidth / w) * h;
                    } else {
                        if (img.width > 780) {
                            var xWidth = 780;
                            var xHeight = (xWidth / w) * h;
                        } else {
                            var xWidth = w;
                            var xHeight = h;
                        }
                    }

                    wrap.css('width', xWidth);  // Setting up wrapper size
                    wrap.css('height', xHeight);
                    canvas.width = xWidth;  // Setting up canvas size
                    canvas.height = xHeight;
                    holder.css('width', xWidth);    // Setting up Placeholder size
                    holder.css('height', xHeight);
                    holder.css('line-height', xHeight + "px");
                    holder.show();  // show placeholder when loading
                }
            }, 30);

        });
    }

    /**
     * Tiemu Render: Rendering all tiemus on the draft wrapper
     * @param  content      Tiemu message content
     * @param  atchKey      Which attachment hold this tiemu
     * @param  tiemuId      ID of this tiemu message
     * @param  vpos         Vertical position offset
     * @param  hpos         Horizontal position offset
     */
    function tiemuRender(content, atchKey, tiemuId, vpos, hpos) {
        debug('[tiemuRender] Rendering tiemu ' + tiemuId + ' on attachment ' + atchKey + ' (v:' + vpos + ', h:' + hpos + ')', 'tiemu');

        var renderFormat = " \
            <div class='tiemu-item' data-id='" + tiemuId +"' style='top: " + vpos + "%; left: " + hpos + "%; transform:scale(" + settings.tiemu_scale + ")'> \
                <div class='tiemu-item-dot'></div> \
                <div class='tiemu-item-arrow'></div> \
                <div class='tiemu-item-content'>" + content + "</div> \
            </div> \
        ";
        $('.tiemu-attachment[data-key="' + atchKey + '"] canvas').before(renderFormat);

        // If fullscreen mode to expend scale level
        if(tiemu_fullscreen) {
            xScale = tiemu_scale * 1.2;
        } else {
            xScale = tiemu_scale;
        }

        // Show tiemu with animation
        $('.tiemu-item[data-id="' + tiemuId + '"]').css('margin-left', "50px");
        setTimeout(function() {
            $('.tiemu-item[data-id="' + tiemuId + '"]').css('display', "table").css('margin-left', "0").css('opacity', tiemu_opacity).css('transform', "scale(" + xScale + ")");

            // Destory timeout tiemu on wrapper
            setTimeout(function() {
                $('.tiemu-item[data-id="' + tiemuId + '"]').css('opacity', "0").css('margin-left', "-20px")
                    .delay(100).promise().done(function(){ // 100ms to wait animation finish
                        $(this).remove();
                        debug('[tiemuRender] Destoried tiemu ' + tiemuId + ' on attachment ' + atchKey, 'warn');
                    });
            }, tiemu_showtime*1000);
        }, 100);
    }

    /**
     * Tiemu Launcher: Launch a new tiemu when click on attachment
     * @param  atchKey      Which attachment hold this tiemu
     * @param  vpos         Vertical position offset
     * @param  hpos         Horizontal position offset
     */
    function tiemuLancher(atchKey, vpos, hpos) {
        debug('[tiemuLauncher] Launch new tiemu on attachment ' + atchKey + ' (v:' + vpos + ', h:' + hpos + ')', 'tiemu');

        var renderFormat = $(" \
            <div class='tiemu-new' style='top: " + vpos + "%; left: " + hpos + "%;'> \
                <div class='tiemu-item-dot' onclick='$(this).parent().remove()'></div> \
                <div class='tiemu-item-arrow'></div> \
                <div class='tiemu-item-content'> \
                    <input type='hidden' name='atchKey' value='" + atchKey + "' /> \
                    <input type='hidden' name='position' value='" + vpos + "," + hpos + "' /> \
                    <input type='text' name='tiemu' placeholder='" + i18n.ln_tiemu_input + "' /> \
                    <button type='button' onclick='$.tiemu(\"post\", $(this).parent().parent())'>" + i18n.ln_tiemu_submit + "</button> \
                </div> \
            </div> \
        ");
        $('.tiemu-new').css('opacity', "0").delay(100).promise().done(function(){ // Hide add remove olds
            $(this).remove();
        });
        $('.tiemu-attachment[data-key="' + atchKey + '"] canvas').before(renderFormat); // append to wrapper

        // Show tiemu with animation
        setTimeout(function() {
            $('.tiemu-new').css('transform', "scale(1)").css('transform', "rotateY(0deg)");
        }, 100);
        $('input[name="tiemu"]', renderFormat).focus(); // set focus on input box
        $('input[name="tiemu"]', renderFormat).keypress(function(event){    // set enter key as submit hotkey
            if(event.keyCode == 13){
                $('button', renderFormat).click();
            }
        });
    }

    /**
     * Comment Render: Render a new comment in the comment wrapper
     * @param  tiemu        Tiemu Content
     * @param  tiemuId      Tiemu ID of current tiemu
     * @param  likeNum      How many people liked this tiemu
     * @param  ynLike       Is you liked it?
     * @param  vpos         Vertical position offset
     * @param  hpos         Horizontal position offset
     * @param  atchKey      Which attachment hold this tiemu
     * @param  username     Who posted this tiemu
     * @param  avatar       Avatar of the person Who posted this tiemu
     * @param  uid          UserID of the person Who posted this tiemu
     */
    function commentRender(tiemu, tiemuId, likeNum, ynLike, vpos, hpos, atchKey, username, avatar, uid) {
        debug('[commentRender] Rendering new comment in wrapper ' + atchKey + ' (v:' + vpos + ', h:' + hpos + ')');

        if ($(".no-comment", settings.comment_list).length !== 0){ // if no comment notice exist remove it
            $(".no-comment", settings.comment_list).remove();
        }

        var renderFormat = $(" \
            <div class='elm-comment' data-tiemuId='" + tiemuId + "' data-atchKey='" + atchKey + "' data-vpos='" + vpos + "' data-hpos='" + hpos + "'> \
                <div class='layout-avatar'> \
                    <div class='like" + (ynLike ? " liked" : "") + "'>+" + likeNum + "</div> \
                    <div class='add-mask'>+1</div> \
                    <img class='lazy' src='/img/null.gif' data-src='" + settings.avatar_prefix + avatar + "' width='80' height='80'/> \
                </div> \
                <div class='layout-comment-text'> \
                    <span class='elm-username'><a href='" + settings.user_prefix + uid + "' target='_blank'>" + username + "</a></span> \
                    <p>" + tiemu + "<span class='elm-abuse'>(" + i18n.ln_report_abuse + ")</span></p> \
                </div> \
            </div> \
        ");

        // If has people liked it show num else hide
        if(likeNum > 0) {
            $(".like", renderFormat).css('opacity','1');
        }

        // Like click event
        $(".like", renderFormat).click(function() {
            // If no tiemu-id tell user failed.
            if($(this).parent().parent().attr('data-tiemuId') == "undefined") {
                msgText(i18n.ln_like_err, 'err');
                return ;
            }

            var url = uriPath + "/tiemu/good" + $(this).parent().parent().attr('data-tiemuId');
            var data = {};    // Initize data object
            if(settings.csrf_enable) {   // If csrf enabled insert csrf token
                data['_token'] = $('meta[name="_token"]').attr('content');
            }
            var likeIcon = $(this);
            var addMask = $(".add-mask", $(this).parent());
            $.ajax({
                type: "POST",
                url: url,
                data: data,
                error: function(data)
                {
                    debug('[tiemuLoader] Tiemu load failed!', 'err');
                    msgText(i18n.ln_load_failed, 'err');
                },
                success: function(data)
                {
                   switch(data.code) {
                       case 105:    // no login
                           msgText(i18n.ln_nologin, 'err');
                           break;

                       case 411:    // Added
                           // To change num
                           likeIcon.text("+" + data.tiemuGood.good);
                           likeIcon.addClass("liked");
                           likeIcon.css('opacity','1');

                           // animation for +1 mask
                           addMask.text("+1");
                           addMask.css('color','red');
                           addMask.show().delay(300).promise().done(function(){ // 100ms to wait animation finish
                               addMask.css('margin-top','-20px');
                               addMask.css('opacity','1');
                               setTimeout(function() {addMask.css('opacity','0')}, 400);
                               setTimeout(function() {addMask.css('margin-top','0').hide()}, 500);
                           });
                           break;

                       case 413:  // canceled
                           // To change num
                           likeIcon.text("+" + data.tiemuGood.good);
                           likeIcon.removeClass("liked");
                           if(data.tiemuGood.good == 0) // If num eq 0, hide me
                               likeIcon.css('opacity','');
                           else
                               likeIcon.css('opacity','1');

                           // animation for +1 mask
                           addMask.text("-1");
                           addMask.css('color','blue');
                           addMask.show().delay(300).promise().done(function(){ // 100ms to wait animation finish
                               addMask.css('margin-top','-20px');
                               addMask.css('opacity','1');
                               setTimeout(function() {addMask.css('opacity','0')}, 400);
                               setTimeout(function() {addMask.css('margin-top','0').hide()}, 500);
                           });
                           break;

                       case 410:
                           msgText(i18n.ln_like_err, 'err');
                           break;

                       default:
                           msgText(i18n.ln_server_err, 'err');
                   }
                }
            });
        });

        // Click event for map the current tieme to wrapper
        $("p", renderFormat).click(function(e) {
            $('html, body').animate({
                scrollTop: $('.tiemu-attachment[data-key="' + atchKey + '"]').offset().top - 50 // scroll to attchment
            }, 500);
            setTimeout(function() {
                tiemuRender(tiemu, atchKey, tiemuId, vpos, hpos);  // rendering tiemu
                $('.tiemu-item[data-id="' + tiemuId + '"]').css('border', '2px solid #FF65B5'); // setting up highlight on tiemu
            }, 500);

        });
        renderFormat.hide().fadeIn('fast'); // animation
        $(settings.comment_list).append(renderFormat);   // Rendering comment item

    }

    /**
     * Tiemu Player: Loop play the tiemu on the draft wrapper
     * @param o         The tiemu object
     */
    function tiemuPlayer ( o ) {
        if(typeof(o) !== 'object' || o.length == 0) {
            debug('[tiemuPlayer] Tiemu Player engine shutdown, because no tiemu.', 'err');
            return;
        }
        var index = 0; // initize object pointer

        var player = function() {
            clearInterval(interval);

            if(tiemu_switch == 'on') { // If tiemu switch off , do nothing
                tiemuRender(    // Rendering tiemu in a loop
                    o[index].content,
                    o[index].Key,
                    o[index].ComId,
                    o[index].position.split(',')[0],
                    o[index].position.split(',')[1]
                );
            }

            index++;
            if(index == o.length) { // reset object pointer to zero
                index = 0;
            }

            if(tiemu_switch == 'on')    // If tie switch off dont spawn engine

                // If tiemu count less than (display mod interval) change interval time
                // Fixed: only one tiemu will show three tiemus with overlapping.
                if ( o.length < (tiemu_showtime/tiemu_interval) + 1 )
                    interval = setInterval(player, (tiemu_showtime*1+tiemu_interval*1) * 1000);
                else
                    interval = setInterval(player, tiemu_interval * 1000);
            else
                debug('[tiemuPlayer] Tiemu Player engine shutdown.', 'err');
        };

        var interval = setInterval(player, tiemu_interval * 1000);
        debug('[tiemuPlayer] Tiemu Player engine started.', 'warn');
    }

    /**
     * Tiemu Loader: Load the tiemu json from server and starting render
     */
    function tiemuLoader() {
        var url = uriPath + "/tiemu/get";
        $.ajax({
            type: "GET",
            url: url,
            error: function(data)
            {
                debug('[tiemuLoader] Tiemu load failed!', 'err');
                msgText(i18n.ln_load_failed, 'err');
            },
            success: function(data)
            {
                debug('[tiemuLoader] Tiemu load successfully!', 'succ');
                tiemu_object = data.tiemu; // storage all the tiemus at memory

                if (tiemu_object.length === 0) { // no comment tips
                    $(settings.comment_list).append('<div class="no-comment">'+i18n.ln_no_comment+'</div>');
                }

                for ( key in tiemu_object ) {   // Render Comments in the comment wrapper
                    commentRender(
                        tiemu_object[key].content,
                        tiemu_object[key].ComId,
                        tiemu_object[key].good,
                        tiemu_object[key].YNgood,
                        tiemu_object[key].position.split(',')[0],
                        tiemu_object[key].position.split(',')[1],
                        tiemu_object[key].Key,
                        tiemu_object[key].UName,
                        tiemu_object[key].UHead,
                        tiemu_object[key].UId
                    );
                }
                // wait all attachment load then start player
                var playerWait = setInterval(function() {
                    if(atch_finish === 'finish') {
                        clearInterval(playerWait)
                        tiemuPlayer(tiemu_object);      //  Starting up tiemu
                    }
                }, 30);

                $(function(){   // Load avatar on demand via JAIL plugin
                    $('img.lazy').jail({
                        triggerElement:settings.comment_wrapper, // scrollable wrapper
                        event: 'scroll'
                    });
                });
            }
        });
    }

    /**
     * Custom option: control panel
     */
    function customOption() {
        layer.open({
            type: 1,
            id: 'tiemuOptionBox',
            title: i18n.ln_option_title,
            skin: 'layui-layer-rim',
            area: ['420px', '245px'],
            shade: 0,
            offset: 'rb',
            content: '<div class="tiemu-option">\
                <div data-option="tiemu_showtime">\
                    <label>' + i18n.ln_showtime + '</label>\
                    <input type="range" min="0.5" max="10" step="0.1" value="' + tiemu_showtime + '">\
                    <label class="value">' + tiemu_showtime + '</label>\
                    <label> ' + i18n.ln_second + '</label>\
                </div>\
                <div data-option="tiemu_interval">\
                    <label>' + i18n.ln_interval + '</label>\
                    <input type="range" min="0.5" max="10" step="0.1" value="' + tiemu_interval + '">\
                    <label class="value">' + tiemu_interval + '</label>\
                    <label> ' + i18n.ln_second + '</label>\
                </div>\
                <div data-option="tiemu_opacity">\
                    <label>' + i18n.ln_opacity + '</label>\
                    <input type="range" min="0.1" max="1" step="0.1" value="' + tiemu_opacity + '">\
                    <label class="value">' + tiemu_opacity + '</label>\
                    <label> ' + i18n.ln_deg + '</label>\
                </div>\
                <div data-option="tiemu_scale">\
                    <label>' + i18n.ln_scale + '</label>\
                    <input type="range" min="0.5" max="3" step="0.1" value="' + tiemu_scale + '">\
                    <label class="value">' + tiemu_scale + '</label>\
                    <label> ' + i18n.ln_times_size + '</label>\
                </div>\
                <p>' + i18n.ln_option_note + ' <a>(' + i18n.ln_restore + ')</a></p>\
            </div>\
            <script>\
                $(".tiemu-option input[type=\'range\']").on("input", function() { \
                    $(".value", $(this).parent()).text($(this).val()); \
                    Cookies.set($(this).parent().attr(\'data-option\'), $(this).val());\
                    $.tiemu("cookiesync");\
                });\
                $(".tiemu-option p a").click(function() {\
                    $.tiemu("cookiesync", "flush");\
                    layer.closeAll("page");\
                    msgText("' + i18n.ln_restored + '", "succ");\
                });\
            </script>\
            ',
        });
    }



    ////////////////////////////////////////////////////////////////////
    //                                  ______
    //     ____ _  _____   ____ _  ____/ /   _____  ____ _ _      ____
    //   / __ `/ / ___/  / __ `/ / __  /   / ___/ / __ `/| | /| / /
    //  / /_/ / / /__   / /_/ / / /_/ /   / /    / /_/ / | |/ |/ /
    //  \__,_/  \___/   \__, /  \__,_/   /_/     \__,_/  |__/|__/
    //                 /____/
    //
    ////////////////////////////////////////////////////////////////////

    /* ------------------------------
     * Tiemu Plugin
     * Global Method
     * -----------------------------*/
    var methods = {

        // System Initization
        init : function( options, language ) {
            //EXTEND DEAFULT OPTIONS
            $.extend(settings, options);
            $.extend(i18n, language);

            // System loaded information
            console.log('%cTiemu system started!\t(verson ' + settings.version + ')\n\
     _____ _                  _____         _             \n\
    |_   _|_|___ _____ _ _   |   __|_ _ ___| |_ ___ _____ \n\
      | | | | -_|     | | |  |__   | | |_ -|  _| -_|     |\n\
      |_| |_|___|_|_|_|___|  |_____|_  |___|_| |___|_|_|_|\n\
                                   |___|                  \n\
             ','color:#ff65b5');

            // Something Funny ^o^
            if(!window.location.href.match(/acgdraw/i)){
                debug('[FATAL] Unknown error: 0x0066ccff.', 'err');
                $.tiemu('koekoekoe');
            }

            // INITIZATION DEBUG SWITCH
            tiemu_debug = Cookies.get('tiemu_debug');
            if(typeof tiemu_debug !== 'undefined') {
                if(tiemu_debug == 'true')
                    debug_enable = true;
                else
                    debug_enable = false;
            } else {
                debug_enable = settings.debug_enable;
            }

            // INITIZATION GLOBAL OPTIONS
            $.tiemu('cookiesync');

            // Decision current page in fullscreen mode
            if($('meta[name="fullscreen"]').attr('content') === "true"){
                debug('[System] Detected in fullscreen mode', 'warn');
                tiemu_fullscreen = true;
            } else {
                debug('[System] Detected not in fullscreen mode');
                tiemu_fullscreen = false;
            }

            /*
             * TIEMU LOADER
             * Load attachment from json and create canvas for draft
             */
            debug('[tiemuLoader] Tiemu Loader start working ...', 'warn');
            tiemuLoader();

            // Rendering for attachments in Tiemu draft wrapper
            var atchData = JSON.parse(settings.attachment_json);
            atchRender(atchData);

            $(function(){
                $('img.lazy').jail();
            });

            /*
             * EVENT LISTENER
             * Bind event to the external elements
             */
            // Open tiemu option when gear clicked
            $('.tiemu-gear').click(function () {
                customOption();
            });
            // Initiza Tiemu switcher
            switch(tiemu_switch) {
                case 'on': $('.tiemu-switch').toggles({on: true}); break;
                default: $('.tiemu-switch').toggles({on: false}); break;
            }
            // Tiemu Switch event when changed
            $('.tiemu-switch').on('toggle', function(e, active) {
                if (active) {
                    Cookies.set("tiemu_switch", "on");
                    $.tiemu("cookiesync");
                    tiemuPlayer(tiemu_object); // starting up tiemu player engine
                } else {
                    Cookies.set("tiemu_switch", "off");
                    $.tiemu("cookiesync");
                }
            });
            // Click out of wrapper desctory tiemu launcher
            $(document).mouseup(function (e) {
                var container = $(".tiemu-new");

                if (!container.is(e.target) // if the target of the click isn't the container...
                    && container.has(e.target).length === 0) // ... nor a descendant of the container
                {
                    container.remove();
                }
            });
        },

        // Sync the cookies to global vars.
        cookiesync : function( flush ) {

            if ( flush == 'flush' ) {
                Cookies.remove("tiemu_showtime");
                Cookies.remove("tiemu_interval");
                Cookies.remove("tiemu_opacity");
                Cookies.remove("tiemu_scale");
                Cookies.remove("tiemu_switch");
            }
            tiemu_showtime = typeof Cookies.get('tiemu_showtime') !== 'undefined' ?  Cookies.get('tiemu_showtime') : settings.tiemu_showtime;
            tiemu_interval = typeof Cookies.get('tiemu_interval') !== 'undefined' ?  Cookies.get('tiemu_interval') : settings.tiemu_interval;
            tiemu_opacity = typeof Cookies.get('tiemu_opacity') !== 'undefined' ?  Cookies.get('tiemu_opacity') : settings.tiemu_opacity;
            tiemu_scale = typeof Cookies.get('tiemu_scale') !== 'undefined' ?  Cookies.get('tiemu_scale') : settings.tiemu_scale;
            tiemu_switch = typeof Cookies.get('tiemu_switch') !== 'undefined' ?  Cookies.get('tiemu_switch') : settings.tiemu_switch;
            debug('[cookieSync] Tiemu setting cookies sync success!', 'succ');

        },

        /**
         * Create a new Tiemu Launcher instant
         * @param e     The element who started tiemu launcher
         */
        new : function( e ) {
            /**
             *  Position Fix Note:
             *  The `vpos` or `hpos` has both minus a number, It's will Let position more accurate.
             *  VPOS minus a number is the half height of Tiemu Tag.
             *  HPOD minus a number is the half width of the dot in Tiemu Tag.
             */

            var atchKey = e.currentTarget.offsetParent.attributes['data-key'].nodeValue;
            var vpos = ((e.offsetY / e.currentTarget.clientHeight * 100) - (10 /e.currentTarget.clientHeight * 100)).toFixed(5);
            var hpos = ((e.offsetX / e.currentTarget.clientWidth * 100) - (5 /e.currentTarget.clientWidth * 100)).toFixed(5);

            tiemuLancher(atchKey, vpos, hpos);
        },

        /**
         * Posting new tienu content to server side
         * @param e     The element which tiemu launcher called this
         */
        post : function ( e ) {
            debug('[tiemuLancher] Tiemu Launcher Initialized.');

            // If not login disallowed to submit tiemu
            if(settings.is_login == 0) {
                e.remove(); // remove tiemu launcher
                debug('[tiemuLancher] Tiemu Launcher exited, because no login', 'err');
                msgText(i18n.ln_nologin, 'err');
                return;
            }

            // If more than tiemu_maximum return fail
            if( $('input[name="tiemu"]', e).val().length < 1 || $('input[name="tiemu"]', e).val().length > settings.tiemu_maximum) {
                debug('[tiemuLancher] Tiemu Launcher exited, because tiemu less than 1 or more than maximum', 'err');
                msgText(i18n.ln_overmax + ' ' + settings.tiemu_maximum, 'err');
                return;
            }

            var atchKey = $('input[name="atchKey"]', e).val();
            var position = $('input[name="position"]', e).val();
            var tiemu = $('input[name="tiemu"]', e).val();
            var url = uriPath + "/tiemu/post";
            var data = {    // Initize data object
                atchKey: atchKey,
                position: position,
                tiemu: tiemu
            };
            if(settings.csrf_enable) {   // If csrf enabled insert csrf token
                data['_token'] = $('meta[name="_token"]').attr('content');
            }

            e.remove(); // remove tiemu launcher

            $.ajax({
                type: "POST",
                url: url,
                data: data,
                error: function(data)			// Server failed
                {
                    debug('[tiemuLancher] Tiemu launch failed!', 'err');
                    msgText(i18n.ln_server_err, 'err');
                },
                success: function(data)			// Init data from server
                {
                    switch(data.code) {
                        case 311:   // success
                            debug('[tiemuLancher] Tiemu launched on attachment ' + atchKey + ' at ' + position + ' success!', 'tiemu');

                            // Render tiemu to wrapper and comment list
                            var posObj = position.split(',');   // do a process for position
                            tiemuRender(tiemu, atchKey, data.ComId, posObj[0], posObj[1]);  // rendering tiemu
                            commentRender(tiemu, data.ComId, 0, 0, posObj[0], posObj[1], atchKey, data.name, data.head, data.UId); // rendering comment

                            // Append tiemu to global object
                            tiemu_object.push({
                                ComId:data.ComId,
                                Key:atchKey,
                                UHead:data.head,
                                UId:data.UId,
                                UName:data.name,
                                YNgood:false,
                                content:tiemu,
                                good:0,
                                position:position,
                                time:moment().format('YYYY-MM-DD HH:mm:ss')
                            });

                            // Updating avatar force
                            $(function(){   // Load avatar immediately
                                var currentAvatar =  $('.elm-comment[data-tiemuId="' + data.ComId + '"] img.lazy');
                                currentAvatar.attr("src", currentAvatar.attr('data-src'));
                            });
                            break;

                        case 312:   // content length not matched
                            debug('[tiemuLancher] Tiemu content length not matched!', 'err');
                            msgText(i18n.ln_overmax + ' ' + settings.tiemu_maximum, 'err');
                            break;

                        case 313:   // time interval too short
                            debug('[tiemuLancher] Tiemu send interval too short!', 'err');
                            msgText(i18n.ln_timeshort, 'err');
                            break;

                        case 105:   // no login
                            debug('[tiemuLancher] Tiemu Launcher exited, because no login', 'err');
                            msgText(i18n.ln_nologin, 'err');
                            break;

                        case 310:
                        default:    // failed
                            debug('[tiemuLancher] Tiemu launch failed!', 'err');
                            msgText(i18n.ln_tiemu_failed, 'err');
                            break;
                    }
                }
            });
        },

        // Debug Switch
        debug: function( sw ) {

            switch( sw ) {
                case 'on': debug_enable = true; return 'Debug mode is on'; break;
                case 'off': debug_enable = false; return 'Debug mode is off'; break;
                default: return 'What are you doing?';
            }

        },

        koekoekoe: function() {
            var koekoekoe = $(' \
                <style> \
                    #koekoekoe {display: none;} \
                    #bluescreen  {font-family: \'Lucida Console\'; width: 770px; padding-top: 20px; height: 480px; background: #010080; color: white; cursor: none; font-size: 12px; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -o-user-select: none; user-select: none;} \
                    #bluescreen p {margin-bottom: 12px;} \
                    :-webkit-full-screen {display: block !important;} \
                    :-moz-full-screen {display: block !important;} \
                    :full-screen {display: block !important;} \
                    :-moz-full-screen #bluescreen {position: absolute; left: 50%; top: 50%; margin-left: -320px;} \
                </style> \
                <div id="koekoekoe"> \
                    <div id="bluescreen"> \
                        <p>A problem has been detected and browser has been go fullscreen to prevent<br /> \
                            damage to your computer.</p> \
                        <p>ACGDRAW_IS_NOT_FOUND_POI</p> \
                        <p>If this is the first time you\'ve seen this stop error screen,<br /> \
                            restart your computer. If this screen appears again, follow these steps:</p> \
                        <p>Check to make sure any new hardware or software is properly installed.<br /> \
                            If this is a new installation, ask your hardware or software manufacturer<br /> \
                            for any updates you might need.</p> \
                        <p>If problems continue disable or remove any newly installed hardware<br /> \
                            or software. Disable BIOS memory options such as caching or shadowing.<br /> \
                            If you need to use Safe Mode to remove or disable components, restart<br /> \
                            your computer, press F8 to select Advanced Startup Options, and then <br />select Safe Mode.</p> \
                        <p>Or just press Esc or F11.</p> \
                        <p>Technical information: <br /><br /> \
                            *** STOP: 0x0066CCFF (0x0066CCFF, 0x0066CCFF, 0x0066CCFF, 0x0066CCFF)<br /></p><br /> \
                        <p>*** &nbsp;ACGDRAW.SYS - Address FF66CCFF base at FF66CCFF, DateStamp 0066ccff</p>\
                    </div> \
                </div> \
            ');
            $('html').append(koekoekoe);

            var target = document;
            target.addEventListener("click", function(event){
                if(fullscreen.webkitRequestFullScreen)
                    fullscreen.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
                else if(fullscreen.mozRequestFullScreen)
                    fullscreen.mozRequestFullScreen();
                else
                    fullscreen.requestFullScreen();
            }, false);

            var bluescreen = document.getElementById('bluescreen'),
            fullscreen = document.getElementById('koekoekoe'),
                isFs = false,
                notSupportFullscreenAPI = !fullscreen.webkitRequestFullScreen && !fullscreen.mozRequestFullScreen && !fullscreen.requestFullScreen;

            if(notSupportFullscreenAPI){
                document.getElementById('click').innerHTML = 'Your browser does not support full screen API.';
                document.getElementById('owata').innerHTML = "／^o^＼";
            }else{
                var screenRatio = screen.width/screen.height;
                bluescreen.style.height = 770/screenRatio+'px';
                if(fullscreen.mozRequestFullScreen)
                    bluescreen.style.marginTop = '-'+(770/screenRatio/2)+'px';
                var widthRatio = screen.width/770;
                var heightRatio = screen.height/(770/screenRatio);

                var fsChange = function(event){
                    if(!isFs){
                        bluescreen.style.WebkitTransform = 'scale('+widthRatio+')';
                        bluescreen.style.MozTransform = 'scale('+widthRatio+')';
                        bluescreen.style.Transform = 'scale('+widthRatio+')';
                    }
                    isFs = isFs ? false : true;
                };

                fullscreen.onwebkitfullscreenchange = fsChange;
                fullscreen.onmozfullscreenchange = fsChange;
                fullscreen.onfullscreenchange = fsChange;
            }
        }
    };

    $.tiemu = function( method ) {

        // Method calling logic
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on tiemu plugin' );
        }

    };

})( jQuery );
