import React, { Component } from 'react';
import AuthService from './AuthService';
import FormUserDetails from './FormUserDetails';
import FormDescription from './FormDescription';
import Confirm from './Confirm';
import Profile from './Profile';
import Login from './Login';

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            step: 1,
            username: '',
            firstname: '',
            lastname: '',
            email: '',
            password: '',
            description: ''
        }

        this.onChange = this.onChange.bind(this);
        this.Auth = new AuthService();
    }

    nextStep = () => {
        const { step } = this.state;
        this.setState({
            step: step + 1
        })
    }

    prevStep = () => {
        const { step } = this.state;
        this.setState({
            step: step - 1
        })
    }

    onChange = input => (e) => {
        this.setState({
            [input]: e.target.value
        });
    }

    render() { 
        const { step } = this.state;
        const { username, firstname, lastname, email, password, description } = this.state;
        const values = { username, firstname, lastname, email, password, description };

        switch(step) { 
            case 1:
            return (
                <FormUserDetails
                    nextStep={this.nextStep}
                    onChange={this.onChange}
                    values={values}
                />
            );
            case 2:
                return (
                    <FormDescription
                        nextStep={this.nextStep}
                        prevStep={this.prevStep}
                        onChange={this.onChange}
                        values={values}
                    />
                );
            case 3:
                return (
                    <Confirm 
                        nextStep={this.nextStep}
                        prevStep={this.prevStep}
                        values={values} 
                    />
                );
            case 4:
                if(this.Auth.isLoggedIn() === true) {
                    return <Profile 
                        values={values}
                />
                } else {
                    return <Login />
                }
                
        }
    }
}

export default Register;