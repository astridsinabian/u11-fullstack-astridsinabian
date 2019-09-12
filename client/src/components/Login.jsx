import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import AuthService from './AuthService';

class Login extends Component {
    constructor(props) {
        super(props);
        
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.Auth = new AuthService();
    }

    onChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    onSubmit(e) {
        e.preventDefault();
        this.Auth.login(this.state.username, this.state.password)
        this.props.history.replace('/profile');
    }

    componentDidMount() {
        if(this.Auth.loggedIn()) {
            this.props.history.replace('/profile')
        }
    }

    render() { 
        return ( 
        <div>
            <h2 style={{display: 'flex', justifyContent: 'center', margin: '30px'}}>Log in - Twitter Clone</h2>
            <div style={{display: 'flex', justifyContent: 'center'}}>
                <Form onSubmit={this.onSubmit}>
                    <FormGroup>
                        <Label>Username:</Label>
                        <Input 
                        onChange={this.onChange}
                        type="text"
                        name="username"
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label>Password:</Label>
                        <Input 
                        onChange={this.onChange}
                        type="password"
                        name="password"
                        />
                    </FormGroup>

                    <Button>Log in</Button>
                </Form>
            </div>
        </div>
        );
    }
}
 
export default Login;