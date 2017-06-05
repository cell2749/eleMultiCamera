import * as React from "react";
import * as wcjsGS from "wcjs-gs";
import * as webglRenderer from "webgl-video-renderer";
class Gstream extends React.Component {
    constructor(props) {
        super(props);

        let renderContext = webglRenderer.setupCanvas(document.getElementById("GstreamCanvas"));
        let wcjs_gs = new wcjsGS.Player();
        wcjs_gs.parseLaunch("uridecodebin uri=http://download.blender.org/peach/bigbuckbunny_movies/big_buck_bunny_480p_stereo.avi name=dec ! appsink name=sink dec. ! audioconvert ! autoaudiosink");
        wcjs_gs.addAppSinkCallback("sink",
            function(type, frame) {
                if(type == wcjs_gs.AppSinkNewSample) {
                    renderContext.render(frame, frame.width, frame.height, frame.planes[1], frame.planes[2]);
                }
            } );
        wcjs_gs.setState(wcjs_gs.GST_STATE_PLAYING);

    }

    render() {
        return (<canvas id="GstreamCanvas" width="400px" height="400px" backgroundColor="red">Hello World</canvas>);
    }
}
module.exports = Gstream;