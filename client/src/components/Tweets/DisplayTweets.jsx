import React, { Component } from 'react';
import axios from 'axios';
import AuthService from '../AuthService';

const Auth = new AuthService();

class DisplayTweets extends Component {

    constructor(props) {
        super(props);

        this.state = {
            data: []
        }

        this.Auth = new AuthService();
    }

    async getTweets() {
        const res = await axios.get('http://localhost:5000/api/tweets');
        this.setState({ data: res.data })
    }

    componentDidMount() {
        this.getTweets();
    }

    render() { 
        const tweets = this.state.data.map((tweet, key) =>
        <li key={tweet._id}>{tweet.text} - av: {tweet.publisher}</li> );
        return ( 
            <div>
                <h2>Alla tweets:</h2>
                <ul>
                    {tweets}
                </ul>
            </div>
         );
    }
}
 
export default DisplayTweets;