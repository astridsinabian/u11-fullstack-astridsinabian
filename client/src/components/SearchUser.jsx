import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

class SearchUser extends Component {

    constructor(props) {
        super(props);

        this.state = {
            text: ''
        }

        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    searchUser() {
        const text = this.state.text;

        axios.post('http://localhost:5000/api/user/search', { text })
            .then(res => this.setState({
                username: res.data.user.username,
                firstname: res.data.user.firstname,
                lastname: res.data.user.lastname
            }));
        
    }

    onSubmit(e) {
        e.preventDefault();
        this.searchUser(this.state.text);
    }

    onChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    render() { 
        const { username, firstname, lastname } = this.state;
        return ( 
            <div style={{display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                <h3>Sök efter användare</h3>
                <form onSubmit={this.onSubmit}>
                    <input 
                        onChange={this.onChange}
                        type="text"
                        name="text"
                    />
                    <button>Sök</button>
                </form>
                <div>
                    <Link to={`/user/${username}`}>{username}</Link>
                    <div>{firstname} {lastname}</div>
                </div>
            </div>
         );
    }
}
 
export default SearchUser;