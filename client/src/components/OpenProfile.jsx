import React, { Component } from 'react';
import axios from 'axios';

class OpenProfile extends Component {

    constructor(props) {
        super(props);

        this.state = {
            username: '',
            firstname: '',
            lastname: '',
            description: '',
            data: []
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

    async getUserTweets() {
        const { username } = this.props.match.params;
        const res = await axios.get(`http://localhost:5000/api/tweets/${username}`)
        this.setState({ data: res.data })
    }

    componentDidMount() {
        this.getUserProfile();
        this.getUserTweets();
    }


    render() { 
        const { username, firstname, lastname, description } = this.state;

        const tweets = this.state.data.map((tweet, key) =>
        <li key={tweet._id}>{tweet.text} {tweet.createdAt}</li> );
        return ( 
            <div>
                <h2>{username}'s profil</h2>

                <h3>Användarens info:</h3>
                <div>Användarnamn: {username}</div>
                <div>Förnamn: {firstname}</div>
                <div>Efternamn: {lastname}</div>
                <div>Beskrivning: {description}</div>

                <h3>Tweets:</h3>
                <ul>{tweets}</ul>
            </div>
         );
    }
}
 
export default OpenProfile;