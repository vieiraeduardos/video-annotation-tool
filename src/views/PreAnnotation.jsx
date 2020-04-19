
import React, { Component } from "react";
import {
  Grid,
  Row,
  Col,
  Image,
  Modal,
  Button,
  ListGroup

} from "react-bootstrap";

import { Card } from "components/Card/Card.jsx";

import avatar from "assets/img/faces/face-3.jpg";

import axios from 'axios';

import './styles.css';

class PreAnnotation extends Component {
  constructor(props) {
    super(props);
 
    this.state = {
        'persons': [],
        'modalShow': false,
        'code': null
    }
    
    this.handleChangeInput = this.handleChangeInput.bind(this);
    this.callModal = this.callModal.bind(this);
 
  }

  componentDidMount() {
    const instance = axios.create({
      baseURL: 'http://127.0.0.1:5000'
    });
    
  }

  handleChangeInput = async (event) => {
    event.preventDefault();
    
    const name = event.target.value;

    const result = await axios({
      method: 'GET',
      url: "/api/persons/" + name,
      
    })
    .then((response) => {
      this.setState({persons: response.data});
    });

    var lista = document.getElementById("lista");

    console.log(this.state)

    if(this.state.persons.length > 0) {
      lista.innerHTML = "";

      for(var index in this.state.persons) {
        var li = document.createElement('li');
        var text = document.createTextNode(this.state.persons[index][1]);

        li.appendChild(text);

        lista.appendChild(li);
      }
    } else {
      lista.innerHTML = "";
      lista.appendChild(document.createTextNode("Nenhum resultado encontrado!"))
    }

  }

  callModal = () => {
    this.setState({'modalShow': true});
    this.setState({'code': 2});

  }

  render() {

    const list1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((response) => 
      <Image src={avatar} rounded width={60} height={60}/>
    )

    return (
      <div className="content">
        <Grid fluid>
          <Row>
            <Col md={12}>
              <Card
                title="Pré anotação"
                content={
                  <form onSubmit={this.handleSubmit}>
                    
                    <Row>
                      <Col xs={6} md={4}>
                          {list1}
                      </Col>

                      <Col xs={6} md={4}>
                          {list1}
                      </Col>

                      <Col xs={6} md={4}>
                          {list1}
                      </Col>
                    </Row>

                    <Row>
                      <Col xs={6} md={4}>
                        <Button variant="primary" onClick={this.callModal}>
                          Editar
                        </Button>
                      </Col>

                      <Col xs={6} md={4}>
                        <Button variant="primary" onClick={this.callModal}>
                          Editar
                        </Button>
                      </Col>

                      <Col xs={6} md={4}>
                        <Button variant="primary" onClick={this.callModal}>
                          Editar
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

        <Modal
          show={this.state.modalShow}
          onHide={() => this.setState({'modalShow': false})}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Quem está nas fotos?
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              Escolha uma pessoa na lista abaixo que está representado nas fotos.
            </p>

            <input type='text' style={{width: "100%"}} onChange={this.handleChangeInput}/>

            <ul id="lista"></ul>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => this.setState({'modalShow': false})}>Confirmar</Button>
            <Button onClick={() => this.setState({'modalShow': false})}>Cancelar</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default PreAnnotation;