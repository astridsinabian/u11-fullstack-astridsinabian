import React, { Component } from "react";
import { Link } from "react-router-dom";
import styled from 'styled-components';

const StepSuccess = styled.div`
  @import url('https://fonts.googleapis.com/css?family=Montserrat&display=swap');
  font-family: 'Montserrat', sans-serif;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 55vw;
`;

const Title = styled.h4`
  font-size: 20px;
  color: gray;
`;

const Content = styled.div`

`;

const StyledLink = styled(Link)`
  color: #c3c9f6;
  text-decoration: none;
  font-weight: bold;

  &:hover {
    color: lightgray;
    text-decoration: none;
  }
`;

class Success extends Component {
  render() {
    return (
      <StepSuccess>
        <Title>Nu är du registrerad!</Title>
        <Content>
          Sätt igång genom att <StyledLink to="/login">logga in</StyledLink>.
        </Content>
      </StepSuccess>
    );
  }
}

export default Success;
