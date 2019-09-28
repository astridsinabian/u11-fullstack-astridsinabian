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
            data: [],
            followers: [],
            following: []
        }
    }
    
    async getUserProfile() {
        const { username } = this.props.match.params;
        const res = await axios.get(`http://localhost:5000/api/user/${username}`);
        this.setState({
                username: res.data.user.username,
                firstname: res.data.user.firstname,
                lastname: res.data.user.lastname,
                description: res.data.user.description,
                followers: res.data.user.followers,
                following: res.data.user.following
            })
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
        const { username, firstname, lastname, description, followers, following } = this.state;

        const tweets = this.state.data.map((tweet, key) =>
        <li key={tweet._id}>{tweet.text} {tweet.createdAt}</li> );
        return ( 
            <div>
                <h2>{username}'s profil </h2>
                <div>Följare: {followers.length} Följer: {following.length}</div>

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