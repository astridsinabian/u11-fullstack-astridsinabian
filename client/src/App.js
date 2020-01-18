import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import styled from "styled-components";

import NavBar from "./components/NavBar";
import Profile from "./components/Profile";
import Register from "./components/Register/Register";
import Login from "./components/Login";
import FrontPage from "./components/FrontPage";
import PrivateRoute from "./components/PrivateRoute";
import OpenProfile from "./components/OpenProfile";
import SearchUser from "./components/SearchUser";
import Admin from "./components/Admin";
import NotFound from "./components/NotFound";

const Container = styled.div`
  margin: 0;
  padding: 0;
`;

class App extends Component {
  render() {
    return (
      <Router>
        <Container>
          <NavBar />
          <Switch>
            <Route path="/" exact component={FrontPage} />
            <PrivateRoute path="/profile" component={Profile} />
            <PrivateRoute path="/admin" component={Admin} />
            <Route path="/register" component={Register} />
            <Route path="/login" component={Login} />
            <Route path="/user" exact component={SearchUser} />
            <Route path="/user/:username" exact component={OpenProfile} />
            <Route path="*" component={NotFound} />
          </Switch>
        </Container>
      </Router>
    );
  }
}

export default App;
