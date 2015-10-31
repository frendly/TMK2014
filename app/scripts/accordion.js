/*'use strict';*/

function accordion() {
	var acc_heading = $('.acc_heading');

	acc_heading.on('click', function () {
		if ($(this).hasClass('acc_open')) {
			$(this).removeClass('acc_open').addClass('acc_closed').next().hide();
			return false;
		} else {
			$(this).removeClass('acc_closed').addClass('acc_open').next().show();
			return true;
		}
	});

	acc_heading.addClass('acc_closed').next().hide();
}
