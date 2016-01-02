var http = require('http');
var https = require('https');
var url = require('url');
var fs = require('fs');

var IVS = require('ivs');

if (typeof __dirname === 'undefined') {
	if (document) {
		var scripts = document.getElementsByTagName('script');
		var scriptPath = scripts[scripts.length - 1].src.split('?')[0];
		var __dirname = scriptPath.split('/').slice(0, -1).join('/');
	} else {
		throw new Error('Cannot get current directory');
	}
}

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
	var options, callback;

	for (var i = 0; i < arguments.length; i++) {
		var argument = arguments[i];

		if (typeof argument === 'function') {
			callback = argument;
		} else if (typeof argument === 'object') {
			options = argument;
		}
	}

	options = options || {};
	callback = callback || function () {};

	this.initialize(options, callback);
}

Kyujitai.prototype.initialize = function (options, callback) {
	var kyujitai = this;

	if (kyujitai.data === undefined || kyujitai.IVS === undefined) {
		var dataJSON = '';

		function onJSONReady() {
			try {
				Kyujitai.prototype.data = JSON.parse(dataJSON);
			} catch (error) {
				return callback.call(kyujitai, new Error('kyujitai.json data is broken'));
			}

			Kyujitai.prototype.IVS = new IVS({ivd: options.ivd}, function (error) {
				if (error) return callback.call(kyujitai, error);

				kyujitai.compile();
				callback.call(kyujitai, null);
			});
		}

		if (typeof location !== 'undefined') { // in browser
			var get = location.protocol === 'https:' ? https.get : http.get;
			var dataURL = options.kyujitai ? url.resolve(location.href, options.kyujitai) : (__dirname + '/kyujitai.json')

			var request = get(dataURL, function (response) {
				if (response.statusCode !== 200) {
					callback(new Error('Request to ' + dataURL + ' responded with status code ' + response.statusCode));
				}

				response.on('error', callback);
				response.on('data', function (chunk) { dataJSON += chunk; });
				response.on('close', onJSONReady);
			});
		} else { // in node
			fs.readFile(__dirname + '/../data/kyujitai.json', function (error, data) {
				if (error) return callback(error);
				dataJSON = data;
				onJSONReady();
			});
		}
	} else {
		setTimeout(function () {
			callback.call(kyujitai, null);
		}, 0);
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

		var kyujiIVS = kyujitai.IVS.AJ(entry[1] + ivs)

		kyuji.encode[entry[0]] = kyujiIVS;
		kyuji.decode[kyujiIVS] = entry[0];
		regexStringShinji += entry[0];
		regexStringKyuji += entry[1];
	});

	kyuji.regexShinji = new RegExp('[' + regexStringShinji + ']', 'g');
	kyuji.regexKyuji = new RegExp('[' + regexStringKyuji + ']', 'g');


	// Generate table for multiple character conversion

	Kyujitai.prototype.table.douon = {};
	var douon = Kyujitai.prototype.table.douon; // shorthand

	douon.encode = {};
	douon.decode = {};

	// make index first
	kyujitai.data.douon.forEach(function (entry) {
		var baseNewChar = entry['new'][0];
		var baseOldChar = entry.old[0];

		entry['new'].forEach(function (newChar) {
			entry.words.forEach(function (word) {
				// replace new[0] with new[index]
				if (baseNewChar !== newChar) {
					word = word.split(baseNewChar).join(newChar);
				}

				if (douon.encode[word] === undefined) {
					douon.encode[word] = word;
				}
			});
		});

		entry.old.forEach(function (oldChar) {
			entry.words.forEach(function (word) {
				word = word.split(baseNewChar).join(oldChar);

				if (douon.decode[word] === undefined) {
					douon.decode[word] = word;
				}
			})
		})
	});

	// replase along to douon conversion table
	kyujitai.data.douon.forEach(function (entry) {
		var baseNewChar = entry['new'][0];
		var baseOldChar = entry.old[0];

		entry['new'].forEach(function (newChar) {
			entry.words.forEach(function (word) {
				// replace new[0] with new[index]
				if (baseNewChar !== newChar) {
					word = word.split(baseNewChar).join(newChar);
				}

				douon.encode[word] = douon.encode[word].split(newChar).join(entry.old[0]);
			});
		})

		entry.old.forEach(function (oldChar) {
			entry.words.forEach(function (word) {
				word = word.split(baseNewChar).join(oldChar);

				douon.decode[word] = douon.decode[word].split(oldChar).join(entry['new'][0]);
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
			return kyujitai.IVS.strip(kyujitai.table.kyuji.encode[char], {resolve: true});
		}
	});

	return string;
};

Kyujitai.prototype.decode = function (string, options) {
	var from, to;
	var kyujitai = this;

	string = kyujitai.IVS.forEachKanji(string, function (kanji, ivs) {
		var appended = kyujitai.IVS.append(kanji + ivs, {
			resolve: true
		});

		if (appended.match(kyujitai.table.kyuji.regexKyuji)) {
			var normalized = kyujitai.IVS.AJ(kyujitai.IVS.append(kanji + ivs, {
				category: 'AJ',
				force: true,
				resolve: true
			}));
			var decoded = kyujitai.table.kyuji.decode[normalized];

			if (decoded !== undefined) {
				return decoded;
			} else {
				return kanji + ivs;
			}
		} else {
			return kanji + ivs;
		}
	});

	for (from in kyujitai.table.douon.decode) if (kyujitai.table.douon.decode.hasOwnProperty(from)) {
		to = kyujitai.table.douon.decode[from];
		string = string.split(from).join(to);
	}

	return string;
};

module.exports = Kyujitai;
