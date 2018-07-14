
import React, { Component } from 'react';
import {Button, Input, Checkbox, Icon, Modal, Layout} from 'antd'
import YQ from '@components/yq'
import jQuery from 'jquery';
import PageHeader from '@components/PageHeader'
import PageContent from "@components/PageContent";
import ExamInfoHeader from "@components/ExamInfoHeader";
import ScanButton from "@components/ScanButton";
import SystemState from "@components/SystemState";
import './style.less'
const { Header, Footer, Sider, Content } = Layout;
const electron = window.require('electron');
const { remote, ipcRenderer } = electron;


class TemplateUpload extends Component {
    constructor(props) {
        super(props);
        this.state = {
            main_image_url: null,
            selected_image_id: null,
            imgIndex: 1,
            scanningState: 2,  //扫描状态
            imgList: [],  //图片列表数据
        };

        this.maxImgWidth = 1500;
        this.minImgWidth = 600;
        this.imgScale = 30;
        this.isFirst = true;

        this.onStartScanClick = this.onStartScanClick.bind(this);
        this.onEndScanListener = this.onEndScanListener.bind(this);
        this.updatePageData = this.updatePageData.bind(this);

        //设置为模板上传类型
        remote.getGlobal('sharedObject').scan_type = 'template';
    }
    componentDidMount(){
        const _this = this;

        ipcRenderer.on('message-upload-template-callback',function (e, res) {
            console.log('上传完成');
        })
        ipcRenderer.on('message-upload-template-progress',function (e, res) {
            console.log(res);
        })

        jQuery('#img_list').on('click','img',function () {

            var _img_url = jQuery(this).attr('img_url');
            var _key_id = jQuery(this).attr('img_id');
            var _index = jQuery(this).index() + 1;
            _this.setState({
                selected_image_id: _key_id,
                main_image_url: _img_url,
                imgIndex: _index
            })
        })
        this.updatePageData();
        setInterval(function () {
            _this.updatePageData();
        },5000);
    }
    updatePageData(){
        var _url = YQ.util.make_local_url('/get_templates');
        var _this = this;
        YQ.http.get(_url, {}, function (res) {
            if(res.type != 'ERROR'){
                _this.setState({
                    imgList: res.data
                });
                //console.log(res.data);
                if(res.data.length > 0){
                    if(_this.isFirst){
                        _this.isFirst = false;
                        _this.setState({
                            selected_image_id: res.data[0]._id,
                            main_image_url: res.data[0].filepath,
                            imgIndex: 1
                        })
                    }
                }else{
                    _this.isFirst = true;
                }
            }
        });
    }
    //点击右侧图片缩略图
    handleClickImg = (index) => {
        //console.log(index);
        if(index != this.state.selectedImg){
            this.setState({
                selectedImg: index,
                scaleX: 1,
                widthChange: '',
                rotateChange: 0
            })
        }
    };
    //点击放大按钮（最多扩大50%）
    handleEnlarge = () => {

        var _nowWidth = jQuery('#main_image').width() + this.imgScale;
        if(_nowWidth< this.maxImgWidth){
            jQuery('#main_image').css('width', _nowWidth+'px');
        }
    };
    //点击缩小按钮（最多缩小50%）
    handleSmall = () => {
        var _nowWidth = jQuery('#main_image').width() - this.imgScale;
        if(_nowWidth > this.minImgWidth){
            jQuery('#main_image').css('width', _nowWidth+'px');
        }
    };

    handleDeleteBtn = () => {
        var _url = YQ.util.make_local_url('/delete_templates');
        var _this = this;
        YQ.http.post(_url, {}, function (res) {  //请求扫面出的图片列表数据
            if(res.type != 'ERROR'){
                console.log('删除完成');
                _this.updatePageData();
            }
        });
    };
    //上传图片
    handleLoadImg = () => {
        const _this = this;
        console.log('上传photo');
        ipcRenderer.send('message-upload-template',this.state.imgList);
    };
    onImgListClick(){
        console.log('log');
    }
    onStartScanClick(){
        //console.log('开始扫描');
    }
    //结束扫描
    onEndScanListener(){

    }
    render() {
        var This = this;
        return (
            <div className="template_upload_html">
                <PageHeader>
                    <div className="app_exam_info">
                        <div className="exam_info"><ExamInfoHeader onClick={this.onChangeExamInfo} data={this.state.exam_info} /></div>
                        <div className="scan_btn"><ScanButton onStartScan={this.onStartScanClick} onEndScan={this.onEndScanListener}/></div>
                    </div>
                </PageHeader>
                <PageContent>
                    <Layout>
                        <Content>
                            <div className="header_wrap">
                                <a href="javascript:;">
                                    <Icon className="back_icon" type="left" /><span className="back_btn">返回</span>
                                    <span className="tips_text">操作提示：请确认模板图片需清晰、正立、不缺页，且为本学科答题卡；否则请删除重新扫描。</span>
                                </a>
                                {
                                    this.state.scanningState !== 0 ? (
                                        <div>
                                            <span className="current_location">
                                                当前位置：第 {this.state.imgIndex}
                                                页 / 共 {this.state.imgList.length} 页
                                            </span>
                                            <Icon className="turn_small" type="minus-circle-o" onClick={this.handleSmall} />
                                            <Icon className="turn_large" type="plus-circle-o" onClick={this.handleEnlarge} />
                                        </div>
                                    ) : null
                                }
                            </div>
                            <div className="content_wrap">
                                {
                                    this.state.imgList.length == 0 ? (
                                        <div className="no_paper_tips_wrap">
                                            <span>
                                                暂无内容<br/>
                                                请「开始扫描」
                                            </span>
                                        </div>
                                    ) : (

                                        <div className="img_content_wrap">
                                            <img
                                                id="main_image"
                                                src={this.state.main_image_url}
                                            />
                                        </div>
                                    )
                                }
                            </div>
                        </Content>
                        <Sider width="300">
                            <h3 className="modal_title">模板扫描</h3>
                            <div>
                                <p className="testPaper_num">试卷张数：{this.state.imgList&&this.state.imgList.length}张</p>
                                <div className="img_list" id="img_list">
                                    {
                                        this.state.imgList&&this.state.imgList.map(function(item, index){
                                            return (
                                                <img
                                                    img_url={item.filepath}
                                                    img_id={item._id}
                                                    key={item._id}
                                                    src={item.filepath}
                                                    className="img_item"
                                                    style={{borderColor: This.state.selected_image_id == item._id ? '#2D6EDB': '#ccc'}}
                                                />
                                            )
                                        })
                                    }
                                </div>
                                <div className="btn_wrap">
                                    <Button onClick={this.handleDeleteBtn}>删除重扫</Button>
                                    <Button onClick={this.handleLoadImg}>上传图片</Button>
                                </div>
                            </div>
                        </Sider>
                    </Layout>
                </PageContent>
            </div>
        );
    }
}

export default TemplateUpload;
