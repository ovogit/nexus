import React from 'react'
import { Link } from 'react-router-dom';

class Navigation extends React.Component {
    constructor(){
        super();
        let props = this.props;
        this.render();
    }
    render (){
       return(
           <nav>
               <div className="logo">Nexus</div>
               <ul className="nav">
                   <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
                   <li className="nav-item"><Link className="nav-link" to="/scraper">Scraper</Link></li>
               </ul>
           </nav>
       );
    };
}
export default Navigation; 
