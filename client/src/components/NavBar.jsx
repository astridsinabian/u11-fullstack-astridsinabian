import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import AuthService from './AuthService';
import { withRouter } from 'react-router-dom';

class NavBar extends Component {
    
    constructor(props) {
        super(props);
        
        this.handleLogout = this.handleLogout.bind(this);
        this.Auth = new AuthService();
    }

    handleLogout(e) {
        e.preventDefault();
        this.Auth.logout();
        this.props.history.replace('/login');
    }

    render() { 
        let links;

        if(this.Auth.getToken() !== null && localStorage.getItem('admin') === 'true') {
            links = (
                <div>
                    <Link to="/profile">Min sida</Link>
                    <Link to="/admin">Dashboard</Link>
                    <button onClick={this.handleLogout}>Logga ut</button>
                </div>
            )
        } else if(this.Auth.getToken() !== null) {
            links = ( 
                <div>
                    <Link to="/profile">Min sida</Link>
                    <button onClick={this.handleLogout}>Logga ut</button>
                </div>
            )
        } else {
            links = (
                <div>
                    <Link to="/login">Logga in</Link>
                    <Link to="/register">Registrera dig</Link>
                </div>
            )
            
        }

        return ( 
            <div>
                <Link to="/">Logo</Link>
                <Link to="/user">Sök</Link>
                { links }
            </div>
        );
    }
}
 
export default withRouter(NavBar);