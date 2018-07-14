
import React, { Component } from 'react';
import { Progress, Button } from 'antd';
const electron = window.require('electron');
const {ipcRenderer, remote} = electron;
const { exec } = window.require('child_process');
var client_version = remote.app.getVersion();
import './style.less';

import icon_close from '@imgs/close.png'
import icon_logo from '@imgs/17logo.png'

class AppUpdate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            progressVisible: 'none',
            cancelBtnVisible: 'inline',
            okBtnVisible: 'inline',
            cancelName: '取消升级',
            okName: '立即升级',
            downloadPercent: 0,
            speed:0
        }
        console.log(window.location.href);
    }

    componentDidMount(){
        var This = this;

        ipcRenderer.on('message-download-progress', function (event, data) {
            console.log(data);
            var _cur_progress = parseInt(data.percent);
            var _speed = parseInt(data.bytesPerSecond/1000.0);
            This.setState({
                downloadPercent: _cur_progress,
                speed: _speed
            })
            //{bytesPerSecond: 173206, delta: 170820, percent: 0.8224354816529318, total: 66718425, transferred: 548716}
        })
        ipcRenderer.on('message-download-end', function (event) {
            console.log('message_down end');
            This.setState({
                downloadPercent: 100,
                cancelBtnVisible: 'none',
                okBtnVisible:'inline',
                okName: '开始安装'
            })
        })

    }
    onCancelClick(){

    }
    onCertainClick(e){
        if(this.state.okName == '立即升级'){
            console.log('update update');
            this.setState({
                progressVisible: 'block',
                cancelBtnVisible: 'inline',
                okBtnVisible:'none',
                cancelName: '取消下载'
            })
            ipcRenderer.send('message-update-start-download','');
        }else if(this.state.okName == '开始安装'){
            ipcRenderer.send('message-update-start-install','');
        }
    }
    onWindowClose(){
        ipcRenderer.send('message-update-win-close','');
    }
    render() {
        return (
            <div className="_app_update_com">
                <div className="_header">
                    <span>客户端升级提示</span>
                    <img src={icon_close} onClick={this.onWindowClose}/>
                </div>
                <div className="_content">
                    <p> 当前版本V{client_version}, 最新版V1.0.2(升级包: 20MB)</p>

                    <p>新版说明：</p>
                    <p>1.xxxxxxxxxxxxx</p>
                    <p>1.xxxxxxxxxxxxx</p>
                    <p>1.xxxxxxxxxxxxx</p>
                </div>
                <div className="_progress" style={{display: this.state.progressVisible}}>
                    <Progress percent={this.state.downloadPercent} showInfo={false}/>
                    <div className="_tip">
                        <span>下载进度：<label className="_percent">{this.state.downloadPercent} %</label></span>
                        <span>下载速度：<label className="_speed">{this.state.speed} KB/s</label></span>
                    </div>
                </div>
                <div className="_footer">
                    <Button
                        onClick={this.onCancelClick.bind(this)}
                        style={{ display:this.state.cancelBtnVisible}}
                        size="large"
                    >
                        {this.state.cancelName}
                    </Button>
                    <Button
                        onClick={this.onCertainClick.bind(this)}
                        type="primary"
                        size="large"
                        style={{marginLeft:30, display:this.state.okBtnVisible}}
                    >
                        {this.state.okName}
                    </Button>
                </div>
            </div>
        );
    }
}
export default AppUpdate;
