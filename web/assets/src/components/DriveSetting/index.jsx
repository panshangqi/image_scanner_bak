
import React, { Component } from 'react';
import { Modal, Button, Radio } from 'antd';

import './style.less';
import YQ from '@components/yq.jsx'
import $ from 'jquery'

const RadioGroup = Radio.Group;
const electron = window.require('electron');
const {ipcRenderer, remote} = electron;
const { exec } = window.require('child_process');


class DriveSettingDialog extends Component {
    constructor(props) {
        super(props);
        this.state={
            visible: false,
            default_drive:'',
            drive_list:[]
        }
        this.handleCancel = this.handleCancel.bind(this);
        this.onRadioChange = this.onRadioChange.bind(this);
        this.onSeniorSettingClick = this.onSeniorSettingClick.bind(this);
        this.showDialog = this.showDialog.bind(this);
        this.hideDialog = this.hideDialog.bind(this);

    }
    componentDidMount(){

    }
    showDialog(){
        this.setState({
            visible: true
        })
        //获取驱动列表 执行获取驱动的命令，然后TwainDriver.exe 会向主程序发送http请求，
        //告诉主程序，然后主程序执行message-drive-list 消息
        var _this = this;
        exec("TwainDriver.exe 4",{},function(err,data){

            var all_drives = YQ.util.get_ini('drive_list');
            all_drives = JSON.parse(all_drives);
            console.log(all_drives);
            if(all_drives && $.isArray(all_drives)){
                all_drives.unshift("ScanSnap IX500");
                _this.setState({
                    drive_list: all_drives
                })
            }
        });
        this.setState({
            default_drive: YQ.util.get_ini('drive')
        })
    }
    hideDialog(){
        this.setState({
            visible: false
        })
    }
    onSetDefultClick = (e) => {
        YQ.util.set_ini('drive', this.state.default_drive);
    }
    //高级驱动设置
    onSeniorSettingClick = (e) =>{

        exec("TwainDriver.exe 2",{},function(err,data){

        });
    }
    handleOk = (e) => {

        this.setState({
            visible: false,
        });
    }
    handleCancel = (e) => {

        this.setState({
            visible: false,
        });
    }
    onRadioChange = (e) => {
        this.state.default_drive = e.target.value;
        YQ.util.set_ini('drive', this.state.default_drive);
    }
    render() {
        return (
            <Modal
                title="驱动设置"
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                footer={null}
            >
                <div id="drive_setting_dialog">
                    <div className="_dialog_content">
                        <div className="_drive_list_box">
                            <RadioGroup onChange={this.onRadioChange} defaultValue={this.state.default_drive}>
                                {
                                    this.state.drive_list.map(function(item, index){
                                        return (<div key={item+index}><Radio value={item} key={item+index}>{item}</Radio></div>)
                                    })
                                }
                            </RadioGroup>
                        </div>
                        <div className="_op_btn_box" >
                            <Button onClick={this.onSetDefultClick} type="primary" style={{width:120}}>设为默认驱动</Button>
                            <Button onClick={this.onSeniorSettingClick} type="primary" style={{width:120, marginTop:10}}>高级设置</Button>
                            <Button onClick={this.handleCancel} style={{width:120, marginTop:10}}>返回</Button>
                        </div>
                    </div>
                    <div className="_dialog_foot">

                    </div>
                </div>
            </Modal>
        );
    }
}
export default DriveSettingDialog;
