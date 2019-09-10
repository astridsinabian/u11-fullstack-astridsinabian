import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import styled from 'styled-components';

import NavBar from './components/NavBar';
import Profile from './components/Profile';
import Register from './components/Register';
import Login from './components/Login';
import FrontPage from './components/FrontPage'

const Container = styled.div`
  margin: 0;
  padding: 0;
`;

function App() {
  return (
    <Router>
      <Container>
        <NavBar />
        <Switch>
          <Route path="/" exact component={FrontPage} />
          <Route path="/profile" component={Profile} />
          <Route path="/register" component={Register} />
          <Route path="/login" component={Login} />
        </Switch>
      </Container>
    </Router>
  );
}

export default App;
