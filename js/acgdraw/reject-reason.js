(function( $ ){

    var reasons = [
        '转载或二次创作稿件请填写转载地址',
        '稿件内容不完整',
        '投稿分区不正确，请修改后再投稿',
        '稿件内容违规，画作内容不能过于暴露血腥等',
        '稿件内容违规，可以适当处理后再投稿',
    ];

    $.fn.rejReason = function() {
        for ( key in reasons ) {
            this.append(`<option value="${reasons[key]}">${reasons[key]}</option>`);
        }
    };
})( jQuery );