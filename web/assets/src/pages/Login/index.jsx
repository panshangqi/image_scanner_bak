
import React, { Component } from 'react';
import {Button, Input, Checkbox, Icon } from 'antd'
import './style.less';
import YQ from '@components/yq'
import PageHeader from '@components/PageHeader'
import PageContent from "@components/PageContent";

const electron = window.require('electron');
const { remote } = electron;
const ping = window.require('ping')

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: "",
            password: "",
            remember: false
        };
        this.onLoginClick = this.onLoginClick.bind(this);
        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onChangeRemember = this.onChangeRemember.bind(this);
        this.onChangeExamInfo = this.onChangeExamInfo.bind(this);
        this.onStartScanClick = this.onStartScanClick.bind(this);
        this.onEndScanListener = this.onEndScanListener.bind(this);
    }
    componentDidMount(){

        var _token = YQ.cookies.load('token');
        var _username = YQ.cookies.load('username');
        var _password =  YQ.cookies.load('password');
        var _remember = YQ.cookies.load('remember');
        var _user = YQ.cookies.load('user');
        this.setState({
            username: _username
        })
        //console.log(_token,_remember, _password, _user);
        if(_remember && _password){
            this.setState({
                password: _password,
                remember: true,
            })
        }
    }
    onLoginClick(){

        var username = this.state.username;
        var password = this.state.password;
        var url = YQ.util.make_aliyun_url('/user/login');
        var This = this;
        YQ.http.post(url,{'username':username,'password':password},function (res) {
            if(res.type != 'ERROR'){
                console.log(res);
                YQ.cookies.save('token',res.body.token);
                YQ.cookies.save('username',username);
                YQ.cookies.save('password', password);
                YQ.cookies.save('user_id', res.body.user.user_id);
                YQ.cookies.save('user',res.body.user);
                if(This.state.remember == true){
                    YQ.cookies.save('remember','true');
                }else{
                    //cookies.remove('remember');
                }
                This.props.history.push('/scan_pattern');
            }else{
                console.log(res);
            }
        })
    }
    onChangeUsername(event){
        this.state.username = event.target.value;
    }
    onChangePassword(event){
        this.state.password = event.target.value;
    }
    onChangeRemember(event){
        this.setState({
            remember: event.target.checked
        })
    }
    onChangeExamInfo(){
        this.setState({
            exam_info:{
                "school_id":"0023",
                "school_name":"第一附属中学",
                "exam_id":"0313f2ad0fad0fa0dfadf",
                "exam_name":"第一次其中考试",
                "subject_id":"english",
                "subject_name":"英语"
            }
        })
    }
    onStartScanClick(){
        console.log('开始扫描');
    }
    onEndScanListener(){
        console.log('结束扫描');
    }
    render() {
        return (
            <div className="login_html">
                <PageHeader>

                </PageHeader>
                <PageContent>
                    <div className="login_box">
                        <Input type="text"
                               onChange={this.onChangeUsername}
                               defaultValue={this.state.username}
                               addonBefore={<Icon type="user" />}
                               size="large"
                               style={{width:360,marginTop:30}}
                        />
                        <Input
                            type="password"
                            onChange={this.onChangePassword}
                            defaultValue={this.state.password}
                            addonBefore={<Icon type="lock" />}
                            size="large"
                            style={{width:360,marginTop:25}}
                        />
                        <div style={{width:360,marginTop:25}}>
                            <Checkbox
                                onChange={this.onChangeRemember}
                                checked={this.state.remember}
                            >记住密码
                            </Checkbox>
                        </div>
                        <Button onClick={this.onLoginClick}
                                type="primary"
                                size="large"
                                style={{width:360,marginTop:25}}
                        >
                            登陆
                        </Button>
                    </div>
                </PageContent>
            </div>

        );
    }
}

export default Login;
