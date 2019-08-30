import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class NavBar extends Component {
    state = {  }
    render() { 
        return ( 
            <div>
                <Link to="/">Logo</Link>
            </div>
         );
    }
}
 
export default NavBar;