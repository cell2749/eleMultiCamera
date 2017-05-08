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
            save: remote.getGlobal("configuration").savedChecked === "true",
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

                        //keytar.setPassword(wowza.host, username, password);
                        if (that.state.save) {
                            remote.getGlobal("configuration").username = username;
                            remote.getGlobal("configuration").appName = that.state.appName;
                            remote.getGlobal("configuration").password = password;
                            remote.getGlobal("configuration").server = that.state.server;
                            remote.getGlobal("configuration").vhost = that.state.vhost;
                        } else {
                            remote.getGlobal("configuration").username = "";
                            remote.getGlobal("configuration").appName = "";
                            remote.getGlobal("configuration").password = "";
                            remote.getGlobal("configuration").server = "";
                            remote.getGlobal("configuration").vhost = "";
                        }

                        remote.getGlobal("configuration").savedChecked = that.state.save.toString();
                        ipcRenderer.send("saveConfig");

                        that.props.changeStateTo("monitoring", that.state);

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
                        if (e.target.value.indexOf('"') == -1 && e.target.value.indexOf('`') == -1 && e.target.value.indexOf("'") == -1) {
                            this.setState({username: e.target.value});
                        } else {
                            e.target.value = this.state.username;
                        }
                    }}
                    floatingLabelText="Username"
                    floatingLabelStyle={{
                        color: COLOR.itemHoverColor
                    }}
                    value={this.state.username}
                />
                <TextField
                    id="tfPassword"
                    onChange={(e) => {
                        if (e.target.value.indexOf('"') == -1 && e.target.value.indexOf('`') == -1 && e.target.value.indexOf("'") == -1) {
                            this.setState({password: e.target.value});
                        } else {
                            e.target.value = this.state.password;
                        }
                    }}
                    floatingLabelText="Password"
                    floatingLabelStyle={{
                        color: COLOR.itemHoverColor
                    }}
                    type="password"
                    value={this.state.password}
                /><br/>
                <div style={{width: "50%", display: "inline-block", textAlign: "left"}}>
                    <TextField
                        id="tfApplication"
                        onChange={(e) => {
                            if (e.target.value.indexOf('"') == -1 && e.target.value.indexOf('`') == -1 && e.target.value.indexOf("'") == -1) {
                                this.setState({appName: e.target.value});
                            } else {
                                e.target.value = this.state.appName;
                            }
                        }}
                        floatingLabelText="Application"
                        floatingLabelStyle={{
                            color: COLOR.itemHoverColor
                        }}
                        value={this.state.appName}
                    />
                    <TextField
                        id="tfServer"
                        onChange={(e) => {
                            if (e.target.value.indexOf('"') == -1 && e.target.value.indexOf('`') == -1 && e.target.value.indexOf("'") == -1) {
                                this.setState({server: e.target.value});
                            } else {
                                e.target.value = this.state.server;
                            }
                        }}
                        floatingLabelText="Server"
                        floatingLabelStyle={{
                            color: COLOR.itemHoverColor
                        }}
                        value={this.state.server}
                    />
                    <TextField
                        id="tfVHost"
                        onChange={(e) => {
                            if (e.target.value.indexOf('"') == -1 && e.target.value.indexOf('`') == -1 && e.target.value.indexOf("'") == -1) {
                                this.setState({vhost: e.target.value});
                            } else {
                                e.target.value = this.state.vhost;
                            }
                        }}
                        floatingLabelText="VHost"
                        floatingLabelStyle={{
                            color: COLOR.itemHoverColor
                        }}
                        value={this.state.vhost}
                    />
                    <Checkbox
                        label="Save login credentials"
                        labelStyle={{color: COLOR.itemHoverColor}}
                        iconStyle={{fill: COLOR.itemHoverColor}}
                        style={{checkedColor: COLOR.exitButton}}
                        checked={this.state.save}
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