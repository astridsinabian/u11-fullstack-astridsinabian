import { Component } from "react";
import axios from "axios";

export default class AuthService extends Component {
  constructor(props) {
    super(props);
    this.register = this.register.bind(this);
  }

  register = data => {
    axios({
      method: "POST",
      url: "http://localhost:5000/api/user/register",
      data: data,
      config: {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    });
  };

  isLoggedIn = () => {
    const token = this.getToken();
    return !!token;
  };

  setRole = admin => {
    return localStorage.setItem("admin", admin);
  };

  setToken = idToken => {
    return localStorage.setItem("auth-token", idToken);
  };

  isAdmin = () => {
    return localStorage.getItem("admin");
  };

  getToken = () => {
    return localStorage.getItem("auth-token");
  };

  logout = () => {
    return (
      localStorage.removeItem("auth-token"), localStorage.removeItem("admin")
    );
  };
}
