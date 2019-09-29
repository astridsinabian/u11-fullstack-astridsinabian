import React, { Component } from 'react';
import { Form, FormGroup, Input, Button } from 'reactstrap';
import axios from 'axios';
import AuthService from './AuthService';

class Tweets extends Component {

    constructor(props) {
        super(props);

        this.state = {
            text: '',
            data: [],
            following: [],
            username: ''
        }

        this.handleChange = this.handleChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.Auth = new AuthService();
    }

    onSubmit(e) {
        e.preventDefault();
        this.addTweet(this.state.text);
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    async addTweet() {
        let token = this.Auth.getToken();
        const config = { 
            headers: {
                'Content-Type': "application/json",
                'Authorization': token
            },
            data: {
                text: this.state.text,
            }
        }
        const res = await axios.post('http://localhost:5000/api/tweets/add', config);
        this.setState({ text: res.data.text });

        this.getTweets();

        this.setState({ text: '' });
    }

    async getTweets() {

        let token = this.Auth.getToken();
        const config = { 
            headers: {
                'Content-Type': "application/json",
                'Authorization': token
            }
        }

        const resFollowing = await axios.get('http://localhost:5000/api/user/profile', config)
            this.setState({
                username: resFollowing.data.user.username,
                following: resFollowing.data.user.following
            });

        const res = await axios.get('http://localhost:5000/api/tweets');
        this.setState({ data: res.data })
    }

    componentDidMount() {
        this.getTweets();
    }

    render() { 
        const tweets = this.state.data.map((tweet, key) => {
            if(this.state.following.includes(tweet.username) || tweet.username === this.state.username) {
                return <li key={tweet._id}>{tweet.text} - av: {tweet.username}</li>
            } 
        })

        return ( 
            <div>
                <h1>Twittra här</h1>

                <Form onSubmit={this.onSubmit}>
                    <FormGroup>
                            <Input 
                            onChange={this.handleChange}
                            value={this.state.text}
                            type="textarea"
                            name="text"
                            placeholder="Vad har du för tankar just nu?"
                            />
                        <Button>Publicera</Button>
                    </FormGroup>
                </Form>

                <div>
                    <h2>Flöde</h2>
                    <ul>
                        {tweets}
                    </ul>
                </div>
            </div>
         );
    }
}
 
export default Tweets;