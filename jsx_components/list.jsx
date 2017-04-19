import * as React from 'react';

//Material-ui imports
import Paper from 'material-ui/Paper';
import { Tabs, Tab, List, ListItem } from 'material-ui';
import FlatButton from 'material-ui/FlatButton';

class MyList extends React.Component {
    constructor(props){
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
            elementStyles:{

            }
        };

        //Button bindings
        this.toggleElement = this.toggleElement.bind(this);
    }
    toggleElement(key){
        let element = this.refs[key].props;
        let elementStyles = this.state.elementStyles;
        if(element.backgroundColor==this.props.color.itemColor){
            elementStyles[key]={
              backgroundColor:this.props.color.itemSeletedColor,
              hoverColor:this.props.color.itemSelectedHoverColor
            };
            this.setState({
                elementStyles:elementStyles
            });
        }else{
            elementStyles[key]={
                backgroundColor:this.props.color.itemColor,
                hoverColor:this.props.color.itemHoverColor
            };
            this.setState({
                elementStyles:elementStyles
            });
        }
        this.props.callback(key);
    }
    render(){
        let elementNames = this.props.elementNames;
        let elementList = [];
        let elementStyles = this.state.elementStyles;

        for(let key in elementNames){
            let backgroundColor = this.props.color.itemColor;
            let hoverColor = this.props.color.itemHoverColor;
            if(elementStyles[key]){
                backgroundColor = elementStyles[key].backgroundColor;
                hoverColor = elementStyles[key].hoverColor;
            }

            elementList.push(
                <FlatButton
                    key={key}
                    ref={key}
                    backgroundColor={backgroundColor}
                    hoverColor={hoverColor}
                    label={elementNames[key]}
                    onTouchTap={() => {
                        this.toggleElement(key)
                    }}
                    style={{
                        width: "100%"
                    }}
                />
            );

        }
        const streamListStyle = {
            height: "50%",
            width: "95%",
            margin: 5,
            textAlign: 'left',
            display: 'inline-block',
            overflowY:"scroll",
            backgroundColor: "#616161"
        };
        return(
            <Paper style={this.props.style||defaultStyle} zDepth={this.props.depth||1}>
                {elementList}
            </Paper>

        )
    }
}
module.exports = MyList;

/*

 <Paper style={this.props.style||defaultStyle} zDepth={this.props.depth||1}>
 {elementList}
 </Paper>
*/