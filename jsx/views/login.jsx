import * as React from 'react';
import * as electron from "electron";
const {remote} = electron;
import HTTPdigest from "request-digest";

import * as wowza from "../../wowza.json";
import {Paper, RaisedButton, TextField, Checkbox} from 'material-ui';

import * as COLOR from "../../jsx/color.json";


class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            appName: "",
            save: false
        };
        //50 Shades of bindings
        this.login = this.login.bind(this);

    }

    login() {
        let that=this;
        //TODO test the connection details before logging in
        let digestRequest = HTTPdigest(this.state.username, this.state.password);

        console.log(wowza.host);
        digestRequest.request({
            host: wowza.host,
            path: '/v2/servers/_defaultServer_/vhosts/_defaultVHost_/applications',
            port: wowza.port,
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
                    //TODO Warn user about incorrect password through notification
                    console.log("Incorrect username and/or password");
                }
            } else {
                try {
                    let validAppName=false;
                    let jsonResp = JSON.parse(body);
                    for(let value of jsonResp.applications){
                        if(value.appType==="Live"&&value.id===that.state.appName){
                            validAppName=true;
                        }
                    }
                    if(!validAppName){
                        //TODO Warn user about invalid application name
                        console.log("Invalid Application Name");
                    }else{
                        //TODO forward user to application and save login conf encoded in case of checkbox
                        //TODO node-keytar for ciphering - requires rebuilding
                        console.log("Success!");
                    }
                } catch (e) {
                    console.log("Login parse error /");
                    console.log(e);
                }
            }
        });

        //this.props.changeStateTo("monitoring", this.state);
    }
    render() {
        let defaultStyle = {
            padding: 10,
            width: 532,
            height: 188,
            top: "calc(50% - 94px)",
            left: "calc(50% - 266px)",
            position: "fixed",
            textAlign: 'left',
            backgroundColor: COLOR.drawerBackground
        };
        return (

            <Paper style={this.props.style || defaultStyle} zDepth={this.props.depth || 5}>
                <TextField
                    onChange={(e)=>{
                        this.setState({username: e.target.value});
                    }}
                    floatingLabelText="Username"
                    floatingLabelStyle={{
                        color: COLOR.itemHoverColor
                    }}
                />
                <TextField
                    onChange={(e)=>{
                        this.setState({password: e.target.value});
                    }}
                    floatingLabelText="Password"
                    floatingLabelStyle={{
                        color: COLOR.itemHoverColor
                    }}
                    type="password"
                /><br/>
                <div style={{width: "50%", display: "inline-block", textAlign: "left"}}>
                    <TextField
                        onChange={(e)=>{
                            this.setState({appName: e.target.value});
                        }}
                        floatingLabelText="Application"
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


            </Paper>

        );
    }
}
module.exports = Login;