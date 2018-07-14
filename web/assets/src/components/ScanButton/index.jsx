
import React, { Component } from 'react';
import './style.less';

const electron = window.require('electron');
const {ipcRenderer, remote} = electron;
/*
scan_modal 扫描模式
0： 系统答题卡
1： 第三方答题卡作答试卷
2： 第三方答题卡模板
 */
class ScanButton extends Component {
    constructor(props) {
        super(props);
        this.state={
            button_name:'开始扫描',
            button_bg_color:'#FFD13C'
        }
        this.onClickBtn = this.onClickBtn.bind(this);
        this.onScanEnd = this.onScanEnd.bind(this);
        var _this = this;
        ipcRenderer.on('message-end-scan' ,function(e, arg){
            _this.onScanEnd();
        })
    }
    onClickBtn(){
        if(this.state.button_name == '开始扫描'){

            if(this.props.onStartScan && typeof this.props.onStartScan === 'function')
            {
                this.props.onStartScan();
            }
            this.setState({
                button_name: '正在扫描...',
                button_bg_color: '#13D469'
            })
            ipcRenderer.send('message-start-scan', 'true');
        }
    }
    onScanEnd(){
        this.setState({
            button_name: '开始扫描',
            button_bg_color: '#FFD13C'
        })
        if(this.props.onEndScan && typeof this.props.onEndScan === 'function')
        {
            this.props.onEndScan();
        }
    }

    render() {
        var _style = this.props.style || {};
        _style['backgroundColor'] = this.state.button_bg_color;
        return (
            <button className="_scan_button_com"
                    style={_style}
                    onClick={this.onClickBtn}
            >
                {this.state.button_name}
            </button>
        );
    }
}
export default ScanButton;
