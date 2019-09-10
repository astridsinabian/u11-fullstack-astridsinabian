import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import AuthService from './AuthService';

class Register extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            firstname: '',
            lastname: '',
            email: '',
            password: ''
        }

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.Auth = new AuthService();
    }

    onChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    onSubmit(e) {
        e.preventDefault();
        this.Auth.register(this.state);
        this.props.history.replace('/profile');
    }

    render() { 
        return ( 
            <div>
                <h2 style={{display: 'flex', justifyContent: 'center', margin: '30px'}}>Join Twitter-Clone Today</h2>
                <div style={{display: 'flex', justifyContent: 'center'}}>
                <Form onSubmit={this.onSubmit}>
                    <FormGroup>
                        <Label>Username</Label>
                        <Input 
                            onChange={this.onChange} 
                            value={this.state.username}
                            type="text" 
                            name="username" 
                            id="username" 
                            placeholder="Username"
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label>First name</Label>
                        <Input 
                            onChange={this.onChange} 
                            value={this.state.firstname}
                            type="name"
                            name="firstname"
                            id="firstname"
                            placeholder="First name" 
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label>Last name</Label>
                        <Input
                            onChange={this.onChange} 
                            value={this.state.lastname}
                            type="name"
                            name="lastname" 
                            id="lastname" 
                            placeholder="Last name" 
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label>Email</Label>
                        <Input 
                            onChange={this.onChange} 
                            value={this.state.email}
                            type="email" 
                            name="email" 
                            id="email" 
                            placeholder="Email" 
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label>Password</Label>
                        <Input 
                            onChange={this.onChange} 
                            value={this.state.password}
                            type="password" 
                            name="password" 
                            id="password" 
                            placeholder="Password" 
                        />
                    </FormGroup>
                    <Button>Sign up</Button>
                </Form>
                </div>
            </div>
         );
    }
}

export default Register;