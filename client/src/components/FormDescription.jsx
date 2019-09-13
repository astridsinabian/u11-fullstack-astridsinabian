import React, { Component } from 'react';
import { FormGroup, Input, Button } from 'reactstrap';

export class FormDescription extends Component {
    continue = e => {
        e.preventDefault();
        debugger;
        this.props.nextStep();
    }

    back = e => {
        e.preventDefault();
        this.props.prevStep();
    }

    render() { 
        const { values, onChange } = this.props;
        return ( 
        <div>
            <h2>Berätta kort om dig själv</h2>
            
            <FormGroup row>
                <Input 
                    onChange={onChange('description')} 
                    value={values.description}
                    type="textarea" 
                    name="description" 
                    id="description" 
                />
            </FormGroup>

            <Button onClick={this.back}>Tillbaka</Button>
            <Button onClick={this.continue}>Nästa</Button>
            </div>
        );
    }
}
 
export default FormDescription;