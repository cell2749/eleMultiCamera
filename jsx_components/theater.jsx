import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Player from "../jsx_components/player.jsx";

class Theater extends React.Component{
    constructor(props){
        /**
         * Props:
         * videoNames - json of {address:streamName}
         * pattern - json or array of horizontal and vertical camera numbers
         * */
        super(props);
    }
    componentDidMount(){

    }
    componentWillUnmount() {

    }
    render(){
        /**
         * 1. Parse Pattern X*Y
         * 2. Set up players
         * 3. Map players
         * 4. ???
         * 5. Profit
         * */
        let pattern = this.props.pattern;
        let videoNames = this.props.videoNames;

        let horizontal = pattern.horizontal||pattern[0];
        let vertical = pattern.vertical||pattern[1];

        let totalVideos = horizontal * vertical;
        let fullHeight = window.innerHeight;
        let fullWidth = window.innerWidth -48;
        let style = {
          width: Math.floor(fullWidth/horizontal),
          height: Math.floor(fullHeight/vertical),
          float:"right"
        };

        let players=[];
        for(let key in videoNames){
            if(players.length<totalVideos) {
                players.push(<Player name={videoNames[key]} key={key} style={style}/>);
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