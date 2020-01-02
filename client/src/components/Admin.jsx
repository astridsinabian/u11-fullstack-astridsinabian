import React, { Component } from 'react';
import AuthService from './AuthService';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import { 
    Button, 
    Modal, 
    ModalHeader, 
    ModalBody, 
    Form, 
    FormGroup, 
    Label, 
    Input,
    FormFeedback
} from 'reactstrap';

const emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

class Admin extends Component {

    constructor(props) {
        super(props);

        this.state = {
            users: [],
            modal: false,
            username: '',
            firstname: '',
            lastname: '',
            email: '',
            password: '',
            validate: {
                usernameState: '',
                firstnameState: '',
                lastnameState: '',
                emailState: '',
                passwordState: ''
            }
        };

        this._isMounted = false;
        this.toggle = this.toggle.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.createNewUser = this.createNewUser.bind(this);
        this.Auth = new AuthService();
    }

    onSubmit(e) {
        e.preventDefault(e);

        this.editUser(this.state.newFirstname, this.state.newLastname, this.state.newEmail, this.newAdmin);

        this.setState({
            modal: false
        })

        this.getUsers();
    }

    createNewUser(e) {
        e.preventDefault(e);

        if(Object.values(this.state.validate).includes("has-danger")){
            return;
        }

        const user = {  
            username: this.state.username,
            firstname: this.state.firstname,
            lastname: this.state.lastname,
            email: this.state.email,
            password: this.state.password
        }
        
        this.Auth.register(user);

        this.setState({ 
            username: '',
            firstname: '',
            lastname: '',
            email: '',
            password: '',
            validate: {
                usernameState: '',
                firstnameState: '',
                lastnameState: '',
                emailState: '',
                passwordState: ''
            }
        });

        this.getUsers();
    }

    handleChange(e) {
        const { validate } = this.state;
        this.setState({
            [e.target.name]: e.target.value
        });

        switch(e.target.name) {
            case 'username':
                if(e.target.value.length >= 6) {
                    validate.usernameState = 'has-success';
                } else {
                    validate.usernameState = 'has-danger'
                }
                break;
            case 'firstname':
                if(e.target.value.length >= 2) {
                    validate.firstnameState = 'has-success';
                } else {
                    validate.firstnameState = 'has-danger'
                }
                break;
            case 'lastname':
                if(e.target.value.length >= 2) {
                    validate.lastnameState = 'has-success';
                } else {
                    validate.lastnameState = 'has-danger'
                }
                break;
            case 'email':
                if (emailRex.test(e.target.value)) {
                    validate.emailState = 'has-success'
                } else {
                    validate.emailState = 'has-danger'
                }
                break;
            case 'password':
                if(e.target.value.length >= 6) {
                    validate.passwordState = 'has-success';
                } else {
                    validate.passwordState = 'has-danger'
                }
                break;
        }

        this.setState({ validate })
    }

    toggle(e) {
        e.preventDefault(e);
        this.setState(prevState => ({
          modal: !prevState.modal
        }));

        if(e.target.value === undefined) {
            return;
        } else {
            
            const valueToSplit = e.target.value;
            const split = valueToSplit.split('/', 5);
            let newFirstname = split[0];
            let newLastname = split[1];
            let newEmail = split[2];
            let id = split[3];
            let admin = split[4];
    
            if(admin === undefined) {
                return;
            } else {
                let newAdmin = admin.trim();

                this.setState({
                    id: id,
                    newFirstname: newFirstname,
                    newLastname: newLastname,
                    newEmail: newEmail,
                    newAdmin: newAdmin
                })
            }
        }
    }

    async getUsers() {
        let token = this.Auth.getToken();
        const config = { 
                headers: {
                    'Content-Type': "application/json",
                    'Authorization': token
                }
            }

        const res = await axios.get('http://localhost:5000/api/admin/users', config)
        
        try {
            this._isMounted && this.setState({
                users: res.data
            });
        } catch(error) { 
            if(error.response.data.message === 'jwt expired') {
                this.Auth.logout();
                this.props.history.replace('/login');
            }
        }
    }

    editUser = () => {
        let _id = this.state.id.trim();

        const user = { 
            _id: _id,
            firstname: this.state.newFirstname,
            lastname: this.state.newLastname,
            email: this.state.newEmail,
            admin: this.state.newAdmin
            }

        axios.patch('http://localhost:5000/api/admin/editUser', { user });
    }

    deleteUser = (e) => {
        e.preventDefault();
        const id = e.target.value.trim();

        axios.delete(`http://localhost:5000/api/admin/deleteUser/${id}`);

        this.getUsers();
    }

    componentDidMount() {
        this._isMounted = true;
        this._isMounted && this.getUsers();
    }

    render() { 
        if(this.Auth.isAdmin() === 'false') {
            return (
                <Redirect to="/profile" />
            );
        } else if (this.Auth.isAdmin() ===  'true') {
            return ( 
                <div>
                    <h2>Admin - Översikt</h2>
                    <div>
                    {this.state.users.map((user, key) => {

                        const role = (
                            user.admin ?
                            "Admin" : "Vanlig användare"
                        );

                        return <div style={{margin: '2em'}} key={user._id}>
                        {user.firstname} {user.lastname} <Button color="primary" onClick={this.toggle} value={user.firstname + ' / ' + user.lastname + ' / ' + user.email + ' / ' + user._id + ' / ' + user.admin}>Ändra</Button> <Button color="danger" onClick={this.deleteUser} value={user._id}>Ta bort</Button>
                        
                        <div>
                            <div><strong>Användarnamn: </strong>{user.username}</div>
                            <div><strong>Email:</strong>{user.email}</div>
                            <div>
                                <strong>Roll:</strong> {role}
                            </div>
                        </div>
                        
                    </div>
                    })}
                    </div>

                    
                    <Modal isOpen={this.state.modal} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}>Ändra {this.state.newFirstname}'s uppgifter</ModalHeader>
                    <ModalBody>
                        <Form onSubmit={this.onSubmit}>
                        <FormGroup>
                            <Label>Förnamn: *</Label>
                            <Input
                                onChange={this.handleChange}
                                value={this.state.newFirstname}
                                type="text"
                                name="newFirstname"
                                id="newFirstname"
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label>Efternamn: *</Label>
                            <Input
                                onChange={this.handleChange}
                                value={this.state.newLastname}
                                type="text"
                                name="newLastname"
                                id="newLastname"
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label>Email: *</Label>
                            <Input
                                onChange={this.handleChange}
                                value={this.state.newEmail}
                                type="text"
                                name="newEmail"
                                id="newEmail"
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label>Ändra roll: *</Label>
                            
                            <div style={{display: 'flex'}}>
                                <h6>Admin</h6>
                                <input
                                    onChange={this.handleChange}
                                    value="true"
                                    type="radio"
                                    name="newAdmin"
                                    id="newAdmin"
                                />

                                <h6>Vanlig användare</h6>
                                <input
                                    onChange={this.handleChange}
                                    value="false"
                                    type="radio"
                                    name="newAdmin"
                                    id="newAdmin"
                                />
                            </div>
                        </FormGroup>
                        <Button color="primary">Ändra</Button>
                        <Button color="secondary" onClick={this.toggle}>Avbryt</Button>
                        </Form>
                    </ModalBody>
                    </Modal>

                    <hr />

                    <div style={{margin: '2em'}}>
                        <h5>Skapa ny användare:</h5>

                        <Form onSubmit={this.createNewUser}>
                        <FormGroup>
                            <Label>Användarnamn: *</Label>
                            <Input 
                                onChange={this.handleChange}
                                value={this.state.username}
                                type="text" 
                                name="username" 
                                id="username" 
                                placeholder="Användarnamn"
                                valid={ this.state.validate.usernameState === 'has-success' }
                                invalid={ this.state.validate.usernameState === 'has-danger' }
                            />
                            <FormFeedback>Behöver vara minst 6 karaktärer</FormFeedback>
                        </FormGroup>

                        <div style={{display: 'flex', }}>
                            <FormGroup>
                                <Label>Förnamn: *</Label>
                                <Input 
                                    onChange={this.handleChange} 
                                    value={this.state.firstname}
                                    type="name"
                                    name="firstname"
                                    id="firstname"
                                    placeholder="Förnamn" 
                                    valid={ this.state.validate.firstnameState === 'has-success' }
                                    invalid={ this.state.validate.firstnameState === 'has-danger' }
                                />
                                <FormFeedback>Behöver vara minst 2 karaktärer</FormFeedback>
                            </FormGroup>
                            
                            <FormGroup>
                                <Label>Efternamn: *</Label>
                                <Input
                                    onChange={this.handleChange} 
                                    value={this.state.lastname}
                                    type="name"
                                    name="lastname" 
                                    id="lastname" 
                                    placeholder="Efternamn" 
                                    valid={ this.state.validate.lastnameState === 'has-success' }
                                    invalid={ this.state.validate.lastnameState === 'has-danger' }
                                />
                                <FormFeedback>Behöver vara minst 2 karaktärer</FormFeedback>
                            </FormGroup>
                        </div>

                        <FormGroup>
                            <Label>Email: *</Label>
                            <Input 
                                onChange={this.handleChange} 
                                value={this.state.email}
                                type="email" 
                                name="email" 
                                id="email" 
                                placeholder="Email" 
                                valid={ this.state.validate.emailState === 'has-success' }
                                invalid={ this.state.validate.emailState === 'has-danger' }
                            />
                            <FormFeedback>Vänligen skriv in en giltig emailadress</FormFeedback>
                        </FormGroup>

                        <FormGroup>
                            <Label>Lösenord: *</Label>
                            <Input 
                                onChange={this.handleChange} 
                                value={this.state.password}
                                type="password" 
                                name="password" 
                                id="password" 
                                placeholder="Lösenord" 
                                valid={ this.state.validate.passwordState === 'has-success' }
                                invalid={ this.state.validate.passwordState === 'has-danger' }
                            />
                            <FormFeedback>Behöver vara minst 6 karaktärer</FormFeedback>
                        </FormGroup>
                        <Button>Skapa</Button>
                    </Form>
                    </div>

                </div>
            );
        }
        
    }
}
 
export default Admin;