function maRadio_init(elmClass, value, inputClass) {
	value = arguments[1] ? arguments[1] : 0; // default value for value (IE Support)
    $(elmClass + " li").removeClass('selected');
    $(elmClass + " li:nth-child(" + (value*1+1) + ")").addClass('selected');
    $(inputClass).val(value);
}

function maRadio(elmClass, elmThis, inputClass) {
	$(elmClass + " li").removeClass('selected');
	elmThis.addClass('selected');
	$(inputClass).val(($(elmClass + " li").index(elmThis)));
}
