import React, { Component } from 'react';
import AuthService from './AuthService';
import axios from 'axios';
import { Form, FormGroup, Label, Input, Button } from 'reactstrap';
import Tweets from './Tweets';
import styled from 'styled-components';

const Auth = new AuthService();

const Container = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: column;
    margin: 10px 120px;
`;

const FormStyled = styled(Form)`
    margin: 50px 0;
`;

const DivStyled = styled.div`
    margin: 30px 0;
`;

class Profile extends Component {

    constructor(props) {
        super(props);

        this.state = {
            username: '',
            firstname: '',
            lastname: '',
            email: '',
            description: '',
            admin: false, 
            loading: true,
            updatedUserText: false,
            updateButton: false
        }

        this.handleChange = this.handleChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.Auth = new AuthService();
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });

        if(e.target.name !== 'description') {
            if(e.target.value === '' || e.target.value === undefined || e.target.value === null) {
                this.setState({ updateButton: false })
            } else {
                this.setState({ updateButton: true })
            }
        } else {
            this.setState({ updateButton: true })
        }
    }

    onSubmit(e) {
        e.preventDefault();
        this.editUser();
        this.setState({ updatedUserText: true });
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
                description: res.data.user.description,
                loading: false
            }))
            .catch((error) => { 
                if(error.response.data.message === 'jwt expired') {
                    this.Auth.logout();
                    this.props.history.replace('/login');
                }
            });
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
        const { 
            username, 
            firstname, 
            lastname, 
            email, 
            description, 
            loading,
            updatedUserText,
            updateButton
        } = this.state;

        if(loading) {
            return <div>Laddar profil...</div>
        } else {
            return ( 
                <Container>
                    <div>
                        <h1>Välkommen {firstname} {lastname}!</h1>
                    </div>

                    <FormStyled onSubmit={this.onSubmit}>
                        <FormGroup>
                        <Label>Användarnamn:</Label>
                            <Input 
                            value={username}
                            readOnly
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

                        { updateButton === true ? <Button>Ändra uppgifter</Button> : <Button disabled>Ändra uppgifter</Button>}
                        <div>{ updatedUserText === true ? 'Ändringar uppdaterade' : '' }</div>
                    </FormStyled>

                    <DivStyled>
                        <Tweets />
                    </DivStyled>

                </Container>
            );
        }
    }
}
 
export default Profile;