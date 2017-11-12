function rmDupArr(arr) {
    var uniqueArr = [];
    $.each(arr, function(i, el){
        if($.inArray(el, uniqueArr) === -1) uniqueArr.push(el);
    });
    return uniqueArr;
}