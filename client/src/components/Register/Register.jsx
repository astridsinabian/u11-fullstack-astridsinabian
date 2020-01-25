import React, { Component } from "react";
import AuthService from "../AuthService";
import FormUserDetails from "./FormUserDetails";
import FormDescription from "./FormDescription";
import Confirm from "./Confirm";
import Success from "./Success";
import { Redirect } from "react-router-dom";

const emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 1,
      username: "",
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      description: "",
      admin: "false",
      validate: {
        usernameState: "",
        firstnameState: "",
        lastnameState: "",
        emailState: "",
        passwordState: ""
      }
    };

    this.onChange = this.onChange.bind(this);
    this.Auth = new AuthService();
  }

  nextStep = () => {
    const { step, validate } = this.state;

    if (Object.values(validate).every(item => item === "has-success")) {
      this.setState({
        step: step + 1
      });
    } else {
      this.setState({
        step: 1
      });
    }
  };

  prevStep = () => {
    const { step } = this.state;
    this.setState({
      step: step - 1
    });
  };

  onChange = input => e => {
    const { validate } = this.state;
    this.setState({
      [input]: e.target.value
    });

    switch (e.target.name) {
      case "username":
        if (e.target.value.length >= 6) {
          validate.usernameState = "has-success";
        } else {
          validate.usernameState = "has-danger";
        }
        break;
      case "firstname":
        if (e.target.value.length >= 2) {
          validate.firstnameState = "has-success";
        } else {
          validate.firstnameState = "has-danger";
        }
        break;
      case "lastname":
        if (e.target.value.length >= 2) {
          validate.lastnameState = "has-success";
        } else {
          validate.lastnameState = "has-danger";
        }
        break;
      case "email":
        if (emailRex.test(e.target.value)) {
          validate.emailState = "has-success";
        } else {
          validate.emailState = "has-danger";
        }
        break;
      case "password":
        if (e.target.value.length >= 6) {
          validate.passwordState = "has-success";
        } else {
          validate.passwordState = "has-danger";
        }
        break;
    }

    this.setState({ validate });
  };

  render() {
    const { step } = this.state;
    const {
      username,
      firstname,
      lastname,
      email,
      password,
      description,
      admin
    } = this.state;
    const values = {
      username,
      firstname,
      lastname,
      email,
      password,
      description,
      admin
    };

    if (localStorage.getItem("auth-token") !== null) {
      return <Redirect to="/profile" />;
    } else {
      switch (step) {
        case 1:
          return (
            <FormUserDetails
              nextStep={this.nextStep}
              onChange={this.onChange}
              values={values}
              validate={this.state.validate}
            />
          );
        case 2:
          return (
            <FormDescription
              nextStep={this.nextStep}
              prevStep={this.prevStep}
              onChange={this.onChange}
              values={values}
            />
          );
        case 3:
          return (
            <Confirm
              nextStep={this.nextStep}
              prevStep={this.prevStep}
              values={values}
            />
          );
        case 4:
          return <Success />;
      }
    }
  }
}

export default Register;
