import React, { Component } from "react";
import styled from 'styled-components';
import background from '../assets/28509423.jpg';

const StyledMain = styled.main`
  @import url('https://fonts.googleapis.com/css?family=Montserrat&display=swap');
  font-family: 'Montserrat', sans-serif;
  color: white;
  font-weight: bold;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  height: 60vw;
  margin-top: 8em;
`;

const StyledImg = styled.img`
  width: 60%;
  height: 50%;
`;

const Title = styled.h1`
  margin-top: 10px;
  color: black;

  @media (min-width: 320px) and (max-width: 480px) {
    font-size: 28px;
  }
`;

const Slogan = styled.div`
  color: #a193d6;

  @media (min-width: 320px) and (max-width: 480px) {
    text-align: center;
    font-size: 13px;
  }
`;

const StyledFooter = styled.footer`
  display: flex;
  justify-content: center;
  align-items: flex-end;
  color: gray;
  font-size: 10px;
  height: 100px;

  @media (min-width: 320px) and (max-width: 480px) {
    margin-top: 5rem;
  }
`;

class FrontPage extends Component {
  render() {
    return (
      <StyledMain>
        <StyledImg src={background} alt="front"></StyledImg>
        <Title>Twitter Clone</Title>
        <Slogan>
          Dela med dig om vad du tycker och tänker.
        </Slogan>
        <StyledFooter>
          Copyright © 2020 by Astrid Sinabian
        </StyledFooter>
      </StyledMain>
    );
  }
}

export default FrontPage;
