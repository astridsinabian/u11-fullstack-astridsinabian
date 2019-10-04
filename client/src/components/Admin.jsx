import React, { Component } from 'react';
import AuthService from './AuthService';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

class Admin extends Component {

    constructor(props) {
        super(props);

        this.state = {
            users: []
        };

        this.Auth = new AuthService();
    }

    getUsers = () => {
        axios.get('http://localhost:5000/api/user/admin/users')
            .then(res => this.setState({
                users: res.data
            }))
            .catch(err => console.log(err));
    }

    componentDidMount() {
        this.getUsers();
    }

    render() { 

        const users = this.state.users.map((user, key) => {
            return <li key={user._id}>{user.firstname} {user.lastname}
                        <ul>
                            <li>{user.username}</li>
                            <li>{user.email}</li>
                        </ul>
                    </li>
        });

        if(this.Auth.isAdmin() === 'false') {
            return (
                <Redirect to="/profile" />
            );
        } else if (this.Auth.isAdmin() ===  'true') {
            return ( 
                <div>
                    <h2>Admin - Översikt</h2>
                    <ul>{ users }</ul>
                </div>
            );
        }
        
    }
}
 
export default Admin;