import React, { Component } from "react";
import { FormGroup, Label, Input, Button, FormFeedback } from "reactstrap";
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const StepOne = styled.div`
  @import url('https://fonts.googleapis.com/css?family=Montserrat&display=swap');
  font-family: 'Montserrat', sans-serif;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 65vw;
  margin-top: 5em;

  @media (min-width: 320px) and (max-width: 480px) {
    margin-top: 12.5em;
  }
`;

const Title = styled.h4`
  color: gray;
  font-size: 20px;

  @media (min-width: 320px) and (max-width: 480px) {
    font-size: 18px;
  }
`;

const StepsText = styled.h6`
  color: lightgray;
`;

const FormTitleWrapper = styled.div`
  width: 60vw;
  padding: 20px 30px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 3px 5px 9px -1px rgba(138,138,138,0.41);

  @media (min-width: 320px) and (max-width: 480px) {
    width: 100%;
    box-shadow: 0 0 0 0  white;
  }
`;

const StyledButton = styled(Button)`
  float: right;
`;

const Name = styled.div`
  display: flex;
`;

const FormWrapper = styled.div`
  margin-top: 30px;

  @media (min-width: 320px) and (max-width: 480px) {
    width: 100%;
    margin: 0;
  }
`;

export class FormUserDetails extends Component {
  continue = e => {
    e.preventDefault();
    this.props.nextStep();
  };

  render() {
    const { values, onChange, validate } = this.props;
    return (
      <StepOne>
        <FormTitleWrapper>
        <Title>Fyll i dina kontaktuppgifter</Title>
        <StepsText>Steg 1 av 3</StepsText>

        <FormWrapper>
        <FormGroup>
          <Label>Användarnamn *</Label>
          <Input
            onChange={onChange("username")}
            value={values.username}
            type="text"
            name="username"
            id="username"
            placeholder="Användarnamn"
            valid={validate.usernameState === "has-success"}
            invalid={validate.usernameState === "has-danger"}
          />
          <FormFeedback>Behöver vara minst 6 karaktärer</FormFeedback>
        </FormGroup>

        <Name>
          <FormGroup>
            <Label>Förnamn *</Label>
            <Input
              onChange={onChange("firstname")}
              value={values.firstname}
              type="name"
              name="firstname"
              id="firstname"
              placeholder="Förnamn"
              valid={validate.firstnameState === "has-success"}
              invalid={validate.firstnameState === "has-danger"}
            />
            <FormFeedback>Behöver vara minst 2 karaktärer</FormFeedback>
          </FormGroup>

          <FormGroup>
            <Label>Efternamn *</Label>
            <Input
              onChange={onChange("lastname")}
              value={values.lastname}
              type="name"
              name="lastname"
              id="lastname"
              placeholder="Efternamn"
              valid={validate.lastnameState === "has-success"}
              invalid={validate.lastnameState === "has-danger"}
            />
            <FormFeedback>Behöver vara minst 2 karaktärer</FormFeedback>
          </FormGroup>
        </Name>

          <FormGroup>
            <Label>Email *</Label>
            <Input
              onChange={onChange("email")}
              value={values.email}
              type="email"
              name="email"
              id="email"
              placeholder="Email"
              valid={validate.emailState === "has-success"}
              invalid={validate.emailState === "has-danger"}
            />
            <FormFeedback>Vänligen skriv in en giltig emailadress</FormFeedback>
          </FormGroup>

          <FormGroup>
            <Label>Lösenord *</Label>
            <Input
              onChange={onChange("password")}
              value={values.password}
              type="password"
              name="password"
              id="password"
              placeholder="Lösenord"
              valid={validate.passwordState === "has-success"}
              invalid={validate.passwordState === "has-danger"}
            />
            <FormFeedback>Behöver vara minst 6 karaktärer</FormFeedback>
          </FormGroup>
        </FormWrapper>
        <StyledButton onClick={this.continue}>
          <FontAwesomeIcon icon='arrow-right' />
        </StyledButton>
        </FormTitleWrapper>
      </StepOne>
    );
  }
}

export default FormUserDetails;
