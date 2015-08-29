'use strict';

require('colors');

var feather = global.feather = module.exports = require('fis');

feather.cli.name = 'feather';
feather.cli.info = feather.util.readJSON(__dirname + '/package.json');
feather.require.prefixes.unshift('feather');
feather.cli.help.commands = ['release', 'install', 'server', 'init', 'switch'];

feather.cli.version = function(){        
    var string = feather.util.read(__dirname + '/vendor/icon', true);
    console.log(string.replace('{version}', ('Version: ' + feather.cli.info.version).bold.red));
}

var old = feather.cli.run;

//override run
feather.cli.run = function(argv){
    var first = argv[2];

    if(argv.length < 3 || first === '-h' ||  first === '--help'){
        old(argv);
    }else if(first === '-v' || first === '--version'){
        old(argv);
    }else if(first[0] === '-'){
        old(argv);
    }else{
        if(['release', 'server', 'install', 'init', 'switch'].indexOf(argv[2]) == -1){
            feather.log.error('command error');
            return;
        }

        if(argv[2] == 'server'){
            var script = feather.project.getTempPath('www') + '/index.php';
            !feather.util.isFile(script) && feather.util.copy(__dirname + '/vendor/index.php', script);

            old(argv);
            return;
        }

        if(argv[2] == 'install'){
            argv.push.apply(argv, ['--repos', 'http://feather-team.github.io/package']);
            old(argv);
            return;
        }

        if(argv[2] == 'init'){
            old(argv);
            return;
        }

        if(argv[2] == 'switch'){
            old(argv);
            return;
        }

        //register command
        var commander = feather.cli.commander = require('commander');
        var cmd = feather.require('command', argv[2]), root = '';

        for(var i = 3; i < argv.length; i++){
            if(/-[\w]*r|--root/.test(argv[i]) && argv[i+1] && !/^-/.test(argv[i+1])){
                var x = argv[i] == '-r' || argv[i] == '--root' ? '' : argv[i].replace(/r$/, '');

                root = argv[i+1];
                argv.splice(i, 2, x);
                break;
            }
        }

        cmd.register(
            commander
                .command(cmd.name || first)
                .usage(cmd.usage)
                .description(cmd.desc)
                .action(function(){
                    var options = arguments[arguments.length - 1];

                    if(!feather.util.isFile(options.file)){
                        feather.log.error('invalid feather config file path [' + options.file + ']');
                    }

                    if(options.clean){
                        var www = feather.project.getTempPath('www');

                        'proj static c_proj'.split(' ').forEach(function(item){
                            feather.util.del(www + '/' + item);
                        });
                    }

                    feather.settings = options;
                })
        );

        if(root){
            feather.config.set('__cwd', process.cwd());
            process.chdir(root);
        }
        
        argv.push.apply(argv, ['-f', 'feather_conf.js']);
        commander.parse(argv);
    }
};

require('./extend.js');
require('./config.js');
