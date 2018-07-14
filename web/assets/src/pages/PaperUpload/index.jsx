import React, {Component} from 'react';
import { Layout, Button, Menu, Dropdown } from 'antd'
const { Header, Content, Sider } = Layout;
import PageHeader from '@components/PageHeader';
import PageContent from '@components/PageContent';
import ExamInfoHeader from '@components/ExamInfoHeader';
import ScanButton from '@components/ScanButton';
import UserInfoBar from '@components/UserInfoBar';
import SystemState from '@components/SystemState';
import YQ from '@components/yq';
import { Collapse } from 'antd';
import './style.less';
import jQuery from 'jquery';
import scan_layer from '@imgs/scan_layer.png';
import scan_bg from '@imgs/scan_bg.png';
const Panel = Collapse.Panel;
const electron = window.require('electron');
const { remote, ipcRenderer } = electron;

var get_batch_url = YQ.util.make_local_url('/get_batchs');
class PaperUpload extends Component{
    constructor(props){
        super(props);
        this.state = {
            batch_list: [],
            scan_number: 0,
            catch_number: 0,
            upload_number: 0,
            current_image_url: null
        }
        this.timer = null;
        this.layerTimer = null;
        this.batchSelected = null;
        this.updateBatchList = this.updateBatchList.bind(this);
        this.openNewWindow = this.openNewWindow.bind(this);
        console.log(window.location.href);
    }

    componentDidMount(){


        var This = this;
        this.updateBatchList(get_batch_url);

        this.timer = setInterval(function() {
            This.updateBatchList(get_batch_url);
        },5000)

        var l_left = -600;
        var l_idx = 0;
        var maxLength = jQuery('#picture_center').width() + l_left - 100;
        console.log(maxLength);
        var moveDis = [10,14,16,18,20,22,24,28,32,40,50,53,56,59,62,65,68,70,72,74,76,78,74,70,66,60,55,40,34,26,17,12,7,3,0];

        this.layerTimer = setInterval(function(){
            var n_left = l_left + moveDis[l_idx];
            if(l_idx + 1 < moveDis.length){
                l_idx ++;
            }else{
                l_idx = 0;
            }
            if(n_left > maxLength)
            {
                l_idx = 0;
                n_left = -600;
            }
            l_left = n_left;
            jQuery('#layer_image').css({
                'left': l_left + 'px'
            })
        },80);


        jQuery('#batch_list_tbody').on('mousedown','tr',function (e) {
            This.batchSelected = jQuery(this).attr('batch_id');

            jQuery('#batch_list_tbody').find('tr').css({'background-color': '#fff'})
            jQuery(this).css({'background-color': '#D5E2F8'})
        })

        var test_img = YQ.util.make_local_url('f9faaa40d6e8a9f73be2d420bc08dde4_1.jpg');
        this.setState({
            current_image_url:test_img
        })
    }
    componentWillUnmount = () => {
        this.setState = (state,callback)=>{
            return;
        };
        this.layerTimer = null;
    }
    shouldComponentUpdate(nextProps, nextState) {
        if (1) {
            return true;
        }
        return false;
    }
    updateBatchList(_url){
        var This = this;
        YQ.http.get(_url, {}, function (res) {

            if (res.type != 'ERROR') {

                This.setState({
                    batch_list: res.data
                })
            }
        })
    }
    openNewWindow(){
        //window.open('http://127.0.0.1:10032/templates/index.html');
    }
    onBatchMouseClick(e){
        var This = this;
        if(this.batchSelected){
            var m_url = YQ.util.make_local_url('/delete_batch');
            YQ.http.post(m_url, {batch_id: this.batchSelected}, function (res) {
                if (res.type != 'ERROR') {
                    console.log('删除成功');
                    This.updateBatchList(get_batch_url);
                }
            })
        }
    }
    render(){
        console.log('render')
        const menu = (
            <Menu style={{width:100,marginLeft:100,border:'1px solid #ccc'}} onClick={this.onBatchMouseClick.bind(this)}>
                <Menu.Item key="1">删除</Menu.Item>
            </Menu>
        );
        return(
            <div className="paper_upload_html">
                <PageHeader>
                    <div className="app_system_state"><SystemState/></div>
                    <div className="app_user"><UserInfoBar/></div>
                    <div className="app_exam_info">
                        <div className="exam_info"><ExamInfoHeader /></div>
                        <div className="scan_btn"><ScanButton /></div>
                    </div>
                </PageHeader>
                <PageContent>
                    <Layout style={{height:'100%'}}>
                        <Sider width="280">
                            <div className="state_show">
                                <table>
                                    <tbody>
                                        <tr style={{height:50,fontSize:26}}>
                                            <td style={{color: '#111'}}>{this.state.scan_number}</td>
                                            <td style={{color: '#FF796B'}}>{this.state.catch_number}</td>
                                            <td style={{color: '#85C381'}}>{this.state.upload_number}</td>
                                        </tr>
                                        <tr style={{height:45}}>
                                            <td>扫描张数</td>
                                            <td>异常</td>
                                            <td>上传人数</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <Button type="primary" style={{width:'100%'}}>处理异常答题卡</Button>
                            </div>
                            <div className="batch_panel">
                                <div className="_title">扫描批次</div>
                                <table className="batch_header">
                                    <thead>
                                        <tr>
                                            <td>批次</td>
                                            <td>扫描张数</td>
                                            <td>异常</td>
                                            <td>上传人数</td>
                                        </tr>
                                    </thead>
                                </table>
                                <div className="batch_list">
                                    <table style={{width:280}}>
                                        <tbody id="batch_list_tbody">
                                        {
                                            this.state.batch_list.map(function(item, index){
                                                return (
                                                    <Dropdown
                                                        overlay={menu}
                                                        trigger={['contextMenu']}
                                                        key={item.timestamp+index+'menu'}

                                                    >
                                                        <tr
                                                            key={item.timestamp+index}
                                                            style={{textAlign:'center'}}
                                                            batch_id={item.batch_id}
                                                        >
                                                            <td>{item.index}</td>
                                                            <td>{item.batch_size}</td>
                                                            <td>{item.catch_num}</td>
                                                            <td>{item.upload_num}</td>
                                                        </tr>
                                                    </Dropdown>
                                                )
                                            })
                                        }
                                        </tbody>
                                    </table>

                                </div>
                            </div>
                            <div className="normal_panel">
                                <div className="_title">正常卷列表</div>
                                <table className="normal_header">
                                    <thead>
                                        <tr>
                                            <td>考生</td>
                                            <td>考号</td>
                                            <td>上传状态</td>
                                        </tr>
                                    </thead>
                                </table>

                                <div className="normal_list">

                                </div>
                            </div>
                        </Sider>
                        <Layout>
                            <Header>
                                    试卷位置 第一批 第123 试卷 考试：无法识别
                            </Header>
                            <Content style={{padding:20}}>
                                <div className="picture_center" id="picture_center">
                                    <div className="picture_box">
                                        <img src={this.state.current_image_url}/>
                                    </div>

                                    <img src={scan_layer} className="layer_image" id="layer_image"/>
                                </div>
                            </Content>
                        </Layout>
                    </Layout>
                </PageContent>
                <div className="batch_delete_menu" id="batch_delete_menu">
                    删除
                </div>
            </div>
        )
    }
}

export default PaperUpload;