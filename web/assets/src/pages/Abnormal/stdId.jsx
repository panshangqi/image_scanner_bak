
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
function onSelect(value) {
  console.log('onSelect', value);
}

class StdId extends Component{
    constructor(props){
        super(props);
        this.state = {
            dataSource: [],
            content_min_height: 0
        };
    }

    componentDidMount(){
        this.setState({
            content_min_height: window.innerHeight - 36 - 16
        });
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

    handleSearch = (value) => {
        this.setState({
          dataSource: !value ? [] : [
            value,
            value + value,
            value + value + value,
          ],
        });
    }

    render(){
        const minHeight = {
            minHeight: this.state.content_min_height
        };
        const { dataSource } = this.state;
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
                            <p>1.处理考号不存在或者考号重复时，请查看学生的姓名或学号，查找学生正确的考号信息后，点击[完成匹配]，完成异常处理。</p>
                            <p>2.若为空白卷，可直接删除。</p>
                        </div>
                        <div className="search_student">
                            <span>考生:</span>
                            <AutoComplete
                                style={{ width: 200 }}
                                dataSource={dataSource}
                                placeholder="输入学生姓名或学号"
                                onSelect={onSelect}
                                onSearch={this.handleSearch}
                            >
                                <Input suffix={<Icon type="search" className="certain-category-icon" />} />
                            </AutoComplete>
                        </div>
                        <div className="op_btns">
                            <Button onClick={this.removeClick.bind(this)} type="primary" ghost>删除</Button>
                            <Button onClick={this.laterClick.bind(this)} type="primary" ghost>稍后处理</Button>
                            <Button onClick={this.certainClick.bind(this)} type="primary">完成匹配</Button>
                        </div>
                    </div>
                </Col>
            </SubPage>
        )
    }
}
export default StdId;