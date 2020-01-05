import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './App.css';
import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.min.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { 
    faUser, 
    faLock, 
    faExclamationCircle, 
    faSearch,
    faSignOutAlt
} from '@fortawesome/free-solid-svg-icons';

library.add(faUser, faLock, faExclamationCircle, faSearch, faSignOutAlt)

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
