// http://stackoverflow.com/questions/476679/
function preload(arrayOfImages) {
    $(arrayOfImages).each(function(){
        $('<img/>')[0].src = this;
    });
}

$(document).ready(function () {
	$.vegas('slideshow', {
		backgrounds: [
			{src: 'assets/img/background01.jpg', fade: 1000},
			{src: 'assets/img/background02.jpg', fade: 1000},
			{src: 'assets/img/background03.jpg', fade: 1000}
		],
		delay: 10000,
		preload: true
	});

	$.vegas('overlay', {
		src:'assets/vegas/overlays/04.png'
	});

	preload([
		'assets/img/logo_hover.png'
	]);

	var $logo = $('img#logo');
	$('#container').hover(function () {
		$logo.attr({src: 'assets/img/logo_hover.png'});
	}, function () {
		$logo.attr({src: 'assets/img/logo.png'});
	})
});
