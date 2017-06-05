import * as React from 'react';
import * as ReactDOM from 'react-dom';
//views
import Monitoring from "../jsx/views/monitoring";
import Login from "../jsx/views/login";
import Gstream from "../jsx/views/gstream";

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
            view: (<Gstream changeStateTo={this.changeStateTo.bind(this)}/>)
            //view: (<Login wowza={wowza} changeStateTo={this.changeStateTo.bind(this)}/>)

        };

    }

    componentDidMount() {
    }

    changeStateTo(state, settings) {
        let states = {
            login: (<Login wowza={wowza} changeStateTo={this.changeStateTo.bind(this)}/>),
            monitoring: (<Monitoring changeStateTo={this.changeStateTo.bind(this)}
                                     wowza={wowza}
                                     settings={settings}
            />),
            gstream: (<Gstream changeStateTo={this.changeStateTo.bind(this)}/>)
        };
        if (states.hasOwnProperty(state)) {
            this.setState({
                view: states[state]
            });
        }
    }

    render() {
        return (
            <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)} style={{
                height: "100%",
                width: "100%",
                backgroundColor: COLOR.itemColor,
                color: COLOR.itemColor
            }}>
                {this.state.view}
            </MuiThemeProvider>);
    }

}
ReactDOM.render(<App/>, document.getElementById("app"));