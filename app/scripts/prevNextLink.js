/*'use strict';*/

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
