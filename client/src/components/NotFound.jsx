import React, { Component } from "react";
import Navbar from "./NavBar";
import styled from "styled-components";
import NotFoundImg from "../assets/404-not-found.png";

const NotFoundWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 6em;

  @media (min-width: 320px) and (max-width: 480px) {
    margin-top: 7em;
  }
`;

const StyledImg = styled.img`
  @media (min-width: 320px) and (max-width: 480px) {
    width: 70%;
    height: 70%;
  }
`;

class NotFound extends Component {
  render() {
    return (
      <NotFoundWrapper>
        <Navbar />
        <StyledImg src={NotFoundImg} alt="Not Found" />
      </NotFoundWrapper>
    );
  }
}

export default NotFound;
