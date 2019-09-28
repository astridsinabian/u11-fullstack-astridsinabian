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

    componentDidMount() {

    }

    render() { 
        let links;

        if(this.Auth.getToken() !== null) {
            links = ( 
                <button onClick={this.handleLogout}>Logga ut</button>
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
                { links }
            </div>
        );
    }
}
 
export default withRouter(NavBar);