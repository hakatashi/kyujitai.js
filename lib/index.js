var http = require('http');
var https = require('https');
var zlib = require('zlib');
var fs = require('fs');

var IVS = require('IVS');

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

function Kyujitai(callback) {
	if (typeof callback !== 'function') {
		callback = function () {};
	}

	this.initialize(callback);
}

Kyujitai.prototype.initialize = function (callback) {
	var kyujitai = this;

	if (kyujitai.data === undefined) {
		var read;
		var gunzip = zlib.createGunzip();

		if (fs) {
			read = fs.createReadStream(__dirname + '/kyujitai.json.gz');
			read.on('error', callback);
		} else {
			// TODO
		}

		var dataJSON = '';

		gunzip.on('data', function (chunk) { dataJSON += chunk; });
		gunzip.on('error', callback);
		gunzip.on('end', function () {
			try {
				Kyujitai.prototype.data = JSON.parse(dataJSON);
			} catch (error) {
				return callback(new Error('kyujitai.json data is broken'));
			}

			kyujitai.compile();

			callback.call(kyujitai, null);
		});

		read.pipe(gunzip);
	} else {
		callback.call(kyujitai, null);
	}
};

Kyujitai.prototype.compile = function () {
	var kyujitai = this;

	Kyujitai.prototype.table = {};

	// Generate table for single character (char-to-char) conversion

	Kyujitai.prototype.table.kyuji = {};
	var kyuji = Kyujitai.prototype.table.kyuji; // shorthand

	kyuji.encode = {};
	kyuji.decode = {};
	var regexStringShinji = '';
	var regexStringKyuji = '';

	kyujitai.data.kyuji.forEach(function (entry) {
		var ivs = '';

		if (entry[2]) {
			var codePoint = parseInt(entry[2], 16);
			ivs = fromCodePoint(codePoint);
		}

		kyuji.encode[entry[0]] = entry[1] + ivs;
		kyuji.decode[entry[1]] = entry[0];
		regexStringShinji += entry[0];
		regexStringKyuji += entry[1];
	});

	kyuji.regexShinji = new RegExp('[' + regexStringShinji + ']', 'g');
	kyuji.regexKyuji = new RegExp('[' + regexStringKyuji + ']', 'g');


	// Generate table for multiple character conversion

	Kyujitai.prototype.table.douon = {};
	var douon = Kyujitai.prototype.table.douon; // shorthand

	douon.encode = {};

	// make index first
	kyujitai.data.douon.forEach(function (entry) {
		var baseChar = entry.new[0];

		entry.new.forEach(function (newChar) {
			entry.words.forEach(function (word) {
				// replace new[0] with new[index]
				if (baseChar !== newChar) {
					word = word.split(baseChar).join(newChar);
				}

				if (douon.encode[word] === undefined) {
					douon.encode[word] = word;
				}
			});
		});
	});

	// replase along to douon conversion table
	kyujitai.data.douon.forEach(function (entry) {
		var baseChar = entry.new[0];

		entry.new.forEach(function (newChar) {
			entry.words.forEach(function (word) {
				// replace new[0] with new[index]
				if (baseChar !== newChar) {
					word = word.split(baseChar).join(newChar);
				}

				douon.encode[word] = douon.encode[word].split(newChar).join(entry.old[0]);
			});
		})
	});
}

Kyujitai.prototype.encode = function (string, options) {
	var from, to;
	var kyujitai = this;

	if (options === undefined) {
		options = {};
	}

	if (options.IVD === undefined) {
		options.IVD = false;
	}

	for (from in kyujitai.table.douon.encode) {
		if (kyujitai.table.douon.encode.hasOwnProperty(from)) {
			to = kyujitai.table.douon.encode[from];
			string = string.split(from).join(to);
		}
	}

	string = string.replace(kyujitai.table.kyuji.regexShinji, function (char) {
		if (options.IVD) {
			return kyujitai.table.kyuji.encode[char];
		} else {
			return IVS.strip(kyujitai.table.kyuji.encode[char], {resolve: true});
		}
	});

	return string;
};

module.exports = Kyujitai;
