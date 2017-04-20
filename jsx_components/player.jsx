import * as React from 'react';
import * as ReactDOM from 'react-dom';
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

        let that = this;
        function validate (player){
            setTimeout(() => {
                if(player.stateInt()==7){
                    console.log("Unmount");
                    ReactDOM.unmountComponentAtNode(document.getElementById("player"+that.props.name));
                }
                validate(player);
            }, 1000);
        }
        validate(this.player);
    }
    componentWillUnmount() {
        //this.player.dispose();
    }
    render(){
        let style = {
            width: 400,
            height: 400,
            float: "right"
        };
        return (<div id={"player"+this.props.name} style={this.props.style||style}></div>);
    }
}
module.exports = Player;
