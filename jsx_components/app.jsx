import * as React from 'react';
import * as ReactDOM from 'react-dom';
import HTTPdigest from "request-digest";
import Player from "../jsx_components/player.jsx";
import * as env from "../env.json"
import wjs from "wcjs-player";
import * as wjsPrebuilt from "wcjs-prebuilt";
//import * as wjs from 'wcjs-player';
//import * as prebuilt from 'wcjs-prebuilt';

//player.addPlaylist("http://archive.org/download/CartoonClassics/Krazy_Kat_-_Keeping_Up_With_Krazy.mp4");

class App extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            dummy:(<p>Hello World</p>),
            players:(<div></div>),
            streams:{}
        };
        //bindings
        this.fetchStreamNames = this.fetchStreamNames.bind(this);

    }
    componentDidMount(){

    }
    componentWillUnmount() {

    }
    fetchStreamNames(e){
        let players=[];
        let that = this;
        let streams = that.state.streams;

        let digestRequest = HTTPdigest(this.props.username, this.props.password);
        digestRequest.request({
            host: that.props.wowzaSEhost,
            path: '/v2/servers/_defaultServer_/vhosts/_defaultVHost_/applications/live/instances',
            port: that.props.wowzaSEport,
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }, function (error, response, body) {
            if (error) {
                throw error;
            }
            try{
                let jsonResp = JSON.parse(body);
                jsonResp.instanceList.forEach((instance)=>{
                    instance.incomingStreams.forEach((incomingStream)=>{
                        if(!streams.hasOwnProperty(incomingStream.sourceIp)) {
                            streams[incomingStream.sourceIp]=incomingStream.name;
                            players.push(
                                <Player name={incomingStream.name} key={incomingStream.name}/>
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

    render(){
        return (
            <div>
                <button onClick={this.fetchStreamNames}> Request</button>
                {this.state.dummy}
                <div>
                    {this.state.players}
                </div>
            </div>);
    }
}

ReactDOM.render(<App wowzaSEhost="http://streamer.metropolia.fi" wowzaSEport="8087" username={env.username} password={env.password}/>,document.getElementById("app"));