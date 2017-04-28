import * as React from 'react';
import * as ReactDOM from 'react-dom';
//views
import Monitoring from "../jsx/views/monitoring";
import Login from "../jsx/views/login";
import Configuration from "../jsx/views/configuration";

import * as wowza from "../wowza.json";

import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

const COLOR = {
    drawerButton: "#455A64",
    drawerBackground: "#263238",
    exitButton: "#880E4F",
    playersBackground: "#455A64",
    slider: "#212121",
    paper: "#455A64",
    itemColor: "#006064",
    itemHoverColor: "#00838F",
    itemSeletedColor: "#4A148C",
    itemSelectedHoverColor: "#6A1B9A"
}
class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            view: (<Login changeStateTo={this.changeStateTo.bind(this)}/>),
            settings:{
                username:"",
                password:"",
                appName:""
            }
        };
        this.viewState = {
            login: (<Login changeStateTo={this.changeStateTo.bind(this)}/>),
            monitoring: (<Monitoring changeStateTo={this.changeStateTo.bind(this)}
                                     wowzaSEhost={wowza.host}
                                     wowzaSEport={wowza.port}
                                     username={this.state.settings.username}
                                     password={this.state.settings.password}
                                     wowzaApp={this.state.settings.appName}/>),
            configuration: (<Configuration changeStateTo={this.changeStateTo.bind(this)}/>)
        }
    }
    componentDidMount(){

    }
    changeStateTo(state,settings) {

        if(this.viewState.hasOwnProperty(state)) {
            this.setState({
                view:this.viewState[state],
                settings: settings
            });
        }
    }
    render() {

        return (
            <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)} style={{height:"100%",width:"100%",backgroundColor:COLOR.itemColor,color:COLOR.itemColor}}>
                {this.state.view}
            </MuiThemeProvider>);
    }

}
ReactDOM.render(<App/>, document.getElementById("app"));