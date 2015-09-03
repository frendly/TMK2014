/*'use strict';*/

$(function () {
	activeMenuItem('.menu, #top-wrapper');
	submenu();
	triangleRezise();
	breadcrumb();
	queryToInput();
	prevNextLink();
	lightbox();

	currentLinkToHistory();
});

$(window).resize(function() {
	triangleRezise();
});

function activeMenuItem(el) {
	var pagePathArray = window.location.pathname.split('/'), // разбиваем url
		href = pagePathArray[1], // достаем название страницы - 01.html
		search = href.split('?')[1] || '';

	if (search) {
		search = '?' + search;
	}

	$(el)
		.find('a[href~="' + href + '"]')
		.addClass('menu__link_active') // отдельно указываем класс для построения breadcrumb
			.filter(function () {
				return this.search === search;
			})
				.parents('li')
					.addClass('menu__item_active');
}

function submenu() {
	$submenu = $('.menu .menu__link_active').closest('.submenu').clone();
	$submenu.find('li').removeClass().addClass('sub-menu__item');
	$submenu.find('.menu__link_active').removeClass()
		.addClass('sub-menu__link_active');
		/*.append('<div class="triangle right" w="7,9" />');*/
	$submenu.find('a').removeClass('menu__link').addClass('sub-menu__link');
	$submenu.removeClass().addClass('sub-menu__items');

	$('aside .sub-menu ul li').removeClass().addClass('sub-menu__item');
	$('aside .sub-menu ul li a').removeClass().addClass('sub-menu__link');
	$('aside .sub-menu').html($submenu);
}

function breadcrumb() {
// breadcrumb
	var $this = $('.menu__link_active'),
		$bc = $('<div class="breadcrumb__items"></div>');

	$this.parents('li').each(function (n, li) {
		var $a = $(li).children('a').clone().removeClass().addClass('breadcrumb__link');
		$bc.prepend($a);
	});

	$('.breadcrumb').html($bc.prepend('<a class="breadcrumb__link" href="/">Главная</a>'));
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
	$('.lightbox').append('<div class="lightbox__zoom">Увеличить</div>').simpleLightbox();
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
	}

	nextPageLink = menuLink.eq(nextPageIndex).clone()
												.text('Следующая страница')
												.removeClass().addClass('prev-next-navigation__next');

	// prev link
	if (activeLinkIndex - 1 > 0) {
		prevPageIndex = activeLinkIndex - 1;
	} else {
		prevPageIndex = menuLink.length - 1;
	}

	prevPageLink = menuLink.eq(prevPageIndex).clone()
												.text('Предыдущая страница')
												.removeClass().addClass('prev-next-navigation__prev');

	$('.prev-next-navigation').prepend(prevPageLink, nextPageLink);
}

/* HISTORY FUNCTION */

function currentLinkToHistory() {
	var title = document.title,
		href = document.location.href,
		data = {
			title: title,
			href: href
		},
		history = getHistoryCookie(),
		found;

	// проверяем на дубли
	found = history.some(function (item) {
		return item.title === data.title;
	});

	// добавляем новый элемент, если нет дублей
	if (!found) {
		// если элементов много, удаляем первый
		if (history.length > 2) {
			history.shift();
		}

		history.push(data);
		history = JSON.stringify(history);
		Cookies.set('history', history);
	}

	createHistoryList();
}

function getHistoryCookie() {
	// парсим куку
	var history = Cookies.get('history');

	if (history !== undefined && history !== '') {
		history = $.parseJSON(history); // если кука существует, преобразуем строку в объект
	} else {
		history = [];
	}
	return history;
}

function createHistoryList() {
	var history = getHistoryCookie(),
		output = '';

	// формируем вывод ссылок из куки в DOM
	$.each(history, function (i, item) {
		output += '<a class="history__link" href=' + item.href + '>' + item.title + '</a>';
	});

	$('.history__items').empty().append(output);
}

/* END HISTORY FUNCTION BLOCK */

function triangleRezise(){
	$('.triangle').each(function(){
		var parentWidth = $(this).parent().width();
		var parentHeight = $(this).parent().height();
		var widthVariable = $(this).attr('w');
		if(!widthVariable){ var widthVariable = $(this).attr('h');}
		triangleWidth = parseInt(widthVariable) / 100 * parentWidth;
		var heightVariable = $(this).attr('h');
		if(!heightVariable){ var heightVariable = $(this).attr('w');}
		triangleHeight = parseInt(heightVariable) / 100 * parentWidth;

		if($(this).hasClass('up')) {
		  triangleWidth = triangleWidth / 2;
		  triangleHeight = "" + triangleHeight + "px";
		  triangleWidth = "" + triangleWidth + "px";
		  var triangle = "0px " + triangleWidth + " " + triangleHeight + " " + triangleWidth;
		  $(this).css("border-width", triangle);
		}
	  else if($(this).hasClass('down')) {
		  triangleWidth = triangleWidth / 2;
		  triangleHeight = "" + triangleHeight + "px";
		  triangleWidth = "" + triangleWidth + "px";
		  var triangle = triangleHeight + " " + triangleWidth + " " + "0px " + triangleWidth;
		  $(this).css("border-width", triangle);
	  }
	  else if($(this).hasClass('left')) {
		  triangleWidth = triangleWidth / 2;
		  triangleHeight = "" + triangleHeight + "px";
		  triangleWidth = "" + triangleWidth + "px";
		  var triangle = triangleWidth + " " + triangleHeight + " " + triangleWidth + " " + "0px";
		  $(this).css("border-width", triangle);
	  }
	  else if($(this).hasClass('right')) {
		  triangleWidth = triangleWidth / 2;
		  triangleHeight = "" + triangleHeight + "px";
		  triangleWidth = "" + triangleWidth + "px";
		  var triangle = triangleHeight +  " " + "0px " + triangleHeight + " " + triangleWidth;
		  $(this).css("border-width", triangle);
	  }
	  else if($(this).hasClass('topleft')) {
		  triangleHeight = "" + triangleHeight + "px";
		  triangleWidth = "" + triangleWidth + "px";
		  var triangle = triangleHeight + " " + triangleWidth + " " + "0px " + "0px";
		  $(this).css("border-width", triangle);
	  }
	  else if($(this).hasClass('topright')) {
		  triangleHeight = "" + triangleHeight + "px";
		  triangleWidth = "" + triangleWidth + "px";
		  var triangle = triangleHeight + " " + "0px " + "0px " + triangleWidth;
		  $(this).css("border-width", triangle);
	  }
	  else if($(this).hasClass('bottomleft')) {
		  triangleHeight = "" + triangleHeight + "px";
		  triangleWidth = "" + triangleWidth + "px";
		  var triangle = "0px " + triangleWidth + " " + triangleHeight + " " + "0px";
		  $(this).css("border-width", triangle);
	  }
	  else if($(this).hasClass('bottomright')) {
		  triangleHeight = "" + triangleHeight + "px";
		  triangleWidth = "" + triangleWidth + "px";
		  var triangle = "0px " + "0px " + triangleHeight + " " + triangleWidth;
		  $(this).css("border-width", triangle);
	  }
	  else{};
	 });
};
