jQuery.fn.watch = function (props, callback, timeout) {
	var $ = jQuery;
	
	if (!timeout) {
		timeout = 10;
	}
	
	return this.each(function () {
		var el = $(this), 
			func = function () {
				__check.call(this, el)
			}, 
			data = {
				props : props.split(','),
				func : callback,
				vals : []
			};
			
		$.each(data.props, function (i) {
			data.vals[i] = (!el.css(data.props[i]) ? el.attr(data.props[i]) : el.css(data.props[i]));
		});
		
		el.data(data);

		if (( typeof (this.onpropertychange) == 'object') || ($.browser.mozilla)) {
			el.on('DOMAttrModified', callback);
		} else {
			timer = setInterval(func, timeout);
			el.data('timer', timer);
		}
	});
	
	function __check(el) {
		var data = el.data(),
			changed = false,
			temp = '';
			
		for (var i = 0; i < data.props.length; i++) {
			temp = (!el.css(data.props[i]) ? el.attr(data.props[i]) : el.css(data.props[i]));
			if (data.vals[i] != temp) {
				data.vals[i] = temp;
				changed = true;
				break;
			}
		}
		
		if (changed && data.func) {
			data.func.call(el, data);
		}
	}
}

jQuery.fn.unwatch = function (props) {
	var $ = jQuery;
	
	return this.each(function () {
		var el = $(this),
			data = el.data(),
			timer = el.data('timer');
		
		props = props.split(','); 
		
		if (props.length) {
			$.each(data.props, function (i) {
				if ($.inArray(data.props[i], props) > -1) {
					data.props.splice(i, 1);
					data.vals.splice(i, 1);
				}
			});
		} else {
			el.removeData(['props', 'vals']);
		}

		if (( typeof (this.onpropertychange) == 'object') || ($.browser.mozilla)) {
			el.off('DOMAttrModified');
		} else {
			clearInterval(timer);
			el.removeData('timer');
		}
	});
}