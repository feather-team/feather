feather.file = require('./lib/file.js');
feather.console = require('./lib/console.js');

var util = require('./lib/util.js');

for(var method in util){
	feather.util[method] = util[method];
}