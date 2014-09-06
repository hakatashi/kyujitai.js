var table = require('./table.js');

module.exports = {
	encode: function (string, options) {
		var from, to;

		for (from in table.multiple.encode) {
			if (table.multiple.encode.hasOwnProperty(from)) {
				to = table.multiple.encode[from];
				string = string.split(from).join(to);
			}
		}

		string = string.replace(table.single.regexShinji, function (char) {
			return table.single.encode[char];
		});

		return string;
	}
};
