import React, { Component } from 'react';
import AuthService from './AuthService';
import axios from 'axios';
import { Form, FormGroup, Label, Input, Button } from 'reactstrap';
import AddTweet from './Tweets/AddTweet';
import DisplayTweets from './Tweets/DisplayTweets';

const Auth = new AuthService();

class Profile extends Component {

    constructor(props) {
        super(props);

        this.state = {
            username: '',
            firstname: '',
            lastname: '',
            email: '',
            description: ''
        }

        this.handleChange = this.handleChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.Auth = new AuthService();
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    onSubmit(e) {
        e.preventDefault();
        this.editUser();
    }

    handleLogout = () => {
        Auth.logout();
        this.props.history.replace('/login');
    }

    getUser = () => {
        let token = Auth.getToken();
        const config = { 
                headers: {
                    'Content-Type': "application/json",
                    'Authorization': token
                }
            }

        axios.get('http://localhost:5000/api/user/profile', config)
        .then(res => this.setState({
            username: res.data.user.username,
            firstname: res.data.user.firstname,
            lastname: res.data.user.lastname,
            email: res.data.user.email,
            description: res.data.user.description
        }));
    }

    editUser = () => {
        let token = Auth.getToken();

        const config = { 
            headers: {
                'Content-Type': "application/json",
                'Authorization': token
            },
            data: {
                username: this.state.username,
                firstname: this.state.firstname,
                lastname: this.state.lastname,
                description: this.state.description
            }
        }
        axios.patch('http://localhost:5000/api/user/profile', config);
    }

    componentDidMount() {
        this.getUser();
    }

    render() { 
        const { username, firstname, lastname, email, description } = this.state;
        return ( 
            <div>
                <h1>Välkommen {firstname} {lastname}!</h1>
                <button onClick={this.handleLogout.bind(this)}>
                    Logga ut
                </button>

                <Form onSubmit={this.onSubmit}>
                    <FormGroup>
                    <Label>Användarnamn:</Label>
                        <Input 
                        onChange={this.handleChange}
                        value={username}
                        type="text"
                        name="username"
                        />
                    </FormGroup>

                    <FormGroup>
                    <Label>Förnamn:</Label>
                        <Input 
                        onChange={this.handleChange}
                        value={firstname}
                        type="text"
                        name="firstname"
                        />
                    </FormGroup>

                    <FormGroup>
                    <Label>Efternamn:</Label>
                        <Input 
                        onChange={this.handleChange}
                        value={lastname}
                        type="text"
                        name="lastname"
                        />
                    </FormGroup>

                    <FormGroup>
                    <Label>Email:</Label>
                        <Input
                        value={email}
                        readOnly
                        type="text"
                        />
                    </FormGroup>

                    <FormGroup>
                    <Label>Beskriv dig själv</Label>
                        <Input 
                        onChange={this.handleChange}
                        value={description}
                        type="textarea"
                        name="description"
                        />
                    </FormGroup>

                    <Button>Ändra uppgifter</Button>
                </Form>

                <AddTweet />
                <DisplayTweets />
            </div>
         );
    }
}
 
export default Profile;