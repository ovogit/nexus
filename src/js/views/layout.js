import React from 'react'
import Dashboard from './dashboard.js'
import Navigation from './navigation.js'

class Layout extends React.Component {

    constructor(){
        super();
        let props = this.props;
        this.render();
        
    }
    render (){
       return(
           <div className="">
               <Navigation />
               <Dashboard />
           </div>
       );
    };

}

export default Layout; 
