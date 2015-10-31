/*'use strict';*/

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
