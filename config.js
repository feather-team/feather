'use strict';

feather.config.merge({
    template: {
        dest: '/view',
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

        ns: ''
    },

    md5Query: {
        open: false,
        name: 'v'
    },

    inlineMode: false,

    autoCombine: false,

    require: {
        config: {
            baseurl: '/static/js',
            rules: [
                /*
                :dialog => /static/js/mod/dialog/dialog.js
                common:dialog => /static/js/common/mod/dialog/dialog.js
                common/a:dialog => /static/js/common/a/mod/dialog/dialog.js
                common/a:dialog/a => /static/js/common/a/mod/dialog/a/a.js
                common/a:dialog/a.js => /static/js/common/a/mod/dialog/a.js
                */
                [/^([^:]+)?\:((?:[^\/]+\/)*)((?:(?!\.js).)+?)(\.js)?$/, function(_0, _1, _2, _3, _4){
                    return (_1 ? _1 + '/' : '') + 'mod/' + _2 + _3 + (_4 ? _4 : ('/' + _3 + '.js'));
                }],

                [/^.+$/, function(all){
                    return /\.([^\.]+)$/.test(all) ? all : (all + '.js');
                }]
            ],
            charset: 'utf-8',
            map: {},
            deps: {},
            domain: ''
        }
    },

    server: {
        rewrite: 'index.php'
    },

    modules: {
        parser : {
            css: 'less'
        },   

        postprocessor: {
            js: ['mod-wrapper', 'require-async-analyse']
        },

        postpackager: ['pack', 'pack-dev']
    },

    roadmap : {
        domain: '',

        path : [
            {
                reg: '/page/**.${template.suffix}',
                release: '${template.dest}/${project.ns}$&',
                isHtmlLike: true
            },
            {
                reg: '/component/**.${template.suffix}',
                release: '${template.dest}/${project.ns}$&',
                isHtmlLike: true,
                isComponentLike: true
            },
            {
                reg: /^\/component\/.*/,
                release: '${statics}/${project.ns}/$&',
                isComponentLike: true,
                isHtmlLike: false
            },
            {
                reg: '/pagelet/**.${template.suffix}',
                release: '${template.dest}/${project.ns}$&',
                isHtmlLike: true,
                useMap: false,
                isPageletLike: true
            },
            {
                reg: /^\/pagelet\/.*/,
                release: '${statics}/${project.ns}/$&',
                isComponentLike: true,
                isHtmlLike: false,
                isPageletLike: true
            },
            {
                reg: /^\/static\/((?:.+?\/)*third\/.*)$/,
                useStandard: false,
                useParser: false,
                useHash: false,
                release: '${statics}/${project.ns}/$1',
                isHtmlLike: false,
                isThird: true
            },
            {
                reg: /^\/static(\/js\/(?:.*\/)?mod\/.*)$/,
                release: '${statics}/${project.ns}/$1',
                isMod: true,
                isHtmlLike: false
            },
            {
                reg : /^\/static(\/.*)$/,
                release: '${statics}/${project.ns}/$1',
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
    }
});

['tpl', 'xhtml', 'phtml', 'html', 'php', 'htm', 'shtml'].forEach(function(type){
    feather.config.set('modules.postprocessor.' + type, ['inline-require', 'require-async-analyse', 'inline-sameresource', 'inline-compress', 'pagelet-analyse', 'component-analyse']);
});