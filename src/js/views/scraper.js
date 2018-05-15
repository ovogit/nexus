import React from 'react'
import Navigation from './navigation.js'

class Scraper extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            status : '',
            terms : '',
            state : '',
            city : ''
        };
        this.handleTermsChange = this.handleTermsChange.bind(this);
        this.handleStateChange = this.handleStateChange.bind(this);
        this.handleCityChange = this.handleCityChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleTermsChange(event){
        this.setState({ terms: event.target.value });
    }
    handleStateChange(event){
        this.setState({ state: event.target.value });
    }
    handleCityChange(event){
        this.setState({ city: event.target.value });
    }
    handleSubmit(event){
        event.preventDefault();
        fetch('http://localhost:5000/test')
        .then(function( response ){
            return response.json();
        })
        .then(function ( json ){
            return console.log(json.tasks);
        });
    }
    render (){
        return(
                <div>
                <Navigation />
                <div className="container">
                <form onSubmit={ this.handleSubmit }>
                    <div className="form-group">
                        <label htmlFor="searchTerms">Search Terms</label>
                        <input type="text" className="form-control" id="searchTerms" value={ this.state.terms } onChange={ this.handleTermsChange } placeholder="YP Search Terms"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="state">State</label>
                        <select className="form-control" id="state" onChange={ this.handleStateChange }>
                        <option>CA</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="city">City</label>
                        <select className="form-control" id="city" onChange={ this.handleCityChange }>
                        <option>Oakland</option>
                        </select>
                    </div>
                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>
                </div>
                </div>
                );
    };
}
export default Scraper; 
