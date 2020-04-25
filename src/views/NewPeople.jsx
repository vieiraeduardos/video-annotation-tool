
import React, { Component } from "react";
import {
  Grid,
  Row,
  Col,
  FormGroup,
  ControlLabel,
  FormControl,
  Alert
} from "react-bootstrap";

import { Card } from "components/Card/Card.jsx";
import { FormInputs } from "components/FormInputs/FormInputs.jsx";
import { UserCard } from "components/UserCard/UserCard.jsx";
import Button from "components/CustomButton/CustomButton.jsx";

import avatar from "assets/img/faces/face-3.jpg";

class NewPeople extends Component {

  constructor(props) {
      super(props);

      this.state = {
          name: "",
          email: "",
          'showMessage': false
      }

      this.handleSubmit = this.handleSubmit.bind(this);
      this.handleChangeName = this.handleChangeName.bind(this);
      this.handleChangeEmail = this.handleChangeEmail.bind(this);
      this.signUp = this.signUp.bind(this);
 
  }

  async signUp() {
    const {name, email} = this.state;

    const formData  = new FormData();

    formData.append('name', name);
    formData.append('email', email);

    const result = await fetch('http://127.0.0.1:5000/api/persons/', {
        method: 'POST',
        body: formData,
    }).then((data) => {
      this.setState({"showMessage": true})
    });
 
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

  showMessage() {
    console.log(this.state.showMessage)
    if(this.state.showMessage) {
      return (
        <Col lg={12} md={12}>
          <Alert variant={"danger"}>
            Ator criado com sucesso!
          </Alert>
        </Col>
      );
    } 

    return (<div></div>)
  }

  render() {

    const m = this.showMessage();

    return (
      <div className="content">
        <Grid fluid>
          <Row>
            {m}
            <Col md={12}>

              <Card
                title="Cadastrar novo ator"
                content={
                  <form onSubmit={this.handleSubmit}>
                    <FormInputs
                      ncols={["col-md-6", "col-md-6"]}
                      properties={[
                        
                        {
                          label: "Nome Completo",
                          type: "text",
                          bsClass: "form-control",
                          placeholder: "Jane Doe",
                          onChange: this.handleChangeName
                        },
                        {
                          label: "E-mail",
                          type: "email",
                          bsClass: "form-control",
                          placeholder: "janedoe@example.com",
                          onChange: this.handleChangeEmail
                        }
                      ]}
                    />
                    

                    
                    <Button bsStyle="info" pullRight fill type="submit">
                      Cadastrar
                    </Button>
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

export default NewPeople;