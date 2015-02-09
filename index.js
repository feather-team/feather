'use strict';

require('colors');

var feather = global.feather = module.exports = require('fis');

feather.cli.name = 'feather';
feather.cli.info = feather.util.readJSON(__dirname + '/package.json');
feather.require.prefixes.unshift('feather');
feather.cli.help.commands = ['release', 'install', 'server', 'init'];

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
        if(['release', 'server', 'install', 'init'].indexOf(argv[2]) == -1){
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
            argv.push.apply(argv, ['--repos', 'http://github.com/feather-ui']);
            old(argv);
            return;
        }

        if(argv[2] == 'init'){
            old(argv);
            return;
        }

        //register command
        var commander = feather.cli.commander = require('commander');
        var cmd = feather.require('command', argv[2]);
        
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

                        'map php static test view'.split(' ').forEach(function(item){
                            feather.util.del(www + '/' + item);
                        });
                    }

                    feather.settings = options;
                })
        );

        argv.push.apply(argv, ['-f', 'feather_conf.js']);
        commander.parse(argv);
    }
};

require('./extend.js');
require('./config.js');