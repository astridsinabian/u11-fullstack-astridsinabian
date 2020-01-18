import React, { Component } from "react";
import { Form, FormGroup, Input, Button, Spinner } from "reactstrap";
import axios from "axios";
import AuthService from "./AuthService";
import { Modal, ModalBody } from "reactstrap";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Moment from "react-moment";

const TweetsContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const SpinnerWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 6em;
`;

const TweetPart = styled.span`
  padding: 10px;
  border: 1px dotted lightgray;
  border-radius: 12px;
  margin-left: 25px;
`;

const RegularTweetPart = styled.span`
  padding: 10px;
  color: lightgray;
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

  @media (min-width: 320px) and (max-width: 480px) {
    font-size: 18px;
  }
`;

const StyledMoment = styled(Moment)`
  color: #D3D3D3;
  @media (min-width: 320px) and (max-width: 480px) {
    font-size: 14px;
  }
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

const Text = styled.span`
  margin: 0 5px 0 0;
  color: black;
  font-size: 14px;

  @media (min-width: 320px) and (max-width: 480px) {
    font-size: 12px;
  }
`;

class Tweets extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: "",
      tweets: [],
      following: [],
      username: "",
      modal: false,
      retweetUser: "",
      retweetTweet: "",
      retweetText: "",
      retweetsData: [],
      mergedTweets: [],
      loading: true,
      publishButton: false
    };

    this._isMounted = false;
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

    if (
      e.target.value === "" ||
      e.target.value === undefined ||
      e.target.value === null
    ) {
      this.setState({ publishButton: false });
    } else {
      this.setState({ publishButton: true });
    }
  }

  toggle(e) {
    e.preventDefault(e);
    this.setState(prevState => ({
      modal: !prevState.modal
    }));

    const retweetToString = e.target.value;

    if(retweetToString === undefined) {
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

  async addTweet() {
    let token = this.Auth.getToken();
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: token
      },
      data: {
        text: this.state.text
      }
    };
    const res = await axios.post(
      "http://localhost:5000/api/tweets/add",
      config
    );
    this.setState({ text: res.data.text });

    this.getTweets();

    this.setState({ text: "" });
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

    this.getTweets();
  }

  async getTweets() {
    let token = this.Auth.getToken();
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: token
      }
    };

    const resFollowing = await axios.get(
      "http://localhost:5000/api/user/profile",
      config
    );
    const resTweets = await axios.get("http://localhost:5000/api/tweets");
    const resRetweets = await axios.get(
      "http://localhost:5000/api/tweets/retweets/retweets"
    );

    try {
      this._isMounted &&
        this.setState({
          username: resFollowing.data.user.username,
          following: resFollowing.data.user.following,
          tweets: resTweets.data,
          retweetsData: resRetweets.data
        });
    } catch (error) {
      return error;
    }

    this.setState({
      mergedTweets: [...this.state.tweets, ...this.state.retweetsData],
      loading: false
    });
  }

  componentDidMount() {
    this._isMounted = true;
    this._isMounted && this.getTweets();
  }

  render() {
    const { loading, publishButton } = this.state;

    const mergedTweets = this.state.mergedTweets
      .sort((a, b) => {
        if (a.createdAt > b.createdAt) return -1;
        else if (a.createdAt < b.createdAt) return 1;
        else return 0;
      })
      .map(tweet => {
        if (
          (this.state.following.includes(tweet.username) ||
            tweet.username === this.state.username) &&
          tweet.text !== undefined
        ) {
          return (
            <li key={tweet._id}>
              <RegularTweetPart>
                <div>
                  <StyledLink to={`/user/${tweet.username}`}>
                    {tweet.username}
                  </StyledLink>
                  <StyledMoment format="D MMM YYYY">{tweet.createdAt}</StyledMoment>
                </div>
                <Text>{tweet.text}</Text>
                <StyledButton
                  onClick={this.toggle}
                  value={`${tweet.text} / ${tweet.username}`}
                  name="retweet"
                >
                Retweet
                </StyledButton>
              </RegularTweetPart>
            </li>
          );
        }
        if (
          (this.state.following.includes(tweet.username) ||
            tweet.username === this.state.username) &&
          tweet.text === undefined
        ) {
          return (
            <li key={tweet._id}>
              <RetweetPart>
                <div>
                  <StyledLink to={`/user/${tweet.username}`}>
                    {tweet.username}
                  </StyledLink>
                </div>
                <Text>{tweet.retweetText}</Text>
              </RetweetPart>
              <TweetPart>
                <div>
                  <StyledLink to={`/user/${tweet.retweetUser}`}>
                    {tweet.retweetUser}
                  </StyledLink>
                  <StyledMoment format="D MMM YYYY">{tweet.createdAt}</StyledMoment>
                </div>
                <Text>{tweet.retweetTweet}</Text>
              </TweetPart>
            </li>
          );
        }
      });

    if (loading) {
      return (
        <SpinnerWrapper>
          <Spinner type="grow" color="secondary" />
        </SpinnerWrapper>
      );
    } else {
      return (
        <TweetsContent>
          <div className="tweets">
            <Form onSubmit={this.onSubmit}>
              <FormGroup>
                <Input
                  onChange={this.handleChange}
                  value={this.state.text}
                  type="textarea"
                  name="text"
                  placeholder="Vad har du för tankar just nu?"
                  maxLength="400"
                />

                {publishButton === true ? (
                  <Button>Publicera</Button>
                ) : (
                  <Button disabled>Publicera</Button>
                )}
              </FormGroup>
            </Form>
          </div>

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
                  maxLength="400"
                />
                <StyledButton color="primary">Retweet</StyledButton>
              </Form>
            </ModalBody>
          </Modal>

          <div className="tweets">
            <ul>{mergedTweets}</ul>
          </div>
        </TweetsContent>
      );
    }
  }
}

export default Tweets;
