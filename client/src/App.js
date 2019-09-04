import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import styled from 'styled-components';

import NavBar from './components/NavBar';
import Home from './components/Home';
import Profile from './components/Profile';
import Register from './components/Register';
import Login from './components/Login';

const Container = styled.div`
  margin: 0;
  padding: 0;
`;

function App() {
  return (
    <Router>
      <Container>
        <NavBar />
        <Route path="/" exact component={Home} />
        <Route path="/profile" component={Profile} />
        <Route path="/register" component={Register} />
        <Route path="/login" component={Login} />
      </Container>
    </Router>
  );
}

export default App;
