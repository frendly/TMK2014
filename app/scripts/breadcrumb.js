/*'use strict';*/

function breadcrumb() {
	var $links = $('.menu__item_active > .menu__link'),
		$bc = $('.breadcrumb__items');
		// если в селекторе уже есть ссылки, удаляем все, кроме ссылки на главную страницу
		$bc = $bc.children().not(':first').remove().end().end();

	$links.each(function () {
		var $a = $(this).clone().removeClass().addClass('breadcrumb__link');
		$bc.append($a);
	});
}
