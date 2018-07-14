
import React, { Component } from 'react';
import cookies from 'react-cookies';
import './style.less';
import YQ from '@components/yq'
import PageHeader from '@components/PageHeader'
import PageContent from "@components/PageContent";
import UserInfoBar from "@components/UserInfoBar";
import {Link} from 'react-router-dom';
const electron = window.require('electron');
const path = window.require('path')
const { remote } = electron;
const ping = window.require('ping')

class Login extends Component {
    constructor(props) {
        super(props);

    }
    componentDidMount(){

    }

    render() {
        return (
            <div className="scan_pattern_html">
                <PageHeader>
                    <div className="app_user">
                        <UserInfoBar/>
                    </div>
                </PageHeader>
                <PageContent>
                    <div className="exam_type_menu">
                        <div className="item">
                            <div className="logo"><img src=""/></div>
                            <div className="title">作业模式</div>
                        </div>
                        <div className="item">
                            <Link to="/select_exam_subject"><div className="logo"><img src=""/></div></Link>
                            <div className="title">大考模式</div>
                        </div>
                    </div>
                </PageContent>
            </div>

        );
    }
}

export default Login;
