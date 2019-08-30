import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import styled from 'styled-components';

import NavBar from './components/NavBar';
import Home from './components/Home';

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
      </Container>
    </Router>
  );
}

export default App;
