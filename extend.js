feather.file = require('./lib/file.js');
feather.console = require('./lib/console.js');

var util = require('./lib/util.js');

for(var method in util){
    feather.util[method] = util[method];
}

fis.util.upload = function(url, opt, data, content, subpath, callback, l){
    if(typeof content === 'string'){
        content = new Buffer(content, 'utf8');
    } else if(!(content instanceof  Buffer)){
        fis.log.error('unable to upload content [' + (typeof content) + ']');
    }
    data = data || {};
    var endl = '\r\n';
    var boundary = '-----np' + Math.random();
    var collect = [];
    fis.util.map(data, function(key, value){
        collect.push('--' + boundary + endl);
        collect.push('Content-Disposition: form-data; name="' + key + '"' + endl);
        collect.push(endl);
        collect.push(value + endl);
    });
    collect.push('--' + boundary + endl);
    collect.push('Content-Disposition: form-data; name="file"; filename="' + subpath + '"' + endl);
    collect.push(endl);
    collect.push(content);
    collect.push('--' + boundary + '--' + endl);
    
    var length = 0;
    collect.forEach(function(ele){
        length += ele.length;
    });
    
    opt = opt || {};
    opt.method = opt.method || 'POST';
    opt.headers = {
        'Content-Type': 'multipart/form-data; boundary=' + boundary
    };

    if(l){
        opt.headers['Content-length'] = length;
    }

    opt = fis.util.parseUrl(url, opt);
    var http = opt.protocol === 'https:' ? require('https') : require('http');
    var req = http.request(opt, function(res){
        var status = res.statusCode;
        var body = '';

        res
            .on('data', function(chunk){
                body += chunk;
            })
            .on('end', function(){
                if(status >= 200 && status < 300 || status === 304){
                    callback(null, body);
                } else {
                    if(status == 411 && !l){
                        fis.util.upload(url, opt, data, content, subpath, callback, true);
                    }else{
                        callback(status);
                    }  
                }
            })
            .on('error', function(err){
                callback(err.message || err);
            });
    });

    req.on('error', function(err){
        if(!l){
            fis.util.upload(url, opt, data, content, subpath, callback, true);
        }else{
            throw new Error('deploy error: ' + err.message);
        }
    });

    collect.forEach(function(d){
        req.write(d);
        if(d instanceof Buffer){
            req.write(endl);
        }
    });

    req.end();   
}