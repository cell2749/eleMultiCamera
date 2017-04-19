/**
 * Created by nikitak on 6.4.2017.
 */
const electron = require("electron");
const {app, BrowserWindow} = electron;
//const locals = {/* ...*/};

//const pug = require('electron-pug')({pretty: true}, locals);
const ele_compile = require('electron-compile').init(__dirname, require.resolve('./main'));
//import {enableLiveReload} from 'electron-compile';

app.commandLine.appendSwitch('--enable-npapi');
if (process.platform == 'win32') {
    process.env['VLC_PLUGIN_PATH'] = require('path').join(__dirname, 'node_modules/wcjs-prebuilt/bin/plugins');
}
//enableLiveReload();
app.on('ready', function(){
    let mainWindow = new BrowserWindow({ width: 500, height: 500,/*});*/ frame:false });
    //mainWindow.maximize();
    mainWindow.setFullScreen(true);
    mainWindow.loadURL(`file://${__dirname}/views/index.jade`);
    mainWindow.webContents.openDevTools();
    console.log("Architecture: " + process.arch);
//// the rest...
});