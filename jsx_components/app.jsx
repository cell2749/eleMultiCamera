import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as electron from "electron";
const {remote} = electron;
import HTTPdigest from "request-digest";

//My Components
import MyList from "../jsx_components/list.jsx";
import Player from "../jsx_components/player.jsx";
import Theater from "../jsx_components/theater.jsx";

import * as wowza from "../wowza.json";
//Materials
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import RaisedButton from 'material-ui/RaisedButton';
import Drawer from 'material-ui/Drawer';
import IconButton from 'material-ui/IconButton';
import ContentSort from 'material-ui/svg-icons/content/sort';
//Additional UI components
import {NotificationContainer, NotificationManager} from 'react-notifications';


const COLOR={
    drawerButton:"#455A64",
    drawerBackground:"#263238",
    exitButton:"#880E4F",
    playersBackground:"#455A64",
    slider:"#212121",
    paper:"#455A64",
    itemColor:"#006064",
    itemHoverColor:"#00838F",
    itemSeletedColor:"#4A148C",
    itemSelectedHoverColor:"#6A1B9A",
};
/**
 * Temporary onTouchTap (instead of onClick) for Material UI.
 * Check updates if it is to be removed.
 * */
import injectTapEventPlugin from 'react-tap-event-plugin';
/**
 * Needed for onTouchTap
 * http://stackoverflow.com/a/34015469/988941
 */
injectTapEventPlugin();



class App extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            dummy:(<p>Hello World</p>),
            players:{},
            streams:{},
            theater:(<div></div>),
            drawerIsOpen:false,
            pattern:[2,2],
            patternIcons: {
                p2x2: {
                    _: "../styles/icons/2x2-active.png",
                    active: "../styles/icons/2x2-active.png",
                    normal: "../styles/icons/2x2-normal.png"
                },
                p3x3: {
                    _: "../styles/icons/3x3-normal.png",
                    active: "../styles/icons/3x3-active.png",
                    normal: "../styles/icons/3x3-normal.png"
                },
                p4x4: {
                    _: "../styles/icons/4x4-normal.png",
                    active: "../styles/icons/4x4-active.png",
                    normal: "../styles/icons/4x4-normal.png"
                }
            }
        };
        this._disableNotifications=false;
        //bindings
        this.toggleStreamNames = this.toggleStreamNames.bind(this);
        this.fetchStreamNames = this.fetchStreamNames.bind(this);
        this.toggleDrawer = this.toggleDrawer.bind(this);
        this.toggleStream = this.toggleStream.bind(this);
        this.setPattern = this.setPattern.bind(this);
    }
    componentDidMount(){

    }
    componentWillUnmount() {

    }
    toggleStreamNames(){
        let players=[];
        let that = this;
        let streams = that.state.streams;

        let digestRequest = HTTPdigest(this.props.username, this.props.password);
        digestRequest.request({
            host: that.props.wowzaSEhost,
            path: '/v2/servers/_defaultServer_/vhosts/_defaultVHost_/applications/'+that.props.wowzaApp+'/instances',
            port: that.props.wowzaSEport,
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }, function (error, response, body) {
            if (error) {
                console.log(error);
            }
            try{
                let jsonResp = JSON.parse(body);
                jsonResp.instanceList.forEach((instance)=>{
                    instance.incomingStreams.forEach((incomingStream)=>{
                        if(!streams.hasOwnProperty(incomingStream.sourceIp)) {
                            streams[incomingStream.sourceIp]=incomingStream.name;
                            players.push(
                                <Player name={incomingStream.name} key={incomingStream.sourceIp}/>
                            );
                        }else{
                            delete streams[incomingStream.sourceIp];
                        }
                    });
                });
                if(players.length>0) {
                    that.setState({
                        players: players,
                        streams: streams
                    });
                }else{
                    that.setState({
                        players: (<div></div>),
                        streams: streams
                    });
                }
            }catch(e){
                console.log(e);
            }
        });
    }
    fetchStreamNames(){
        let that = this;
        let streamNames = {};
        let players = this.state.players;
        let digestRequest = HTTPdigest(this.props.username, this.props.password);
        digestRequest.request({
            host: that.props.wowzaSEhost,
            path: '/v2/servers/_defaultServer_/vhosts/_defaultVHost_/applications/'+that.props.wowzaApp+'/instances',
            port: that.props.wowzaSEport,
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }, function (error, response, body) {
            if (error) {
                console.log(error);
            }
            try{
                let jsonResp = JSON.parse(body);
                jsonResp.instanceList.forEach((instance)=>{
                    instance.incomingStreams.forEach((incomingStream)=>{
                        streamNames[incomingStream.sourceIp] = incomingStream.name;
                    });
                });

                for(let address in players){
                    if(!streamNames.hasOwnProperty(address)){
                        delete players[address];
                    }
                }
                that.setState({
                    streams: streamNames,
                    players: players
                });
            }catch(e){
                console.log(e);
            }
        });

    }
    exitApp(){
        remote.getCurrentWindow().close();
    }
    toggleDrawer(){
        this.setState({
            drawerIsOpen:!this.state.drawerIsOpen
        });
    }
    toggleStream(address){
        let MAX_SIZE = this.state.pattern[0]*this.state.pattern[1];

        if(Object.keys(this.state.players).length<MAX_SIZE) {
            let players = this.state.players;

            //TODO Remove Player if rtsp end shuts down -- callback???

            if (!this.state.players.hasOwnProperty(address)) {
                players[address] = this.state.streams[address];
            } else {
                delete players[address];
            }
            let theater = (<Theater videoNames={players} pattern={this.state.pattern}/>)
            this.setState({
                players: players,
                theater: theater
            });
            return true;
        }else{
            let players = this.state.players;
            if (this.state.players.hasOwnProperty(address)) {
                delete players[address];

                let theater = (<Theater videoNames={players} pattern={this.state.pattern}/>)
                this.setState({
                    players: players,
                    theater: theater
                });

                return true;

            }else {
                let that = this;

                if(!this._disableNotifications) {
                    that._disableNotifications=true;
                    let timeout = setTimeout(()=>{that._disableNotifications=false},3000);
                    NotificationManager.error("De-Select elements!", "Limit Reached!", 3000,()=>{
                        clearTimeout(timeout);
                        that._disableNotifications=false
                    });
                }
                return false;
            }
        }
    }
    setPattern(pattern){
        //TODO Update Theater
        let patternIcons = this.state.patternIcons;
        let patternString = "p"+pattern[0]+"x"+pattern[1];
        for(let key in patternIcons){
            if(patternString==key){
                patternIcons[key]._ = patternIcons[key].active;
            }else{
                patternIcons[key]._ = patternIcons[key].normal;
            }
        }
        this.setState({
            pattern:pattern,
            patternIcons:patternIcons
        })
    }
    render(){
        const streamListStyle = {
            height: "50%",
            width: "95%",
            margin: 5,
            textAlign: 'left',
            display: 'inline-block',
            backgroundColor: COLOR.paper,
            overflowY:"scroll"
        };
        return (
            <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
                <div>
                    <div id="drawerClosed" className="drawerClosed" >
                    <div className="whatIf">
                        <IconButton id="drawerClosedButton" className="drawerClosedButton" onTouchTap={this.toggleDrawer} style={{ float:"left", backgroundColor:COLOR.slider,height:"100%"}}><ContentSort /></IconButton>
                    </div>
                    </div>
                    <Drawer openSecondary={false} open={this.state.drawerIsOpen} >
                        <div id="drawerContent" style={{backgroundColor:COLOR.drawerBackground}}>
                            <RaisedButton
                                onTouchTap={this.toggleStreamNames}
                                label="Request"
                                backgroundColor={COLOR.drawerButton}
                                style={{
                                    margin:5
                                }}
                            />
                            <RaisedButton
                                onTouchTap={this.fetchStreamNames}
                                label="Refresh"
                                backgroundColor={COLOR.drawerButton}
                                style={{
                                    margin:5
                                }}
                            />
                            <MyList
                                style={streamListStyle}
                                color={COLOR}
                                depth={2}
                                elementNames={this.state.streams}
                                callback={this.toggleStream}
                            />
                            <div id="PatternContainer">
                                <img id="Pattern2x2" src={this.state.patternIcons.p2x2._} style={{
                                    padding:2,
                                    margin:5,
                                    width:48,
                                    height:48,
                                    backgroundColor:COLOR.playersBackground,
                                    borderRadius:4
                                }} onClick={()=>{
                                    this.setPattern([2,2]);
                                }}/>
                                <img id="Pattern3x3" src={this.state.patternIcons.p3x3._} style={{
                                    padding:2,
                                    margin:5,
                                    width:48,
                                    height:48,
                                    backgroundColor:COLOR.playersBackground,
                                    borderRadius:4
                                }} onClick={()=>{
                                    this.setPattern([3,3]);
                                }}/>
                                <img id="Pattern4x4" src={this.state.patternIcons.p4x4._} style={{
                                    padding:2,
                                    margin:5,
                                    width:48,
                                    height:48,
                                    backgroundColor:COLOR.playersBackground,
                                    borderRadius:4
                                }} onClick={()=>{
                                    this.setPattern([4,4]);
                                }}/>
                            </div>
                            <div id="NotificationContainerContainer">
                                <NotificationContainer/>
                            </div>
                            <RaisedButton
                                onTouchTap={this.exitApp}
                                label="Exit"
                                backgroundColor={COLOR.exitButton}
                                style={{
                                    position:"fixed",
                                    bottom:"5px",
                                    left:"5px"
                                }}
                            />
                        </div>
                        <div id="drawerOpen">
                            <IconButton onTouchTap={this.toggleDrawer}  style={{ float:"right", backgroundColor:COLOR.slider,height:"100%"}}><ContentSort /></IconButton>
                        </div>
                    </Drawer>
                    <div id="players" style={{backgroundColor:COLOR.playersBackground}}>
                        {this.state.theater}
                    </div>
                </div>
            </MuiThemeProvider>);
    }
}

ReactDOM.render(<App wowzaSEhost={wowza.host} wowzaSEport={wowza.port} username={wowza.username} password={wowza.password} wowzaApp={wowza.appName}/>,document.getElementById("app"));