$(function(){
    /*
     * Customized Scrollbar for Waves
     */
    $('.waves .wave-list').slimScroll({
        size: '8px',
        color: '#cccccc',
        width: '100%',
        height: '100%',
        distance: '5px',
        wheelStep: 5,
        allowPageScroll: true
    });

    /*
     * New Draft Type Area Toggle
     */
    function toggleDraftType(num) {
        var i = 0;
        $(".newdraft .draft-panel").each(function() {
            if(i == num)
                $(this).fadeIn();
            else
                $(this).fadeOut();
            i++;
        });
    }
    $(".newdraft .extra button").click(function() {
        $(".newdraft .extra button").removeClass("active");
        $(this).addClass("active");
        toggleDraftType($(this).index());
    });

    /*
     * Dianbo Render
     */
    function dianboRender() {
        $.ajax({
            type: "GET",
            url: '/index/getFeedTop10',
            success: function(data)
            {
                $(".waves .mdl-load").slideUp(500); // Hidden Loading
                var dianboData = JSON.parse(data);
                // Start render
                for(var i=0; i<dianboData.length; i++) {
                    var renderFmt = $('<div class="wave"> \
                        <div class="info"> \
                            <div class="head"> \
                                <img src="'+dianboData[i].UserAvatarLink+'"/> \
                                <img class="verified '+dianboData[i].Verified+'" src="/img/verified.png" title="' + dianboData[i].VerifyInfo + '"/> \
                            </div> \
                            <div class="user"> \
                                <div class="username"><a href="'+dianboData[i].UserProfileLink+'" target="_blank">'+dianboData[i].UserName+'</a></div> \
                                <div class="sendtime"><a href="'+dianboData[i].FeedUrl+'" target="_blank">'+moment.unix(dianboData[i].SendTime).format("YYYY/MM/DD H:mm")+'</a></div> \
                            </div> \
                        </div> \
                        <div class="content">'+dianboData[i].FeedContent+'</div> \
                    </div>');
                    renderFmt.hide().delay(i*200).promise().done(function(){
                        $(this).fadeIn('slow');
                    });
                    $('.waves .wave-list').append(renderFmt);
                }
            }
        });
    }

    /*
     * Ranking Render
     */
    function rankRender() {
        $.ajax({
            type: "GET",
            url: '/index/getRank',
            success: function(data)
            {
                if(data.code == 901) {
                    $(".ranking .mdl-load").text('数据读取失败');
                    return;
                }
                $(".ranking .mdl-load").slideUp(500).promise().done(function(){ // Hidden Loading
                    $(this).remove();
                });
                var draftData = data.Draft;
                var draftAttach = data.Attachment;
                // Start render
                for(var i=0; i<5; i++) {//首页排行目前限制数量为 5
                    var renderFmt = $('<div class="rank-item"> \
                        <div class="image"><a href="/ad'+draftData[i].DraftID+'" target="_blank"><img src="'+draftAttach[draftData[i].DraftID]+'"/></a></div> \
                        <div class="draft-info"> \
                            <span class="title" title="'+draftData[i].name+'"><a href="/ad'+draftData[i].DraftID+'" target="_blank">'+draftData[i].name+'</a></span> \
                            <span class="author"><a href="/ad'+draftData[i].DraftID+'" target="_blank">'+draftData[i].Uname+'</a></span> \
                        </div> \
                        <div class="rank-flag"></div> \
                        <div class="rank-num">'+(i*1+1)+'</div> \
                    </div>');
                    renderFmt.hide().delay(i*100).promise().done(function(){
                        $(this).fadeIn('slow');
                    });
                    $('.ranking .rank-list .rank-showmore').before(renderFmt);
                }
            }
        });
    }

    /*
     * Follow List Render
     */
    function followRender() {
        $.ajax({
            type: "GET",
            url: '/index/getFollow',
            success: function(data)
            {
                $(".follow .mdl-load").slideUp(500); // Hidden Loading
                var userList = data.recommendedUsers;
                for(var i=0; i<userList.length; i++) {
                    if (userList[i].isFollow == 0)
                        btnClass = '<button class="btn-follow unfollow" data-uid="'+userList[i].UserId+'">加关注</button>';
                    else
                        btnClass = '<button class="btn-follow followed" data-uid="'+userList[i].UserId+'">已关注</button>';
                    var renderFmt = $('<div class="user"> \
                        <div class="head"><img src="'+userList[i].UserHead+'"/></div> \
                        <div class="info"> \
                            <div class="username"><a href="/u/'+userList[i].UserId+'" target="_blank">'+userList[i].UserName+'</a></div> \
                            <div class="extra">'+btnClass+'</div> \
                        </div> \
                    </div>');
                    // Follow button click evnet
                    $('.btn-follow', renderFmt).click(function() {
                        var $this = $(this);
                        $.ajax({
                            type: "POST",
                            url: '/index/follow/' + $this.attr('data-uid'),
                            data: {
                                _token: $('meta[name="token"]').attr("content")
                            },
                            error: function(data)			// Server failed
                            {
                                msgText('关注失败', 'err');
                            },
                            success: function(data)			// Server response
                            {
                                switch(data.code) {
                                    case 105: msgText('请先登录', 'err'); break;
                                    case 3000: msgText('关注失败', 'err'); break;
                                    case 3001:
                                        msgText('关注成功', 'succ');
                                        $this.removeClass('followed')
                                            .removeClass('unfollow')
                                            .addClass('followed')
                                            .text('已关注');
                                        break;
                                    case 3010: msgText('取消关注失败', 'err'); break;
                                    case 3011:
                                        msgText('取消关注成功', 'succ');
                                        $this.removeClass('followed')
                                            .removeClass('unfollow')
                                            .addClass('unfollow')
                                            .text('加关注');
                                        break;
                                    case 3012: msgText('不能关注自己', 'err'); break;
                                    default: msgText('关注失败', 'err');
                                }
                            }
                        });
                    });
                    renderFmt.hide().delay(i*200).promise().done(function(){
                        $(this).fadeIn('slow');
                    });
                    $('.follow').append(renderFmt);
                }
            }
        });
    }

    /*
     * NewDraft Render
     */
    function newDraftRender() {
        $.ajax({
            type: "GET",
            url: '/index/getNDraft',
            success: function(data)
            {
                $.each(data.newDraft, function(typeName, typeData) {
                    var renderString = '<div class="draft-panel" data-type="'+typeName+'">';
                    for(var i=0; i<typeData.length; i++) {
                        renderString += '<div class="draft"> \
                            <div class="image"><a href="/ad'+typeData[i].draftId+'" target="_blank"><img class="'+(typeData[i].count>1?'multi':'')+'" src="'+typeData[i].cover+'"/></a></div> \
                            <div class="info"> \
                                <div class="name"><a href="/ad'+typeData[i].draftId+'" target="_blank">'+typeData[i].draftName+'</a></div> \
                                <div class="author"><a href="/ad'+typeData[i].draftId+'" target="_blank">'+typeData[i].painterName+'</a></div> \
                            </div> \
                        </div>';
                    }
                    var renderFmt = $(renderString + '</div>');
                    $('.newdraft').append(renderFmt);
                });
                $(".newdraft .mdl-load").slideUp(500); // Hidden Loading
                toggleDraftType(0); // default type area is the first type area
            }
        });
    }

    /*
     * Recommend Render
     */
    function recommendRender() {
        $.ajax({
            type: "GET",
            url: '/index/getRecommendDrafts',
            success: function(data)
            {
                var drafts = data.newDraft;
                // Start render
                for(var i=0; i<drafts.length; i++) {
                    var renderFmt = $('<a href="/ad'+drafts[i].draftId+'"><img alt="'+drafts[i].draftName+'" src="'+drafts[i].cover+'"/></a>');
                    $('#recommendDraft').append(renderFmt);
                }
                $(".recommend .mdl-load").slideUp(500); // Hidden Loading
                /*
                 * Initiating Recommend Gallery
                 */
                $("#recommendDraft").fadeIn();  // show container
                $("#recommendDraft").justifiedGallery({ // init gallery
                    //rowHeight: 100,
                    //maxRowHeight: 200,
                    margins : 5,
                    lastRow: 'hide',
                    randomize: true,
                    target: '_blank'
                });
                $('#recommendDraft').slimScroll({ // init scrollbar
                    size: '8px',
                    color: '#aaaaaa',
                    width: '100%',
                    height: '100%',
                    distance: '5px',
                    wheelStep: 0,
                    allowPageScroll: true
                });
            }
        });
    }

    /*
     * Message Render
     */
    function messageRender()
    {
        $.ajax({
            type: "GET",
            url: '/message/unread',
            success: function(data)
            {
                var i = 0; // Animate Delay
                var c = 0; // notify count
                $.each(data, function(k, v) {
                    var renderFmt = $('<div class="alert-item">\
                        <div class="avatar">\
                            <img src="'+v.avatar+'"/>\
                            <div class="count">'+v.count+'</div>\
                        </div>\
                        <div class="content">\
                            <div class="title">'+v.username+'</div>\
                            <div class="message">'+v.body+'</div>\
                        </div>\
                    </div>');
                    if (v.count === 0) $('.count', renderFmt).remove();

                    // show chat box
                    renderFmt.click(function (e)
                    {
                        layer.open({
                            type: 2,
                            title: '发送私信给 '+v.username+'（非实时消息）',
                            shadeClose: true,
                            shade: false,
                            maxmin: true, //开启最大化最小化按钮
                            area: ['640px', '520px'],
                            content: '/message/send/'+v.from
                        });
                        $("#alertBox").slideToggle();
                    });

                    $('#alertBox').append(renderFmt);
                    c += v.count;
                });

                if (Object.keys(data).length > 0)
                {
                    $('.load-error','#alertBox').hide();            // hide empty tips
                    if (c > 0)
                    {
                        // show red dot
                        $('nav .extra .alert .red-dot').fadeIn(500);

                        // Clean all notifies
                        var cleanBtn = $('<button class="clean-unread">清除消息计数</button>');
                        cleanBtn.click(function () {
                            $.ajax({
                                data: {_token: $('meta[name="token"]').attr('content')},
                                type: "DELETE",
                                url: '/message/unread',
                                success: function (data) {
                                    msgText('计数君已归零', 'succ');
                                    $('.alert-item .count', '#alertBox').remove();
                                },
                                error: function (xhr) {
                                    msgText('计数器归零失败', 'err');
                                }
                            });
                        });
                        $('#alertBox').append(cleanBtn);
                    }
                }
            },
            error: function(xhr)
            {
                $('.load-error','#alertBox').text('登录后可查看通知消息');
            }
        });
    }

    recommendRender();
    newDraftRender();
    rankRender();
    followRender();
    dianboRender();
    messageRender();

    /**
     * EVENT BINDING
     */
    $("nav .extra .alert i").click(function (e)
    {
        $("#alertBox").slideToggle();
        $('nav .extra .alert .red-dot').fadeOut(300);
    })
});