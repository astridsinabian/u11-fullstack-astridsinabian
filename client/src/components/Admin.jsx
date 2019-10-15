import React, { Component } from 'react';
import AuthService from './AuthService';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import { Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input, CustomInput} from 'reactstrap';

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
            password: ''
        };

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

        const user = {  
            username: this.state.username,
            firstname: this.state.firstname,
            lastname: this.state.lastname,
            email: this.state.email,
            password: this.state.password
        }
        
        this.Auth.register(user);
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
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
        const res = await axios.get('http://localhost:5000/api/admin/users');
            this.setState({
                users: res.data
            })
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
        this.getUsers();
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
                            <Label>Förnamn</Label>
                            <Input
                                onChange={this.handleChange}
                                value={this.state.newFirstname}
                                type="text"
                                name="newFirstname"
                                id="newFirstname"
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label>Efternamn</Label>
                            <Input
                                onChange={this.handleChange}
                                value={this.state.newLastname}
                                type="text"
                                name="newLastname"
                                id="newLastname"
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label>Email</Label>
                            <Input
                                onChange={this.handleChange}
                                value={this.state.newEmail}
                                type="text"
                                name="newEmail"
                                id="newEmail"
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label>Ändra roll:</Label>
                            
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
                            <Label>Användarnamn</Label>
                            <Input 
                                onChange={this.handleChange}
                                value={this.state.username}
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
                                    onChange={this.handleChange} 
                                    value={this.state.firstname}
                                    type="name"
                                    name="firstname"
                                    id="firstname"
                                    placeholder="Förnamn" 
                                />
                            </FormGroup>
                            
                            <FormGroup>
                                <Label>Efternamn</Label>
                                <Input
                                    onChange={this.handleChange} 
                                    value={this.state.lastname}
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
                                onChange={this.handleChange} 
                                value={this.state.email}
                                type="email" 
                                name="email" 
                                id="email" 
                                placeholder="Email" 
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label>Lösenord</Label>
                            <Input 
                                onChange={this.handleChange} 
                                value={this.state.password}
                                type="password" 
                                name="password" 
                                id="password" 
                                placeholder="Lösenord" 
                            />
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