/*'use strict';*/

function activeMenuItem(el) {
	// парсим url и выбираем крайнюю его часть вида 01.html
	var	url = window.location.href,
		segment = (url.substr(url.lastIndexOf('/') + 1)),
		search = segment.split('?')[1] || '';

	if (search) {
		search = '?' + search;
	}

	// находим идентичную ссылку в структуре меню
	$(el)
	// если класс существует, удаляем его
		.find('.menu__item_active').removeClass('menu__item_active')
		.end()
		.find('.menu__link_active').removeClass('menu__link_active')
		.end()
	// находим текущую ссылку
		.find('a[href~="' + segment + '"]')
		.addClass('menu__link_active') // отдельно указываем класс для построения breadcrumb
			.filter(function () {
				return this.search === search;
			})
				.parents('li')
					.addClass('menu__item_active');
}
