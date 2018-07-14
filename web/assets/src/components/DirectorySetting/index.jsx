
import React, { Component } from 'react';
import { Modal, Button} from 'antd';
import YQ from '@components/yq'
import './style.less';
const electron = window.require('electron');
const {ipcRenderer, remote} = electron;
const diskspace = window.require('diskspace');


class DirectorySettingDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            installationPath: remote.app.getPath('exe'),  //安装路径
            savePath: '',  //保存路径
            spaceResidual: ''  //磁盘剩余
        };
    }
    componentDidMount(){
        this.setState({
            installationPath: remote.app.getPath('exe'),  //获取程序默认安装路径
            savePath: YQ.util.get_ini('picture')  //获取数据存放路径
        });
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
    handleCancel = () => {

        const _this = this;
        this.setState({
            visible: false
        });
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
    };
    handleChangeDirectory = () =>{
        console.log('更改目录');
        electron.remote.dialog.showOpenDialog({
            properties: ['openDirectory'],
            defaultPath: "C:\\"
        }, (filenames)=>{
            console.log(filenames);
            YQ.util.set_ini('picture',filenames[0]);  //更改目录
            this.setState({
                savePath: YQ.util.get_ini('picture')  //获取数据存放路径
            })
        });

    };
    handleRemoveCaching = () =>{
        console.log('清除缓存')
    };
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
        );
    }
}
export default DirectorySettingDialog;
