import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Spinner } from "reactstrap";
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import background from '../assets/2887095.jpg';

const Search = styled.div`
  @import url('https://fonts.googleapis.com/css?family=Montserrat&display=swap');
  font-family: 'Montserrat', sans-serif;

  display: flex;
  align-items: center;
  flex-direction: column;
  margin-top: 8em;
`;

const Title = styled.h2`
  font-size: 26px;
  padding: 10px;
  color: gray;

  @media (min-width: 320px) and (max-width: 480px) {
    font-size: 22px;
  }
`;

const StyledForm = styled.form`
  display: flex;
  width: 60%;

  @media (min-width: 320px) and (max-width: 480px) {
    width: 80%;
  }
`;

const StyledInput = styled.input`
  background-color: transparent;
  font-size: 12px;
  border: 1px solid lightgray;
  border-radius: 12px;
  padding: 10px;
  width: 100%;
  margin-left: 5px;
`;

const StyledButtonSearch = styled.button`
  background-color: #a69bce;
  border-radius: 12px;
  border: 1px solid #a69bce;
  color: white;
  padding: 5px 10px 4px 10px;
  text-transform: uppercase;
  font-weight: bold;

  &:hover {
    background-color: #b9aee0;
    border: 1px solid #b9aee0;
  }
`;

const SearchedUser = styled.div`
  padding: 10px;
`;

const Name = styled.span`
  font-size: 12px;
  color: lightgray;
`;

const StyledLink = styled(Link)`
  font-size: 14px;
  text-decoration: none;
  color: darkgray;
  padding: 0 7px;

  &:hover {
    text-decoration: none;
    color: gray;
  }
`;

const Message = styled.div`
  font-size: 16px;
  padding: 10px;
  color: gray;
`;

const StyledImg = styled.img`
  width: 60%;
  height: 50%;
  margin-bottom: 30px;
`;

class SearchUser extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: null,
      isSubmitted: false,
      loading: false
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  searchUser(text) {
    axios
      .post("http://localhost:5000/api/user/search", { text })
      .then(res =>
        this.setState({
          username: res.data.user.username,
          firstname: res.data.user.firstname,
          lastname: res.data.user.lastname,
          loading: false
        })
      )
      .catch(() => {
        this.setState({
          loading: false
        });
      });
  }

  onSubmit(e) {
    e.preventDefault();
    this.searchUser(this.state.text);
    this.setState({
      isSubmitted: true,
      loading: true
    });
  }

  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  render() {
    const { username, firstname, lastname, isSubmitted, loading } = this.state;

    let searchedForUser;

    if (isSubmitted === true && username !== undefined) {
      searchedForUser = (
        <SearchedUser>
          <StyledLink to={`/user/${username}`}>{username}</StyledLink>
          <Name>
            {firstname} {lastname}
          </Name>
        </SearchedUser>
      );
    }
    if (isSubmitted === true && username === undefined) {
      searchedForUser = <Message>Användaren finns inte</Message>;
    }
    if (isSubmitted === false) {
      searchedForUser = <div></div>;
    }
    if (loading) {
      searchedForUser = <Message>Söker...</Message>;
    }

    return (
      <Search>
        <Title>Sök efter användare</Title>
        <StyledImg src={background} alt="front"></StyledImg>
        <StyledForm onSubmit={this.onSubmit}>
          <StyledButtonSearch> { loading ? <Spinner size="sm" color="light" /> : <FontAwesomeIcon icon='search' /> }</StyledButtonSearch>
          <StyledInput onChange={this.onChange} type="text" name="text" />
        </StyledForm>
        {searchedForUser}
      </Search>
    );
  }
}

export default SearchUser;
