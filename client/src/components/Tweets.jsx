import React, { Component } from 'react';
import { Form, FormGroup, Input, Button } from 'reactstrap';
import axios from 'axios';
import AuthService from './AuthService';
import { Modal, ModalBody } from 'reactstrap';
import { Link } from 'react-router-dom';

class Tweets extends Component {

    constructor(props) {
        super(props);

        this.state = {
            text: '',
            data: [],
            following: [],
            username: '',
            modal: false,
            retweetUser: '',
            retweetTweet: '',
            retweetText: '',
            retweetsData: [],
            mergedTweets: [],
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

        const retweetToString = e.target.value;
        const split = retweetToString.split('/', 2)
        let retweetTweet = split[0];
        let retweetUser = split[1];

        this.setState({
            retweetTweet: retweetTweet,
            retweetUser: retweetUser
        })

      }

    retweetSubmit(e) {
        e.preventDefault(e);
        this.addRetweet(this.state.retweetText, this.state.retweetTweet, this.state.retweetUser);
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
                retweetUser: this.state.retweetUser,
                retweetTweet: this.state.retweetTweet,
                retweetText: this.state.retweetText
            }
        }
        const res = await axios.post('http://localhost:5000/api/tweets/retweet', config);
        this.setState({ 
            retweetTweet: res.data.retweetTweet,
            retweetUser: res.data.retweetUser,
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

        const res = await axios.get('http://localhost:5000/api/tweets')
            this.setState({ data: res.data });

        const resRetweets = await axios.get('http://localhost:5000/api/tweets/retweets')
            this.setState({ retweetsData: resRetweets.data });

            this.setState({ mergedTweets: [...this.state.data, ...this.state.retweetsData] })
    }

    componentDidMount() {
        this.getTweets();
    }

    render() { 

        const mergedTweets = this.state.mergedTweets.sort((a, b) => {
            if(a.createdAt > b.createdAt) return -1;
            else if(a.createdAt < b.createdAt) return  1;
            else return 0;
        }).map((tweet, key) => {
            if(this.state.following.includes(tweet.username) || tweet.username === this.state.username && tweet.text !== undefined) {
                return <li key={tweet._id}>{tweet.text} - av: <Link to={`/user/${tweet.username}`}>{tweet.username}</Link><button onClick={this.toggle} value={`${tweet.text} / ${tweet.username}`} name="retweet">retweet</button> skapad: {tweet.createdAt}</li>
            } else if (this.state.following.includes(tweet.username) || tweet.username === this.state.username && tweet.text === undefined) {
                return <li key={tweet._id}>{tweet.retweetTweet} - av: <Link to={`/user/${tweet.retweetUser}`}>{tweet.retweetUser}</Link> / {tweet.retweetText} - av: <Link to={`/user/${tweet.username}`}>{tweet.username}</Link> skapad: {tweet.createdAt}</li>
            }
        });

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
                            <div>{this.state.retweetTweet} - av: {this.state.retweetUser}</div>
                            <Button color="primary">Retweet</Button>
                        </Form>
                            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                    </ModalBody>
                </Modal>

                <div>
                    <h2>Flöde</h2>
                    <ul>
                        {mergedTweets}
                    </ul>
                </div>
            </div>
         );
    }
}
 
export default Tweets;