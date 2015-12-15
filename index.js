'use strict';

require('colors');

global.feather = module.exports = require('fis3');

//require cli.js overwrite fis-cli.js
require('./cli.js');

//feather default config
feather.config.merge({
	project: {
        fileType: {
            text: 'phtml'
        },

        name: '_default',
        charset: 'utf-8',
        modulename: '',
        staticMode: false,
        ignore: ['node_modules/**', 'output/**', '.git/**']
    },

 	template: {
 		suffix: 'html'
 	},

    statics: '/static',

    require: {
    	use: true,
    	defineWrapAll: false,
    	config: {
            baseurl: '/',
            rules: [
                /*
                :dialog => /static/mod/dialog/dialog.js
                common:dialog => /static/common/mod/dialog/dialog.js
                common/a:dialog => /static/common/a/mod/dialog/dialog.js
                common/a:dialog/a => /static/common/a/mod/dialog/a/a.js
                common/a:dialog/a.js => /static/common/a/mod/dialog/a.js
                common/a.js => /static/common/a.js
                */
                [/^([^:]+)?\:((?:[^\/]+\/)*)([^\.]+?)(\..+)?$/, function(_0, _1, _2, _3, _4){
                    return (_1 ? _1 + '/' : '') + 'mod/' + _2 + _3 + (_4 ? _4 : ('/' + _3 + '.js'));
                }],
                [/\/[^\.]*$/, '$&.js']
            ],
            charset: 'utf-8',
            map: {},
            deps: {}
        }
    },

    server: {
    	rewrite: 'index.php'
    }
});

feather.match('*.{less,css}', {
	parser: feather.plugin('less'),
	optimizer: feather.plugin('clean-css'),
	rExt: '.css'
});

feather.match('/component/**', {
	isMod: true
});

feather.match('/component/**/*.js', {
	postprocessor: fis.plugin('jswrapper', {
        type: 'commonjs'
    })
})

