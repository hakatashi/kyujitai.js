// http://stackoverflow.com/questions/476679/
function preload(arrayOfImages) {
    $(arrayOfImages).each(function(){
        $('<img/>')[0].src = this;
    });
}

var kyujitai;
var fromStore, toStore;

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
	});

	kyujitai = new Kyujitai(function () {
		$('#loading').hide();
		$('#conversion-to').val(kyujitai.encode($('#conversion-from').val()));
		fromStore = $('#conversion-from').val();
		toStore = $('#conversion-to').val();
	});

	$('#conversion-from').keydown(encode);
	$('#conversion-from').keyup(encode);
	$('#conversion-from').on('paste', function () {
		setTimeout(encode, 100);
	});

	$('#conversion-to').keydown(decode);
	$('#conversion-to').keyup(encode);
	$('#conversion-to').on('paste', function () {
		setTimeout(decode, 100);
	});
});

function encode() {
	var fromText = $('#conversion-from').val();

	if (fromStore !== fromText) {
		$('#conversion-to').val(kyujitai.encode($('#conversion-from').val()));
		fromStore = fromText;
	}
}

function decode() {
	var toText = $('#conversion-from').val();

	if (toStore !== toText) {
		$('#conversion-from').val(kyujitai.encode($('#conversion-to').val()));
		toStore = toText;
	}
}
