
import React, { Component } from 'react';
import { Col, Button, Input, AutoComplete, Icon} from 'antd';

import SubPage from '@components/SubPage';
import AbnormalSiderBar from '@components/AbnormalSiderBar';
import AbnormalPictureCorrect from '@components/AbnormalPictureCorrect'

/*
 接口回调：
 removePaperClick()   //删除
 laterSolveClick()   //稍后处理
 certainAbsenceClick()   //完成匹配
 */

class Missing extends Component{
    constructor(props){
        super(props);
        this.state = {
            dataSource: [],
            content_min_height: 0
        };
        this.removeClick = this.removeClick.bind(this);
        this.laterClick = this.laterClick.bind(this);
        this.missingClick = this.missingClick.bind(this);
    }

    componentDidMount(){
        this.setState({
            content_min_height: window.innerHeight - 36 - 16
        });
    }

    removeClick(){
    }

    laterClick(){
    }

    missingClick(){
    }

    render(){
        const minHeight = {
            minHeight: this.state.content_min_height
        };
        return(
            <SubPage title="异常处理">
                <Col span={5}>
                    <AbnormalSiderBar />
                </Col>
                <Col span={13}>
                    <AbnormalPictureCorrect />
                </Col>
                <Col span={6}>
                    <div className="assign_result" style={minHeight}>
                        <div className="title">提示</div>
                        <div className="tips">
                            <p>1.若该券学生已作答，只是错误填涂了缺考标识，则“移出缺考”。</p>
                            <p>2.若确实为未作答卷，确认“缺考”。</p>
                        </div>
                        <div className="op_btns">
                            <Button onClick={this.removeClick} type="primary" ghost>移除缺考</Button>
                            <Button onClick={this.laterClick} type="primary" ghost>稍后处理</Button>
                            <Button onClick={this.missingClick} type="primary">确认缺考</Button>
                        </div>
                    </div>
                </Col>
            </SubPage>
        )
    }
}
export default Missing;