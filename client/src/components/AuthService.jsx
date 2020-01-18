import { Component } from "react";

export default class AuthService extends Component {
  constructor(props) {
    super(props);
  }

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
