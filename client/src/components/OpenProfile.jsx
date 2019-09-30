import React, { Component } from 'react';
import { Button } from 'reactstrap';
import axios from 'axios';
import AuthService from './AuthService';
import { Link } from 'react-router-dom';

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
            following: [],
            mergedTweets: []
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

        const resRetweets = await axios.get(`http://localhost:5000/api/tweets/retweets/${username}`)
        this.setState({ retweetsData: resRetweets.data })

        this.setState({ mergedTweets: [...this.state.data, ...this.state.retweetsData] });
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

        let retweetButton;

        const mergedTweets = this.state.mergedTweets.sort((a, b) => {
            if(a.createdAt > b.createdAt) return -1;
            else if(a.createdAt < b.createdAt) return  1;
            else return 0;
        }).map((tweet, key) => {
            if(this.Auth.getToken() !== null){
                retweetButton = (<button onClick={this.toggle} value={`${tweet.text} / ${tweet.username}`} name="retweet">retweet</button>);
            }
            if(tweet.username === this.state.username && tweet.text !== undefined) {
                return <li key={tweet._id}>{tweet.text} - av: <Link to={`/user/${tweet.username}`}>{tweet.username}</Link> {retweetButton} skapad: {tweet.createdAt}</li>
            } else if (tweet.username === this.state.username && tweet.text === undefined) {
                return <li key={tweet._id}>{tweet.retweetTweet} - av: <Link to={`/user/${tweet.retweetUser}`}>{tweet.retweetUser}</Link> / {tweet.retweetText} - av: <Link to={`/user/${tweet.username}`}>{tweet.username}</Link> skapad: {tweet.createdAt}</li>
            }
        });

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
                <ul>{ mergedTweets }</ul>
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