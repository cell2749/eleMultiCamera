import * as React from 'react';
import {remote, ipcRenderer} from "electron";
ipcRenderer.send("getConfig");

import HTTPdigest from "request-digest";


import {Paper, RaisedButton, TextField, Checkbox} from 'material-ui';
import {NotificationContainer, NotificationManager} from 'react-notifications';

import * as COLOR from "../../jsx/color.json";


class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: remote.getGlobal("configuration").username,
            password: remote.getGlobal("configuration").password,
            appName: remote.getGlobal("configuration").appName,
            server: remote.getGlobal("configuration").server,
            vhost: remote.getGlobal("configuration").vhost,
            save: false,
            _disableNotifications: false
        };
        //50 Shades of bindings
        this.login = this.login.bind(this);

    }

    login() {
        let that = this;
        //Testing the connection details before logging in
        let username = this.state.username;
        let password = this.state.password;
        let digestRequest = HTTPdigest(username, password);

        digestRequest.request({
            host: "http://" + this.props.wowza.host,
            path: `/v2/servers/${this.state.server}/vhosts/${this.state.vhost}/applications`, //server and vhost - advanced configuration?
            port: this.props.wowza.apiPort,
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }, function (error, response, body) {
            if (error) {
                console.log("Login request error /");
                console.log(error);
                if (error.statusCode == 401) {
                    if (!that._disableNotifications) {
                        that._disableNotifications = true;
                        let timeout = setTimeout(() => {
                            that._disableNotifications = false;
                        }, 3000);
                        NotificationManager.error("Invalid Credentials", "", 3000, () => {
                            clearTimeout(timeout);
                            that._disableNotifications = false;
                        });
                    }
                }
            } else {
                try {
                    let validAppName = false;
                    let jsonResp = JSON.parse(body);
                    console.log(jsonResp);
                    /**
                     *  jsonResp = {
                     *      serverName: String
                     *      applications: [
                     *        {
                     *          appType: String,
                     *          drmEnabled: String,
                     *          dvrEnabled: String,
                     *          href: String,
                     *          id: String,
                     *          streamTargetsEnabled: Boolean,
                     *          transcoderEnabled: Boolean
                     *        }
                     *      ]
                     *  }
                     * */
                    for (let value of jsonResp.applications) {
                        if (value.appType === "Live" && value.id === that.state.appName) {
                            validAppName = true;
                        }
                    }
                    if (!validAppName) {
                        if (!that._disableNotifications) {
                            that._disableNotifications = true;
                            let timeout = setTimeout(() => {
                                that._disableNotifications = false
                            }, 3000);
                            NotificationManager.error("Invalid Application", "", 3000, () => {
                                clearTimeout(timeout);
                                that._disableNotifications = false
                            });
                        }
                    } else {
                        //TODO forward user to application and save login conf encoded in case of checkbox
                        //TODO node-keytar for ciphering - requires ????
                        //Problems with keytar
                        that.setState({
                            errorPassword: "",
                            errorUsername: "",
                            errorApplication: ""
                        });
                        if (that.state.save) {
                            //keytar.setPassword(wowza.host, username, password);
                            remote.getGlobal("configuration").username = username;
                            remote.getGlobal("configuration").appName = that.state.appName;
                            remote.getGlobal("configuration").password = password;
                            ipcRenderer.send("saveConfig");
                            console.log("saved");
                        }
                        that.props.changeStateTo("monitoring", that.state);
                        console.log("Success!");
                    }
                } catch (e) {
                    console.log("Login parse error /");
                    console.log(e);
                }
            }
        });
    }

    render() {
        let defaultStyle = {
            padding: 10,
            width: 532,
            height: 332,
            top: "calc(50% - 166px)",
            left: "calc(50% - 266px)",
            position: "fixed",
            textAlign: 'left',
            backgroundColor: COLOR.drawerBackground
        };
        //console.log(remote.getGlobal("configuration").username);
        return (

            <Paper style={this.props.style || defaultStyle} zDepth={this.props.depth || 5}>
                <TextField
                    id="tfUsername"
                    onChange={(e) => {
                        this.setState({username: e.target.value});
                    }}
                    floatingLabelText="Username"
                    defaultValue={remote.getGlobal("configuration").username}
                    floatingLabelStyle={{
                        color: COLOR.itemHoverColor
                    }}
                />
                <TextField
                    id="tfPassword"
                    onChange={(e) => {
                        this.setState({password: e.target.value});
                    }}
                    floatingLabelText="Password"
                    defaultValue={remote.getGlobal("configuration").password}
                    floatingLabelStyle={{
                        color: COLOR.itemHoverColor
                    }}
                    type="password"
                /><br/>
                <div style={{width: "50%", display: "inline-block", textAlign: "left"}}>
                    <TextField
                        id="tfApplication"
                        onChange={(e) => {
                            this.setState({appName: e.target.value});
                        }}
                        floatingLabelText="Application"
                        defaultValue={remote.getGlobal("configuration").appName}
                        floatingLabelStyle={{
                            color: COLOR.itemHoverColor
                        }}
                    />
                    <TextField
                        id="tfServer"
                        onChange={(e) => {
                            this.setState({server: e.target.value});
                        }}
                        floatingLabelText="Server"
                        defaultValue={this.state.server}
                        floatingLabelStyle={{
                            color: COLOR.itemHoverColor
                        }}
                    />
                    <TextField
                        id="tfVHost"
                        onChange={(e) => {
                            this.setState({vhost: e.target.value});
                        }}
                        floatingLabelText="VHost"
                        defaultValue={this.state.vhost}
                        floatingLabelStyle={{
                            color: COLOR.itemHoverColor
                        }}
                    />
                    <Checkbox
                        label="Save login credentials"
                        labelStyle={{color: COLOR.itemHoverColor}}
                        iconStyle={{fill: COLOR.itemHoverColor}}
                        style={{checkedColor: COLOR.exitButton}}
                        onCheck={(e) => {
                            this.setState({save: !this.state.save});
                        }}
                    />
                </div>
                <div style={{
                    width: "50%",
                    display: "inline-block"
                }}>
                    <div style={{

                        width: "100%",
                        top: 0
                    }}>
                        <NotificationContainer />
                    </div>
                    <br />
                    <div style={{
                        width: "50%",
                        display: "inline-block",
                        textAlign: "center",
                        bottom: 0,
                        position: "absolute"
                    }}>
                        <RaisedButton
                            label="Login"
                            backgroundColor={COLOR.itemHoverColor}
                            onClick={this.login}
                            style={{margin: 10, marginBottom: 20}}
                        />
                        <RaisedButton
                            label="Exit"
                            backgroundColor={COLOR.exitButton}
                            onClick={(e) => {
                                remote.getCurrentWindow().close();
                            }}
                            style={{margin: 10, marginBottom: 20}}
                        />
                    </div>
                </div>

            </Paper>

        );
    }
}
module.exports = Login;