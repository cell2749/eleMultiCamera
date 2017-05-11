import * as React from 'react';

//Material-ui imports
import {Paper, FlatButton, TextField} from 'material-ui';


class MyList extends React.Component {
    constructor(props) {
        super(props);
        /**
         * Props:
         * style
         * depth
         * elementNames - JSON
         *
         * colors?
         * */
        this.state = {
            elementStyles: {},
            filter: ""
        };
        //Button bindings
        this.toggleElement = this.toggleElement.bind(this);
    }

    toggleElement(key) {
        if (this.props.callback(key)) {
            let element = this.refs[key].props;
            let elementStyles = this.state.elementStyles;
            if (element.backgroundColor == this.props.color.itemColor) {
                elementStyles[key] = {
                    backgroundColor: this.props.color.itemSeletedColor,
                    hoverColor: this.props.color.itemSelectedHoverColor
                };
                this.setState({
                    elementStyles: elementStyles
                });
            } else {
                elementStyles[key] = {
                    backgroundColor: this.props.color.itemColor,
                    hoverColor: this.props.color.itemHoverColor
                };
                this.setState({
                    elementStyles: elementStyles
                });
            }
        }
    }

    render() {
        let elementNames = this.props.elementNames;
        let elementList = [];
        let elementStyles = this.state.elementStyles;

        for (let key in elementNames) {
            let backgroundColor = this.props.color.itemColor;
            let hoverColor = this.props.color.itemHoverColor;
            if (elementStyles[key]) {
                backgroundColor = elementStyles[key].backgroundColor;
                hoverColor = elementStyles[key].hoverColor;
            }
            if (elementNames[key].indexOf(this.state.filter) != -1 || this.state.filter == "") {
                elementList.push(
                    <FlatButton
                        key={key}
                        ref={key}
                        backgroundColor={backgroundColor}
                        hoverColor={hoverColor}
                        label={elementNames[key]}
                        onClick={() => {
                            this.toggleElement(key);
                        }}
                        style={{
                            width: "100%"
                        }}
                    />
                );
            }

        }
        const defaultStyle = {
            height: "50%",
            width: "95%",
            margin: 5,
            textAlign: 'left',
            display: 'inline-block',
            overflowY: "scroll",
            backgroundColor: "#616161"
        };
        //TODO adjust style
        return (
            <div style={{height: this.props.style.height || defaultStyle.height, width: "95%",display:"inline-block"}}>
                <TextField
                    id="listFilter"
                    hintText="Filter"
                    onChange={(e) => {
                        this.setState({filter: e.target.value});
                    }}
                />
                <Paper
                    style={{
                        height: "100%",
                        width: "100%",
                        margin: this.props.style.margin || 5,
                        textAlign: this.props.style.textAlign || 'left',
                        display: this.props.style.display || 'inline-block',
                        backgroundColor: this.props.style.backgroundColor || "#616161",
                        overflowY: this.props.style.overflowY || "scroll"
                    }}
                    zDepth={this.props.depth || 1}>
                    {elementList}
                </Paper>
            </div>

        )
    }
}
module.exports = MyList;