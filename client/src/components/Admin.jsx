import React, { Component } from 'react';
import AuthService from './AuthService';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import { Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input } from 'reactstrap';

class Admin extends Component {

    constructor(props) {
        super(props);

        this.state = {
            users: [],
            modal: false,
            firstname: '',
            lastname: '',
            email: '',
            admin: ''
        };

        this.toggle = this.toggle.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.Auth = new AuthService();
    }

    onSubmit(e) {
        e.preventDefault(e);
        this.editUser(this.state.newFirstname, this.state.newLastname, this.state.newEmail);
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

        const valueToSplit = e.target.value;
        const split = valueToSplit.split('/', 4);
        let newFirstname = split[0];
        let newLastname = split[1];
        let newEmail = split[2];
        let id = split[3];

        this.setState({
            id: id,
            newFirstname: newFirstname,
            newLastname: newLastname,
            newEmail: newEmail
        })
    }

    getUsers = () => {
        axios.get('http://localhost:5000/api/admin/users')
            .then(res => this.setState({
                users: res.data
            }))
            .catch(err => console.log(err));
    }

    editUser = () => {
        let _id = this.state.id.trim();

        const user = { 
            _id: _id,
            firstname: this.state.newFirstname,
            lastname: this.state.newLastname,
            email: this.state.newEmail,
            }

        axios.patch('http://localhost:5000/api/admin/editUser', { user });
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
                            user.admin === true ?
                            "Admin" : "Vanlig användare"
                        );

                        return <div style={{margin: '2em'}} key={user._id}>
                        {user.firstname} {user.lastname} <Button color="primary" onClick={this.toggle} value={user.firstname + ' / ' + user.lastname + ' / ' + user.email + ' / ' + user._id}>Ändra</Button>
                        
                        <div>
                            <div><strong>Användarnamn: </strong>{user.username}</div>
                            <div><strong>Email:</strong>{user.email}</div>
                            <div><strong>Roll:</strong> {role}</div>
                        </div>
                        
                    </div>
                    })}
                    </div>

                    
                    <Modal isOpen={this.state.modal} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}>Ändra X uppgifter</ModalHeader>
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
                        <Button color="primary">Ändra</Button>
                        <Button color="secondary" onClick={this.toggle}>Avbryt</Button>
                        </Form>
                    </ModalBody>
                    </Modal>

                </div>
            );
        }
        
    }
}
 
export default Admin;