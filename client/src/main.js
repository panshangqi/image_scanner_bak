
const {app, Tray,Menu, BrowserWindow, BrowserView, ipcMain, globalShortcut} = require('electron')
const logger = require('electron-log')
const fs = require('fs')
const os = require('os')
const path = require("path")
const uuid = require('node-uuid');
const { exec } = require('child_process');
var ini = require('ini')


const html_path = path.join(__dirname, './html/');
const img_path = path.join(__dirname, './img/');
const root_path = path.join(__dirname, '../');
//全局变量
global.appdata = require('electron').app.getPath("userData");
global.root_path = root_path;
global.local_host = "127.0.0.1";
global.local_port = 10082;
global.aliyun_url = "http://10.200.3.16:3202";
global.local_url = "http:127.0.0.1:" + local_port;
global.aliyun_key_url = aliyun_url + '/host/sts';

//扫描类型：'system'系统卡，'template'：第三方模板, 'template_paper': 第三方试卷
global.sharedObject = {
    scan_type: 'system'
}
//global.scan_type = 'system';

const yq = require('./yq')

// 创建图片缓存路径
// 创建配置文件
var default_pic = path.join(appdata, 'pictures');

if(!fs.existsSync(default_pic)){
    fs.mkdirSync(default_pic);
}
global.pictures = default_pic;
var scanCfg = path.join(appdata, "scanCfg.ini");
if (!fs.existsSync(scanCfg)) {
    logger.info("scanCfg is no exist, now to create");
    fs.writeFileSync(scanCfg,"");
    var config = ini.parse(fs.readFileSync(scanCfg, 'utf-8'))
    config.general = {
        picture: default_pic,
        fingerprint: uuid.v1()
    }
    fs.writeFileSync(scanCfg, ini.stringify(config));
}else{
    var config = ini.parse(fs.readFileSync(scanCfg, 'utf-8'))
    if(!config.general.fingerprint){
        config.general.fingerprint = uuid.v1()
    }
    fs.writeFileSync(scanCfg, ini.stringify(config));
}
console.log(uuid.v1())

if(process.env.NODE_ENV === 'development') {
    require('electron-reload')(__dirname);
}


const autoUpdater = require('electron-updater').autoUpdater

if(process.env.NODE_ENV === 'development'){
    global.aliyun_url = "/client";
    global.local_url = "/local";
}

//const uploadUrl='http://www.pansq.info:8081/download/'
//const uploadUrl='http://127.0.0.1:8081/download/'
const uploadUrl='http://10.200.3.16:8081/download/'
//const uploadUrl = 'http://10.200.4.232:10010/download/'

let win = null;
let tray = null;
let child = null;

function createWindow () {
    // 创建浏览器窗口。
    setupLogger();
    var win_opt = {
        width: 1700,
        height: 720,
        minWidth:1300,
        minHeight:720,
        frame: true,
        transparent:false,
        webPreferences:{

        }
    }
    win = new BrowserWindow(win_opt)
    if(process.env.NODE_ENV === 'development') {
        win.loadURL('http://127.0.0.1:10032/templates/index.html#/app_update');
        //win.loadURL(root_path + 'web_dist/templates/index.html');
    }else{
        win.loadURL(root_path + 'web_dist/templates/index.html');
    }

    logger.info('success load html: ' + html_path + 'index.html')
    // 打开开发者工具
    win.webContents.openDevTools()

    // 当 window 被关闭，这个事件会被触发。
    win.on('closed', () => {
        logger.info("application exist .");
        win = null
    })

}
// 主进程监听渲染进程传来的信息

function eventHandle(){
    ipcMain.on('asynchronous-message', (event, arg) => {

    })

    ipcMain.on('message-check-for-update', (e, arg) => {

    });

    ipcMain.on('message-start-scan', (e, arg) => {
        exec("TwainDriver.exe 0",{},function(err,data){
            logger.info('start scan');
            sendMessageToRender('message-end-scan','');
        });
    });
    ipcMain.on('message-window-maxi', (e, arg) => {
        win.maximize();
    });
    ipcMain.on('message-window-unmaxi', (e, arg) => {
        win.unmaximize();
    });
    ipcMain.on('message-window-min', (e, arg) => {
        win.minimize();
    });
    ipcMain.on('message-window-close', (e, arg) => {
        //win.maximize();
    });
    ipcMain.on('message-window-hide', (e, arg) => {
        win.hide();
    });


    globalShortcut.register('CommandOrControl+R', function () {
        if(process.env.NODE_ENV === 'development') {
            win.loadURL('http://127.0.0.1:10032/templates/index.html');
            if(child)
            child.loadURL('http://127.0.0.1:10032/templates/update.html');
        }
    })
}
updateHandle();
function updateHandle() {  //软件更新检测
    logger.info('update check')


    let message = {
        error: 'check update error',
        checking: 'checking update ...',
        updateAva: 'checked laster version',
        updateNotAva: 'the version is laster',
    };
    autoUpdater.autoDownload = false;
    autoUpdater.setFeedURL(uploadUrl);
    setTimeout(function(){
        //autoUpdater.checkForUpdates();
    },5000);

    ipcMain.on('message-update-start-download', (e, arg) => {
        autoUpdater.downloadUpdate();
        logger.info('start download...');
    });
    ipcMain.on('message-update-start-install', (e, arg) => {
        autoUpdater.quitAndInstall();
    });
    ipcMain.on('message-update-win-close', (e, arg) => {
        if(child){
            child.close();
        }
    });


    autoUpdater.on('error', function (error) {
        logger.info(message.error)
    });
    autoUpdater.on('checking-for-update', function () {
        logger.info(message.checking)

    });
    autoUpdater.on('update-available', function (info) {
        logger.info(message.updateAva);
        //如果检查到最新版本则弹出升级窗口
        if(!child) {
            child = new BrowserWindow({parent: win, modal: false,show: false, width:540, height:330, frame:false})
        }
        if(process.env.NODE_ENV === 'development'){
            child.loadURL('http://127.0.0.1:10032/templates/update.html');
        }
        else{
            child.loadURL(root_path + 'web_dist/templates/index.html/app_update');
        }
        child.show();
    });
    autoUpdater.on('update-not-available', function (info) {
        logger.info(message.updateNotAva)
    });
    // 更新下载进度事件
    autoUpdater.on('download-progress', function(progressObj) {
        logger.info(progressObj);
        sendMessageToChild('message-download-progress', progressObj);
    })
    autoUpdater.on('update-downloaded', function (event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate) {
        //win.webContents.send('downloadProcess', 'checkUpdate');
        logger.info("start update install");
            //some code here to handle event
        sendMessageToChild('message-download-end');
    });

}
function sendStatusToWindow(text) {
    logger.info(text);
    win.webContents.send('update-message-call', text);
}

function sendMessageToRender(_event,_data){
    win.webContents.send(_event, _data);
}
function sendMessageToChild(_event,_data){
    if(child)
        child.webContents.send(_event, _data);
}
function createTray(){
    tray = new Tray(img_path + 'ImageScanner.ico')
    const contextMenu = Menu.buildFromTemplate([
        {
            label: '显示主界面',
            type: 'normal',
            click: function(e) {
                win.show();
            }
        },
        {
            label: '退出',
            type: 'normal',
            click: function(e) {
                win.close();
            }
        }
    ])
    tray.setToolTip('This is my application.')
    tray.setContextMenu(contextMenu)
    logger.info('success load tray: ' + img_path + 'ImageScanner.ico')
}
// Electron 会在初始化后并准备
// 创建浏览器窗口时，调用这个函数。
// 部分 API 在 ready 事件触发后才能使用。
app.on('ready', () => {
    createWindow()
    eventHandle()
    if(os.platform() == "win32"){
        createTray()
        const runPfu = require('./pfuRegedit')
        runPfu.init()
    }
})

// 当全部窗口关闭时退出。
app.on('window-all-closed', () => {
    // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
    // 否则绝大部分应用及其菜单栏会保持激活。
    logger.info("window-all-closed .")
    app.quit()
    globalShortcut.unregisterAll()
})
// 在这个文件中，你可以续写应用剩下主进程代码。
// 也可以拆分成几个文件，然后用 require 导入。
//本地服务
function localServer(){
    var static_pic_path = yq.util.get_ini('picture');
    //lowdb
    const low = require('lowdb')
    const FileSync = require('lowdb/adapters/FileSync')

    var appdata = app.getPath("userData")
    var local_dbs = path.join(appdata,"local_dbs")
    if(!fs.existsSync(local_dbs)){
        fs.mkdirSync(local_dbs);
    }

    var image_db_path = path.join(local_dbs,"image_db_v1.0.json");
    var recognition_db_path = path.join(local_dbs,"recognition_db_v1.0.json");

    const image_db = low(new FileSync(image_db_path))
    const recognition_db = low(new FileSync(recognition_db_path))

    image_db.defaults({image_files:[],batch_list:[],template_files:[]}).write()
    recognition_db.defaults({images:[]}).write()

    process.on('uncaughtException', function (err) {
        console.log(err);
    });

    var http = require('http');
    var express = require('express');
    var bodyParser = require('body-parser')
    var router  = express();
    // 添加 body-parser 中间件就可以了
    router.use(express.static(static_pic_path))  //设置静态文件路径
    router.use(bodyParser.urlencoded({extended: false}));
    router.use(bodyParser.json());


    router.post('/new_batch', function (req, res) {

        if(req.body){
            console.log(req.body);
            var obj = {
                batch_id: req.body.batch_id,
                timestamp: req.body.timestamp,
                scan_type: sharedObject.scan_type
            }
            image_db.get('batch_list').push(obj).write();
        }
        res.send({'type':'AJAX'});
    });
    router.get('/get_batchs', function(req, res){

        const _batch_list = image_db.get('batch_list').sortBy('timestamp').value();
        var _data = [];
        for(var idx=0; idx< _batch_list.length; idx++){
            var _index = idx + 1;
            var _batch_id = _batch_list[idx].batch_id;
            var _batch_size = image_db.get('image_files').filter({'batch_id': _batch_id}).size().value();
            _data.push({
                'index': _index,
                batch_id: _batch_id,
                batch_size: _batch_size,
                catch_num: 0,
                upload_num: 0,
                timestamp: _batch_list[idx].timestamp
            })
        }
        var v_data = _data.reverse();
        res.send({'type':'AJAX', 'data': v_data});
    })
    router.post('/delete_batch', function (req, res) {
        if(req.body){
            var de_batch_id = req.body.batch_id;
            image_db.get('batch_list').remove({batch_id: de_batch_id}).write();
            image_db.get('image_files').remove({batch_id: de_batch_id}).write();
        }
        res.send({'type':'AJAX'});
    })
    router.post('/drive_images', function (req, res) {


        if(req.body){

            var obj = {
                _id: req.body._id,
                filename: req.body.filename,
                filesize: req.body.filesize,
                image_guid: req.body.image_guid,
                timestamp: req.body.timestamp,
                batch_id: req.body.batch_id,
                order: req.body.order,
                used: 'false',
                scan_type: sharedObject.scan_type
            }
            console.log(req.body);
            image_db.get('image_files').push(obj).write();
        }
        res.send({'type':'AJAX'});
    });

    router.get('/get_images', function(req, res) {
        const _res = image_db.get('image_files').filter({'used': 'false'}).take(1).value();
        if(_res.length > 0){
            const _id = _res[0]._id;
            image_db.get('image_files').find({'_id':_id}).assign({'used':'true'}).write();
            _res[0].filepath = path.join(local_url , _res[0].filename);
        }
        res.send({
            'type': 'AJAX',
            'data': _res
        });
    })
    //获取扫描的第三方模板 template
    router.get('/get_templates', function(req, res) {
        const _res = image_db.get('image_files').filter({'scan_type': 'template'}).value();
        for(var i=0;i<_res.length;i++){
            _res[i].filepath = path.join(local_url , _res[i].filename);
        }
        res.send({
            'type': 'AJAX',
            'data': _res
        });
    })
    //删除第三方模板 delete template
    router.post('/delete_templates', function(req, res) {
        image_db.get('image_files').remove({'scan_type': 'template'}).write();
        res.send({
            'type': 'AJAX'
        });
    })

    //获取驱动列表
    router.post('/drive_list', function (req, res) {

        if(req.body){
            var drives = req.body.drives;
            yq.util.set_ini('drive_list', drives);
        }
        res.send({'type':'AJAX'});
    });

    router.post("/login",function(req,res){
        console.log(req.query)
        res.send({'type':'AJAX'})
    })
    router.get("/",function(req,res){
        console.log(req.query)
        res.send("Hello Electron Server")
    })
    var server = router.listen(local_port, function () {

        var host = server.address().address
        var port = server.address().port

        console.log("the local server http://%s:%s", host, port)
    })

}
localServer();

function setupLogger() {
    const date_time = require('date-and-time')
    var appdata = app.getPath("userData")
    var log_cache = path.join(appdata, 'logs');
    if (!fs.existsSync(log_cache)) {
        fs.mkdirSync(log_cache);
    }
    var now = new Date();
    var logname = date_time.format(now, 'YYYY_MM_DD');
    log_cache = path.join(log_cache, logname + '.log');

    logger.transports.file.level = true;
    logger.transports.console.level = true;
    // Same as for console transport
    logger.transports.file.level = 'info';
    //logger.transports.file.format = '[{h}:{i}:{s}:{ms}] {text}';

    // Set approximate maximum log size in bytes. When it exceeds,
    // the archived log will be saved as the log.old.log file
    logger.transports.file.maxSize = 5 * 1024 * 1024;

    // Write to this file, must be set before first logging
    logger.transports.file.file = log_cache;

    // fs.createWriteStream options, must be set before first logging
    logger.transports.file.streamConfig = {flags: 'ax+'};

    // set existed file stream
    logger.transports.file.stream = fs.createWriteStream(log_cache, {'flags': 'a'});
}


const co = require('co');
const OSS = require('ali-oss')
function getAliyunKey(){
    return new Promise((resolve, reject)=>{
        yq.http.get(aliyun_key_url,{},function (res) {
            res = JSON.parse(res);
            resolve(res);
        })
    })
}
var ordd =0;
function upload_task(_res, _filepath, _filename){
    return new Promise((resolve, reject)=>{
        if(!fs.existsSync(_filepath)){
            resolve({result: 'error'})
        }else{
            const client = new OSS({
                region: _res.body.region,
                accessKeyId: _res.body.Credentials.AccessKeyId,
                accessKeySecret: _res.body.Credentials.AccessKeySecret,
                bucket: _res.body.bucket,
                stsToken: _res.body.Credentials.SecurityToken
            });
            co(function* () {
                ordd++;
                var result1 = yield client.put(_res.body.file_dir + '/' +_filename, _filepath);
                resolve({result: 'ok'})
            }).catch(function (err) {
                console.log(err)
                resolve({result: 'error'})
            });
        }

    })
}

async function upload_file_aliyun(){
    while(1){
        console.log('start---------------');
        var res = await getAliyunKey();
        var hr = await upload_task(res);
        console.log(hr);
    }
}
//上传模板
async function upload_template_aliyun(templateList){

    var static_pic_path = yq.util.get_ini('picture');
    var m_total =  templateList.length;
    for(var i=0; i<m_total; i++){
        var _file_path = path.join(static_pic_path, templateList[i].filename);
        var res = await getAliyunKey();
        var hr = await upload_task(res, _file_path, templateList[i].filename);
        console.log(hr);
        sendMessageToRender('message-upload-template-progress', {
            num: (i+1),
            total: m_total
        });
    }
    sendMessageToRender('message-upload-template-end', res);
}
ipcMain.on('message-upload-template',function (eve, msg) {
    upload_template_aliyun(msg);
})
//upload_file_aliyun();






