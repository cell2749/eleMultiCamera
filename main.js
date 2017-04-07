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

//enableLiveReload();
app.on('ready', function(){
    let mainWindow = new BrowserWindow({ width: 800, height: 600 });

    mainWindow.loadURL(`file://${__dirname}/views/index.jade`);
    mainWindow.webContents.openDevTools();
//// the rest...
});