
import React, { Component } from "react";
import {
  Grid,
  Row,
  Col,
  Image
} from "react-bootstrap";

import { Card } from "components/Card/Card.jsx";
import Button from "components/CustomButton/CustomButton.jsx";

import avatar from "assets/img/faces/face-3.jpg";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck} from '@fortawesome/free-solid-svg-icons'
import { faTimes} from '@fortawesome/free-solid-svg-icons'


class Verification extends Component {

  constructor(props) {
      super(props);

      this.state = {
          name: "",
          email: ""
      }

      this.handleSubmit = this.handleSubmit.bind(this);
      this.handleChangeName = this.handleChangeName.bind(this);
      this.handleChangeEmail = this.handleChangeEmail.bind(this);
      this.signUp = this.signUp.bind(this);
 
  }

  signUp() {
    const {name, email} = this.state;

    const formData  = new FormData();

    formData.append('name', name);
    formData.append('email', email);

    fetch('http://34.50.159.150/actors', {
      method: 'POST',
      body: formData
     })
  }

  handleChangeName(event) {
    this.setState({name: event.target.value});
  }

  handleChangeEmail(event) {
    this.setState({email: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();

    this.signUp();
  }

  render() {

    const list1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((response) => 
      <Image src={avatar} rounded width={60} height={60}/>
    )


    
    return (
      <div className="content">
        <Grid fluid>
          <Row>
            <Col md={12}>
              <Card
                title="Essas imagens representam a mesma pessoa?"
                content={
                  <form onSubmit={this.handleSubmit}>
                    
                    <Row>
                      <Col xs={6} md={12}>
                          {list1}
                          {list1}
                          {list1}
                          {list1}
                          {list1}
                          {list1}
                          {list1}
                          {list1}
                          {list1}
                      </Col>
                    </Row>

                    
                    <Row>
                        <Col md={5}>
                          <Button bsStyle="success" pullRight fill type="submit">
                              Aceitar
                              <FontAwesomeIcon icon={faCheck} />
                          </Button>
                          
                        </Col>
                        <Col md={2}>
                        <Button bsStyle="danger" pullRight fill type="submit">
                              Negar
                            <FontAwesomeIcon icon={faTimes} />
                        </Button>
                        </Col>
                    </Row>
                    <div className="clearfix" />
                  </form>
                }
              />
            </Col>
            
          </Row>
        </Grid>
      </div>
    );
  }
}

export default Verification;