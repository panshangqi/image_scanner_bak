import React from 'react';
import 'whatwg-fetch';
import $ from 'jquery';

const path = window.require('path')
const fs = window.require('fs')
const ini = window.require('ini')
const {remote} = window.require('electron');
const co = window.require('co');
const OSS = window.require('ali-oss')

var APPDATA = remote.app.getPath("userData");

const YQ = {};

function common_fetch(method, url, reqParam = {}, callback) {
    const d = new Date();
    const setting = {};
    const param = reqParam;
    let path = url;
    setting.method = method;
    setting.credentials = 'include';
    setting.headers = {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json',
        'Accept': 'application/json; charset=utf-8'
    };
    param.t = d.getTime();
    const _token = YQ.cookies.load('token');
    const _user_id = YQ.cookies.load('user_id');
    if(_token){
        setting.headers.token = _token;
        setting.headers.user_id = _user_id;
    }
    //console.log(setting);
    if (method === 'post') {

        setting.body = JSON.stringify(param);
    } else if (method === 'put') {

        setting.body = JSON.stringify(param);
    } else { //get delete

        const param_string = $.param(param);
        path = `${url}?${param_string}`;
    }

    function check_response_status(res) {
        const { status } = res;
        const msg = [];
        if (status >= 200 && status < 300) {
            return res;
        }
        if (status === 400 || status === 500) {
            msg.push('我们正在努力解决问题');
        }
        if (status === 401) {
            msg.push('您尚未登录');
        }
        if (status === 403) {
            msg.push('你无权限访问');
        }
        if (status === 404) {
            msg.push('未发现所请求的资源');
        }
        if (status === 403) {
            msg.push('没有权限或访问的资源不属于此账号');
        }
        if (status === 502) {
            msg.push('服务正在升级，请稍后重试！');
        }
        msg.push(`(${res.statusText})`);
        const error = new Error();
        error.name = status;
        error.message = msg.join('\n');
        error.res = res;
        throw error;
    }

    function parse_res(res) {
        return res.json();
    }

    function network_error(error) {
        let title = 'Network Error';
        if (error.name && error.name !== 'Error') {
            title = error.name;
        }
        if (process.env.NODE_ENV === 'development') {
            console.log(error);
        }
        console.log('Network Error: ',error.message);
    }

    function success(res_data) {
        callback(res_data);
    }
    fetch(path, setting).then(check_response_status)
        .then(parse_res)
        .then(success)
        .catch(network_error);
}

YQ.http = {
    get(url, reqParam, callback) {
        common_fetch('get', url, reqParam, callback);
    },
    post(url, reqParam, callback) {
        common_fetch('post', url, reqParam, callback);
    },
    put(url, reqParam, callback) {
        common_fetch('put', url, reqParam, callback);
    },
    _delete(url, reqParam, callback) {
        common_fetch('delete', url, reqParam, callback);
    }
};

YQ.util = {
    set_ini(key,value) {
        var scanCfg = path.join(APPDATA, "scanCfg.ini");
        if (fs.existsSync(scanCfg)) {

            var config = ini.parse(fs.readFileSync(scanCfg, 'utf-8'))
            config.general[key] = value;
            fs.writeFileSync(scanCfg, ini.stringify(config));
        }
    },
    get_ini (key) {

        var scanCfg = path.join(APPDATA, "scanCfg.ini");
        if (fs.existsSync(scanCfg)) {
            var config = ini.parse(fs.readFileSync(scanCfg, 'utf-8'))
            if(config.general)
                return config.general[key];
            return null;
        }
        return null;
    },
    make_aliyun_url(_route) {
        return remote.getGlobal('aliyun_url') + _route;
    },
    make_local_url(_route) {
        return remote.getGlobal('local_url') + _route;
    }
}
YQ.cookies = {
    save(key,value) {
        YQ.util.set_ini(key, value);
    },
    load (key) {
        return YQ.util.get_ini(key);
    }
}
export default YQ;
