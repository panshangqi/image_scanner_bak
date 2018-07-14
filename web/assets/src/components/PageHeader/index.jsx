
import React, { Component } from 'react';
import { Menu, Dropdown, Icon } from 'antd';
import DriveSetting from '@components/DriveSetting'
import NetSpeedCheck from '@components/NetSpeedCheck'
import DirectorySetting from '@components/DirectorySetting'
import AppVersion from '@components/AppVersion'
import './style.less';

import icon_close from '@imgs/close.png'
import icon_maxsize from '@imgs/maxsize.png'
import icon_minisize from '@imgs/minisize.png'
import icon_setting from '@imgs/setting.png'
import icon_logo from '@imgs/17logo.png'

const electron = window.require('electron');
const {ipcRenderer, remote} = electron;


class PageHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            maxwindow: false
        }
        this.onLoadMenu = this.onLoadMenu.bind(this);
        this.onSettingClick = this.onSettingClick.bind(this);
        this.onMaxiWindow = this.onMaxiWindow.bind(this);
        this.onCloseWindow = this.onCloseWindow.bind(this);
    }
    onSettingClick(e){
        if (e.key == "0") {
            this.refs.drive_dlg.showDialog();
        } else if (e.key === "2") {
            this.refs.net_speed_dlg.showDialog();
        } else if (e.key === "4") {
            this.refs.directory_dlg.showDialog();
        }
    }
    onMinWindow(){
        ipcRenderer.send('message-window-min','');
    }
    onMaxiWindow(){
        if(this.state.maxwindow == false){
            this.state.maxwindow = true;
            ipcRenderer.send('message-window-maxi','');
        }else{
            this.state.maxwindow = false;
            ipcRenderer.send('message-window-unmaxi','');
        }

    }
    onCloseWindow(){
        ipcRenderer.send('message-window-hide','');
    }
    onLoadMenu(){
        return (
            <Menu onClick={this.onSettingClick}>
                <Menu.Item key="0">
                    <span>驱动设置</span>
                </Menu.Item>
                <Menu.Item key="1">
                    <span>关于</span>
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item key="2">网络测速工具</Menu.Item>
                <Menu.Item key="3">扫描测速工具</Menu.Item>
                <Menu.Item key="4">目录查看工具</Menu.Item>
            </Menu>
        );
    }
    render() {
        return (
            <div className="page_head">

                <DriveSetting ref="drive_dlg"/>
                <NetSpeedCheck ref="net_speed_dlg"/>
                <DirectorySetting ref="directory_dlg" />

                <div className="app_logo">
                    <img src={icon_logo}/>
                </div>
                <div className="windows_btns">
                    <div className="win_btn">
                        <Dropdown
                            overlay={this.onLoadMenu()}
                            trigger={['click']}
                        >
                            <a className="ant-dropdown-link" href="#">
                                <img src={icon_setting}/>
                            </a>
                        </Dropdown>
                    </div>
                    <div className="win_btn" onClick={this.onMinWindow}>
                        <img src={icon_minisize}/>
                    </div>
                    <div className="win_btn">
                        <img src={icon_maxsize} onClick={this.onMaxiWindow}/>
                    </div>
                    <div className="win_btn">
                        <img src={icon_close} onClick={this.onCloseWindow}/>
                    </div>
                </div>

                <div style={{"display": "flex"}}>
                    <div>{this.props.children}</div>
                </div>
            </div>
        );
    }
}

export default PageHeader;
