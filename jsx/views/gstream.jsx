import * as React from "react";
//import * as wcjsGS from "wcjs-gs";
//import * as webglRenderer from "webgl-video-renderer";
import wjs from "wcjs-player";
import * as wjsPrebuilt from "wcjs-prebuilt";

class Gstream extends React.Component {
    constructor(props) {
        super(props);
        this.player = new wjs("#gstream").addPlayer({
            autoplay: true,
            wcjs: wjsPrebuilt,
            buffer: 20
        });
        this.player.addPlaylist(`C:/Users/nikitak/Documents/rbpirGstream.sdp`);
        this.player.ui(false);
        this.player.notify(this.props.notify || "");

    }

    render() {
        let style = {
            width: 400,
            height: 400,
            float: "right"
        };
        return (<div id={"GstreamPlayer"} style={this.props.style || style}></div>);
    }
}
module.exports = Gstream;