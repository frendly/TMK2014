/*'use strict';*/

function myreport() {
	var myreport__save = $('.myreport__save'),
		pageID = $('#content').attr('data-page');
	counterCookieItems();
	checkAll();

	// проверяем страницу, если НЕ страница отчетности, то скрываем ссылку
	if ($.isNumeric(pageID) === false) {
		myreport__save.hide();
	}

	myreport__save.click(function () {
		addLinkToCookie('myreport');
		counterCookieItems('animate');

		return false;
	});

	$('.myreport__delete').click(function () {
		removeCookie('myreport');
		$('.myreport__items').parent().hide();
		$('.myreport__nopage').show();
		counterCookieItems('animate');

	});
	$('.pagemyreport').on('load', createListForMyreport());
}
