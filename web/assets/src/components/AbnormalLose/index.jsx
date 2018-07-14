
import React, { Component } from 'react';
import {Button} from 'antd';
import './style.less'

/*
 接口回调：
 removePaperClick()   //移除缺考
 laterSolveClick()   //稍后处理

 */
class AbnormalLose extends Component{
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
    render(){
        return(
            <div className="_abnormal_lose_com">
                <div className="_title">提示</div>
                <div className="_sub_title">
                    <p>1.请确定该卷为本科考卷，若不是，请删除。</p>
                    <p>2.若不清晰，请找到本卷的卷纸后，重新扫描。</p>
                </div>
                <div className="_op_btn">
                    <Button onClick={this.laterClick.bind(this)}>稍后处理</Button>
                    <Button onClick={this.removeClick.bind(this)} type="primary" style={{width:90,marginLeft:20}}>删除</Button>
                </div>
            </div>
        )
    }
}
export default AbnormalLose;