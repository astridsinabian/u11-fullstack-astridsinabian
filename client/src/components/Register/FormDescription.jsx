import React, { Component } from "react";
import { FormGroup, Input, Button } from "reactstrap";
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const StepTwo = styled.div`
  @import url('https://fonts.googleapis.com/css?family=Montserrat&display=swap');
  font-family: 'Montserrat', sans-serif;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 55vw;
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

const ButtonsPrevNext = styled.div`
  display: flex;
  justify-content: space-between;
`;

export class FormDescription extends Component {
  continue = e => {
    e.preventDefault();
    this.props.nextStep();
  };

  back = e => {
    e.preventDefault();
    this.props.prevStep();
  };

  render() {
    const { values, onChange, descriptionState } = this.props;
    return (
      <StepTwo>
        <FormTitleWrapper>
          <Title>Berätta kort om dig själv</Title>
          <StepsText>Steg 2 av 3</StepsText>

          <FormGroup row>
            <Input
              onChange={onChange("description")}
              value={values.description}
              type="textarea"
              name="description"
              id="description"
              valid={descriptionState === "has-success"}
              invalid={descriptionState === "has-danger"}
              maxLength="400"
            />
          </FormGroup>

          <ButtonsPrevNext>
            <Button onClick={this.back}>
              <FontAwesomeIcon icon='arrow-left' />
            </Button>
            <Button onClick={this.continue}>
              <FontAwesomeIcon icon='arrow-right' />
            </Button>
          </ButtonsPrevNext>
        </FormTitleWrapper>
      </StepTwo>
    );
  }
}

export default FormDescription;
