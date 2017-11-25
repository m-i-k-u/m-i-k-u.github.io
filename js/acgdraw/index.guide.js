$(function(){
    // Set cookies
    function setCookie(key, value) {
        var expires = new Date();
        expires.setTime(expires.getTime() + (365 * 24 * 60 * 60 * 1000)); // Block Welcome 365 days
        document.cookie = key + '=' + value + ';expires=' + expires.toUTCString();
    }
    // Get cookies
    function getCookie(key) {
        var keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
        return keyValue ? keyValue[2] : null;
    }

    // Show Newer's Guide
    function showGuide() {
        if(getCookie('MOEART_GUIDE_BLOCK') === 'yes')  return ; // fix first finish guide resize window will replay guide.

        // HTML Div Template
        var padding = (document.body.clientWidth - 1245)/2;
        var renderFmt = $('<div id="MAGUIDE" style="min-width:1265px;width:100%;overflow:hidden;position:absolute;z-index:9999;cursor:pointer;"> \
            <div style="float:left;width:'+padding+'px;height:1247px;background:rgba(0,0,0,0.72)"></div> \
            <div style="float:left;width:1245px;height:1247px;"> \
                <div style="float:left;width:1245px;height:2px;background:rgba(0,0,0,0.72)"></div>\
                <div style="float:left;width:1245px;height:1245px;position: relative;"> \
                    <img src="/img/guide/'+window.guidestep+'.png" width="1245px" height="1245px"/> \
                    <div class="btn-guide-skip" style="cursor:pointer; position: absolute;top: 25px;color: #FFFFFF;font-size: 1.2em;border: 1px solid #FFFFFF;padding: 8px 20px;border-radius: 5px;right: 20px;">跳过</div> \
                </div> \
            </div> \
            <div style="float:left;width:'+padding+'px;height:1247px;background:rgba(0,0,0,0.72)"></div> \
            <div style="float:left;width:100%;height:1245px;background:rgba(0,0,0,0.72)"></div> \
        </div>');

        // If not the first step, once guide reload, plz donot using FADE.
        if (window.guidestep == 0)
            renderFmt.hide().delay(200).promise().done(function(){
                $(this).fadeIn('slow');
            });
        else
            renderFmt.show();
        $('body').prepend(renderFmt); // Prepend to the body area.

        // If user click skip button skip this
        $(".btn-guide-skip", renderFmt).click(function () {
            window.guidestep = 999; // set a number big than guide step
        });

        // When user click on the guide, play the next page.
        renderFmt.click(function(){
            window.guidestep++;
            if (window.guidestep <= 9)
            {
                if (window.guidestep == 9)
                    $("img", this).attr("src", "https://m-i-k-u.github.io/img/guide/9.png"); // switch guide pictures
                else
                    $("img", this).attr("src", "/img/guide/" + window.guidestep + ".png"); // switch guide pictures
            }
            $(".btn-guide-skip", renderFmt).hide(); // hide skip button
            switch(window.guidestep) {
                case 1: $("body,html").animate({ scrollTop: 0 }, "fast"); break;
                case 2: $("body,html").animate({ scrollTop: 0 }, "fast"); break;
                case 3: $("body,html").animate({ scrollTop: 0 }, "fast"); break;
                case 4: $("body,html").animate({ scrollTop: 0 }, "fast"); break;
                case 5: $("body,html").animate({ scrollTop: 0 }, "fast"); break;
                case 6: $("body,html").animate({ scrollTop: 125 }, "slow"); break;
                case 7: $("body,html").animate({ scrollTop: 666 }, "slow"); break;
                case 8: $("body,html").animate({ scrollTop: 770 }, "fast"); break;
                case 9: $("body,html").animate({ scrollTop: 0 }, "slow");break;
                default:
                    setCookie('MOEART_GUIDE_BLOCK', 'yes'); // Guide end set a flag
                    $(this).fadeOut('slow');
            }
        });
    }

    if(getCookie('MOEART_GUIDE_BLOCK') != 'yes') { // flag not set, start the guide.
        window.guidestep = 0; // set first page at 0
        showGuide();
        $(window).resize(function() { // if window resized then reload guide.
            $("#MAGUIDE").remove();
            showGuide();
        });
    }

});