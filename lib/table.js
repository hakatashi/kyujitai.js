var data = require('./data.js');

var table = {};

table.single = {};

table.single.encode = {};
table.single.decode = {};
var regexStringShinji = '';
var regexStringKyuji = '';

data.single.forEach(function (entry) {
	table.single.encode[entry[0]] = entry[1];
	table.single.decode[entry[1]] = entry[0];
	regexStringShinji += entry[0];
	regexStringKyuji += entry[1];
});

table.single.regexShinji = new RegExp('[' + regexStringShinji + ']', 'g');
table.single.regexKyuji = new RegExp('[' + regexStringKyuji + ']', 'g');

table.single.data = data.single;

table.multiple = {};

table.multiple.encode = {};
table.multiple.decode = {};

data.multiple.forEach(function (entry) {
	table.multiple.encode[entry[0]] = entry[1];
	table.multiple.decode[entry[1]] = entry[0];
});

table.multiple.data = data.multiple;

module.exports = table;
