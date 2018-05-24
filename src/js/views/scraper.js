// TODO loading animation while fetching csv data
// - create download last csv 
import React from 'react'
import Navigation from './navigation.js'
import { Link } from 'react-router-dom'
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
import LinearProgress from '@material-ui/core/LinearProgress';

// GLOBAL ENV VARS
import NXSCONFIG from '../env.js';

const styles = theme => ({
    root: {
    },
    progress: {
    },
    paper: {
        padding: theme.spacing.unit * 2,
        textAlign: 'left',
        color: theme.palette.text.secondary,
        marginBottom: 10
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
    button:{
        marginRight: 10
    },
    container: {
    },
    textField: {
        marginBottom: 20,
    },
});


/**
 * @class Scraper
 * @function handleTermsChange
 * @function handleStateChange
 * @function handleCityChange
 * @function submitForm
 */

class Scraper extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            status: '',
            allCSVFiles: null,
            lastCSV: null,
            lastCSVDownloadUrl: NXSCONFIG.host + ':5000/download/last',
            lastCSVData: null,
            loading: false,
            terms: '',
            state: '',
            city: '',
            error: ''
        };
        this.fetchLastCSV = this.fetchLastCSV.bind(this);
        this.fetchAllCSV = this.fetchAllCSV.bind(this);
        this.handleTermsChange = this.handleTermsChange.bind(this);
        this.handleStateChange = this.handleStateChange.bind(this);
        this.handleCityChange = this.handleCityChange.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidUpdate(){
    }
    componentWillMount(){
        this.fetchAllCSV();
    }

    //TODO get the last csv filename and return a download file options
    fetchAllCSV() {
        var that = this;
        fetch( NXSCONFIG.host+':5000/query/csvs' )
            .then( ( response ) => {
                return response.json();
            })
        .then( ( json ) => {
            if( json.error == null ){
                if ( json.data ) {
                    that.setState({ allCSVFiles : json.data });
                    console.log( json.data );
                }
                return 
            } else {
                that.setState({ allCSVFiles : null });
                that.setState({ error: 'No CSVs' });
            }
        });
    }
    fetchLastCSV() {
        var that = this;
        fetch( NXSCONFIG.host+':5000/query/last' )
            .then( ( response ) => {
                return response.json();
            })
        .then( ( json ) => {
            if( json.error == null ){
                if ( json.lastCSV ) {
                    that.setState({ lastCSV : json.lastCSV[0] }); 
                    that.setState({ lastCSVData : json.data });
                }
                return 
            } else {
                that.setState({ lastCSVData : null });
                that.setState({ error: json.error });
            }
        });
    }
    loadCSV(){
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
            this.setState({ error: null });
            this.setState({ loading: true });
            var that = this;
            fetch(NXSCONFIG.host+':5000/ypscraper/'+state+'/'+city+'/'+terms)
                .then(function (response) {
                    return response.json();
                })
            .then(function (json) {
                if( json.error == null ){
                    that.fetchLastCSV();
                    that.setState({loading : false });
                    that.fetchAllCSV();
                    return
                } else {
                    that.setState({ error: json.error });
                    that.setState({ loading: false });
                    that.setState({ terms: '' });
                }
            });
        } else {
            this.setState({error: "Missing Fields"});
        }
    }

    handleSubmit(event) {
        event.preventDefault();
        this.submitForm();
    }

    render() {
        let loading = (this.state.loading ? false : true);
        let buttonsLoading = (this.state.loading ? true : false);
        const { classes } = this.props;
        const isLastCSV = this.state.lastCSV;
        const downloadLastCSVButton = isLastCSV ? (
                 <span>
                <a href={ this.state.lastCSVDownloadUrl }>
                <Button disabled={ buttonsLoading }  size="xs" variant="raised" color="default" className={classes.button}>Download CSV</Button>
                </a>
                <Button disabled={ buttonsLoading } onClick={ this.toggleQueryResults }  size="small" variant="raised" color="default" className={classes.button}>Show Query Results</Button>
                </span>
        ) : (
            <span>
            <Button  size="small" variant="raised" color="default" disabled={true} className={classes.button}>Download CSV</Button>
            <Button disabled={true} size="small" variant="raised" color="default" className={classes.button}>Show Query Results</Button>
            </span>
                
        );

        let allCSVFiles = [];
        if ( this.state.allCSVFiles != null ) {
            for( var i = 0; i < this.state.allCSVFiles.length; i++) {
                let key = 'csv-file' + i;
                allCSVFiles.push( <Paper key={ key } className={ classes.paper }> 
                                    <a href={NXSCONFIG.host + ':5000/download/csv/' + this.state.allCSVFiles[i]}><Button size="small" variant="raised" color="default" className={classes.button}>Download</Button></a>
                                    { this.state.allCSVFiles[i] } </Paper> );
            }
        }
        else {
            allCSVFiles = [<div key={ 'no-csv-files' }>No CSV Files</div>]
        }
        let dataElements = []
        if ( this.state.lastCSVData != null ){
            for( var i = 0; i < this.state.lastCSVData.length; i++){
                let name = this.state.lastCSVData[i].name;
                let address = this.state.lastCSVData[i].address;
                let phone = this.state.lastCSVData[i].phone;
                let website = this.state.lastCSVData[i].website;
                let key = "result" + i;
                dataElements.push( <Paper key={ key } className={ classes.paper }><b>{ name }</b> - <em>{ address }</em> - <em>{ phone }</em> - <em>{ website }</em></Paper> )
            }
        } else {
            dataElements = [<div key={ 'no-results' }></div>]
        }
        return (
                <div className={classes.root}>
                    <Navigation />
                    <Grid container spacing={24} className={classes.contentGrid}>
                        <Grid item xs={12} sm={8} md={6}>
                            <div>{ this.state.error }</div>
                            <LinearProgress className={classes.progress} hidden={loading } />
                            <form ref="ypform" onSubmit={this.handleSubmit}>
                                <FormControl className={classes.formControl} margin='normal' fullWidth={true}>
                                    <TextField
                                        id="terms"
                                        label="Search Terms"
                                        className={classes.textField}
                                        value={this.state.terms}
                                        onChange={this.handleTermsChange}
                                        margin="normal"
                                        disabled={ buttonsLoading }
                                    />
                                </FormControl>
                                <Grid container spacing={24}>
                                    <Grid item xs={12} sm={6} >
                                        <FormControl className={classes.formControl} margin='normal' >
                                            <InputLabel htmlFor="state">State</InputLabel>
                                            <Select
                                                className={classes.select}
                                                fullWidth={true}
                                                value={this.state.state}
                                                onChange={this.handleStateChange}
                                                disabled={ buttonsLoading }
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
                                                    disabled={ buttonsLoading }
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
                                        <Button disabled={ buttonsLoading } onClick={ this.submitForm } size="small" variant="raised" color="primary" className={classes.button}>
                                            Search
                                        </Button>
                                        { downloadLastCSVButton  }
                                        
                                        <div style={{display:'none'}}>
                                            { dataElements }
                                        </div>
                                    </form>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    { allCSVFiles }
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
