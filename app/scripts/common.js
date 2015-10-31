/*'use strict';*/

$(function () {
	activeMenuItem('.menu, #top-wrapper, .tools');
	submenu();
	breadcrumb();
	queryToInput();
	prevNextLink();
	lightbox();
	accordion();
	printPage();
	formSubmit();

	addLinkToCookie('history');
	myreport();
	ajaxReloadPage();

	$('body').addClass('show');
});

function getQueryParams(qs) {
// получаем все GET параметры url
	qs = qs.split('+').join(' ');

	var params = {},
		tokens,
		re = /[?&]?([^=]+)=([^&]*)/g;

	while (tokens = re.exec(qs)) {
		params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
	}

	return params;
}

function queryToInput() {
// собираем ссылку для рекомендации отчета
// http://localhost:3001/recommend.html?index=01
	var query = getQueryParams(document.location.search),
		hostname = 'http://' + document.location.hostname,
		pageUrl = query.index,
		lang = query.lang;

	$('.input_recommend_page').attr('value', pageUrl);
	$('.input_recommend_lang').attr('value', lang);
}

/* HISTORY FUNCTION */
/*currentLinkToHistory*/
function addLinkToCookie(cookieName) {
	var title = document.title,
		href = document.location.href,
		lang = $('html').attr('lang'),
		data = {
			title: title,
			href: href,
			lang: lang
		},
		/*history*/
		cookie = getCookie(cookieName),
		/*getHistoryCookie*/
		found;

	// проверяем на дубли
	found = cookie.some(function (item) {
		return item.title === data.title;
	});

	// добавляем новый элемент, если нет дублей
	if (!found) {
		// если элементов много, удаляем первый
		if (cookie.length > 2 && cookieName !== 'myreport') {
			cookie.shift();
		}

		cookie.push(data);
		cookie = JSON.stringify(cookie);
		Cookies.set(cookieName, cookie);
	}

	if (cookieName === 'history') {
		createListForHistory();
	}
	if (cookieName === 'myreport') {
		createListForMyreport();
	}
}

/*getHistoryCookie*/
function getCookie(cookieName) {
	// парсим куку
	var cookie = Cookies.get(cookieName);

	if (cookie !== undefined && cookie !== '') {
		cookie = $.parseJSON(cookie); // если кука существует, преобразуем строку в объект
	} else {
		cookie = [];
	}
	return cookie;
}

function animate(element_ID, animation) {
	$(element_ID).addClass(animation);
	var wait = window.setTimeout(function () {
		$(element_ID).removeClass(animation);
	}, 1300
	);
}

/*createHistoryList*/
function createListForHistory(cookieName) {
	cookieName = 'history';

	var cookie = getCookie(cookieName),
		container = '.' + cookieName + '__items',
		output = '',
		lang = $('html').attr('lang'),
		item;

	// формируем вывод ссылок из куки в DOM
	$.each(cookie, function (i, item) {

		if (lang === item.lang) {
			item = $('<a />',
			{
				class: 'history__link',
				href: item.href,
				text: item.title
			});
			$(container).append(item);
		}
	});

}

function createListForMyreport() {
	var cookieName = 'myreport',
		cookie = getCookie(cookieName),
		container = '.myreport__items',
		pathToFile = $('.myreport__items').attr('data-download-path'),
		output = '',
		regex = /\d+/,
		pageID,
		segment,
		fullLink;

	// формируем вывод ссылок из куки в DOM
	if (cookie.length > 0) {
		$.each(cookie, function (i, item) {
			segment = (item.href.substr(item.href.lastIndexOf('/') + 1));
			pageID = segment.match(regex)[0];
			fullLink = pathToFile + pageID + '.pdf';


			output += '<tr>';
			output += '<td><a class="myreport__link" href=' + item.href + '>' + item.title + '</a></td>';
			output += '<td><input type="checkbox" checked name="files[]" value=' + fullLink + '></td>';
			output += '</tr>';
		});
	} else {
		$(container).parent().hide();
		$('.myreport__nopage').show();
	}

	$(container).append(output);
}

function removeCookie(cookieName) {
	Cookies(cookieName, undefined);
}
/* END HISTORY FUNCTION BLOCK */

function ajaxReloadPage() {
	/*pajax*/
	// применять ко всем ссылкам, кроме .lightbox и .switch-language
	$(document).pjax('a:not(.lightbox):not(.switch-language)', '.main', {
		fragment: '.main'
	});

	$(document).on('pjax:complete', function (xhr) {
		// если запрос успешно выполнен
		var pageID = $('#content').attr('data-page'),
			pageLang = $('#content').attr('data-page-lang'),
			switchLang,
			switchLink;

		if (pageLang === 'ru') {
			switchLang = 'en';
			switchLink = pageID ? '/' + switchLang + '/' + pageID + '.html' : '/';
		} else {
			switchLang = 'ru';
			switchLink = pageID ? '/' + pageID + '.html' : '/en/';
		}
		$('.switch-language').attr('href', switchLink);
		$('html').attr('lang', pageLang);

		activeMenuItem('.menu, #top-wrapper, .tools');
		submenu();
		breadcrumb();
		prevNextLink();
		lightbox();
		accordion();
		printPage();
		addLinkToCookie('history');
		myreport();
	});
}
