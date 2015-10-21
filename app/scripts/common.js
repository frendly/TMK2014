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

	$('body').addClass('show');
});

function activeMenuItem(el) {
	var	url = window.location.href,
		segment = (url.substr(url.lastIndexOf('/') + 1)),
		search = segment.split('?')[1] || '';

	if (search) {
		search = '?' + search;
	}

	$(el)
		.find('a[href~="' + segment + '"]')
		.addClass('menu__link_active') // отдельно указываем класс для построения breadcrumb
			.filter(function () {
				return this.search === search;
			})
				.parents('li')
					.addClass('menu__item_active');
}

function submenu() {
	/*выбираем активный пункт меню*/
	$submenu = $('.menu .menu__link_active');

	if ($submenu.next().is('.submenu')) { /*если активен элемент 1 уровня, проверяем есть ли у него меню*/
		$submenu = $submenu.siblings('.submenu').clone();
	} else {
		/*если меню рядом нет, значит мы глубже 1 уровня, поднимаемся до ближайшего субменю*/
		$submenu = $submenu.closest('.submenu').clone();
	}

	$submenu.find('li').removeClass().addClass('sub-menu__item');
	$submenu.find('.menu__link_active').removeClass().addClass('sub-menu__link_active')
	.parent().addClass('sub-menu__item_active');

	$submenu.find('a').removeClass('menu__link').addClass('sub-menu__link');
	$submenu.removeClass().addClass('sub-menu__items');

	$('aside .sub-menu ul li').removeClass().addClass('sub-menu__item');
	$('aside .sub-menu ul li a').removeClass().addClass('sub-menu__link');
	$('aside .sub-menu').html($submenu);
}

function breadcrumb() {
	var $links = $('.menu__item_active > .menu__link'),
		$bc = $('.breadcrumb__items');

	$links.each(function () {
		var $a = $(this).clone().removeClass().addClass('breadcrumb__link');
		$bc.append($a);
	});
}

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

function lightbox() {
	var box = $('.lightbox'),
		link,
		blockID,
		lang = $('html').attr('lang'),
		zoom_text = (lang === 'ru') ? 'Увеличить' : 'Zoom';

	if (box.is('a')) { /*если тег задан ссылке, то считам, что внутри изображение*/
		box.append('<div class="lightbox__zoom">' + zoom_text + '</div>');
		box.fancybox({
			fitToView: false,
			helpers: {
				title: {
					type: 'outside',
				}
			}
		});
	} else {
		/*так же может быть вариант table.lightbox: мы должны увеличить таблицу на весь экран*/
		/*добавляем id к блоку, чтобы потом сослаться на него*/
		box.each(function (i) {
			blockID = 'lightbox_' + i;
			link = $('<a />').prop('href', '#' + blockID).addClass('lightbox__zoom').append(zoom_text);
			$(this).attr('id', blockID).after(link);
		});

		$('.lightbox__zoom').fancybox();
	}
}

function prevNextLink() {
// создаем блок с предыдущей и следующей ссылкой из меню .menu
	var menuLink = $('.menu .menu__link'),
		activeLink = $('.menu__link_active'),
		activeLinkIndex = menuLink.index(activeLink),
		nextPageIndex = 0,
		nextPageLink,
		prevPageIndex,
		prevPageLink;

	// next link
	if (activeLinkIndex + 1 < menuLink.length) {
		nextPageIndex = activeLinkIndex + 1;

		if (activeLink.attr('href') === menuLink.eq(nextPageIndex).attr('href')) {
			nextPageIndex = activeLinkIndex + 2; // пропускаем дублирующуюся ссылку родительского элемента
		}
	}
	nextPageLink = menuLink.eq(nextPageIndex).prop('href');


	// prev link
	if (activeLinkIndex - 1 > 0) {
		prevPageIndex = activeLinkIndex - 1;
	} else {
		prevPageIndex = menuLink.length - 1;
	}

	prevPageLink = menuLink.eq(prevPageIndex).prop('href');

	$('.prev-next-navigation')
		.find('.prev-next-navigation__prev').prop('href', prevPageLink)
		.end()
		.find('.prev-next-navigation__next').prop('href', nextPageLink)
		.end()
	.sticky({topSpacing: 20}); /* STICKY BLOCK */
}

function accordion() {
	var acc_heading = $('.acc_heading');

	acc_heading.click(function () {
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
		lang = $('html').attr('lang');

	// формируем вывод ссылок из куки в DOM
	$.each(cookie, function (i, item) {
		if (lang === item.lang) {
			output += '<a class="history__link" href=' + item.href + '>' + item.title + '</a>';
		}
	});

	$(container).empty().append(output);
}
function checkAll() {
	$('#checkAll').change(function () {
		$('input:checkbox').prop('checked', $(this).prop('checked'));
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


function printPage() {
	$('.tools__print').click(function () {
		window.print();
	});
}

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

function myreport() {
	counterCookieItems();
	checkAll();

	$('.myreport__save').click(function () {
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
