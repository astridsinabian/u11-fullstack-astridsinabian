import React, { Component } from 'react';
import AuthService from './AuthService';
import { Redirect } from 'react-router-dom';

class Admin extends Component {

    constructor(props) {
        super(props);
        this.Auth = new AuthService();
    }

    render() { 

        if(this.Auth.isAdmin() === 'false') {
            return (
                <Redirect to="/profile" />
            );
        } else if (this.Auth.isAdmin() ===  'true') {
            return ( 
                <div>
                    <h2>Admin - Översikt</h2>
                </div>
            );
        }
        
    }
}
 
export default Admin;