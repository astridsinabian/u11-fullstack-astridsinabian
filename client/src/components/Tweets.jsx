import React, { Component } from 'react';
import { Form, FormGroup, Input, Button } from 'reactstrap';
import axios from 'axios';
import AuthService from './AuthService';
import { Modal, ModalBody } from 'reactstrap';

class Tweets extends Component {

    constructor(props) {
        super(props);

        this.state = {
            text: '',
            data: [],
            following: [],
            username: '',
            modal: false,
            retweet: '',
            retweetText: '',
            retweetsData: []
        }

        this.handleChange = this.handleChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.retweetSubmit = this.retweetSubmit.bind(this);
        this.toggle = this.toggle.bind(this);
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

    toggle(e) {
        e.preventDefault(e);
        this.setState(prevState => ({
          modal: !prevState.modal
        }));

        this.setState({
            retweet: e.target.value
        })
      }

    retweetSubmit(e) {
        e.preventDefault(e);
        this.addRetweet(this.state.retweetText, this.state.retweet);
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

    async addRetweet() {
        let token = this.Auth.getToken();
        const config = { 
            headers: {
                'Content-Type': "application/json",
                'Authorization': token
            },
            data: {
                retweet: this.state.retweet,
                retweetText: this.state.retweetText
            }
        }
        const res = await axios.post('http://localhost:5000/api/tweets/retweet', config);
        this.setState({ 
            retweet: res.data.retweet,
            retweetText: res.data.retweetText
        });

        this.setState({ retweetText: '' });
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
        this.setState({ data: res.data });

        const resRetweets = await axios.get('http://localhost:5000/api/tweets/retweets');
        this.setState({ retweetsData: resRetweets.data });
    }

    componentDidMount() {
        this.getTweets();
    }

    render() { 

        const retweets = this.state.retweetsData.map((retweet, key) => {
            return <li key={retweet._id}>{retweet.retweet} / {retweet.retweetText} - av: {retweet.username}</li>
        })
        
        const tweets = this.state.data.map((tweet, key) => {
            if(this.state.following.includes(tweet.username) || tweet.username === this.state.username) {
                return <li key={tweet._id}>{tweet.text} - av: {tweet.username}<button onClick={this.toggle} value={`${tweet.text} - ${tweet.username}`} name="retweet">retweet</button></li>
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

                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <ModalBody>
                        <Form onSubmit={this.retweetSubmit}>
                            <Input 
                                onChange={this.handleChange}
                                type="textarea"
                                value={this.state.retweetText}
                                name="retweetText"
                            />
                            <div>{this.state.retweet}</div>
                            <Button color="primary">Retweet</Button>
                        </Form>
                            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                    </ModalBody>
                </Modal>

                <div>
                    <h2>Flöde</h2>
                    <ul>
                        
                        {retweets}
                        {tweets}
                    </ul>
                </div>
            </div>
         );
    }
}
 
export default Tweets;