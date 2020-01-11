import React, { Component } from "react";
import axios from "axios";
import AuthService from "./AuthService";
import { Modal, ModalBody, Form, Input, Spinner } from "reactstrap";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Moment from "react-moment";

const OpenProfilePage = styled.div`
  @import url("https://fonts.googleapis.com/css?family=Montserrat&display=swap");
  font-family: "Montserrat", sans-serif;
  display: flex;
  flex-direction: column;

  margin-top: 4em;
  padding: 30px;
`;

const SpinnerWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 6em;
`;

const Top = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px dotted lightgray;
  padding: 15px;
`;

const FirstRow = styled.div`
  display: flex;
  align-items: center;
  padding: 0;
`;

const SecondRow = styled.div`
  padding: 8px 0 3px 0;
`;

const Title = styled.h4`
  line-height: 1.3;
  padding-right: 8px;
  margin: 0;
`;

const StyledButton = styled.button`
  border: 1px solid lightgray;
  background-color: lightgray;
  border-radius: 12px;
  color: gray;
  font-weight: bold;
  padding: 3px 7px;
  font-size: 12px;

  &:hover {
    background-color: #e0e0e0;
    border: 1px solid #e0e0e0;
  }
`;

const FollowersFollowing = styled.span`
  display: flex;
  align-items: center;
  padding-left: 15px;
  line-height: 1.5;
`;

const Followers = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 10px;
`;

const Following = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Number = styled.span`
  font-weight: bold;
`;

const FollowText = styled.div`
  font-size: 10px;
`;

const Name = styled.div`
  text-transform: capitalize;
  font-size: 14px;
  font-weight: bold;
`;

const Description = styled.div`
  font-size: 14px;
`;

const MergedTweets = styled.ul`
  list-style: none;
  margin: 0;
  padding: 20px 15px 0 15px;
`;

const TweetsList = styled.li`
  display: flex;
  flex-direction: column;
  margin: 10px 10px 30px 0;
`;

const RegularTweetPart = styled.span`
  padding: 10px;
  color: lightgray;
`;

const TweetPart = styled.span`
  padding: 10px;
  border: 1px dotted lightgray;
  border-radius: 12px;
  margin-left: 25px;
`;

const RetweetPart = styled.span`
  padding: 10px;
  color: lightgray;
`;

const StyledLink = styled(Link)`
  padding-right: 5px;
  color: black;
  font-weight: bold;

  &:hover {
    color: #232323;
    text-decoration: none;
  }
`;

const Text = styled.span`
  margin: 0 5px 0 0;
  color: black;
  font-size: 14px;
`;

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

    if (retweetToString === undefined) {
      return;
    }

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
      .map(tweet => {
        if (this.Auth.getToken() !== null) {
          retweetButton = (
            <StyledButton
              onClick={this.toggle}
              value={`${tweet.text} / ${tweet.username}`}
              name="retweet"
            >
              Retweet
            </StyledButton>
          );
        }
        if (
          tweet.username === this.state.username &&
          tweet.text !== undefined
        ) {
          return (
            <TweetsList key={tweet._id}>
              <RegularTweetPart>
                <div>
                  <StyledLink to={`/user/${tweet.username}`}>
                    {tweet.username}
                  </StyledLink>
                  <Moment format="D MMM YYYY">{tweet.createdAt}</Moment>
                </div>
                <Text>{tweet.text}</Text>
                {retweetButton}
              </RegularTweetPart>
            </TweetsList>
          );
        }
        if (
          tweet.username === this.state.username &&
          tweet.text === undefined
        ) {
          return (
            <TweetsList key={tweet._id}>
              <RetweetPart>
                <div>
                <StyledLink to={`/user/${tweet.username}`}>
                  @{tweet.username}
                </StyledLink>
                <Moment format="D MMM YYYY">{tweet.createdAt}</Moment>
                </div>
                <Text>{tweet.retweetText}</Text>
              </RetweetPart>
              <TweetPart>
                <div>
                  <StyledLink to={`/user/${tweet.retweetUser}`}>
                    @{tweet.retweetUser}
                  </StyledLink>
                </div>
                <Text>{tweet.retweetTweet}</Text>
              </TweetPart>
            </TweetsList>
          );
        }
      });

    if (this.Auth.getToken() !== null) {
      this.userLoggedIn();
      if (user !== username) {
        if (!loggedInUserFollowing.includes(username)) {
          followButtons = (
            <StyledButton onClick={this.follow}>Följ</StyledButton>
          );
        } else {
          followButtons = (
            <StyledButton onClick={this.unfollow}>Avfölj</StyledButton>
          );
        }
      }
    }

    if (username !== "") {
      userInfo = (
        <div>
          <Top>
            <FirstRow>
              <Title>{username}</Title> <span>{followButtons}</span>
              <FollowersFollowing>
                <Followers>
                  <Number>{followers.length}</Number>
                  <FollowText>Följer</FollowText>
                </Followers>
                <Following>
                  <Number>{following.length}</Number>
                  <FollowText>Följare</FollowText>
                </Following>
              </FollowersFollowing>
            </FirstRow>
            <SecondRow>
              <Name>
                {firstname} {lastname}
              </Name>
              <Description>{description}</Description>
            </SecondRow>
          </Top>

          <MergedTweets>{mergedTweets}</MergedTweets>
        </div>
      );
    }
    if (username === "") {
      userInfo = <div>Kunde inte hitta användaren...</div>;
    }

    if (loading) {
      return (
        <SpinnerWrapper>
          <Spinner type="grow" color="secondary" />
        </SpinnerWrapper>
      );
    } else {
      return (
        <OpenProfilePage>
          <Modal
            isOpen={this.state.modal}
            toggle={this.toggle}
            className={this.props.className}
          >
            <ModalBody>
              <Form onSubmit={this.retweetSubmit}>
                <div>
                  <span>{this.state.retweetUser}</span>
                  <span>{this.state.retweetTweet}</span>
                </div>
                <Input
                  onChange={this.handleChange}
                  type="textarea"
                  value={this.state.retweetText}
                  name="retweetText"
                  placeholder="Skriv något här..."
                />
                <StyledButton>SKICKA</StyledButton>
              </Form>
            </ModalBody>
          </Modal>
          {userInfo}
        </OpenProfilePage>
      );
    }
  }
}

export default OpenProfile;
