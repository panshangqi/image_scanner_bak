
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import YQ from '@components/yq'
import './style.less';


class ExamInfoHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            subject_name:'',
            school_name:'',
            exam_name:'',
        }
    }
    componentDidMount(){
        var _exam_info = YQ.util.get_ini('exam_info');
        if(_exam_info){
            console.log(_exam_info);
            this.setState({
                subject_name:_exam_info.subject_name,
                school_name:_exam_info.school_name,
                exam_name:_exam_info.exam_name,
            })
        }
    }
    render() {

        return (
            <div className="_exam_info_com">
                <table>
                    <tbody>
                        <tr>
                            <td>考试：</td>
                            <td style={{textAlign:'left', width:200}}><div style={{width:180}} title={this.state.exam_name}>{this.state.exam_name}</div></td>
                            <td>学校：</td>
                            <td style={{textAlign:'left', width:200}}><div style={{width:180}} title={this.state.school_name}>{this.state.school_name}</div></td>
                            <td>学科：</td>
                            <td style={{textAlign:'left', width:100}}><div style={{width:90}} title={this.state.subject_name}>{this.state.subject_name}</div></td>
                            <td style={{textAlign:'right'}}>
                                <div className="modify_exam_btn"> <Link to="/select_exam_subject">修改</Link></div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}
export default ExamInfoHeader;
