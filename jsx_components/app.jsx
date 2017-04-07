import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as videojs from 'video.js';

//import * as wjs from 'wcjs-player';
//import * as prebuilt from 'wcjs-prebuilt';

//player.addPlaylist("http://archive.org/download/CartoonClassics/Krazy_Kat_-_Keeping_Up_With_Krazy.mp4");

class Player extends React.Component {

    componentDidMount(){
        this.player = videojs.constructor(this.videoPlayer, {
            src: '../video/test.mp4',
        }, () => {
            // on ready function for anything else you need to do
            // after the player is set up…
        });
        //document.getElementById('vlc').play();
        /*let player = new wjs("#player").addPlayer({
            autoplay: true,
            wcjs: prebuilt
            // OR
            // wcjs: require('webchimera.js')
            // OR
            // wcjs: require([path-to-Webchimera.js.node-file])
        });*/

        //player.addPlaylist("http://archive.org/download/CartoonClassics/Krazy_Kat_-_Keeping_Up_With_Krazy.mp4");
    }
    componentWillUnmount() {
        this.player.dispose();
        this.videoPlayer = undefined;
    }
    togglePlayback() {

    }

    render(){
        return (<div>

        </div>);
    }
}
ReactDOM.render(<Player name="World" />,document.getElementById("app"));