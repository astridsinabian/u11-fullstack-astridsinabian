import React, { Component } from 'react';
import axios from 'axios';

class OpenProfile extends Component {

    constructor(props) {
        super(props);

        this.state = {
            username: '',
            firstname: '',
            lastname: '',
            description: ''
        }
    }
    
    
    getUserProfile = () => {
        const { username } = this.props.match.params;
        axios.get(`http://localhost:5000/api/user/${username}`)
            .then(res => this.setState({
                username: res.data.user.username,
                firstname: res.data.user.firstname,
                lastname: res.data.user.lastname,
                description: res.data.user.description
            }))
    }

    componentDidMount() {
        this.getUserProfile();
    }


    render() { 
        const { username, firstname, lastname, description } = this.state;
        return ( 
            <div>
                <h2>{username}'s profil</h2>

                <div>Användarnamn: {username}</div>
                <div>Förnamn: {firstname}</div>
                <div>Efternamn: {lastname}</div>
                <div>Beskrivning: {description}</div>
            </div>
         );
    }
}
 
export default OpenProfile;