var path = require('path')
var fs = require('fs')
var ini = require('ini')
var co = require('co');
var OSS = require('ali-oss')
var request = require('request')
var electron = require('electron')

var APPDATA = '';
if(electron.remote){
    APPDATA = electron.remote.app.getPath("userData")
}else{
    APPDATA = electron.app.getPath("userData")
}

yq = {};
/*
 yq.http.get('http://10.200.3.16:3202/host/sts',{username:'123456',pswd:'002'},function (res) {
 console.log(res);
 })


 */

yq.http = {
    get:function (url,data,fn) {
        var index = 0;
        var params = '';
        for(var key in data){
            params += (index == 0) ? '?': '&';
            params += key;
            params += '=';
            params += data[key];
            index++;
        }
        var _url = url + params;
        request(_url, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                if(typeof fn === 'function'){
                    fn(body);
                }
            }else{
                console.log('client net error');
            }
        })
    },
    post:function(url,data,fn){

    }

}

yq.util = {
    set_ini:function (key,value) {
        var scanCfg = path.join(APPDATA, "scanCfg.ini");
        if (fs.existsSync(scanCfg)) {

            var config = ini.parse(fs.readFileSync(scanCfg, 'utf-8'))
            config.general[key] = value;
            fs.writeFileSync(scanCfg, ini.stringify(config));
        }
    },
    get_ini:function (key) {

        var scanCfg = path.join(APPDATA, "scanCfg.ini");
        if (fs.existsSync(scanCfg)) {
            var config = ini.parse(fs.readFileSync(scanCfg, 'utf-8'))
            if(config.general)
                return config.general[key];
            return null;
        }
        return null;
    }
}
yq.aliyun = {

    upload_aliyun: function () {
        function get_aliyun_key(){
            return new Promise((resolve, reject) => {
                var _key_url = aliyun_url + '/host/sts';
                yq.http.get(_key_url,'',function(res){
                    resolve(res);
                })
            })
        }

        async function upload_task(){
            let result = await get_aliyun_key()
            console.log(result);
        }
        upload_task();
    }
}

module.exports = yq;

/*
function upload_end(i) {
    return new Promise((resolve,reject)=>{
        setTimeout(() => {
        resolve({
            'school':454102,
            'name': 'zhangjie',
            'order': i
        });
    },500)
})
}
function upload_start(i) {
    return new Promise((resolve,reject)=>{
        setTimeout(() => {
        resolve({
            'filesize':1455245,
            'order':i
        });
    },1000)
})
}
async function upload_task(){
    for(var i=0;i<2000;i++){
        let start = await upload_start(i)
        console.log(start);
        let end = await upload_end(i)
        console.log(end)
        //$('#console').html(res.order);
    }
}
//upload_task();


console.log("end")
$('#test_btn').click(function () {
    console.log('this si d');
})

 */