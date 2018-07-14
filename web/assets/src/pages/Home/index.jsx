
import React, { Component } from 'react';
import './style.less';
import $ from 'jquery';

const electron = window.require('electron');
const {ipcRenderer, remote} = electron;

class Home extends Component {
    constructor(props) {
        super(props);
        console.log("constructor")

    }
    render() {
        return (
            <div>
                登陆成功
            </div>
        );
    }
}

export default Home;
