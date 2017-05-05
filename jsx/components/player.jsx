import * as React from 'react';
import wjs from "wcjs-player";
import * as wjsPrebuilt from "wcjs-prebuilt";

class Player extends React.Component {
    constructor(props) {
        super(props);

    }

    componentDidMount() {
        this.player = new wjs("#player" + this.props.name).addPlayer({
            autoplay: true,
            wcjs: wjsPrebuilt,
            buffer: 200
        });
        this.player.addPlaylist(`rtsp://${this.props.host}:${this.props.port}/${this.props.appName}/${this.props.name}`);
        this.player.ui(false);
        this.player.notify(this.props.notify || "");
        /*this._ = setInterval(()=>{
            if(this.player.stateInt()===7){
                this.props.unmount();
            }
        },1000);*/
    }

    componentWillUnmount() {
        //this.player.dispose();
        console.log("Unmount - Player");
        //clearInterval(this._);
    }

    render() {
        let style = {
            width: 400,
            height: 400,
            float: "right"
        };
        return (<div id={"player" + this.props.name} style={this.props.style || style}></div>);
    }
}
module.exports = Player;
