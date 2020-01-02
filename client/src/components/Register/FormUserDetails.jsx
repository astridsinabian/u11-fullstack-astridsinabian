import React, { Component } from "react";
import { FormGroup, Label, Input, Button, FormFeedback } from "reactstrap";

export class FormUserDetails extends Component {
  continue = e => {
    e.preventDefault();
    this.props.nextStep();
  };

  render() {
    const { values, onChange, validate } = this.props;
    return (
      <div>
        <h2>Fyll i kontaktuppgifter</h2>

        <FormGroup>
          <Label>Användarnamn</Label>
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

        <div style={{ display: "flex" }}>
          <FormGroup>
            <Label>Förnamn</Label>
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
            <Label>Efternamn</Label>
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
        </div>

        <FormGroup>
          <Label>Email</Label>
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
          <Label>Lösenord</Label>
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
        <Button onClick={this.continue}>Nästa</Button>
      </div>
    );
  }
}

export default FormUserDetails;
