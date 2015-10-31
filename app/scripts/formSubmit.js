/*'use strict';*/

function formSubmit() {
	$('.recommend_form').submit(function () {
		var url = '/recommend.php';

		$.ajax({
			type: 'POST',
			url: url,
			data: $(this).serialize(),
			success: function () {
				$('.recommend').hide();
				$('.recommend__afterSend').show();
			}
		});

		return false;
	});
}
