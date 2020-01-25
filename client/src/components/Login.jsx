import React, { Component } from "react";
import axios from "axios";
import { 
  Form, 
  FormGroup, 
  Input, 
  InputGroup, 
  InputGroupAddon, 
  InputGroupText,
  Spinner
} from "reactstrap";
import AuthService from "./AuthService";
import { Redirect } from "react-router-dom";
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from "../assets/62348.jpg";

const LoginContentWrapper = styled.div`
  @import url('https://fonts.googleapis.com/css?family=Montserrat&display=swap');
  display: flex;
  font-family: 'Montserrat', sans-serif;
  height: 60vw;
  margin: 5em 3em;

  @media (min-width: 320px) and (max-width: 480px) {
    flex-direction: column;
    margin: 5em 2rem;
  }
`;

const LoginSideDesign = styled.div`
  width: 110vw;

  @media (min-width: 320px) and (max-width: 480px) {
    width: 100%;
  }
`;

const LoginFormWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
`;

const StyledForm = styled(Form)`
  margin-top: 20px;
  width: 25vw;

  @media (min-width: 320px) and (max-width: 480px) {
    width: 100%;
  }
`;

const StyledTitle = styled.h3`
  display: flex;
  justify-content: center;
  margin: 0;
  color: #9c8ed4;
  font-weight: bold;
  letter-spacing: 0.5px;
`;

const StyledErrorMessage = styled.div`
  font-size: 10px;
  color: red;
  font-weight: bold;
  padding-left: 5px;
`;

const StyledButton = styled.button`
  display: flex;
  justify-content: center;
  margin: 1.5em 0 0 0;
  background-color: #9c8ed4;
  color: white;
  font-weight: 500;
  border: 3px solid #9c8ed4;
  border-radius: 12px;
  padding: 5px;
  box-shadow: 2px 8px 15px -6px rgba(204,204,204,1);
  width: 100%;
  font-size: 14px;

  &:hover {
    background-color: #a69bce;
    border: 3px solid #a69bce;
  }
`;

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      errorMessage: null
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.login = this.login.bind(this);
    this.Auth = new AuthService();
  }

  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  onSubmit(e) {
    e.preventDefault();
    this.login(this.state.username, this.state.password);
    this.setState({ loading: true });
  }

  login = (username, password) => {
    const user = {
      username: username,
      password: password
    };
    axios
      .post("http://localhost:5000/api/user/login", { user })
      .then(res => {
        this.Auth.setToken(res.data.token);
        this.Auth.setRole(res.data.admin);

        if (this.Auth.isAdmin() === "true") {
          this.props.history.push("/admin");
        } else {
          this.props.history.push("/profile");
        }
        this.setState({ loading: false });
      })
      .catch(error => {
        let errorMessage = error.response.data;

        switch(error.response.data) {
          case '"username" is required':
            errorMessage = "Användarnamn krävs";
            this.setState({
              loading: false,
              errorMessage: errorMessage
            });
            break;
          case '"username" is not allowed to be empty':
            errorMessage = "Användarnamnet får inte vara tomt";
            this.setState({
              loading: false,
              errorMessage: errorMessage
            });
            break;
          case '"password" is required':
            errorMessage = "Lösenord krävs";
            this.setState({
              loading: false,
              errorMessage: errorMessage
            });
            break;
          case 'Username does not exists':
            errorMessage = "Användaren finns inte";
            this.setState({
              loading: false,
              errorMessage: errorMessage
            });
            break;
          case 'Invalid password':
            errorMessage = "Ogiltigt lösenord";
            this.setState({
              loading: false,
              errorMessage: errorMessage
            });
            break;
          case '"password" is not allowed to be empty':
            errorMessage = "Lösenord får inte vara tomt";
            this.setState({
              loading: false,
              errorMessage: errorMessage
            });
            break;
          default: 
            this.setState({
              errorMessage: error.response.data,
              loading: false
            });
        }
      });
  };

  render() {
    const { loading, errorMessage } = this.state;

    if (localStorage.getItem("auth-token") !== null) {
      return <Redirect to="/profile" />;
    } else {
      return (
        <div>
          <LoginContentWrapper>
            <LoginSideDesign>
              <img src={Image} alt="" width="100%" height="100%"/>
            </LoginSideDesign>
            <LoginFormWrapper>
            <StyledTitle>Logga in</StyledTitle>
              <StyledForm onSubmit={this.onSubmit}>
                <FormGroup>
                  <InputGroup>
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText><FontAwesomeIcon icon='user' /></InputGroupText>
                    </InputGroupAddon>
                    <Input 
                      onChange={this.onChange} 
                      type="text" 
                      name="username" 
                      placeholder="Användarnamn"
                    />
                  </InputGroup>
                </FormGroup>

                <FormGroup>
                  <InputGroup>
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText><FontAwesomeIcon icon='lock' /></InputGroupText>
                    </InputGroupAddon>
                    <Input
                      onChange={this.onChange}
                      type="password"
                      name="password"
                      placeholder="Lösenord"
                    />
                  </InputGroup>
                </FormGroup>

                <StyledErrorMessage>{errorMessage ? `${errorMessage}` : null}</StyledErrorMessage>

                <StyledButton>
                  {loading === true ? <Spinner size="sm" color="light" /> : 'Logga in'}
                </StyledButton>
              </StyledForm>
            </LoginFormWrapper>
          </LoginContentWrapper>
        </div>
      );
    }
  }
}

export default Login;
