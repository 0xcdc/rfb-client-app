/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, {Component} from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './ClientDetailForm.css';
import { Col, ControlLabel, Form, FormGroup, FormControl } from 'react-bootstrap';

class ClientDetailForm extends Component {
  constructor({client}) {
    super();
    this.state = client
  }

  render() {
    return (
      <Form horizontal>

        <FormGroup controlId="formHorizontalFirstName">
          <Col componentClass={ControlLabel} sm={2}>
            First Name
          </Col>
          <Col sm={10}>
            <FormControl type="text" placeholder="Enter first name" value={this.state.firstName} />
          </Col>
        </FormGroup>

        <FormGroup controlId="formHorizontalLastName">
          <Col componentClass={ControlLabel} sm={2}>
            Last Name
          </Col>
          <Col sm={10}>
            <FormControl type="text" placeholder="Enter last name" value={this.state.lastName} />
          </Col>
        </FormGroup>

        {JSON.stringify(this.state)}
      </Form>
    );
  }
}

export default withStyles(s)(ClientDetailForm);

