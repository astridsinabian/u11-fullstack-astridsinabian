import React, { Component } from "react";
import AuthService from "./AuthService";
import { Redirect } from "react-router-dom";
import axios from "axios";
import {
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Label,
  Input,
  FormFeedback,
  Spinner
} from "reactstrap";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const AdminDashboard = styled.div`
  @import url("https://fonts.googleapis.com/css?family=Montserrat&display=swap");
  font-family: "Montserrat", sans-serif;

  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 70px;
  font-size: 12px;
`;

const Title = styled.h3`
  display: flex;
  justify-content: center;
  font-size: 26px;
`;

const Users = styled.div`
  border: 1px dotted lightgray;
  border-radius: 12px;
  margin: 20px 50px;
  padding: 10px;
  width: 500px;

  @media (min-width: 320px) and (max-width: 480px) {
    margin: 10px 15px;
    width: 300px;
  }
`;

const NameButtons = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Name = styled.h6`
  text-transform: capitalize;
  font-weight: bold;
  padding: 0 5px;
`;

const UserTitle = styled.span`
  padding: 5px;
  font-weight: 600;
`;

const StyledButtonEdit = styled.button`
  background-color: #61b2ff;
  border-radius: 12px;
  border: 1px solid #61b2ff;
  color: white;
  padding: 4px 7px 4px 8px;

  &:hover {
    background-color: #75bcff;
    border: 1px solid #75bcff;
  }
`;

const StyledButtonDelete = styled.button`
  background-color: #e52855;
  border-radius: 12px;
  border: 1px solid #e52855;
  color: white;
  padding: 4px 7px 4px 8px;
  font-weight: bold;

  &:hover {
    background-color: #f7446f;
    border: 1px solid #f7446f;
  }
`;

const StyledButtonCancel = styled.button`
  background-color: #afafaf;
  border-radius: 12px;
  border: 1px solid #afafaf;
  color: white;
  font-size: 14px;
  font-weight: bold;
  padding: 5px 7px 5px 8px;
  margin-left: 3px;

  &:hover {
    background-color: #c3c3c3;
    border: 1px solid #c3c3c3;
  }
`;

const ButtonsEditCancel = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const StyledModal = styled(Modal)`
  @import url("https://fonts.googleapis.com/css?family=Montserrat&display=swap");
  font-family: "Montserrat", sans-serif;
`;

const TitleModal = styled.span`
  font-size: 18px;
  font-weight: bold;
`;

const StyledRole = styled.div`
  display: flex;
`;

const TitleRole = styled.h6`
  font-size: 12px;
  padding: 5px 0;
`;

const StyledInput = styled.input`
  margin: 5px;
`;

const NewUser = styled.div`
  margin: 0px 55px 60px 55px;
  width: 500px;

  @media (min-width: 320px) and (max-width: 480px) {
    margin: 0px 20px 60px 20px;
    width: 300px;
  }
`;

const TitleCreateNewUser = styled.h6`
  display: flex;
  justify-content: center;
  font-size: 20px;
`;

const StyledForm = styled(Form)`
  margin: 15px 0;
`;

const StyledButtonCreate = styled.button`
  float: right;
  background-color: #afafaf;
  border-radius: 12px;
  border: 1px solid #afafaf;
  color: white;
  font-size: 14px;
  font-weight: bold;
  padding: 5px 7px 5px 8px;
  margin-left: 3px;

  &:hover {
    background-color: #c3c3c3;
    border: 1px solid #c3c3c3;
  }
`;

const ErrorMessage = styled.div`
  color: red;
  font-size: 10px;
  font-weight: bold;
`;

const Loading = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 130px;
`;

class Admin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: [],
      modal: false,
      username: "",
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      validate: {
        usernameState: "",
        firstnameState: "",
        lastnameState: "",
        emailState: "",
        passwordState: ""
      },
      errorEmail: false,
      errorUsername: false,
      loading: true
    };

    this._isMounted = false;
    this.toggle = this.toggle.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.createNewUser = this.createNewUser.bind(this);
    this.Auth = new AuthService();
    this.register = this.register.bind(this);
  }

  onSubmit(e) {
    e.preventDefault(e);

    this.editUser(
      this.state.newFirstname,
      this.state.newLastname,
      this.state.newEmail,
      this.newAdmin
    );

    this.setState({
      modal: false
    });

    this.getUsers();
  }

  createNewUser(e) {
    e.preventDefault(e);

    if (
      Object.values(this.state.validate).every(item => item === "has-success")
    ) {
      const user = {
        username: this.state.username,
        firstname: this.state.firstname,
        lastname: this.state.lastname,
        email: this.state.email,
        password: this.state.password
      };

      this.register(user);

      this.setState({
        username: "",
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        validate: {
          usernameState: "",
          firstnameState: "",
          lastnameState: "",
          emailState: "",
          passwordState: ""
        },
        errorEmail: false,
        errorUsername: false
      });
    } else {
      return;
    }

    this.getUsers();
  }

  register = data => {
    axios.post("/api/user/register", data).catch(error => {
      if (error.response.data === "Email already exists") {
        this.setState({
          errorEmail: true
        });
      }
      if (error.response.data === "Username already exists") {
        this.setState({
          errorUsername: true
        });
      }
    });
  };

  handleChange(e) {
    const { validate } = this.state;
    this.setState({
      [e.target.name]: e.target.value
    });

    switch (e.target.name) {
      case "username":
        if (e.target.value.length >= 6) {
          validate.usernameState = "has-success";
        } else {
          validate.usernameState = "has-danger";
        }
        break;
      case "firstname":
        if (e.target.value.length >= 2) {
          validate.firstnameState = "has-success";
        } else {
          validate.firstnameState = "has-danger";
        }
        break;
      case "lastname":
        if (e.target.value.length >= 2) {
          validate.lastnameState = "has-success";
        } else {
          validate.lastnameState = "has-danger";
        }
        break;
      case "email":
        if (emailRex.test(e.target.value)) {
          validate.emailState = "has-success";
        } else {
          validate.emailState = "has-danger";
        }
        break;
      case "password":
        if (e.target.value.length >= 6) {
          validate.passwordState = "has-success";
        } else {
          validate.passwordState = "has-danger";
        }
        break;
    }

    this.setState({ validate });
  }

  toggle(e) {
    e.preventDefault(e);
    this.setState(prevState => ({
      modal: !prevState.modal
    }));

    if (e.target.value === undefined) {
      return;
    } else {
      const valueToSplit = e.target.value;
      const split = valueToSplit.split("/", 5);
      let newFirstname = split[0];
      let newLastname = split[1];
      let newEmail = split[2];
      let id = split[3];
      let admin = split[4];

      if (admin === undefined) {
        return;
      } else {
        let newAdmin = admin.trim();

        this.setState({
          id: id,
          newFirstname: newFirstname,
          newLastname: newLastname,
          newEmail: newEmail,
          newAdmin: newAdmin
        });
      }
    }
  }

  async getUsers() {
    let token = this.Auth.getToken();
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: token
      }
    };

    const res = await axios.get(
      "/api/admin/users",
      config
    );

    try {
      this.setState({
        users: res.data,
        loading: false
      });
    } catch (error) {
      this.setState({
        loading: false
      });

      if (error.response.data.message === "jwt expired") {
        this.Auth.logout();
        this.props.history.replace("/login");
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
    };

    axios.patch("/api/admin/editUser", { user });
  };

  deleteUser = e => {
    e.preventDefault();
    const id = e.target.value.trim();

    axios.delete(`/api/admin/deleteUser/${id}`);

    this.getUsers();
  };

  componentDidMount() {
    this.getUsers();
  }

  render() {
    const { errorUsername, errorEmail, loading } = this.state;

    if (this.Auth.isAdmin() === "false") {
      return <Redirect to="/profile" />;
    } else if (this.Auth.isAdmin() === "true") {
      if (loading) {
        return <Loading><Spinner type="grow" color="secondary" /></Loading>;
      } else {
        return (
          <AdminDashboard>
            <Title>Översikt</Title>
            <div>
              {this.state.users.map((user, key) => {
                const role = user.admin ? "Admin" : "Vanlig användare";

                return (
                  <Users key={user._id}>
                    <NameButtons>
                      <Name>
                        {user.firstname} {user.lastname}
                      </Name>
                      <div>
                        <StyledButtonEdit
                          onClick={this.toggle}
                          value={
                            user.firstname +
                            " / " +
                            user.lastname +
                            " / " +
                            user.email +
                            " / " +
                            user._id +
                            " / " +
                            user.admin
                          }
                        >
                          ✎
                        </StyledButtonEdit>
                        <StyledButtonDelete
                          onClick={this.deleteUser}
                          value={user._id}
                        >
                          X
                        </StyledButtonDelete>
                      </div>
                    </NameButtons>
                    <div>
                      <div>
                        <UserTitle>Användarnamn:</UserTitle>
                        <span>{user.username}</span>
                      </div>
                      <div>
                        <UserTitle>Email:</UserTitle>
                        <span>{user.email}</span>
                      </div>
                      <div>
                        <UserTitle>Roll:</UserTitle>
                        <span>{role}</span>
                      </div>
                    </div>
                  </Users>
                );
              })}
            </div>

            <StyledModal isOpen={this.state.modal} toggle={this.toggle}>
              <ModalHeader toggle={this.toggle}>
                <TitleModal>
                  Ändra {this.state.newFirstname}'s uppgifter
                </TitleModal>
              </ModalHeader>
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

                    <StyledRole>
                      <TitleRole>Admin</TitleRole>
                      <StyledInput
                        onChange={this.handleChange}
                        value="true"
                        type="radio"
                        name="newAdmin"
                        id="newAdmin"
                      />

                      <TitleRole>Vanlig användare</TitleRole>
                      <StyledInput
                        onChange={this.handleChange}
                        value="false"
                        type="radio"
                        name="newAdmin"
                        id="newAdmin"
                      />
                    </StyledRole>
                  </FormGroup>
                  <ButtonsEditCancel>
                    <StyledButtonEdit>
                      <FontAwesomeIcon icon="check" />
                    </StyledButtonEdit>
                    <StyledButtonCancel onClick={this.toggle}>
                      AVBRYT
                    </StyledButtonCancel>
                  </ButtonsEditCancel>
                </Form>
              </ModalBody>
            </StyledModal>

            <hr />

            <NewUser>
              <TitleCreateNewUser>Skapa ny användare</TitleCreateNewUser>

              <StyledForm onSubmit={this.createNewUser}>
                <FormGroup>
                  <Input
                    onChange={this.handleChange}
                    value={this.state.username}
                    type="text"
                    name="username"
                    id="username"
                    placeholder="Användarnamn"
                    valid={this.state.validate.usernameState === "has-success"}
                    invalid={this.state.validate.usernameState === "has-danger"}
                  />
                  <FormFeedback>Behöver vara minst 6 karaktärer</FormFeedback>
                  <ErrorMessage>
                    {errorUsername ? "Användarnamn finns redan" : null}
                  </ErrorMessage>
                </FormGroup>

                <div style={{ display: "flex" }}>
                  <FormGroup>
                    <Input
                      onChange={this.handleChange}
                      value={this.state.firstname}
                      type="name"
                      name="firstname"
                      id="firstname"
                      placeholder="Förnamn"
                      valid={
                        this.state.validate.firstnameState === "has-success"
                      }
                      invalid={
                        this.state.validate.firstnameState === "has-danger"
                      }
                    />
                    <FormFeedback>Behöver vara minst 2 karaktärer</FormFeedback>
                  </FormGroup>

                  <FormGroup>
                    <Input
                      onChange={this.handleChange}
                      value={this.state.lastname}
                      type="name"
                      name="lastname"
                      id="lastname"
                      placeholder="Efternamn"
                      valid={
                        this.state.validate.lastnameState === "has-success"
                      }
                      invalid={
                        this.state.validate.lastnameState === "has-danger"
                      }
                    />
                    <FormFeedback>Behöver vara minst 2 karaktärer</FormFeedback>
                  </FormGroup>
                </div>

                <FormGroup>
                  <Input
                    onChange={this.handleChange}
                    value={this.state.email}
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Email"
                    valid={this.state.validate.emailState === "has-success"}
                    invalid={this.state.validate.emailState === "has-danger"}
                  />
                  <ErrorMessage>
                    {errorEmail ? "Email finns redan" : null}
                  </ErrorMessage>
                  <FormFeedback>
                    Vänligen skriv in en giltig emailadress
                  </FormFeedback>
                </FormGroup>

                <FormGroup>
                  <Input
                    onChange={this.handleChange}
                    value={this.state.password}
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Lösenord"
                    valid={this.state.validate.passwordState === "has-success"}
                    invalid={this.state.validate.passwordState === "has-danger"}
                  />
                  <FormFeedback>Behöver vara minst 6 karaktärer</FormFeedback>
                </FormGroup>
                <StyledButtonCreate>Skapa</StyledButtonCreate>
              </StyledForm>
            </NewUser>
          </AdminDashboard>
        );
      }
    }
  }
}

export default Admin;
