import * as React from 'react';
import wjs from "wcjs-player";
import * as wjsPrebuilt from "wcjs-prebuilt";

class Player extends React.Component {
    constructor(props){
        super(props);
    }
    componentDidMount(){
        this.player = new wjs("#player"+this.props.name).addPlayer({
            autoplay: true,
            wcjs: wjsPrebuilt,
            buffer: 200
        });
        this.player.addPlaylist("rtsp://195.148.104.124:1935/live/"+this.props.name);
        this.player.ui(false);
    }
    componentWillUnmount() {
        //this.player.dispose();
        this.videoPlayer = undefined;
    }
    render(){
        let style = {
            width: 400,
            height: 400
        };
        return (<div id={"player"+this.props.name} style={style}></div>);
    }
}
module.exports = Player;
