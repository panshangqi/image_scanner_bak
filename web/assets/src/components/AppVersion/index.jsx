
import React, { Component } from 'react';
import { Modal, Button, Radio } from 'antd';

import './style.less';
import YQ from '@components/yq.jsx'
import $ from 'jquery'

const RadioGroup = Radio.Group;
const electron = window.require('electron');
const {ipcRenderer, remote} = electron;
const { exec } = window.require('child_process');

var client_version = remote.app.getVersion();
class AppVersion extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount(){

    }
    render() {
        return (
            <div className="_app_version_com">
                当前客户端版本 {client_version}<a href="http://www.17zuoye.com" target="_blank">请到官网下载最新版本</a>
            </div>
        );
    }
}
export default AppVersion;
