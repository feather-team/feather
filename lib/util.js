'use strict';

module.exports = {
    isEmptyObject: function(obj){
        for(var i in obj){
            if(obj.hasOwnProperty(i)){
                return false;
            }
        }

        return true;
    },

    //数组去重
    unique: function(arr){
        var obj = {}, uq = [];

        arr.forEach(function(v){
            if(obj[v]) return;

            obj[v] = true; 
            uq.push(v);
        });

        return uq;
    },

    /*
        任意类型转json
    */
    json: function json(obj){
        var tmp;

        if(obj.constructor == Object){
            tmp = [];

            for(var i in obj){
                tmp.push('"' + i + '":' + json(obj[i]));
            }

            return "{" + tmp.join(',') + "}";
        }else if(obj.constructor == Array){
            tmp = [];

            obj.forEach(function(v){
                tmp.push(json(v));
            });

            return "[" + tmp.join(',') + "]";
        }else if(obj.constructor == String){
            tmp = '"' + String(obj) + '"';
        }else{
            tmp = String(obj);
        }

        return tmp.replace(/[\r\n]+/g, '');
    },

    //判断是否为远程url
    isRemoteUrl: function(path){
        return /^https?:\/\//.test(path);
    },

    toPhpArray: function(json){
        var d = [], self = this;

        if(Array.isArray(json)){
            json.forEach(function(v){
                d.push(self.toPhpArray(v));
            });

            return "array(" + d.join(',') + ')';
        }else if(typeof json == 'object'){
            for(var i in json){
                d.push('"' + i + '" => ' + self.toPhpArray(json[i]));
            }

            return "array(" + d.join(',') + ')';
        }else{
            return typeof json == 'string' ? '"' + json.replace(/"/g, '\\"') + '"' : json;
        }
    }
};