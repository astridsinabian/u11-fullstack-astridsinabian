import React, { Component } from "react";
import { Link } from "react-router-dom";
import AuthService from "./AuthService";
import { withRouter } from "react-router-dom";
import iconPigeon from '../assets/icons8-pigeon.png';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const StyledNav = styled.nav`
  @import url('https://fonts.googleapis.com/css?family=Montserrat&display=swap');

  display: flex;
  justify-content: space-between;
  position: fixed;
  top: 0;
  width: 100%;
  overflow: hidden;
  background-color: white;
  box-shadow: -1px 5px 9px -1px rgba(138,138,138,0.41);

  font-family: 'Montserrat', sans-serif;
`;

const StyledImg = styled.img`
  padding: 10px 0px 10px 20px;
`;

const OtherLinks = styled.span`
  display: flex;
  padding: 10px;
`;

const StyledNavLink = styled(Link)`
  padding: 0 5px;
  color: #9c8ed4;
  font-weight: bold;
  text-transform: uppercase;
  font-size: 10px;

  &:hover {
    color: #a69bce;
    text-decoration: none;
  }
`;

const StyledSpan = styled.span`
  padding-right: 10px;
`;

const LogoutButton = styled.button`
  background: none;
  margin: 0;
  padding: 0 5px;
  border: 0;

  color: #9c8ed4;
  font-size: 12px;

  &:hover {
    color: #a69bce;
    text-decoration: none;
  }
`;

class NavBar extends Component {
  constructor(props) {
    super(props);

    this.handleLogout = this.handleLogout.bind(this);
    this.Auth = new AuthService();
  }

  handleLogout(e) {
    e.preventDefault();
    this.Auth.logout();
    this.props.history.replace("/login");
  }

  render() {
    let links;

    if (
      this.Auth.getToken() !== null &&
      localStorage.getItem("admin") === "true"
    ) {
      links = (
        <span>
          <StyledNavLink to="/profile">Min sida</StyledNavLink>
          <StyledNavLink to="/admin">Dashboard</StyledNavLink>
          <LogoutButton onClick={this.handleLogout}><FontAwesomeIcon icon='sign-out-alt' /></LogoutButton>
        </span>
      );
    } else if (this.Auth.getToken() !== null) {
      links = (
        <span>
          <StyledNavLink to="/profile">Min sida</StyledNavLink>
          <LogoutButton onClick={this.handleLogout}><FontAwesomeIcon icon='sign-out-alt' /></LogoutButton>
        </span>
      );
    } else {
      links = (
        <StyledSpan>
          <StyledNavLink to="/login">Logga in</StyledNavLink>
          <StyledNavLink to="/register">Registrera dig</StyledNavLink>
        </StyledSpan>
      );
    }

    return (
      <StyledNav>
        <Link to="/">
          <StyledImg src={iconPigeon} width="40px" height="40px" alt="Logo"/>
        </Link>
        <OtherLinks>
          <span>
            <StyledNavLink to="/user"><FontAwesomeIcon icon='search' /></StyledNavLink>
          </span>
          {links}
        </OtherLinks>
      </StyledNav>
    );
  }
}

export default withRouter(NavBar);
