$(function() {
    /*
     * INITIZATION, EVENT, ETC.
     * FCUNTION DEFINE AREA
     */
    // Init keyword from URL parameter
    function initKeyword() {
        if(window.subAreaMode) return;
        var keyword = decodeURIComponent($.urlParam('kw'));
        $("#search-keyword").val(keyword);
    }

    // Init sort method from URL parameter
    function initSearchMethod() {
        if(window.subAreaMode) return;
        var method = $.urlParam('t');
        var orderId = 0;

        switch(method) {
            case 'mixed':   orderId = 0;  break;
            case 'title':   orderId = 1;  break;
            case 'tag':     orderId = 2;  break;
            case 'author':  orderId = 3;  break;
            default:        orderId = 0;
        }
        maRadio_init(".radio-method", orderId, "#input-method");
    }

    // Init sort type from URL parameter
    function initSortType() {
        var order = $.urlParam('ord');
        var orderId = 0;

        switch(order) {
            case 'tiemu':   orderId = 1;  break;
            case 'good':    orderId = 2;  break;
            case 'visit':   orderId = 3;  break;
            case 'forward': orderId = 4;  break;
            default:        orderId = 0;
        }
        maRadio_init(".radio-sort", orderId, "#input-sort");
    }

    // Init sort type from URL parameter
    function initDraftType() {
        if(window.subAreaMode) return;
        var typeId = $.urlParam('a');

        var $draftSubArea = $('#draftSubArea');
        $('li', $draftSubArea).removeClass('selected');
        if(typeId === null) {
            $('li[data-typeId="0"]', $draftSubArea).addClass('selected');
            typeId = 0;
        } else {
            $('li[data-typeId="'+typeId+'"]', $draftSubArea).addClass('selected');
        }

        $('#input-type').val(typeId);
    }

    // Init Engine Mode: Search Engine or SubArea
    function initEngineMode() {
        var cond1 = window.location.pathname.indexOf('/type/'); // subarea
        if( cond1 === 0 )
        {
            // SubArea Mode
            window.subAreaMode = true;
            $('.sect-searchbox *').hide();
            $('.sect-searchbox').css('height','50px');
            $('#draftSearchMethod').hide();
            $('#draftSubArea').hide();
            $('.sect-list .sect-list-none').text('当前分区还没有作品');

            // Split Get query string and Type Id
            window.typeId = document.URL.split('/')[4];
            if (window.typeId.indexOf('?') > -1) {
                window.typeId = window.typeId.substr(0,window.typeId.indexOf('?'));
            }
        }
        else
        {
            // Search Engine Mode
            window.subAreaMode = false;
            document.title = '搜索 ' + document.title;
        }
    }

    // Validate Form Input
    function validateForm() { // Second condition for IE Support
        if( $("#search-keyword").val().length < 1 ) {
            tipsText('搜索关键词不能为空', '#search-keyword', 'warn', 3);
            return false;
        }
        return true;
    }

    // Submit form
    function doSearch() {
        // If input is invalid then break
        if (!window.subAreaMode) {
            if (validateForm() === false) {
                return;
            }
        }

        // Enable Loading
        layer.load(1, {
            shade: 0.3
        });

        // Method value converntor
        var method = 'title';
        switch($("#input-method").val()) {
            case '0': method = 'mixed';   break;
            case '1': method = 'title';   break;
            case '2': method = 'tag';     break;
            case '3': method = 'author';  break;
            default: method = 'mixed';
        }

        // OderBy value converntor
        var order = 'time';
        switch($("#input-sort").val()) {
            case '0': order = 'time'; break;
            case '1': order = 'tiemu';   break;
            case '2': order = 'good';    break;
            case '3': order = 'visit';   break;
            case '4': order = 'forward'; break;
            default: order = 'time';
        }

        // Init parameters
        var dtype = $("#input-type").val();
        var keyword = encodeURIComponent($("#search-keyword").val());
        var ascDesc = 'desc';
        var queryUri;

        // Send query and reload page
        if(window.subAreaMode)
            queryUri = '/type/'+window.typeId+'?ord='+order;
        else
            queryUri = '/search?kw='+keyword+'&t='+method+'&a='+dtype+'&ord='+order+'&desc='+ascDesc;
        window.location.href = queryUri;
    }


    /*
     * BUTTON, RADIO, FORM
     * EVENT AREA
     */
    // Events for Radio Method
    $(".radio-method li").on("click", function() {
        maRadio(".radio-method", $(this), "#input-method");
        doSearch();
    });

    // Events for Radio Type
    $(".radio-type li").on("click", function() {
        $('li', '#draftSubArea').removeClass('selected');
        $(this).addClass('selected');
        $('#input-type').val($(this).attr('data-typeId'));
        doSearch();
    });

    // Events for Radio Sort
    $(".radio-sort li").on("click", function() {
        maRadio(".radio-sort", $(this), "#input-sort");
        doSearch();
    });

    // Events for Submit in search box
    $("#form-search").submit(function(e) {
        doSearch();
        e.preventDefault();
    });


    /*
     * FUNCTION, SYSTEM, ETC.
     * INITIZATION AREA
     */
    // system init
    initEngineMode();   // Init search engine mode, must in END

    initSearchMethod(); // Init search method and radio of sort
    initSortType();     // Init order method and radio of sort
    initKeyword();      // Init keyword from URL parameter
    initDraftType();      // Init draft subarea from URL parameter
});