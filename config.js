'use strict';

feather.config.merge({
    template: {
        suffix: 'html',
        componentRules: [
            /*
            :nav => /component/nav/nav.tpl
            common:nav => /component/common/nav/nav.tpl
            common/a:nav => /component/common/a/nav/nav.tpl
            common/a:nav/a => /component/common/a/nav/a/a.tpl
            common/a:nav/a.tpl => /component/common/a/nav/a.tpl
            common/a/b => /component/common/a/b.tpl
            common/a/b.tpl => /component/common/a/b/tpl
            */
            [/^([^:]+)?\:((?:[^\/]+\/)*)((?:(?!\.[^.]+).)+?)(\..+)?$/, function(_0, _1, _2, _3, _4){
                return (_1 ? (_1 + '/') : '') + _2 + _3 + (_4 ? _4 : ('/' + _3 + '.' + feather.config.get('template.suffix')));
            }],

            [/^.+$/, function(all){
                return all.replace(new RegExp('\\.' + feather.config.get('template.suffix') + '$'), '') + '.' + feather.config.get('template.suffix');
            }]
        ]
    },

    statics: '/static',

    project: {
        fileType: {
            text: 'phtml'
        },

        charset: 'utf-8',

        modulename: '',

        name: ''
    },

    md5Query: {
        open: false,
        name: 'v'
    },

    staticMode: false,

    autoCombine: false,

    //CSS中的path将绝对路径转相对路径
    cssA2R: true,

    require: {
        config: {
            baseurl: '/static',
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
                }]
            ],
            charset: 'utf-8',
            map: {},
            deps: {}
        }
    },

    server: {
        rewrite: 'index.php'
    },

    modules: {
        parser : {
            css: 'less'
        },

        preprocessor: {
            js: ['standard-before']
        },   

        postprocessor: {
            js: ['standard-after', 'mod-wrapper', 'require-async-analyse']
        },

        postpackager: ['map-before', 'map', 'map-after']
    },

    roadmap : {
        domain: '',

        path : [
            {
                reg: '/page/**.${template.suffix}',
                release: '/view/$&',
                isHtmlLike: true
            },
            {
                reg: '/component/**.${template.suffix}',
                release: '/view/$&',
                isHtmlLike: true,
                isComponentLike: true
            },
            {
                reg: /^\/component\/.*/,
                release: '/static/${statics}/$&',
                url: '${statics}/$&',
                isComponentLike: true,
                isHtmlLike: false
            },
            {
                reg: '/pagelet/**.${template.suffix}',
                release: '/view/$&',
                isHtmlLike: true,
                isPageletLike: true
            },
            {
                reg: /^\/pagelet\/.*/,
                release: '/static/${statics}/$&',
                url: '${statics}/$&',
                isComponentLike: true,
                isHtmlLike: false,
                isPageletLike: true
            },
            {
                reg: /^\/static\/((?:.+?\/)*third\/.*)$/,
                useStandard: false,
                useParser: false,
                useHash: false,
                release: '/static/${statics}/$1',
                url: '${statics}/$1',
                isHtmlLike: false,
                isThird: true
            },
            {
                reg: /^\/static(\/(?:.*\/)*mod\/.*)$/,
                release: '/static/${statics}/$1',
                url: '${statics}/$1',
                isMod: true,
                isHtmlLike: false
            },
            {
                reg : /^\/static(\/.*)$/,
                release: '/static/${statics}/$1',
                url: '${statics}/$1',
                isHtmlLike: false
            },
            {
                reg: /(?:feather_(?:rewrite|compatible))\.php$/,
                release: '/php/tmp/$&',
                isHtmlLike: false
            },
            {
                reg: /^\/php\/template\/(.*)$/,
                release: '${template.dest}/component/resource/$1',
                isHtmlLike: false
            },
            {
                reg: /^\/(?:map\.json|feather_.*)/,
                release: false
            },
            {
                reg: /^\S+$/,
                isHtmlLike: false,
                isJsLike: false,
                isCssLike: false
            }
        ]
    },

    settings: {
        optimizer: {
            'htmlmin': {
                level : 'strip'
            }
        }
    }
});

['tpl', 'xhtml', 'phtml', 'html', 'php', 'htm', 'shtml'].forEach(function(type){
    feather.config.set('modules.optimizer.' + type, 'htmlmin');
    feather.config.set('modules.preprocessor.' + type, 'standard-before');
    feather.config.set('modules.postprocessor.' + type, ['standard-after', 'pagelet-analyse', 'component-analyse', 'resource-analyse', 'require-async-analyse', 'inline-compress']);
});