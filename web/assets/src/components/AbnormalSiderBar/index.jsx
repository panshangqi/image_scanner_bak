
import React, { Component } from 'react';
import { Modal, Collapse , Radio } from 'antd';

import './style.less';
import YQ from '@components/yq.jsx'
import $ from 'jquery'
const Panel = Collapse.Panel;
const RadioGroup = Radio.Group;
const electron = window.require('electron');
const {ipcRenderer, remote} = electron;
const { exec } = window.require('child_process');

var client_version = remote.app.getVersion();
class AbnormalSiderBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            paper_total: 50,
            paper_solved: 5,
            lack_total: 30,  //缺考
            lack_solved: 6,
            object_total: 33,
            object_solved: 20, //客观题
            student_total: 33,
            student_solved: 25, //考生
            lose_total: 60,
            lose_solved: 23  //缺页
        }
    }
    componentDidMount(){

    }
    render() {
        return (
            <div className="_abnormal_nav_com">
                <Collapse defaultActiveKey={['4']}>
                    <Panel header={"试卷识别异常(" + this.state.paper_solved + "/" + this.state.paper_total + ")"} key="1">
                        <div className="panel_box"></div>
                    </Panel>
                    <Panel header={"缺考识别异常(" + this.state.lack_solved + "/" + this.state.lack_total + ")"} key="2">
                        <div className="panel_box"></div>
                    </Panel>
                    <Panel header={"客观题识别异常("  + this.state.object_solved + "/" + this.state.object_total +  ")"} key="3">
                        <div className="panel_box"></div>
                    </Panel>
                    <Panel header={"考生识别异常(" + this.state.student_solved + "/" + this.state.student_total +  ")"} key="4">
                        <div className="panel_box"></div>
                    </Panel>
                    <Panel header={"试卷缺页(" + this.state.lose_solved + "/" + this.state.lose_total + ")"} key="5">
                        <div className="panel_box"></div>
                    </Panel>
                </Collapse>
            </div>
        );
    }
}
export default AbnormalSiderBar;
