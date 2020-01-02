import React, { Component } from "react";
import axios from "axios";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";
import AuthService from "./AuthService";
import { Redirect } from "react-router-dom";

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
        this.setState({
          loading: false,
          errorMessage: error.response.data
        });
      });
  };

  render() {
    const { loading, errorMessage } = this.state;

    let loader;

    if (loading === true) {
      loader = <div>Loggar in...</div>;
    }

    if (localStorage.getItem("auth-token") !== null) {
      return <Redirect to="/profile" />;
    } else {
      return (
        <div>
          <h2
            style={{
              display: "flex",
              justifyContent: "center",
              margin: "30px"
            }}
          >
            Twitter Clone
          </h2>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Form onSubmit={this.onSubmit}>
              <FormGroup>
                <Label>Användarnamn:</Label>
                <Input onChange={this.onChange} type="text" name="username" />
              </FormGroup>

              <FormGroup>
                <Label>Lösenord:</Label>
                <Input
                  onChange={this.onChange}
                  type="password"
                  name="password"
                />
              </FormGroup>

              <Button>Logga in</Button>
              {loader}
              <div>{errorMessage}</div>
            </Form>
          </div>
        </div>
      );
    }
  }
}

export default Login;
