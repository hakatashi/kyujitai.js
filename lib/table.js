var kyuji = require('../data/kyuji.json');
var douon = require('../data/douon.json');

var table = {};

// ES6 String.fromCodePoint polyfilling
/*! http://mths.be/fromcodepoint v0.1.0 by @mathias */
var fromCodePoint = function (codePoints) {
	var MAX_SIZE = 0x4000;
	var codeUnits = [];
	var highSurrogate;
	var lowSurrogate;
	var index = -1;
	var length = arguments.length;
	if (!length) {
		return '';
	}
	var result = '';
	while (++index < length) {
		var codePoint = Number(arguments[index]);
		if (
			!isFinite(codePoint) || // `NaN`, `+Infinity`, or `-Infinity`
			codePoint < 0 || // not a valid Unicode code point
			codePoint > 0x10FFFF || // not a valid Unicode code point
			Math.floor(codePoint) != codePoint // not an integer
		) {
			throw RangeError('Invalid code point: ' + codePoint);
		}
		if (codePoint <= 0xFFFF) { // BMP code point
			codeUnits.push(codePoint);
		} else { // Astral code point; split in surrogate halves
			// http://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
			codePoint -= 0x10000;
			highSurrogate = (codePoint >> 10) + 0xD800;
			lowSurrogate = (codePoint % 0x400) + 0xDC00;
			codeUnits.push(highSurrogate, lowSurrogate);
		}
		if (index + 1 == length || codeUnits.length > MAX_SIZE) {
			result += String.fromCharCode.apply(null, codeUnits);
			codeUnits.length = 0;
		}
	}
	return result;
};


// Generate table for single character (char-to-char) conversion

table.single = {};

table.single.encode = {};
table.single.decode = {};
var regexStringShinji = '';
var regexStringKyuji = '';

kyuji.forEach(function (entry) {
	var ivs = '';

	if (entry[2]) {
		var codePoint = parseInt(entry[2], 16);
		ivs = fromCodePoint(codePoint);
	}

	table.single.encode[entry[0]] = entry[1] + ivs;
	table.single.decode[entry[1]] = entry[0];
	regexStringShinji += entry[0];
	regexStringKyuji += entry[1];
});

table.single.regexShinji = new RegExp('[' + regexStringShinji + ']', 'g');
table.single.regexKyuji = new RegExp('[' + regexStringKyuji + ']', 'g');

table.single.data = kyuji;


// Generate table for multiple character conversion

table.multiple = {};

table.multiple.encode = {};

// make index first
douon.forEach(function (entry) {
	var baseChar = entry.new[0];

	entry.new.forEach(function (newChar) {
		entry.words.forEach(function (word) {
			// replace new[0] with new[index]
			if (baseChar !== newChar) {
				word = word.split(baseChar).join(newChar);
			}

			if (table.multiple.encode[word] === undefined) {
				table.multiple.encode[word] = word;
			}
		});
	});
});

// replase along to douon conversion table
douon.forEach(function (entry) {
	var baseChar = entry.new[0];

	entry.new.forEach(function (newChar) {
		entry.words.forEach(function (word) {
			// replace new[0] with new[index]
			if (baseChar !== newChar) {
				word = word.split(baseChar).join(newChar);
			}

			table.multiple.encode[word] = table.multiple.encode[word]
			                              .split(newChar).join(entry.old[0]);
		});
	})
});

module.exports = table;
