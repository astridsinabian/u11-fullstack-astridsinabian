import React, { Component } from "react";
import styled from 'styled-components';
import background from '../assets/background-frontpage.jpg';

const StyledMain = styled.main`
  @import url('https://fonts.googleapis.com/css?family=Montserrat&display=swap');
  font-family: 'Montserrat', sans-serif;
  color: white;
  font-weight: bold;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  background: url(${background});
  background-repeat: no-repeat;
  background-size: cover;
  height: 60vw;
`;

const Title = styled.h1`
  position: absolute;
  top: 25%;
  left: 10%;
`;

const Slogan = styled.div`
  position: absolute;
  top: 35%;
  left: 10%;
`;

class FrontPage extends Component {
  render() {
    return (
      <StyledMain>
        <Title>Twitter Clone</Title>
        <Slogan>Dela med dig om vad du tycker och tänker.</Slogan>
      </StyledMain>
    );
  }
}

export default FrontPage;
