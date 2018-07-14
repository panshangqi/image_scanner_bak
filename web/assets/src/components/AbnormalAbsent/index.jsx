
import React, { Component } from 'react';
import {Button} from 'antd';
import './style.less'

/*
 接口回调：
 removePaperClick()   //移除缺考
 laterSolveClick()   //稍后处理
 certainAbsenceClick()   //确认缺考
 */
class AbnormalAbsent extends Component{
    constructor(props){
        super(props);
    }
    componentDidMount(){

    }
    removeClick(){
        if(this.props.removePaperClick && typeof this.props.removePaperClick ==='function'){
            this.props.removePaperClick();
        }
    }
    laterClick(){
        if(this.props.laterSolveClick && typeof this.props.laterSolveClick ==='function'){
            this.props.laterSolveClick();
        }
    }
    certainClick(){
        if(this.props.certainAbsenceClick && typeof this.props.certainAbsenceClick ==='function'){
            this.props.certainAbsenceClick();
        }
    }
    render(){
        return(
            <div className="_abnormal_absent_com">
                <div className="_title">提示</div>
                <div className="_sub_title">
                    <p>1.若该学生已作答，只是错误的填涂了缺考标记，则“移出缺考”。</p>
                    <p>2.若确实未作答卷，确认“缺考”。</p>
                </div>
                <div className="_op_btn">
                    <Button onClick={this.removeClick.bind(this)}>移除缺考</Button>
                    <Button onClick={this.laterClick.bind(this)} type="primary">稍后处理</Button>
                    <Button onClick={this.certainClick.bind(this)} type="primary">确认缺考</Button>
                </div>
            </div>
        )
    }
}
export default AbnormalAbsent;