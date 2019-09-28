import React, { Component } from 'react';
import { Form, Button } from 'reactstrap';
import axios from 'axios';
import AuthService from './AuthService';

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

        this.follow = this.follow.bind(this);
        this.unfollow = this.unfollow.bind(this);
        this.Auth = new AuthService();
    }

    async follow(e) {
        e.preventDefault();

        let token = this.Auth.getToken();

        const config = { 
            headers: {
                'Content-Type': "application/json",
                'Authorization': token
            },
            data: {
                username: this.state.username
            }
        }

        const res = await axios.post('http://localhost:5000/api/user/follow', config);
        
    }

    async unfollow(e) {
        e.preventDefault();

        let token = this.Auth.getToken();

        const config = { 
            headers: {
                'Content-Type': "application/json",
                'Authorization': token
            },
            data: {
                username: this.state.username
            }
        }

        const res = await axios.post('http://localhost:5000/api/user/unfollow', config);
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

            this.userLoggedIn(username);
    }

    async getUserTweets() {
        const { username } = this.props.match.params;
        const res = await axios.get(`http://localhost:5000/api/tweets/${username}`)
        this.setState({ data: res.data })
    }

    async userLoggedIn() {
        let token = this.Auth.getToken();

        if(token !== null) {
        const config = { 
            headers: {
                'Content-Type': "application/json",
                'Authorization': token
            }
        }

        const res = await axios.get('http://localhost:5000/api/user/profile', config)
        this.setState({
            followers: res.data.user.followers,
            following: res.data.user.following
        })
        } else {
            return false;
        }
    }

    componentDidMount() {
        this.getUserProfile();
        this.getUserTweets();
    }


    render() { 
        const { username, firstname, lastname, description, followers, following } = this.state;

        const tweets = this.state.data.map((tweet, key) =>
        <li key={tweet._id}>{tweet.text} {tweet.createdAt}</li> );

        let followButtons;

        if(this.Auth.getToken() !== null){
            this.userLoggedIn();
            if(!following.includes(username)) {
                followButtons = (<Button onClick={this.follow}>Följ</Button>)
                } else {
                    followButtons = (<Button onClick={this.unfollow}>Avfölj</Button>)
            }
        }

        let userInfo;

        if(this.getUserProfile && this.getUserTweets) {
            userInfo = (
            <div>
                <h2>{username}'s profil</h2>
                <div>{followButtons}</div>
                <div>
                    Följare: {followers.length} Följer: {following.length}
                </div>

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
        
        return ( 
            <div>
                { userInfo }
            </div>
         );
    }
}
 
export default OpenProfile;