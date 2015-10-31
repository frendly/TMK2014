/*'use strict';*/

function checkAll() {
	$('#checkAll').change(function () {
		$('input:checkbox').prop('checked', $(this).prop('checked'));
	});
}
