// Tips with Formatted Text
function tipsText(Text, dstClass, msgType, posType) {
	posType = arguments[3] ? arguments[3] : 1; // default value for posType (IE Support)
	// colors for message
	switch(msgType) {
		case 'succ': var color = '#0a0'; break;
		case 'warn': var color = '#f90'; break;
		case 'err': var color = '#c00'; break;
		default: var color = '#f90';
	}
	layer.tips('<span class="tips-text">' + Text + '</span>', dstClass, {
		tips: [posType, color],		// Position and color of Tips
		maxWidth: '360px' 			// Limit max width of Tips
	});
}

// Msg with Formatted Text
function msgText(Text, msgType) {
	// colors for message
	switch(msgType) {
		case 'succ': 
			var color = '#0a0'; 
			var sign = 'check'; 
			var shift = 0;
			var time = 2000;
			break;
			
		case 'warn': 
			var color = '#f90'; 
			var sign = 'warning'; 
			var shift = 6;
			var time = 3000;
			break;
			
		case 'err': 
			var color = '#c00'; 
			var sign = 'close'; 
			var shift = 6;
			var time = 3500;
			break;
			
		default: 
			var color = '#0a0'; 
			var sign = 'check';
			var shift = 0;
			var time = 3000;
	}
	layer.msg('<i class="fa fa-' + sign + '" aria-hidden="true" style="font-size:28px; margin-right:10px; margin-top:-5px; vertical-align:middle; color:' + color + '"></i>' + Text, {
		shade: 0.5,
		time: time,
		shift: shift,
		maxWidth: '400px'
	});
}