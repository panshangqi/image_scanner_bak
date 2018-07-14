import React, { Component } from 'react';
import './style.less';
import {Modal, Button} from 'antd';
import YQ from '@components/yq'

const electron = window.require('electron');
const {ipcRenderer, remote} = electron;
const client_version = remote.app.getVersion();
const diskspace = window.require('diskspace')

class SystemState extends Component {
    constructor(props) {
        super(props);
        console.log("constructor");
        this.state = {
            systemState: 0,  //设备状态
            disk: 0,  //磁盘状态
            network: 0,  //网络状态
            visible: false,
            installationPath: remote.app.getPath('exe'),  //安装路径
            savePath: '',  //保存路径
            spaceResidual: ''  //磁盘剩余
        }
    }
    componentDidMount = () => {
        /*YQ.http.post(url,function (res) {
            console.log(res);
            This.props.history.push('/home');
        })*/

        this.setState({
            installationPath: remote.app.getPath('exe'),  //获取程序默认安装路径
            savePath: YQ.util.get_ini('picture')  //获取数据存放路径
        })
        let _this = this;
        //查看磁盘空间状态
        diskspace.check('C',function (err,result) {
            if(!err){

                _this.setState({
                    spaceResidual: result.free/(1024*1024*1024)
                })
            }else{
                console.log(err);
            }
        })
    }
    handleSetClick = () => {
        this.setState({
            visible: true
        })
    }
    handleChangeDirectory = () =>{
        console.log('更改目录')
        electron.remote.dialog.showOpenDialog({
            properties: ['openDirectory'],
            defaultPath: "C:\\"
        }, (filenames)=>{
            console.log(filenames)
            YQ.util.set_ini('picture',filenames[0]);  //更改目录
            this.setState({
                savePath: YQ.util.get_ini('picture')  //获取数据存放路径
            })
        });

    }
    handleRemoveCaching = () =>{
        console.log('清除缓存')
    }
    handleCancel = () => {
        const _this = this;
        this.setState({
            visible: false
        })
        //查看磁盘空间状态
        diskspace.check('C',function (err,result) {
            if(!err){
                _this.setState({
                    spaceResidual: result.free/(1024*1024*1024)
                })
            }else{
                console.log(err);
            }
        })
    }
    render() {

        return (
            <div className="SystemState_wrap">
                <ul className="SystemState_list">
                    <li className="mg40">
                        {
                            this.state.systemState ?　(
                                <p className="SystemState_item"><i className="SystemState_icon_green"></i><span className="SystemState_text"> 设备：已连接</span></p>
                            ) : (
                                <p className="SystemState_item"><i className="SystemState_icon_red"></i><span className="SystemState_text"> 设备：未连接 <a href="javascript:;" onClick={this.handleSetClick}>去设置</a></span></p>
                            )
                        }
                    </li>
                    <li className="mg40">
                        {
                            this.state.systemState ?　(
                                <p className="SystemState_item"><i className="SystemState_icon_green"></i><span className="SystemState_text"> 网络：未连接</span></p>
                            ) : (
                                <p className="SystemState_item"><i className="SystemState_icon_red"></i><span className="SystemState_text"> 网络：已连接</span></p>
                            )
                        }
                    </li>
                    <li>
                        {
                            this.state.systemState ?　(
                                <p className="SystemState_item"><i className="SystemState_icon_green"></i><span className="SystemState_text"> 磁盘：正常</span></p>
                            ) : (
                                <p className="SystemState_item"><i className="SystemState_icon_red"></i><span className="SystemState_text"> 磁盘：磁盘空间不足5GB <a href="javascript:;" onClick={this.handleSetClick}>去设置</a></span></p>
                            )
                        }
                    </li>
                </ul>
                <Modal
                    title="目录查看工具"
                    visible={this.state.visible}
                    mask={true}
                    onCancel={this.handleCancel}
                    closable={true}
                    footer={[
                        <Button key="back" onClick={this.handleCancel}>关闭</Button>
                    ]}
                >
                    <p>程序安装路径：<span>{this.state.installationPath}</span></p>
                    <p>数据存放目录：<span>{this.state.savePath}</span>（<a href="javascript:;" onClick={this.handleChangeDirectory}>更改目录</a>）</p>
                    <p>磁盘剩余空间：<span>{this.state.spaceResidual?this.state.spaceResidual.toFixed(2):''}GB</span>（<a href="javascript:;" onClick={this.handleRemoveCaching}>清除缓存</a>）</p>
                </Modal>
            </div>
        );
    }
}

export default SystemState;
