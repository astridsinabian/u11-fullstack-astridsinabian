import axios from 'axios';

export default class AuthService {
    constructor() {
        this.login = this.login.bind(this);
        this.register = this.register.bind(this);
    }

    login = (username, password) => {
        const user = { 
            username: username, 
            password: password
        };

        axios.post('http://localhost:5000/api/user/login', { user })
            .then(res => {
                this.setToken(res.data);
                
            })
            .catch((res) => console.log(res));
        }

    register = (data) => {
        axios({
            method: 'POST',
            url: 'http://localhost:5000/api/user/register',
            data: data,
            config: { 
                headers: {
                    'Content-Type': 'multipart/form-data' 
                    }
                }
            })
        }

    loggedIn = () => {
        const token = this.getToken();
        return !!token;
    }

    setToken = (idToken) => {
        return localStorage.setItem('auth-token', idToken);
    }

    getToken = () => {
        return localStorage.getItem('auth-token');
    }

    logout = () => {
        return localStorage.removeItem('auth-token');
    }
}