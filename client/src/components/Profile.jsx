import React, { Component } from 'react';
import AuthService from './AuthService';
import axios from 'axios';

const Auth = new AuthService();

class Profile extends Component {

    constructor(props) {
        super(props);

        this.state = {
            username: null,
            firstname: null,
            lastname: null,
            email: null,
            description: null
        }
        
        this.Auth = new AuthService();
    }

    handleLogout = () => {
        Auth.logout();
        this.props.history.replace('/login');
    }

    getUser = () => {
        let token = Auth.getToken();
        const config = { 
                headers: {
                    'Content-Type': "application/json",
                    'Authorization': token
                }
            }
        axios.get('http://localhost:5000/api/user/profile', config)
        .then(res => this.setState({
            username: res.data.user.username,
            firstname: res.data.user.firstname,
            lastname: res.data.user.lastname,
            email: res.data.user.email,
            description: res.data.user.description
        }));
    }

    componentDidMount() {
        this.getUser();
    }

    render() { 
        const { username, firstname, lastname, email, description } = this.state;
        return ( 
            <div>
                <h1>Välkommen {firstname} {lastname}!</h1>
                <div>{username}</div>
                <div>{email}</div>
                <div>{description}</div>
                <button onClick={this.handleLogout.bind(this)}>
                    Logga ut
                </button>
            </div>
         );
    }
}
 
export default Profile;