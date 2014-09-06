var table = require('./table.js');

module.exports = {
	encode: function (str) {
		str = table.multiple.data.reduce(function (previous, current) {
			return previous.replace(new RegExp(current[0], 'g'), current[1]);
		}, str);

		str = str.replace(table.single.regexShinji, function (char) {
			return table.single.encode[char];
		});

		return str;
	}
};
