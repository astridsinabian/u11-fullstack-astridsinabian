import React, { Component } from "react";
import AuthService from "./AuthService";
import axios from "axios";
import { Form, FormGroup, Label, Input, Button, Spinner } from "reactstrap";
import Tweets from "./Tweets";
import styled from "styled-components";

const Auth = new AuthService();

const Container = styled.div`
  @import url("https://fonts.googleapis.com/css?family=Montserrat&display=swap");
  font-family: "Montserrat", sans-serif;
  display: flex;
  align-items: center;
  flex-direction: column;
  margin: 6em 0;

  @media (min-width: 320px) and (max-width: 480px) {
    font-size: 20px;
    white-space: nowrap;
    margin: 5em 1em;
  }
`;

const Title = styled.h3`
  color: #9c8ed4;

  @media (min-width: 320px) and (max-width: 480px) {
    font-size: 20px;
    white-space: nowrap;
  }
`;

const FormStyled = styled(Form)`
  width: 500px;
  margin: 2em 0 8em 0;

  @media (min-width: 320px) and (max-width: 480px) {
    width: 100%;
    margin-bottom: 5em;
  }
`;

const StyledButton = styled(Button)`
  float: right;
`;

const TextWhenUpdated = styled.div`
  font-size: 12px;
  font-weght: bold;
  color: gray;
`;

const SpinnerWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 6em;
`;

class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      firstname: "",
      lastname: "",
      email: "",
      description: "",
      admin: false,
      loading: true,
      updatedUserText: false,
      updateButton: false
    };

    this._isMounted = false;
    this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.Auth = new AuthService();
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });

    if (e.target.name !== "description") {
      if (
        e.target.value === "" ||
        e.target.value === undefined ||
        e.target.value === null
      ) {
        this.setState({ updateButton: false });
      } else {
        this.setState({ updateButton: true });
      }
    } else {
      this.setState({ updateButton: true });
    }
  }

  onSubmit(e) {
    e.preventDefault();
    this.editUser();
    this.setState({ updatedUserText: true });
  }

  async getUser() {
    let token = Auth.getToken();
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

    try {
      this._isMounted &&
        this.setState({
          username: res.data.user.username,
          firstname: res.data.user.firstname,
          lastname: res.data.user.lastname,
          email: res.data.user.email,
          description: res.data.user.description,
          loading: false
        });
    } catch (error) {
      if (error.response.data.message === "jwt expired") {
        this.Auth.logout();
        this.props.history.replace("/login");
      }
    }
  }

  editUser = () => {
    let token = Auth.getToken();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: token
      },
      data: {
        username: this.state.username,
        firstname: this.state.firstname,
        lastname: this.state.lastname,
        description: this.state.description
      }
    };
    axios.patch("http://localhost:5000/api/user/profile", config);
  };

  componentDidMount() {
    this._isMounted = true;
    this._isMounted && this.getUser();
  }

  render() {
    const {
      username,
      firstname,
      lastname,
      email,
      description,
      loading,
      updatedUserText,
      updateButton
    } = this.state;

    if (loading) {
      return (
        <SpinnerWrapper>
          <Spinner type="grow" color="secondary" />
        </SpinnerWrapper>
      );
    } else {
      return (
        <Container>
          <Title>
            Hejsan, {firstname} {lastname}!
          </Title>

          <FormStyled onSubmit={this.onSubmit}>
            <FormGroup>
              <Label>Användarnamn: *</Label>
              <Input value={username} readOnly type="text" name="username" />
            </FormGroup>

            <FormGroup>
              <Label>Förnamn: *</Label>
              <Input
                onChange={this.handleChange}
                value={firstname}
                type="text"
                name="firstname"
              />
            </FormGroup>

            <FormGroup>
              <Label>Efternamn: *</Label>
              <Input
                onChange={this.handleChange}
                value={lastname}
                type="text"
                name="lastname"
              />
            </FormGroup>

            <FormGroup>
              <Label>Email: *</Label>
              <Input value={email} readOnly type="text" />
            </FormGroup>

            <FormGroup>
              <Label>Beskriv dig själv</Label>
              <Input
                onChange={this.handleChange}
                value={description}
                type="textarea"
                name="description"
              />
            </FormGroup>

            {updateButton === true ? (
              <StyledButton>ÄNDRA UPPGIFTER</StyledButton>
            ) : (
              <StyledButton disabled>ÄNDRA UPPGIFTER</StyledButton>
            )}
            <TextWhenUpdated>
              {updatedUserText === true ? "Ändringar uppdaterade" : ""}
            </TextWhenUpdated>
          </FormStyled>

          <Tweets />

        </Container>
      );
    }
  }
}

export default Profile;
