
import React, { Component } from 'react';
import { Row } from 'antd';

import './style.less';
import icon_logo from '@imgs/sm_logo.svg';
import icon_close from '@imgs/close.png';

const electron = window.require('electron');
const { ipcRenderer } = electron;

class SubPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: this.props.title || '窗口',
            content_min_height: 0
        };
        this.onCloseWindow = this.onCloseWindow.bind(this);
    }

    onCloseWindow(){
        ipcRenderer.send('message-window-hide','');
    }

    componentDidMount(){
        this.setState({
            content_min_height: window.innerHeight - 36
        });
    }

    render() {
        const minHeight = {
            minHeight: this.state.content_min_height
        };
        return (
            <div className="sub_page">
                <div className="sub_page_header">
                    <div className="logo">
                        <img src={icon_logo}/>
                        <span className="title">{this.state.title}</span>
                    </div>
                    <div className="close" onClick={this.onCloseWindow}>
                        <img src={icon_close}/>
                    </div>
                </div>
                <div className="sub_page_content" style={minHeight}>
                    <Row gutter={16}>
                        {this.props.children}
                    </Row>
                </div>
            </div>
        );
    }
}

export default SubPage;
