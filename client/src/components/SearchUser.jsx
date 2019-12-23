import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

class SearchUser extends Component {

    constructor(props) {
        super(props);

        this.state = {
            text: '',
            isSubmitted: false
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
            }))
            .catch(error => error);
    }

    onSubmit(e) {
        e.preventDefault();
        this.searchUser(this.state.text);
        this.setState({isSubmitted: true})
    }

    onChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    render() { 
        const { username, firstname, lastname, isSubmitted } = this.state;

        let searchedForUser;

        if(isSubmitted === true && username !== undefined) {
            searchedForUser = (
                <div>
                    <Link to={`/user/${username}`}>{username}</Link>
                    <div>{firstname} {lastname}</div>
                </div>
            );
        }
        if(isSubmitted === true && username === undefined) {
            searchedForUser = (
                <div>Användaren finns inte...</div>
            );
        }
        if(isSubmitted === false) {
            searchedForUser = (
                <div></div>
            );
        }

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

                { searchedForUser }
   
            </div>
         );
    }
}
 
export default SearchUser;