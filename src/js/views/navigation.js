import React from 'react';
import {Link} from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import PropTypes from 'prop-types';
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

const styles = {
    root: {
    },
    menu: {
        background: 'rgba(0,0,0,0.1)',
        padding:0,

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
        };
        this.render();
        this.handleChange = this.handleChange.bind(this);
        this.handleMenu = this.handleMenu.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }
    handleChange(event, checked) {
        this.setState({ auth: checked });
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
        const { auth, anchorEl } = this.state;
        const open = Boolean(anchorEl);

        return (
            <div className={classes.root}>
            <CssBaseline />
                <AppBar position="static">
                    <Toolbar>
                        <IconButton 
                            className={classes.menuButton} 
                            color="inherit" 
                            aria-label="Menu" 
                            aria-haspopup="true" 
                            onClick={this.handleMenu} 
                            aria-owns={ open ? 'main-menu' : null}
                        >
                        <MenuIcon />
                        </IconButton>
                        <Menu
                            className={classes.menu}
                            id="main-menu"
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={open}
                            onClose={this.handleClose}
                        >
                        <Link to="/"><MenuItem onClick={this.handleClose} className={classes.menuItem}>Home</MenuItem></Link>
                        <Link to="/scraper"><MenuItem onClick={this.handleClose} className={classes.menuItem}>Scraper</MenuItem></Link>
                        </Menu>
                        <Typography variant="title" color="inherit" className={classes.flex}>
                            Nexus
                        </Typography>
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}

Navigation.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(Navigation); 
