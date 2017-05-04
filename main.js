/**
 * Created by nikitak on 6.4.2017.
 */
const electron = require("electron");
const {app, BrowserWindow, ipcMain} = electron;
const fs = require("fs");
const wowza = require("./wowza.json");
global.configuration = {
    username: wowza.username,
    password: "",
    appName: wowza.appName,
    server: wowza.server,
    vhost: wowza.vhost
};
//const locals = {/* ...*/};
ipcMain.on("getConfig", () => {
    fs.readFile(app.getPath('userData') + "/userConf", "utf-8", (err, data) => {
        if (err) {
            console.log("File Read error: ", err);
            if (err.errno == -4058) {
                fs.writeFile(app.getPath('userData') + "/userConf", JSON.stringify(global.configuration), (err) => {
                    if (err) {
                        console.log("Read create file error:", err);
                    } else {
                        console.log("Created File");
                    }

                });
            }
        } else {
            try {
                let jsonData = JSON.parse(data);
                global.configuration.username = jsonData.username || global.configuration.username;
                global.configuration.appName = jsonData.appName || global.configuration.appName;
                global.configuration.server = jsonData.server || global.configuration.server;
                global.configuration.vhost = jsonData.vhost || global.configuration.vhost;
                //TODO get password from keytar
            } catch (e) {
                console.log("File Read caught error: ", e);
            }
        }
    })
});
ipcMain.on("saveConfig", () => {
    fs.writeFile(app.getPath("userData") + "/userConf",
        `{
        "username":"${global.configuration.username}",
        "appName":"${global.configuration.appName}",
        "server":"${global.configuration.server}",
        "vhost":"${global.configuration.vhost}"
        }`
        , (err) => {
            if (err) {
                console.log("Write file error:", err);

            } else {
                //TODO set password to keytar
                console.log("Write successful");
            }
        });
});
//const pug = require('electron-pug')({pretty: true}, locals);
const ele_compile = require('electron-compile').init(__dirname, require.resolve('./main'));
//import {enableLiveReload} from 'electron-compile';console.log(app);
app.commandLine.appendSwitch('--enable-npapi');
if (process.platform == 'win32') {
    process.env['VLC_PLUGIN_PATH'] = require('path').join(__dirname, 'node_modules/wcjs-prebuilt/bin/plugins');
}
//enableLiveReload();
app.on('ready', () => {
    let mainWindow = new BrowserWindow({width: 500, height: 500});///**/ , frame:false });
    mainWindow.maximize();
    //mainWindow.setFullScreen(true);
    mainWindow.loadURL(`file://${__dirname}/views/index.jade`);
    mainWindow.webContents.openDevTools();
    console.log("Architecture: " + process.arch);
//// the rest...
});
app.on('window-all-closed', () => {
    app.quit()
});
