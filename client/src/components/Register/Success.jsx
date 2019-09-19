import React, { Component } from 'react';
import { Link } from 'react-router-dom'

class Success extends Component {
    render() { 
        return ( 
            <div>
                <h2>Nu är du registrerad!</h2>
                <p>För att logga in klicka på: 
                    <Link to="/login">Logga in</Link>
                </p>
            </div>
         );
    }
}

export default Success;