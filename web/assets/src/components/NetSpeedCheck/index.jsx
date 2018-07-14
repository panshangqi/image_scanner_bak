
import React, { Component } from 'react';
import { Modal, Button, Radio } from 'antd';
const RadioGroup = Radio.Group;
import './style.less';
import YQ from '@components/yq.jsx'
import $ from 'jquery'
const electron = window.require('electron');
const {ipcRenderer, remote} = electron;

class DriveSettingDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            now_speed: '-/-',
            expected_speed: '-/-',
            pic_rest: '-/-',
        };
        this.onStartTestClick = this.onStartTestClick.bind(this);
    }
    componentDidMount(){

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
    onStartTestClick(){
        console.log('start test speed');
    }

    showDialog() {
        this.setState({
            visible: true,
        });
    }
    hideDialog() {
        this.state({
            visible: false,
        });
    }
    render() {
        return (
            <Modal
                title="网速测试"
                visible={this.state.visible}
                maskClosable={false}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                footer={null}
                style={{ top: 280 }}
            >
                <div className="_dialog_content">
                    <div className="_line_info">
                        <label className="_info_label" style={{ width: 130}}>当前网络上传速度：</label>
                        <span className="_info_span" style={{ marginRight: 70}}>{this.state.now_speed} MB/秒</span>
                    </div>
                        <br/>
                    <div className="_line_info">
                        <label className="_info_label" style={{ width: 100}}>预计上传速度：</label>
                        <span className="_info_span" style={{ marginRight: 100}}>{this.state.expected_speed} 张/分钟</span>
                    </div>
                        <br/>
                    <div className="_line_info">
                        <label className="_info_label" style={{ width: 90}}>待上传图片：</label>
                        <span className="_info_span" style={{ marginRight: 110}}>{this.state.pic_rest} 张</span>
                    </div>
                        <br/>
                        <br/>
                        <br/>
                    <Button className="_op_btn_box" type="primary" onClick={this.handleCancel} >关闭</Button>
                </div>
                <div className="_dialog_foot">

                </div>
            </Modal>

        );
    }
}
export default DriveSettingDialog;
