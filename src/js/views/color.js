// Color React Component
import React from 'react'
import PropTypes from 'prop-types';
import CssBaseline from '@material-ui/core/CssBaseline';
import { withStyles } from '@material-ui/core/styles';
 import Grid from '@material-ui/core/Grid';
// import Button from '@material-ui/core/Button';
// import TextField from '@material-ui/core/TextField';
// import Input from '@material-ui/core/Input';
// import InputLabel from '@material-ui/core/InputLabel';
// import FormHelperText from '@material-ui/core/FormHelperText';
// import FormControl from '@material-ui/core/FormControl';
// import Select from '@material-ui/core/Select';
 import Paper from '@material-ui/core/Paper';
 import LinearProgress from '@material-ui/core/LinearProgress';
// import AppBar from '@material-ui/core/AppBar';
// import Toolbar from '@material-ui/core/Toolbar';
// import Typography from '@material-ui/core/Typography';
// import IconButton from '@material-ui/core/IconButton';
// import AccountCircle from '@material-ui/icons/AccountCircle';
// import Switch from '@material-ui/core/Switch';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import FormGroup from '@material-ui/core/FormGroup';
// import MenuItem from '@material-ui/core/MenuItem';
// import Menu from '@material-ui/core/Menu';
// import MenuIcon from '@material-ui/icons/Menu';

import Navigation from './navigation.js'
import ColorBlock from './components/color-block.js'

const styles = {
    root: {
    },
    paper: {
        height: 90,
        margin: 10,
    }
};

/**
 * @class Color
 */
class Color extends React.Component {

    constructor(props){
        super(props);
        // bind functions
        this.state = {
            colorsData: null
        }
        this.loadColors = this.loadColors.bind(this);
        // prepare
        this.loadColors();
        // render
        this.render();
    }

    loadColors(){
        var that = this;
        fetch( 'http://10.0.0.160:5000/colors' )
            .then( ( response ) => {
                return response.json();
            })
        .then( ( json ) => {
            that.setState({colorsData:json.data});
            console.log( that.state.colorsData );
            return 
        });
    }

    render (){
       const { classes } = this.props;
        let colors = [];
        if ( this.state.colorsData != null ){
            for(let i = 0; i < this.state.colorsData.length; i++ ){
                colors.push(<ColorBlock colors={ this.state.colorsData[i] } />);
            }
        } else {
            colors = '';
        }
       return(
           <div className={ classes.root }>
               <Navigation />
               <Grid container spacing={24}>
                   <Grid item xs={12} sm={12} md={4}>
                       { colors }
                   </Grid>
               </Grid>
           </div>
       );
    };

}

Color.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Color); 
