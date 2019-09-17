import React, { Component } from 'react';
import AuthService from './AuthService';

const Auth = new AuthService();

class Profile extends Component {

    handleLogout = () => {
        Auth.logout();
        this.props.history.replace('/login');
    }

    render() { 
        
        return ( 
            <div>
                <h1>Välkommen!</h1>
                <button onClick={this.handleLogout.bind(this)}>
                    Logga ut
                </button>
            </div>
         );
    
}
}
 
export default Profile;