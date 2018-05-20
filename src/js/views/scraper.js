import React from 'react'
import Navigation from './navigation.js'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Paper from '@material-ui/core/Paper';

const styles = theme => ({
    root: {
        flexGrow: 1,
        display: 'flex',
        flexWrap: 'wrap',
    },
    paper: {
        padding: theme.spacing.unit * 2,
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    contentGrid:{
        padding:20,
    },
    formControl: {
        display: 'flex',
    },
    select: {
        flexGrow:1,
    },
    container: {
    },
    textField: {
        marginBottom: 20,
    },
});

class Scraper extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            status: '',
            terms: '',
            state: '',
            city: '',
            error: ''
        };
        this.handleTermsChange = this.handleTermsChange.bind(this);
        this.handleStateChange = this.handleStateChange.bind(this);
        this.handleCityChange = this.handleCityChange.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleTermsChange(event) {
        this.setState({ terms: event.target.value });
    }

    handleStateChange(event) {
        this.setState({ state: event.target.value });
    }

    handleCityChange(event) {
        this.setState({ city: event.target.value });
    }

    submitForm(){
        event.preventDefault();
        let {terms, state, city} = this.state;
        if ( terms != '' && state != '' && city != '') {
            this.state.error = null;
            fetch('http://10.0.0.160:5000/ypscraper/'+state+'/'+city+'/'+terms)
                .then(function (response) {
                    return response.json();
                })
            .then(function (json) {
                return console.log(json.data);
            });
        } else {
            this.setState({error: "Missing Fields"});
            console.log(this.state.error);
        }
    }
    handleSubmit(event) {
        event.preventDefault();
        this.submitForm();
    }

    render() {
        const { classes } = this.props;
        return (
                <div className={classes.root}>
                    <Grid container spacing={24}>
                        <Grid item xs={12}>
                            <Navigation />
                        </Grid>
                    </Grid>
                    <Grid container spacing={24} className={classes.contentGrid}>
                        <Grid item xs={12} sm={4}>
                            <div>{ this.state.error }</div>
                            <form ref="ypform" onSubmit={this.handleSubmit}>
                                <FormControl className={classes.formControl} margin='normal' fullWidth={true}>
                                    <TextField
                                        id="terms"
                                        label="Search Terms"
                                        className={classes.textField}
                                        value={this.state.terms}
                                        onChange={this.handleTermsChange}
                                        margin="normal"
                                    />
                                </FormControl>
                                <Grid container spacing={24}>
                                    <Grid item xs={12} sm={6}>
                                    <FormControl className={classes.formControl} margin='normal' >
                                        <InputLabel htmlFor="state">State</InputLabel>
                                        <Select
                                            className={classes.select}
                                            fullWidth={true}
                                            value={this.state.state}
                                            onChange={this.handleStateChange}
                                            inputProps={{
                                                name: 'state',
                                                id: 'state',
                                                }}
                                            >
                                                <MenuItem value="CA">
                                                    <em>CA</em>
                                                </MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <FormControl className={classes.formControl} margin='normal' >
                                            <InputLabel htmlFor="city">City</InputLabel>
                                            <Select
                                                className={classes.select}
                                                fullWidth={true}
                                                value={this.state.city}
                                                onChange={this.handleCityChange}
                                                inputProps={{
                                                    name: 'city',
                                                    id: 'city',
                                                    }}
                                                >
                                                    <MenuItem value="Oakland">
                                                        <em>Oakland</em>
                                                    </MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        </Grid>
                                        <Button onClick={ this.submitForm } size="large" variant="raised" color="primary" className={classes.button}>
                                            Search
                                        </Button>
                                    </form>
                                </Grid>
                            </Grid>
                        </div>
                    );
    };
}
Scraper.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(Scraper); 
