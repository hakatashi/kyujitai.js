var table = require('./table.js');
var IVS = require('ivs');

module.exports = {
	encode: function (string, options) {
		var from, to;

		if (options === undefined) {
			options = {};
		}

		if (options.IVD === undefined) {
			options.IVD = false;
		}

		for (from in table.multiple.encode) {
			if (table.multiple.encode.hasOwnProperty(from)) {
				to = table.multiple.encode[from];
				string = string.split(from).join(to);
			}
		}

		string = string.replace(table.single.regexShinji, function (char) {
			if (options.IVD) {
				return table.single.encode[char];
			} else {
				return IVS.strip(table.single.encode[char], {resolve: true});
			}
		});

		return string;
	}
};
