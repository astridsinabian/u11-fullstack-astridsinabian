import React, { Component } from 'react';
import { FormGroup, Label, Input, Button } from 'reactstrap';

export class FormUserDetails extends Component {
    continue = e => {
        e.preventDefault();
        this.props.nextStep();
    }

    render() { 
        const { values, onChange } = this.props;
        return ( 
        <div>
            <h2>Fyll i kontaktuppgifter</h2>
            
            
            <FormGroup>
                <Label>Användarnamn</Label>
                <Input 
                    onChange={onChange('username')} 
                    value={values.username}
                    type="text" 
                    name="username" 
                    id="username" 
                    placeholder="Användarnamn"
                />
            </FormGroup>

            <div style={{display: 'flex', }}>
            <FormGroup>
                <Label>Förnamn</Label>
                <Input 
                    onChange={onChange('firstname')} 
                    value={values.firstname}
                    type="name"
                    name="firstname"
                    id="firstname"
                    placeholder="Förnamn" 
                />
            </FormGroup>
            
            <FormGroup>
                <Label>Efternamn</Label>
                <Input
                    onChange={onChange('lastname')} 
                    value={values.lastname}
                    type="name"
                    name="lastname" 
                    id="lastname" 
                    placeholder="Efternamn" 
                />
            </FormGroup>
            </div>

            <FormGroup>
                <Label>Email</Label>
                <Input 
                    onChange={onChange('email')} 
                    value={values.email}
                    type="email" 
                    name="email" 
                    id="email" 
                    placeholder="Email" 
                />
            </FormGroup>

            <FormGroup>
                <Label>Lösenord</Label>
                <Input 
                    onChange={onChange('password')} 
                    value={values.password}
                    type="password" 
                    name="password" 
                    id="password" 
                    placeholder="Lösenord" 
                />
            </FormGroup>
            <Button
                onClick={this.continue}
            >Nästa
            </Button>
            </div>
        );
    }
}
 
export default FormUserDetails;