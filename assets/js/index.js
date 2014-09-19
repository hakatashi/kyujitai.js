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
});
