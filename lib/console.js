'use strict';

var colors = require('colors');

module.exports = {
	warn: function(msg){
		console.log('[WARING] ' + String(msg).yellow);
	}
};