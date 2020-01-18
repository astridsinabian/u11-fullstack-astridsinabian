import React, { Component } from "react";
import Navbar from "./NavBar";
import styled from "styled-components";
import NotFoundImg from "../assets/404-not-found.png";

const NotFoundWrapper = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 6em;
`;

class NotFound extends Component {
  render() {
    return (
        <NotFoundWrapper>
            <Navbar />
            <img src={NotFoundImg} alt="Not Found"/>
        </NotFoundWrapper>
    );
  }
}

export default NotFound;
