import React, { Component } from 'react';
import axios from 'axios';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import AuthService from './AuthService';


class Login extends Component {
    constructor(props) {
        super(props);

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.login = this.login.bind(this);
        this.Auth = new AuthService();
    }

    onChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    onSubmit(e) {
        e.preventDefault();
        this.login(this.state.username, this.state.password);
    }

    login = (username, password) => {
        const user = { 
            username: username, 
            password: password
        };

        axios.post('http://localhost:5000/api/user/login', { user })
            .then(res => {
                this.Auth.setToken(res.data);
                this.props.history.push('/profile');
            })
            .catch((res) => console.log(res));
    }
    
    render() { 
        return ( 
        <div>
            <h2 style={{display: 'flex', justifyContent: 'center', margin: '30px'}}>Twitter Clone</h2>
            <div style={{display: 'flex', justifyContent: 'center'}}>
                <Form onSubmit={this.onSubmit}>
                    <FormGroup>
                        <Label>Användarnamn:</Label>
                        <Input 
                        onChange={this.onChange}
                        type="text"
                        name="username"
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label>Lösenord:</Label>
                        <Input 
                        onChange={this.onChange}
                        type="password"
                        name="password"
                        />
                    </FormGroup>

                    <Button>Logga in</Button>
                </Form>
            </div>
        </div>
        );
    }
}
 
export default Login;