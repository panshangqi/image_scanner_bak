
import React, { Component } from 'react';
import { Select, Button, Modal} from 'antd';
import './style.less';
import YQ from '@components/yq'
import PageHeader from '@components/PageHeader'
import PageContent from "@components/PageContent";
import ExamInfoHeader from "@components/ExamInfoHeader";
import ScanButton from "@components/ScanButton";
import UserInfoBar from "@components/UserInfoBar";

const electron = window.require('electron');
const { remote } = electron;
const Option = Select.Option;

class SelectExamSubject extends Component {
    constructor(props) {
        super(props);
        this.state = {
            btnPaperState: 'none',
            btnState: 'none',
            btnTpState:'none',
            btnTpState_v2:'none',
            settingPaperDialogShow: false,
            showTemplateDialogShow: false,
            isTPDialog: false,
            exam_data:[],
            subjects:[],
            schools:[],
            exam_id:'',
            exam_name:'',
            subject_id:'',
            subject_name:'',
            school_id:'',
            school_name:'',
            template_info:{
                template_name: '未知',
                anscard_count: 0,
                num_type: '未知',
                objective_item_count: 0,
            },
        };
        this.onExamHandleChange = this.onExamHandleChange.bind(this);
        this.onSubjectHandleChange = this.onSubjectHandleChange.bind(this);
        this.onSchoolHandleChange = this.onSchoolHandleChange.bind(this);
        this.onUploadModalBtn = this.onUploadModalBtn.bind(this);
        this.onSettingPaperClick = this.onSettingPaperClick.bind(this);
        this.onShowTemplateClick = this.onShowTemplateClick.bind(this);
        this.onStepToScanModal = this.onStepToScanModal.bind(this);
        this.saveExamInfo = this.saveExamInfo.bind(this);
    }
    componentDidMount(){

        var url = YQ.util.make_aliyun_url('/exam/exam/list');
        var _this = this;
        YQ.http.get(url,{},function (res) {

            if(res.type == 'ERROR')
                return;
            console.log(res.body);
            _this.setState({
                exam_data: res.body
            },function(){
                //初始化
                var _exam_info = YQ.util.get_ini('exam_info');
                if(_exam_info){
                    console.log(_exam_info);
                    var _data = _this.state.exam_data;
                    for(var i=0;i<_data.length;i++){
                        if(_exam_info.exam_id == _data[i]._id){
                            var subjects = _data[i].subjects;
                            var schools = _data[i].schools;
                            _this.setState({
                                subjects: subjects,
                                schools: schools
                            })
                            break;
                        }
                    }
                    _this.setState({
                        exam_name: _exam_info.exam_name,
                        exam_id: _exam_info.exam_id,
                        subject_name: _exam_info.subject_name,
                        subject_id: _exam_info.subject_id,
                        school_name: _exam_info.school_name,
                        school_id: _exam_info.school_id
                    })

                }

            })

        },false)

    }

    onExamHandleChange(value, options){

        var _exam_id = options.props._id;
        console.log(_exam_id);
        var _data = this.state.exam_data;
        for(var i=0;i<_data.length;i++){
            if(_exam_id == _data[i]._id){
                var subjects = _data[i].subjects;
                var schools = _data[i].schools;
                this.setState({
                    subjects: subjects,
                    schools: schools,
                    exam_id: _data[i]._id,
                    exam_name: _data[i].name,
                    school_name:'',
                    school_id:'',
                    subject_name:'',
                    subject_id:'',
                })
                break;
            }
        }

    }
    onSubjectHandleChange(value, options){   //选择学科

        var This = this;
        this.setState({
            subject_id : options.props._id,
            subject_name : options.props._name
        }, function () {

            if(This.state.subject_name.length>0){

                //判断按钮状态
                var EXAM_DATA = This.state.exam_data;
                for(var i=0;i<EXAM_DATA.length;i++){
                    if(This.state.exam_id == EXAM_DATA[i]._id){

                        var subjects = EXAM_DATA[i].subjects;
                        for(var j=0;j<subjects.length;j++){

                            if(This.state.subject_id == subjects[j].id){
                                // console.log(subjects[j].id,subjects[j].has_paper,subjects[j].is_tp_finished,this.state.subject_id);
                                if(subjects[j].has_paper){  //是否以及关联试卷

                                    if(subjects[j].is_tp_anscard){ //第三方考试
                                        console.log('第三方答题卡');
                                        if(subjects[j].is_tp_finished){
                                            console.log('模板已上传');
                                            this.setState({
                                                btnPaperState: 'none',
                                                btnState: 'none',
                                                btnTpState: 'none',
                                                btnTpState_v2: 'flex',
                                                isTPDialog: true,
                                            });
                                        }else{
                                            console.log('模板未上传');
                                            this.setState({
                                                btnPaperState: 'none',
                                                btnState: 'none',
                                                btnTpState: 'flex',
                                                btnTpState_v2: 'none',
                                            });
                                        }
                                    }else{ //系统模式考试
                                        console.log('系统答题卡');
                                        this.setState({
                                            btnPaperState: 'none',
                                            btnState: 'flex',
                                            btnTpState: 'none',
                                            btnTpState_v2: 'none',
                                            isTPDialog: false,
                                        })
                                    }

                                }else{
                                    console.log('未关联试卷');
                                    this.setState({
                                        btnPaperState:'flex',
                                        btnState: 'none',
                                        btnTpState: 'none',
                                        btnTpState_v2: 'none',
                                    })
                                }
                                break;
                            }
                        }
                        break;
                    }
                }
            }
        });
        var url = YQ.util.make_aliyun_url('/exam/exam/info');
        var params = {
            exam_id: this.state.exam_id,
            subject: options.props._id,
        };
        YQ.http.get(url,params,function (res) {
            if (res.type === 'AJAX') {
                console.log(res.body);
                This.setState({
                    template_info:{
                        template_name: res.body.template_name,
                        anscard_count: res.body.anscard_count,
                        num_type: res.body.num_type,
                        objective_item_count: res.body.objective_item_count,
                    },
                });
            }
        });
    }
    onSchoolHandleChange(value, options){

        this.setState({
            school_id : options.props._id,
            school_name : options.props._name
        })
    }

    onSettingPaperClick(){
        this.setState({
            settingPaperDialogShow:true
        })
    }
    onShowTemplateClick() {

        this.setState({
            showTemplateDialogShow: true,
        });
    }
    onStepToScanModal(){ //判断答题卡模式确定显示什么按钮


    }
    onUploadModalBtn(){
        this.saveExamInfo();
        this.props.history.push('/TemplateUpload');
    }
    saveExamInfo(){
        var result = {
            exam_id: this.state.exam_id,
            exam_name: this.state.exam_name,
            subject_id: this.state.subject_id,
            subject_name: this.state.subject_name,
            school_id: this.state.school_id,
            school_name: this.state.school_name,
        }
        if(result.exam_id.length <=0 || result.subject_id.length <=0){

        }else{
            YQ.util.set_ini('exam_info', result);
        }
    }
    handleOk = (e) => {

        this.setState({
            settingPaperDialogShow: false,
        });
    }
    handleCancel = (e) => {

        this.setState({
            settingPaperDialogShow: false,
        });
    }
    handleTemplateCancel = (e) => {
        this.setState({
            showTemplateDialogShow: false,
        });
    }
    render() {
        const _This = this;
        return (
            <div className="select_exam_subject_html">
                <PageHeader>
                    <div className="user_info_box">
                        <UserInfoBar/>
                    </div>
                </PageHeader>
                <PageContent>
                    <div className="sub_nav">
                        <span>
                            <a>大考模式</a> <a> >  选择扫描的考试科目</a>
                        </span>


                        <a>返回重新选择模式</a>
                    </div>
                    <div className="select_box">
                        <div className="_title">扫描科目选择</div>
                        <div className="_sub_title">辅助文案说明辅助文案说明辅助文案说明辅助助文案说明</div>
                        <div className="select_exam">
                            <Select
                                showSearch
                                style={{ width: 360 }}
                                placeholder="请选择考试"
                                size="large"
                                value={this.state.exam_name}
                                onChange={this.onExamHandleChange}
                            >
                                {

                                    this.state.exam_data.map( function(item, index){
                                        return (
                                            <Option

                                                _id={item._id}
                                                _name={item.name}
                                                key={item._id+index}
                                            >
                                                {item.name}
                                            </Option>)
                                    })
                                }
                            </Select>
                        </div>
                        <div className="select_exam">
                            <Select
                                showSearch
                                style={{ width: 360 }}
                                placeholder="请选择学科"
                                value={this.state.subject_name}
                                size="large"
                                onChange={this.onSubjectHandleChange}
                            >
                                {
                                    this.state.subjects.map( function(item, index){
                                        return (
                                            <Option
                                                _id={item.id}
                                                _name={item.name}
                                                key={item.name+index}
                                            >
                                                {item.name}
                                            </Option>)
                                    })
                                }
                            </Select>
                        </div>
                        <div className="select_exam">
                            <Select
                                showSearch
                                style={{ width: 360 }}
                                placeholder="请选择学校"
                                value={this.state.school_name}
                                size="large"
                                onChange={this.onSchoolHandleChange}
                            >
                                {
                                    this.state.schools.map( function(item, index){
                                        return (
                                            <Option
                                                defaultValue={_This.state.school_name}
                                                _id={item.id}
                                                _name={item.name}
                                                key={item.name+index}
                                            >
                                                {item.name}
                                            </Option>)
                                    })
                                }
                            </Select>
                        </div>
                        <div className="select_exam" style={{display: this.state.btnPaperState }}>
                            <Button type="primary" size="large" style={{width:360}} onClick={this.onSettingPaperClick}>设置答题卡</Button>
                        </div>
                        <div className="select_exam" style={{display: this.state.btnState }}>
                            <Button type="primary" size="large" style={{width:360}} onClick={this.onShowTemplateClick}>开始扫描</Button>
                        </div>
                        <div className="select_exam" style={{display: this.state.btnTpState }}>
                            <Button type="primary" size="large" style={{width:360}} onClick={this.onUploadModalBtn}>上传模板</Button>
                        </div>
                        <div className="select_exam double_buttons" style={{display: this.state.btnTpState_v2 }}>
                            <Button type="primary" size="large"  style={{width:160}} >开始扫描</Button>
                            <Button type="primary" size="large"  style={{width:160}} onClick={this.onShowTemplateClick}>查看模板</Button>
                        </div>
                    </div>

                </PageContent>

                <Modal
                    title="操作提示"
                    visible={this.state.settingPaperDialogShow}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={null}
                >
                    <div className="setting_paper_dialog">

                        <div className="_dialog_tip">
                            请确认设置完答题卡模式后，再返回本客户端执行后续操作。
                        </div>
                        <div className="_op_btn_box" >
                            <Button onClick={this.handleCancel} type="primary" style={{width:120}} className="theme_empty_btn">关闭窗口</Button>
                            <Button onClick={this.onStepToScanModal} type="primary" style={{width:120, marginLeft:20}}>设置完成</Button>
                        </div>

                    </div>
                </Modal>

                <Modal
                    title="操作提示"
                    visible={this.state.showTemplateDialogShow}
                    onCancel={this.handleTemplateCancel}
                    footer={null}
                    keyboard={true}
                    style={{ top: 280 }}
                >
                    <div className="show_template_dialog">

                        <div className="_template_info">
                            <div>
                                <label className="_info_label">当前模板：</label>
                                <span
                                    className="_info_span"
                                    title={this.state.template_info.template_name}
                                >
                                    {this.state.template_info.template_name}
                                </span>
                                <label className="_info_label">考号类型：</label>
                                <span className="_info_span">{this.state.template_info.num_type}</span>
                            </div>
                            <br/>
                            <div>
                                <label className="_info_label">图片张数：</label>
                                <span className="_info_span">{this.state.template_info.anscard_count} 张</span>
                                <label className="_info_label">客观题：</label>
                                <span className="_info_span">{this.state.template_info.objective_item_count} 题</span>
                            </div>
                            <br/>
                            <div style={{ marginLeft: 36 }}>
                                说明：点击确认后，将用此模板进行扫描，否则请修改模板
                            </div>
                            <br/>
                            <br/>
                        </div>
                        <div className="_op_btn_box" >
                            <Button onClick={this.handleTemplateCancel} type="" style={{width:120}} className="theme_empty_btn">关闭窗口</Button>
                            <Button
                                onClick={null}
                                type="primary"
                                style={{width:120, marginLeft:20, display: this.state.isTPDialog? '': 'none'}}
                            >
                                修改模板
                            </Button>
                            <Button onClick={null} type="primary" style={{width:120, marginLeft:20}}>确认扫描</Button>
                        </div>

                    </div>
                </Modal>
            </div>

        );
    }
}

export default SelectExamSubject;
