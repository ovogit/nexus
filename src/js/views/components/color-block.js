// ColorBlock React Component
// Dependency Imports
import React from 'react'
import PropTypes from 'prop-types';
import CssBaseline from '@material-ui/core/CssBaseline';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

const styles = {
    root: {
        flex: 1,
    },
    paper: {
        height: 90,
        margin: 10,
        display:'flex',
    },
    block: {
        flex:1,
        flexGrow:1
    },
    b: {
        color:"#ffffff",
        textShadow:"1px 1px 2px rgba(0,0,0,0.4)"
    }
};

/**
 * @class ColorBlock
 */
class ColorBlock extends React.Component {

    constructor(props){
        super(props);
        console.log(this.props.colors);
        this.render();
    }

    render (){
        const { classes } = this.props;
        const box1 = <div className={classes.block} style={{ backgroundColor: "#"+this.props.colors[0] }}><b className={classes.b}>{this.props.colors[0]}</b></div>
        const box2 = <div className={classes.block} style={{ backgroundColor: "#"+this.props.colors[1] }}><b className={classes.b}>{this.props.colors[1]}</b></div>
        const box3 = <div className={classes.block} style={{ backgroundColor: "#"+this.props.colors[2] }}><b className={classes.b}>{this.props.colors[2]}</b></div>
        const box4 = <div className={classes.block} style={{ backgroundColor: "#"+this.props.colors[3] }}><b className={classes.b}>{this.props.colors[3]}</b></div>
        const box5 = <div className={classes.block} style={{ backgroundColor: "#"+this.props.colors[4] }}><b className={classes.b}>{this.props.colors[4]}</b></div>

        return(
            <div className={ classes.root }>
                <Paper className={ classes.paper }>{ box1}{box2}{box3}{box4}{box5}</Paper> 
            </div>
        );
    };

}
ColorBlock.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(ColorBlock); 

