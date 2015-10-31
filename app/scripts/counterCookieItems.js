/*'use strict';*/

function counterCookieItems(animation) {
	var cookie = getCookie('myreport'),
		counter = 0;

	$.each(cookie, function (i) {
		counter++;
	});
	$('.myreport__counter').attr('data-counter', counter);

	if (animation === 'animate') {
		animate($('.myreport__counter'), 'bounceIn');
	}
}
