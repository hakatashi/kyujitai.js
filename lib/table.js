var kyuji = require('../data/kyuji.json');
var douon = require('../data/douon.json');

var table = {};


// Generate table for single character (char-to-char) conversion

table.single = {};

table.single.encode = {};
table.single.decode = {};
var regexStringShinji = '';
var regexStringKyuji = '';

kyuji.forEach(function (entry) {
	table.single.encode[entry[0]] = entry[1];
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
