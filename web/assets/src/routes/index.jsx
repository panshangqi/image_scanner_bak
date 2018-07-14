import React from 'react';
import ReactDOM from 'react-dom';
import {Router,Route,Redirect, IndexRoute, Link, Switch} from 'react-router-dom';
import { createBrowserHistory, createHashHistory } from 'history';
import 'antd/dist/antd.less'
import './index.less'

import Login from '@pages/Login/index.jsx'
import Home from '@pages/Home/index.jsx'
import Page from '@components/Page/index.jsx'
import ScanPattern from '@pages/ScanPattern'
import SelectExamSubject from '@pages/SelectExamSubject'
import PaperUpload from '@pages/PaperUpload'
import TemplateUpload from '@pages/TemplateUpload'

import { StdId, Missing } from '@pages/Abnormal'

import SystemState from '@components/SystemState'
import AbnormalSiderBar from '@components/AbnormalSiderBar'
import AbnormalPictureCorrect from '@components/AbnormalPictureCorrect'
import AbnormalAbsent from '@components/AbnormalAbsent'

import AbnormalLose from '@components/AbnormalLose'
import AbnormalObjective from '@components/AbnormalObjective'

import SubPage from '@components/SubPage'


var history = createBrowserHistory();

ReactDOM.render(
    <Router history={history}>
        <Page>
            <Switch>
                <Route exact path="/login" component={Login} />
                <Route path="/select_exam_subject" component={SelectExamSubject} />
                <Route path="/home" component={Home} />
                <Route path="/SystemState" component={SystemState} />
                <Route path="/template_upload" component={TemplateUpload} />
                <Route path="/paper_upload" component={PaperUpload} />
                <Route path="/scan_pattern" component={ScanPattern} />
                <Route path="/abnormal_sider" component={AbnormalSiderBar} />
                <Route path="/abnormal_picture_correct" component={AbnormalPictureCorrect} />
                <Route path="/abnormal_absent" component={AbnormalAbsent} />
                <Route path="/abnormal_lose" component={AbnormalLose} />
                <Route path="/abnormal_objective" component={AbnormalObjective} />
                <Route path="/abnormal/student" component={StdId} />
                <Route path="/abnormal/missing" component={Missing} />
                <Route path="/sub" component={SubPage} />
                <Redirect to="/abnormal_picture_correct" />

            </Switch>
        </Page>
    </Router>
    , document.getElementById('root'));

