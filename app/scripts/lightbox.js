/*'use strict';*/

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
