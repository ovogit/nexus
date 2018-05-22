// Dashboard React Component
// Dependency Imports
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
// import LinearProgress from '@material-ui/core/LinearProgress';
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

// Component Imports
import Navigation from './navigation.js';

const styles = {
    root: {
    },
    paper: {
        padding: 30,
    },
};

/**
 * @class Dashboard
 */
class Dashboard extends React.Component {

/**
 * @function constructor
 */
    constructor(props){
        super(props);
        this.render();
    }

/**
 * @function render
 */
    render (){
        const { classes } = this.props;
        return(
            <div className={ classes.root }>
                <Navigation />
                <Grid container spacing={24} style={{ paddingTop: 10 }}>
                    <Grid item xs={12} sm={4}>
                        <Paper className={ classes.paper }> Dash Item</Paper>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Paper className={ classes.paper }>Dash Item</Paper>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Paper className={ classes.paper }>Dash Item</Paper>
                    </Grid>
                </Grid>
            </div>
        );
    };

}
Dashboard.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(Dashboard); 
