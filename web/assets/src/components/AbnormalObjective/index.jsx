
import React, { Component } from 'react';
import {Button} from 'antd';
import './style.less'

/*
 接口回调：
 removePaperClick()   //删除
 laterSolveClick()   //稍后处理
 ignoreAllClick() //忽略全部
 */
class AbnormalObjective extends Component{
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
    ignoreClick(){
        if(this.props.ignoreAllClick && typeof this.props.ignoreAllClick ==='function'){
            this.props.ignoreAllClick();
        }
    }
    render(){
        return(
            <div className="_abnormal_objective_com">
                <div className="_title">提示</div>
                <div className="_sub_title">
                    <p>1.红框代表填涂有误的选项，请在图片中点击选项或在输入框中完成修改后，点击[确定]，处理下一位。</p>
                    <p>2.若考生未填涂/看不清考生的填涂。点击[忽略]，进入下一页。</p>
                </div>
                <div className="_op_btn">
                    <Button onClick={this.removeClick.bind(this)} style={{width:90}}>删除</Button>
                    <Button onClick={this.laterClick.bind(this)}>稍后处理</Button>
                    <Button onClick={this.ignoreClick.bind(this)} type="primary">全部忽略</Button>
                </div>
            </div>
        )
    }
}
export default AbnormalObjective;