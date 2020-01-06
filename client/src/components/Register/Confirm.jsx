import React, { Component } from "react";
import { Button, Form } from "reactstrap";
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from "axios";

const StepThree = styled.div`
  @import url('https://fonts.googleapis.com/css?family=Montserrat&display=swap');
  font-family: 'Montserrat', sans-serif;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 55vw;
  background-color: #b0d3d526;
`;

const Title = styled.h4`
  color: gray;
  font-size: 20px;
`;

const StepsText = styled.h6`
  color: lightgray;
`;

const FormTitleWrapper = styled.div`
  font-size: 12px;
  width: 60vw;
  padding: 20px 30px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 3px 5px 9px -1px rgba(138,138,138,0.41);
`;

const FormTitle = styled.span`
  font-weight: bold;
  padding-right: 5px;
`;

const ErrorMessage = styled.div`
  color: red;
  font-size: 10px;
  font-weight: bold;
`;

const FormWrapper = styled.div`
  margin: 20px 0;
`;

const FormInfo = styled.div`
  padding: 3px 3px 3px 0;
`;

const ButtonsPrevNext = styled.div`
  display: flex;
  justify-content: space-between;
`;

export class Confirm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      errorEmail: false,
      errorUsername: false
    }

    this.register = this.register.bind(this);
  }

  continue = e => {
    e.preventDefault();
    this.register(this.props.values);
  };

  register = (data) => {
     axios.post("http://localhost:5000/api/user/register", data)
      .then(() => {
        this.props.nextStep();
      })
      .catch(error => {
        if(error.response.data === "Email already exists" ) {
          this.setState({
            errorEmail: true
          })
        } 
        if(error.response.data === "Username already exists") {
          this.setState({
            errorUsername: true
          })
        }
      })
  };

  back = e => {
    e.preventDefault();
    this.props.prevStep();
  };

  render() {
    const { values: { username, firstname, lastname, email, description }} = this.props;
    const { errorUsername, errorEmail } = this.state;
    return (
      <StepThree>
        <FormTitleWrapper>
          <Title>Bekräfta</Title>
          <StepsText>Steg 3 av 3</StepsText>

          <Form onSubmit={this.continue}>
            <FormWrapper>
              <FormInfo>
                <FormTitle>Användarnamn:</FormTitle> 
                <span>{username}</span>
                <ErrorMessage>{ errorUsername ? 'Användarnamn finns redan' : null }</ErrorMessage>
              </FormInfo>
              <FormInfo>
                <FormTitle>Förnamn:</FormTitle> 
                <span>{firstname}</span>
              </FormInfo>
              <FormInfo>
                <FormTitle>Efternamn:</FormTitle> 
                <span>{lastname}</span>
              </FormInfo>
              <FormInfo>
                <FormTitle>Email:</FormTitle> 
                <span>{email}</span>
                <ErrorMessage>{ errorEmail ? 'Email finns redan' : null }</ErrorMessage>
              </FormInfo>
              <FormInfo>
                <FormTitle>Beskrivning:</FormTitle> 
                <span>{description}</span>
              </FormInfo>
            </FormWrapper>

            <ButtonsPrevNext>
              <Button onClick={this.back}><FontAwesomeIcon icon='arrow-left' /></Button>
              <Button type="submit"><FontAwesomeIcon icon='check' /></Button>
            </ButtonsPrevNext>
          </Form>

        </FormTitleWrapper>
      </StepThree>
    );
  }
}

export default Confirm;
