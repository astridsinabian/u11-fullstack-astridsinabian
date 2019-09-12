import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import AuthService from './AuthService';

class NavBar extends Component {
    
    constructor(props) {
        super(props);
        this.Auth = new AuthService();
    }

    render() { 

        return ( 
            <div>
                <Link to="/">Logo</Link>
                <Link to="/register">Register</Link>
                <Link to="/login">Login</Link>
            </div>
        );
    }
}
 
export default NavBar;