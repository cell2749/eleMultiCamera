import * as React from 'react';
import * as electron from "electron";
const {remote} = electron;
import HTTPdigest from "request-digest";

//My Components
import MyList from "../../jsx/components/list.jsx";
import Theater from "../../jsx/components/theater.jsx";

//Materials
import RaisedButton from 'material-ui/RaisedButton';
import Drawer from 'material-ui/Drawer';
import IconButton from 'material-ui/IconButton';
import ContentSort from 'material-ui/svg-icons/content/sort';

//Additional UI components
import {NotificationContainer, NotificationManager} from 'react-notifications';

import * as COLOR from "../../jsx/color.json"

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


class Monitoring extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dummy: (<p>Hello World</p>),
            players: {},
            streams: {},
            theater: (<div></div>),
            drawerIsOpen: false,
            pattern: [2, 2],
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
        this._disableNotifications = false;
        //50 Shades of bindings
        this.fetchStreamNames = this.fetchStreamNames.bind(this);
        this.toggleDrawer = this.toggleDrawer.bind(this);
        this.toggleStream = this.toggleStream.bind(this);
        this.setPattern = this.setPattern.bind(this);
    }

    componentDidMount() {

    }

    componentWillUnmount() {
        console.log("Unmount - App");
    }

    fetchStreamNames() {
        let that = this;
        let streamNames = {};
        let players = this.state.players;
        let digestRequest = HTTPdigest(this.props.settings.username, this.props.settings.password);
        digestRequest.request({
            host: "http://" + that.props.wowza.host,
            path: `/v2/servers/${that.props.settings.server}/vhosts/${that.props.settings.vhost}/applications/${that.props.settings.appName}/instances`,
            port: that.props.wowza.apiPort,
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }, function (error, response, body) {
            if (error) {
                console.log(error);
            } else {
                try {

                    let jsonResp = JSON.parse(body);
                    jsonResp.instanceList.forEach((instance) => {
                        instance.incomingStreams.forEach((incomingStream) => {
                            streamNames[incomingStream.sourceIp] = incomingStream.name;
                        });
                    });

                    for (let address in players) {
                        if (!streamNames.hasOwnProperty(address)) {
                            delete players[address];
                        }
                    }
                    let theater = (
                        <Theater
                            appName={that.props.wowza.appName}
                            host={that.props.wowza.host}
                            port={that.props.wowza.streamerPort}
                            videoNames={players}
                            pattern={that.state.pattern}
                        />
                    );
                    that.setState({
                        streams: streamNames,
                        players: players,
                        theater: theater
                    });
                } catch (e) {
                    console.log(e);
                }
            }
        });
    }

    exitApp() {
        remote.getCurrentWindow().close();
    }

    toggleDrawer() {
        this.setState({
            drawerIsOpen: !this.state.drawerIsOpen
        });
    }

    toggleStream(address) {
        let MAX_SIZE = this.state.pattern[0] * this.state.pattern[1];

        if (Object.keys(this.state.players).length < MAX_SIZE) {
            let players = this.state.players;

            //TODO Remove Player automatically if rtsp end shuts down -- callback???

            if (!this.state.players.hasOwnProperty(address)) {
                players[address] = this.state.streams[address];
            } else {
                delete players[address];
            }
            let theater = (
                <Theater
                    appName={this.props.wowza.appName}
                    host={this.props.wowza.host}
                    port={this.props.wowza.streamerPort}
                    videoNames={players}
                    pattern={this.state.pattern}
                />);
            this.setState({
                players: players,
                theater: theater
            });
            return true;
        } else {
            let players = this.state.players;
            if (this.state.players.hasOwnProperty(address)) {
                delete players[address];

                let theater = (
                    <Theater
                        appName={this.props.wowza.appName}
                        host={this.props.wowza.host}
                        port={this.props.wowza.streamerPort}
                        videoNames={players}
                        pattern={this.state.pattern}
                    />);
                this.setState({
                    players: players,
                    theater: theater
                });

                return true;

            } else {
                let that = this;

                if (!this._disableNotifications) {
                    that._disableNotifications = true;
                    let timeout = setTimeout(() => {
                        that._disableNotifications = false
                    }, 3000);
                    NotificationManager.error("De-Select elements!", "Limit Reached!", 3000, () => {
                        clearTimeout(timeout);
                        that._disableNotifications = false
                    });
                }
                return false;
            }
        }
    }

    setPattern(pattern) {
        let playersCount = Object.keys(this.state.players).length;
        let patternSize = pattern[0] * pattern[1];
        let that = this;
        //Notify user about removing some videos for small patterns
        if (playersCount > patternSize) {
            if (!this._disableNotifications) {
                that._disableNotifications = true;
                let timeout = setTimeout(() => {
                    that._disableNotifications = false
                }, 3000);
                NotificationManager.error("De-Select elements!", "Pattern Too Small!", 3000, () => {
                    clearTimeout(timeout);
                    that._disableNotifications = false
                });
            }
        } else {
            let patternIcons = this.state.patternIcons;
            let patternString = "p" + pattern[0] + "x" + pattern[1];
            for (let key in patternIcons) {
                if (patternString == key) {
                    patternIcons[key]._ = patternIcons[key].active;
                } else {
                    patternIcons[key]._ = patternIcons[key].normal;
                }
            }


            let theater = (
                <Theater
                    appName={this.props.wowza.appName}
                    host={this.props.wowza.host}
                    port={this.props.wowza.streamerPort}
                    videoNames={this.state.players}
                    pattern={pattern}/>
            );
            this.setState({
                pattern: pattern,
                patternIcons: patternIcons,
                theater: theater
            })
        }
    }

    render() {
        const streamListStyle = {
            height: "50%",
            width: "95%",
            margin: 5,
            textAlign: 'left',
            display: 'inline-block',
            backgroundColor: COLOR.paper,
            overflowY: "scroll"
        };
        //<MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
        //</MuiThemeProvider>
        return (

            <div>
                <div id="drawerClosed" className="drawerClosed">
                    <div className="whatIf">
                        <IconButton id="drawerClosedButton" className="drawerClosedButton"
                                    onTouchTap={this.toggleDrawer} style={{
                            float: "left",
                            backgroundColor: COLOR.slider,
                            height: "100%"
                        }}><ContentSort /></IconButton>
                    </div>
                </div>
                <Drawer openSecondary={false} open={this.state.drawerIsOpen}>
                    <div id="drawerContent" style={{backgroundColor: COLOR.drawerBackground}}>
                        <RaisedButton
                            onTouchTap={()=>{
                                console.log("Direct Connection");
                            }}
                            disabled={true}
                            label="Connect"
                            backgroundColor={COLOR.drawerButton}
                            style={{
                                margin: 5
                            }}
                        />
                        <RaisedButton
                            onTouchTap={this.fetchStreamNames}
                            label="Refresh"
                            backgroundColor={COLOR.drawerButton}
                            style={{
                                margin: 5
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
                                padding: 2,
                                margin: 5,
                                width: 48,
                                height: 48,
                                backgroundColor: COLOR.playersBackground,
                                borderRadius: 4
                            }} onClick={() => {
                                this.setPattern([2, 2]);
                            }}/>
                            <img id="Pattern3x3" src={this.state.patternIcons.p3x3._} style={{
                                padding: 2,
                                margin: 5,
                                width: 48,
                                height: 48,
                                backgroundColor: COLOR.playersBackground,
                                borderRadius: 4
                            }} onClick={() => {
                                this.setPattern([3, 3]);
                            }}/>
                            <img id="Pattern4x4" src={this.state.patternIcons.p4x4._} style={{
                                padding: 2,
                                margin: 5,
                                width: 48,
                                height: 48,
                                backgroundColor: COLOR.playersBackground,
                                borderRadius: 4
                            }} onClick={() => {
                                this.setPattern([4, 4]);
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
                                position: "fixed",
                                bottom: "5px",
                                left: "5px"
                            }}
                        />
                    </div>
                    <div id="drawerOpen">
                        <IconButton onTouchTap={this.toggleDrawer} style={{
                            float: "right",
                            backgroundColor: COLOR.slider,
                            height: "100%"
                        }}><ContentSort /></IconButton>
                    </div>
                </Drawer>
                <div id="players" style={{backgroundColor: COLOR.playersBackground}}>
                    {this.state.theater}
                </div>
            </div>
        );
    }
}
module.exports = Monitoring;
