import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Search = styled.div`
  @import url('https://fonts.googleapis.com/css?family=Montserrat&display=swap');
  font-family: 'Montserrat', sans-serif;
`;

const Title = styled.h2``;

const StyledForm = styled.form``

const StyledInput = styled.input``;

const StyledButtonSearch = styled.button``;

class SearchUser extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: "",
      isSubmitted: false,
      loading: false
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  searchUser() {
    const text = this.state.text;

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
        <div>
          <Link to={`/user/${username}`}>{username}</Link>
          <div>
            {firstname} {lastname}
          </div>
        </div>
      );
    }
    if (isSubmitted === true && username === undefined) {
      searchedForUser = <div>Användaren finns inte...</div>;
    }
    if (isSubmitted === false) {
      searchedForUser = <div></div>;
    }
    if (loading) {
      searchedForUser = <div>Söker...</div>;
    }

    return (
      <Search>
        <Title>Sök efter användare</Title>
        <StyledForm onSubmit={this.onSubmit}>
          <StyledInput onChange={this.onChange} type="text" name="text" />
          <StyledButtonSearch>Sök</StyledButtonSearch>
        </StyledForm>

        {searchedForUser}
      </Search>
    );
  }
}

export default SearchUser;
