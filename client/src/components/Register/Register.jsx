import React, { Component } from 'react';
import AuthService from '../AuthService';
import FormUserDetails from './FormUserDetails';
import FormDescription from './FormDescription';
import Confirm from './Confirm';
import Success from './Success';
import { Redirect } from 'react-router-dom';

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
            description: '',
            admin: 'false'
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
        const { username, firstname, lastname, email, password, description, admin } = this.state;
        const values = { username, firstname, lastname, email, password, description, admin };

        if(localStorage.getItem('auth-token') !== null) {
            return <Redirect to="/profile" />
        } else {

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
                    return (
                        <Success />
                    );
            }
        }
    }
}

export default Register;