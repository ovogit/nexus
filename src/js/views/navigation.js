import React from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import CssBaseline from '@material-ui/core/CssBaseline';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';



const styles = {
    root: {
        margin: 0,
        paddingBottom: 60,
    },
    flex: {
        marginLeft: 20,
    },
    menu: {
        background: 'rgba(0,0,0,0.1)',
        padding:0,

    },
    appbar: {
        width: '100%',
        background: '#2b2b2b',
    },
    menuItem : {
        width:200,
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
};

class Navigation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            auth: true,
            anchorEl: null,
            top: false,
            left: false,
            bottom: false,
            right: false,
        };
        this.render();
        this.handleDrawer = this.handleDrawer.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleMenu = this.handleMenu.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }


    handleChange(event, checked) {
        this.setState({ auth: checked });
    }

    handleDrawer(){
        let open = (this.state.left ? false : true);
        this.setState({
            left: open
        });
    }
    handleMenu(event) {
        this.setState({ anchorEl: event.currentTarget });
        //this.setState({ anchorEl: document.querySelector('#navbar')});
    }

    handleClose() {
        this.setState({ anchorEl: null });
    }

    render() {
        const { classes } = this.props;

        return (
                <div className={classes.root}>
                    <AppBar className={ classes.appbar } position="absolute">
                        <Toolbar>
                            <IconButton 
                                className={classes.menuButton} 
                                color="inherit" 
                                aria-label="Menu" 
                                aria-haspopup="true" 
                                onClick={this.handleDrawer} 
                                aria-owns={ open ? 'main-menu' : null}
                            >
                            <MenuIcon />
                            </IconButton>
                                <Typography variant="title" color="inherit" className={classes.flex}>
                                    NXS 
                                </Typography>
                        </Toolbar>
                    </AppBar>
                    <Drawer open={this.state.left} onClose={ this.handleDrawer }>
                        <List>
                            <Link to="/"><MenuItem onClick={this.handleClose} className={classes.menuItem}>Home</MenuItem></Link>
                            <Link to="/scraper"><MenuItem onClick={this.handleClose} className={classes.menuItem}>Scraper</MenuItem></Link>
                            <Link to="/color"><MenuItem onClick={this.handleClose} className={classes.menuItem}>Color</MenuItem></Link>
                        </List>
                    </Drawer>
                </div>
                    );
    }
}

Navigation.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(Navigation); 
