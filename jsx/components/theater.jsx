import * as React from 'react';
import Player from "../../jsx/components/player.jsx";

class Theater extends React.Component {
    constructor(props) {
        /**
         * Props:
         * videoNames - json of {address:streamName}
         * pattern - json or array of horizontal and vertical camera numbers
         * */
        super(props);
        this.refresh=this.refresh.bind(this);
    }

    componentWillUnmount() {
        console.log("Unmount - Theater");
    }
    refresh(){
        //TODO - Need to remove the player from player array
        //Either remove from array or initiate refresh from monitoring component

    }
    render() {
        let horizontal = this.props.pattern.horizontal || this.props.pattern[0];
        let vertical = this.props.pattern.vertical || this.props.pattern[1];

        let totalVideos = horizontal * vertical;
        let fullHeight = window.innerHeight;
        let fullWidth = window.innerWidth;
        let style = {
            width: Math.floor(fullWidth / horizontal),
            height: Math.floor(fullHeight / vertical),
            float: "right"
        };

        let players = [];
        for (let key in this.props.videoNames) {
            if (players.length < totalVideos) {
                players.push(
                    <Player
                        name={this.props.videoNames[key]}
                        host={this.props.host}
                        port={this.props.port}
                        appName={this.props.appName}
                        notify={this.props.videoNames[key]}
                        key={key}
                        unmount={this.refresh()}
                        style={style}
                    />
                );
            }
        }
        return (
            <div id="Theater">
                {players}
            </div>
        );
    }

}

module.exports = Theater;