
import React, { Component } from 'react';
import { Modal, Icon, Radio } from 'antd';

import './style.less';
import YQ from '@components/yq.jsx'
import $ from 'jquery'

const RadioGroup = Radio.Group;
const electron = window.require('electron');
const {ipcRenderer, remote} = electron;
const { exec } = window.require('child_process');

var client_version = remote.app.getVersion();
class AbnormalPictureCorrect extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imageDefaultWidth: 700,
            imageList:[],
            show_image_url: null
        }
        this.minWidth = 500;
        this.maxWidth = 1000;
        this.onEnlargeClick = this.onEnlargeClick.bind(this);
        this.onLessClick = this.onLessClick.bind(this);
        this.onLeftRotateClick = this.onLeftRotateClick.bind(this);
        this.onRightRotateClick = this.onRightRotateClick.bind(this);
        this.onGetLayout = this.onGetLayout.bind(this);
        this.onCanvas = this.onCanvas.bind(this);
    }
    componentDidMount(){
        var test_img = YQ.util.make_local_url('/f9faaa40d6e8a9f73be2d420bc08dde4_1.jpg');
        var test_img1 = YQ.util.make_local_url('/5db56b11d1aa41a2a6ae2a4aec71f2e2_1.jpg');
        var test_img2 = YQ.util.make_local_url('/5ddd61b3bf2748b59304509f37f01a50_0.jpg');
        var test_img3 = YQ.util.make_local_url('/5ddd61b3bf2748b59304509f37f01a50_1.jpg');
        var lists = [];
        lists.push({
            image_url: test_img
        })
        lists.push({
            image_url: test_img1
        })
        lists.push({
            image_url: test_img2
        })
        lists.push({
            image_url: test_img3
        })
        this.setState({
            imageList: lists,
            show_image_url: lists[0].image_url
        })
    }
    onEnlargeClick(){
        var _Width = this.state.imageDefaultWidth + 20;
        if(_Width > this.maxWidth)
            return;
        this.setState({
            imageDefaultWidth: _Width
        })
    }
    onLessClick(){
        var _Width = this.state.imageDefaultWidth - 20;
        if(_Width < this.minWidth)
            return;
        this.setState({
            imageDefaultWidth: _Width
        })
    }
    onLeftRotateClick(){

    }
    onRightRotateClick(){

    }
    onGetLayout(){
        var This = this;
        var url = YQ.util.make_aliyun_url('/exam/exam/anscard_info');
        YQ.http.get(url, {exam_id:'5b488d72892b1a0ee83773a1', subject:'math_science' }, function (res) {

            var info_list = res.body.anscard_info;
            var idx = 0;
            var info = [];
            console.log(info_list);
            for(var key in info_list){
                if(idx==0){

                    info = info_list[key];
                }
                idx++;
            }
            console.log(info);
            This.onCanvas(info[0].layout.header);

        })
    }

    onCanvas(_info){
        if(_info.children){

            var _children = _info.children;
            console.log(_children);
            for(var i=0;i<_children.length;i++){
                var child = _children[i];

                var html = '<div style="border:1px solid #ff00ff;position: absolute;left: '+child.x+'px;top:'+child.y+'px; width: '+child.w+'px; height:'+child.h+'px;">';

                $('#_picture_show').append(html);


            }
        }

    }


    render() {

        return (
            <div className="_picture_correct_com">
                <div className="_picture_title">
                    <Icon type="minus-circle-o" onClick={this.onLessClick} />
                    <Icon type="plus-circle-o" onClick={this.onEnlargeClick} />
                    <button onClick={this.onLeftRotateClick}>左旋2'</button>
                    <button onClick={this.onRightRotateClick}>右旋2'</button>
                    <button onClick={this.onGetLayout}>获取答题卡布局</button>
                </div>
                <div className="_picture_show" id="_picture_show">

                </div>
                <div className="_picture_list">
                    {
                        this.state.imageList.map(function(item, index){
                            return (
                                <img src={item.image_url} key={index+'image'} className="view_pic"/>
                            )
                        })
                    }
                </div>
            </div>
        );
    }
}
export default AbnormalPictureCorrect;

/*
* <!--img src={this.state.show_image_url} width={this.state.imageDefaultWidth} /-->
* */