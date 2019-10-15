import React, { Component } from 'react';
import { Button, Form } from 'reactstrap';
import AuthService from '../AuthService';

export class Confirm extends Component {

    constructor(props) {
        super(props);
        
        this.Auth = new AuthService();
    }

    continue = e => {
        e.preventDefault();
        this.Auth.register(this.props.values);
        this.props.nextStep();
    }

    back = e => {
        e.preventDefault();
        this.props.prevStep();
    }

    render() { 
        const { values: { username, firstname, lastname, email, password, description }} = this.props;
        return ( 
        <div>
            <h2>Bekräfta</h2>
            
            <Form onSubmit={this.continue}>
                <div>Användarnamn: {username}</div>
                <div>Förnamn: {firstname}</div>
                <div>Efternamn: {lastname}</div>
                <div>Email:{email}</div>
                <div>Lösenord: {password}</div>
                <div>Beskrivning: {description}</div>
                <Button type="submit">Klar!</Button>
            </Form>

            <Button onClick={this.back}>Tillbaka</Button>
            
            </div>
        );
    }
}
 
export default Confirm;