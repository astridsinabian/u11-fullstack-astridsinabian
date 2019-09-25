import React, { Component } from 'react';
import { Form, FormGroup, Label, Input, Button } from 'reactstrap';

class AddTweet extends Component {

    constructor(props) {
        super(props);

        this.state = {
            tweet: ''
        }

        this.handleChange = this.handleChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onSubmit(e) {
        e.preventDefault();
        console.log("Post tweet to user")
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    render() { 
        return ( 
            <div>
                <h1>Twittra här</h1>

                <Form onSubmit={this.onSubmit}>
                    <FormGroup>
                            <Input 
                            onChange={this.handleChange}
                            value={this.state.tweet}
                            type="textarea"
                            name="tweet"
                            placeholder="Vad har du för tankar just nu?"
                            />
                        <Button>Publicera</Button>
                    </FormGroup>
                </Form>
            </div>
         );
    }
}
 
export default AddTweet;