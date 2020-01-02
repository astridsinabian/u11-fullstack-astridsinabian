import React, { Component } from "react";
import axios from "axios";
import AuthService from "./AuthService";
import { Modal, ModalBody, Form, Input, Button } from "reactstrap";
import { Link } from "react-router-dom";

class OpenProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: "",
      username: "",
      firstname: "",
      lastname: "",
      description: "",
      data: [],
      followers: [],
      following: [],
      mergedTweets: [],
      retweetTweet: "",
      retweetUser: "",
      retweetText: "",
      loggedInUserFollowers: [],
      loggedInUserFollowing: [],
      loading: true
    };

    this._isMounted = false;
    this.follow = this.follow.bind(this);
    this.unfollow = this.unfollow.bind(this);
    this.toggle = this.toggle.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.retweetSubmit = this.retweetSubmit.bind(this);
    this.Auth = new AuthService();
  }

  toggle(e) {
    e.preventDefault(e);
    this.setState(prevState => ({
      modal: !prevState.modal
    }));

    const retweetToString = e.target.value;
    const split = retweetToString.split("/", 2);
    let retweetTweet = split[0];
    let retweetUser = split[1];

    this.setState({
      retweetTweet: retweetTweet,
      retweetUser: retweetUser
    });
  }

  retweetSubmit(e) {
    e.preventDefault(e);
    this.addRetweet(
      this.state.retweetText,
      this.state.retweetTweet,
      this.state.retweetUser
    );
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  async addRetweet() {
    let token = this.Auth.getToken();
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: token
      },
      data: {
        retweetUser: this.state.retweetUser,
        retweetTweet: this.state.retweetTweet,
        retweetText: this.state.retweetText
      }
    };
    const res = await axios.post(
      "http://localhost:5000/api/tweets/retweet",
      config
    );
    this.setState({
      retweetTweet: res.data.retweetTweet,
      retweetUser: res.data.retweetUser,
      retweetText: res.data.retweetText
    });

    this.setState({ modal: false });
  }

  async follow(e) {
    e.preventDefault();

    let token = this.Auth.getToken();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: token
      },
      data: {
        username: this.state.username
      }
    };
    await axios.post("http://localhost:5000/api/user/follow", config);

    this.getUserProfile();
  }

  async unfollow(e) {
    e.preventDefault();

    let token = this.Auth.getToken();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: token
      },
      data: {
        username: this.state.username
      }
    };

    await axios.post("http://localhost:5000/api/user/unfollow", config);

    this.getUserProfile();
  }

  async getUserProfile() {
    const { username } = this.props.match.params;
    const res = await axios.get(`http://localhost:5000/api/user/${username}`);

    try {
      this._isMounted &&
        this.setState({
          username: res.data.user.username,
          firstname: res.data.user.firstname,
          lastname: res.data.user.lastname,
          description: res.data.user.description,
          followers: res.data.user.followers,
          following: res.data.user.following
        });
    } catch (error) {
      if (this.username === undefined) {
        return undefined;
      }
    }
    this.userLoggedIn(username);
  }

  async getUserTweets() {
    const { username } = this.props.match.params;
    const res = await axios.get(`http://localhost:5000/api/tweets/${username}`);
    this._isMounted &&
      this.setState({
        data: res.data
      });

    const resRetweets = await axios.get(
      `http://localhost:5000/api/tweets/retweets/${username}`
    );
    this.setState({
      retweetsData: resRetweets.data
    });

    this.setState({
      mergedTweets: [...this.state.data, ...this.state.retweetsData],
      loading: false
    });
  }

  async userLoggedIn() {
    let token = this.Auth.getToken();

    if (token !== null) {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: token
        }
      };

      const res = await axios.get(
        "http://localhost:5000/api/user/profile",
        config
      );
      this.setState({
        loggedInUserFollowers: res.data.user.followers,
        loggedInUserFollowing: res.data.user.following,
        user: res.data.user.username
      });
    } else {
      return false;
    }
  }

  componentDidMount() {
    this._isMounted = true;
    this._isMounted && this.getUserProfile();
    this._isMounted && this.getUserTweets();
  }

  render() {
    const {
      username,
      firstname,
      lastname,
      description,
      followers,
      following,
      user,
      loggedInUserFollowing,
      loading
    } = this.state;

    let retweetButton;
    let followButtons;
    let userInfo;

    const mergedTweets = this.state.mergedTweets
      .sort((a, b) => {
        if (a.createdAt > b.createdAt) return -1;
        else if (a.createdAt < b.createdAt) return 1;
        else return 0;
      })
      .map((tweet, key) => {
        if (this.Auth.getToken() !== null) {
          retweetButton = (
            <button
              onClick={this.toggle}
              value={`${tweet.text} / ${tweet.username}`}
              name="retweet"
            >
              retweet
            </button>
          );
        }
        if (
          tweet.username === this.state.username &&
          tweet.text !== undefined
        ) {
          return (
            <li key={tweet._id}>
              {tweet.text} - av:{" "}
              <Link to={`/user/${tweet.username}`}>{tweet.username}</Link>{" "}
              {retweetButton} skapad: {tweet.createdAt}
            </li>
          );
        }
        if (
          tweet.username === this.state.username &&
          tweet.text === undefined
        ) {
          return (
            <li key={tweet._id}>
              {tweet.retweetTweet} - av:{" "}
              <Link to={`/user/${tweet.retweetUser}`}>{tweet.retweetUser}</Link>{" "}
              / {tweet.retweetText} - av:{" "}
              <Link to={`/user/${tweet.username}`}>{tweet.username}</Link>{" "}
              skapad: {tweet.createdAt}
            </li>
          );
        }
      });

    if (this.Auth.getToken() !== null) {
      this.userLoggedIn();
      if (user !== username) {
        if (!loggedInUserFollowing.includes(username)) {
          followButtons = <Button onClick={this.follow}>Följ</Button>;
        } else {
          followButtons = <Button onClick={this.unfollow}>Avfölj</Button>;
        }
      }
    }

    if (username !== "") {
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
          <ul>{mergedTweets}</ul>
        </div>
      );
    }
    if (username === "") {
      userInfo = <div>Kunde inte hitta användaren...</div>;
    }

    if (loading) {
      return <div>laddar...</div>;
    } else {
      return (
        <div>
          <Modal
            isOpen={this.state.modal}
            toggle={this.toggle}
            className={this.props.className}
          >
            <ModalBody>
              <Form onSubmit={this.retweetSubmit}>
                <Input
                  onChange={this.handleChange}
                  type="textarea"
                  value={this.state.retweetText}
                  name="retweetText"
                />
                <div>
                  {this.state.retweetTweet} - av: {this.state.retweetUser}
                </div>
                <Button color="primary">Retweet</Button>
              </Form>
              <Button color="secondary" onClick={this.toggle}>
                Cancel
              </Button>
            </ModalBody>
          </Modal>
          {userInfo}
        </div>
      );
    }
  }
}

export default OpenProfile;
