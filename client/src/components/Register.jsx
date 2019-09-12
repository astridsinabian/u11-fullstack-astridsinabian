import React, { Component } from 'react';
import { 
    Button, 
    Form, 
    FormGroup, 
    Label, 
    Input, 
    TabContent, 
    TabPane, 
    Nav, 
    NavItem, 
    NavLink
} from 'reactstrap';
import AuthService from './AuthService';
import {  } from 'reactstrap';
import classnames from 'classnames';
import styled from 'styled-components';

const RegisterWrapper = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: column;
    margin: 0 30%;
`;

const NavItemStyled = styled(NavItem)`
    cursor: pointer;
`;

const NavLinkStyled = styled(NavLink)`
    cursor: pointer;
    border: 1px solid pink;
    width: 80px;
    text-align: center;
    
    &:hover {
        background-color: lightgray;
    }
`;

const TabContentStyled = styled(TabContent)`
    padding: 40px 20px 20px 20px;
`;

class Register extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            firstname: '',
            lastname: '',
            email: '',
            password: '',
            activeTab: '1'
        }

        this.toggle = this.toggle.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.Auth = new AuthService();
        
    }

    toggle = (tab) => {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }

    onChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    onSubmit(e) {
        e.preventDefault();
        this.Auth.register(this.state);
        this.props.history.replace('/profile');
    }

    render() { 
        return ( 
            <div>
                <h2 style={{display: 'flex', justifyContent: 'center', margin: '30px'}}>Join Twitter-Clone Today</h2>
                <RegisterWrapper>

                <Nav tabs>
                    <NavItemStyled>
                        <NavLink 
                        className={classnames({ active: this.state.activeTab === '1' })}
                        onClick={() => { this.toggle('1'); }}
                        >
                        Kontaktuppgifter
                        </NavLink>
                    </NavItemStyled>
                    <NavItemStyled>
                        <NavLink
                            className={classnames({ active: this.state.activeTab === '2' })}
                            onClick={() => { this.toggle('2'); }}
                        >
                        Profilbild
                        </NavLink>
                    </NavItemStyled>
                    <NavItemStyled>
                        <NavLink
                            className={classnames({ active: this.state.activeTab === '3' })}
                            onClick={() => { this.toggle('3'); }}
                        >
                        Beskriv dig själv
                        </NavLink>
                    </NavItemStyled>
                    <NavItemStyled>
                        <NavLink
                            className={classnames({ active: this.state.activeTab === '4' })}
                            onClick={() => { this.toggle('4'); }}
                        >
                        Intressen
                        </NavLink>
                    </NavItemStyled>
                    <NavItemStyled>
                        <NavLink
                            className={classnames({ active: this.state.activeTab === '5' })}
                            onClick={() => { this.toggle('5'); }}
                        >
                        Upptäck konton
                        </NavLink>
                    </NavItemStyled>
                </Nav>

                <Form onSubmit={this.onSubmit}>
                <TabContentStyled activeTab={this.state.activeTab}>
                    <TabPane tabId="1">
                            <FormGroup>
                                <Label>Username</Label>
                                <Input 
                                    onChange={this.onChange} 
                                    value={this.state.username}
                                    type="text" 
                                    name="username" 
                                    id="username" 
                                    placeholder="Username"
                                />
                            </FormGroup>

                            <FormGroup>
                            <Label>First name</Label>
                            <Input 
                                onChange={this.onChange} 
                                value={this.state.firstname}
                                type="name"
                                name="firstname"
                                id="firstname"
                                placeholder="First name" 
                            />
                            </FormGroup>

                            <FormGroup>
                                <Label>Last name</Label>
                                <Input
                                    onChange={this.onChange} 
                                    value={this.state.lastname}
                                    type="name"
                                    name="lastname" 
                                    id="lastname" 
                                    placeholder="Last name" 
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label>Email</Label>
                                <Input 
                                    onChange={this.onChange} 
                                    value={this.state.email}
                                    type="email" 
                                    name="email" 
                                    id="email" 
                                    placeholder="Email" 
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label>Password</Label>
                                <Input 
                                    onChange={this.onChange} 
                                    value={this.state.password}
                                    type="password" 
                                    name="password" 
                                    id="password" 
                                    placeholder="Password" 
                                />
                            </FormGroup>
                            <NavLinkStyled onClick={() => { this.toggle('2'); }}>Nästa</NavLinkStyled>
                    </TabPane>
                </TabContentStyled>

                <TabContent activeTab={this.state.activeTab}>
                    <TabPane tabId="2">
                        <h4>Tab 2 content</h4>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Est, beatae maiores omnis nihil illo tempore perferendis. Eum aspernatur enim aperiam beatae voluptatum alias est nemo minus? Praesentium blanditiis molestiae aliquam?</p>

                        <NavLinkStyled onClick={() => { this.toggle('3'); }}>Nästa</NavLinkStyled>
                    </TabPane>
                </TabContent>

                <TabContent activeTab={this.state.activeTab}>
                    <TabPane tabId="3">
                        <h4>Tab 3 content</h4>
                        <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eius, commodi enim voluptatem tempora ducimus deserunt nostrum atque placeat, sint quae fugiat quia animi sed, officiis nihil nam accusamus beatae velit.</p>

                        <NavLinkStyled onClick={() => { this.toggle('4'); }}>Nästa</NavLinkStyled>
                    </TabPane>
                </TabContent>

                <TabContent activeTab={this.state.activeTab}>
                    <TabPane tabId="4">
                        <h4>Tab 4 content</h4>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum perspiciatis itaque blanditiis consequatur alias est et, magni quod eligendi voluptates officia fugiat quibusdam, distinctio voluptatibus veritatis cupiditate natus laudantium sit?</p>

                        <NavLinkStyled onClick={() => { this.toggle('5'); }}>Nästa</NavLinkStyled>
                    </TabPane>
                </TabContent>

                <TabContent activeTab={this.state.activeTab}>
                    <TabPane tabId="5">
                        <Button>Färdig!</Button>
                    </TabPane>
                </TabContent>
                </Form>
                </RegisterWrapper>
            </div>
         );
    }
}

export default Register;