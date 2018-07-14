require("babel-polyfill");

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './TemplateUploadContent.less';
//import './TemplateUploadContent.css';
import {Modal, Button, Icon} from 'antd';
import YQ from '@components/yq'
import aaa from '@imgs/1.jpg'
const electron = window.require('electron');
const {ipcRenderer, remote} = electron;
var client_version = remote.app.getVersion();
class TemplateUploadContent extends Component {
    constructor(props) {
        super(props);
        console.log("constructor");
        this.state = {
            scanningState: 2,
            imgList: null,
            selectedImg: 0,
            scaleX: 1,
            scaleY: 1,
            widthChange: '',
            rotateChange: 0,
            originWidthVal: 0,
            originHeightVal: 0

        }
        this.saveRef = ref => {this.refDom = ref};
        this.widthVal = '';
        this.timer = null;
        this.timeNum = 0;
        this.region = '';
        this.accessKeyId = '';
        this.accessKeySecret = '';
        this.bucket = '';
    }
    componentDidMount = () => {
        const _this = this;

        var _url = YQ.util.make_local_url('/get_images');
        YQ.http.get(_url, {}, function (res) {
            console.log(res);
            if(res.type != 'ERROR'){

                _this.setState({
                    imgList: res.data
                })
                console.log(res.data);
            }
        })

        //this.loopRequest();
    }
    loopRequest = () => {
        const _this = this;

        var _url = YQ.util.make_local_url('/get_images');

        this.timer = setInterval(function(){

            console.log('setInterval', '<------------')
            _this.timeNum += 1;

            YQ.http.get(_url, {}, function (res) {
                console.log(res);
                if(res.type != 'ERROR'){
                    _this.setState({
                        imgList: res.data
                    })
                    console.log(res.data);
                }
            })
        }, 4000)


    }
    handleClickImg = (index) => {
        console.log(index)
        this.setState({
            selectedImg: index,
            scaleX: 1,
            widthChange: '',
            rotateChange: 0
        })
    }
    handleEnlarge = () => {
        console.log('change large')
        let scaleNum = this.state.scaleX;
        let widthNum = this.widthVal*(scaleNum + 0.1);
        if(scaleNum < 1.5){
            this.setState({
                scaleX: scaleNum + 0.1,
                widthChange: widthNum
            })
        }
    }
    handleSmall = () => {
        console.log('change small')
        let scaleNum = this.state.scaleX;
        let widthNum = this.widthVal*(scaleNum - 0.1);
        if(scaleNum > 0.5){
            this.setState({
                scaleX: scaleNum - 0.1,
                widthChange: widthNum
            })
        }
    }
    imgOnload = () => {
        console.log('onload')
        const {width} = this.refDom;
        this.widthVal = width;
    }
    handleRotateLeft = () => {
        let rotateChangeNum = this.state.rotateChange - 90;
        this.setState({
            rotateChange: rotateChangeNum
        })
    }
    handleRotateRight = () => {
        let rotateChangeNum = this.state.rotateChange + 90;
        this.setState({
            rotateChange: rotateChangeNum
        })
    }
    handleDeleteBtn = () => {
        if(this.state.scanningState == 2){
            this.setState({
                scanningState: 0,
                imgList: null
            })
        }
        clearInterval(this.timer);
    }
    handleLoadImg = () => {
        const _this = this;
        console.log('上传photo')
        YQ.http.get('client/host/sts', {}, function (res) {
            _this.region = res.body.region;
            _this.accessKeyId = res.body.Credentials.AccessKeyId;
            _this.accessKeySecret = res.body.Credentials.AccessKeySecret;
            console.log(res.body.bucket,'<-------------20');
            _this.bucket = res.body.bucket;

            const co = window.require('co');
            const OSS = window.require('ali-oss')
            const client = new OSS({
                region: _this.region + '111',
                accessKeyId: _this.accessKeyId,
                accessKeySecret: _this.accessKeySecret,
                bucket: _this.bucket
            });
            console.log({
                region: _this.region,
                accessKeyId: _this.accessKeyId,
                accessKeySecret: _this.accessKeySecret,
                bucket: _this.bucket
            }, '<-------------------------------')
            co(function* () {
                var result = yield client.put('objectkey', 'C:/Users/mini/Desktop/objects/image_scanner/client/web_dist/static/imgs/1.jpg');
                console.log(result, '<------------loadimg');
            }).catch(function (err) {
                console.log(err);
            });
        })

    }
    handleRotate = (dir) => {
        let rotateChangeNum = this.state.rotateChange + 90;
        let originFlag = 0;
        switch(Math.abs(rotateChangeNum)%360)
        {
            case 90:
                originFlag = 1;
                break;
            case 180:
                originFlag = 0;
                break;
            case 270:
                originFlag = 2;
                break;
            default:
                originFlag = 0
        }
        const {width, height} = this.refDom;
        let originWidthVal = 0;
        let originHeightVal = 0;
        console.log(originFlag == 1, dir>0);
        console.log(width, height);
        if(dir>0){
            switch(originFlag)
            {
                case 0:
                    originWidthVal = width/2;
                    originHeightVal = height/2;
                    break;
                case 1:
                    originWidthVal = height/2;
                    originHeightVal = height/2;
                    break;
                case 2:
                    originWidthVal = width/2;
                    originHeightVal = width/2;
                    break;
                default:
                    originWidthVal = width/2;
                    originHeightVal = height/2;
            }
        }
        /*if((dir>0 && originFlag == 1) || (dir<0 && originFlag == 0)){
            originVal = height/2;
        }else{
            originVal = width/2;
        }*/
        this.setState({
            rotateChange: rotateChangeNum,
            originWidthVal,
            originHeightVal
        })
    }
    render() {
        console.log(this.timeNum, '<-------------this.timeNum')
        if(this.timeNum >= 1 ){
            clearInterval(this.timer);
            this.timeNum = 0;
        }

        let originValStr = this.state.originWidthVal + 'px ' + this.state.originHeightVal + 'px';
        let widthVal = this.state.widthChange?this.state.widthChange + 'px':'';
        let rotateVal = "rotate("+this.state.rotateChange+"deg)";
        console.log(rotateVal, ',_--------------rotateVal')
        console.log(originValStr, ',_--------------rotateVal')
        return (
            <div className="TemplateUploadContent_wrap">
                <div className="slider_left">
                    <h3>模板扫描</h3>
                    {
                        this.state.scanningState != 0 ? (
                            <div>
                                <p>试卷张数：{this.state.imgList&&this.state.imgList.length}张</p>
                                <div className="img_list">
                                    <ul>
                                        {
                                            this.state.imgList&&this.state.imgList.map((val, index)=>{
                                                return (
                                                    <li key={index} onClick={()=>this.handleClickImg(index)}>
                                                        <img src={val.filepath} alt=""/>
                                                    </li>
                                                )
                                            })
                                        }
                                    </ul>
                                </div>
                                <div>
                                    <Button onClick={this.handleDeleteBtn}>删除重扫</Button>
                                </div>
                            </div>
                        ) : null
                    }
                </div>
                <div className="content_wrap">
                    <div className="content_tips">操作提示：请确认模板图片需清晰、正立、不缺页，且为本学科答题卡；否则请删除重新扫描。</div>
                    {
                        this.state.scanningState == 0 ? (
                            <div className="content_img">暂无内容请“开始扫描”</div>
                        ) : (
                            <div>
                                <div>
                                    <Icon type="left-circle-o" style={{"marginRight": "20px"}} onClick={()=>this.handleRotate(-1)} />
                                    <Icon type="plus-circle-o" style={{"marginRight": "20px"}} onClick={this.handleEnlarge} />
                                    <Icon type="minus-circle-o" style={{"marginRight": "20px"}} onClick={this.handleSmall} />
                                    <Icon type="right-circle-o" onClick={()=>this.handleRotate(1)} />
                                </div>
                                <div className="img_wrap">
                                    {
                                        this.state.imgList&&this.state.imgList.map((val, index)=>{
                                            if(index == this.state.selectedImg){
                                                return (

                                                    <img className="img_self" key={index} ref={this.saveRef} onLoad={this.imgOnload} style={{"width": widthVal, "transform": rotateVal, "-webkit-transform-origin": originValStr}} src={val.filepath} alt=""/>

                                                )
                                            }
                                        })
                                    }
                                </div>
                                <Button onClick={this.handleLoadImg}>上传图片</Button>
                            </div>
                        )
                    }
                    
                </div>
            </div>
        );
    }
}

export default TemplateUploadContent;
