
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

import { Table } from "react-bootstrap";

import Card from "components/Card/Card.jsx";

import axios from 'axios';

import './styles.css';

class PreAnnotation extends Component {
  constructor(props) {
    super(props);
 
    this.state = {
        'persons': [],
        'modalShow': false,
        'code': null,
        'video_code': 11,
        'annotations': [],
        'avatar': null,
        'photos': [],
        'options': null,
        'option': null
    }
    
    this.handleChangeInput = this.handleChangeInput.bind(this);
    this.loadModal = this.loadModal.bind(this);
 
  }

  isInside(photos, code) {
    for(var i in photos) {
      if(photos[i]["actor"] == code) {
        return i
      }
    }

    return 999
  }

  async componentDidMount() {
    const instance = axios.create({
      baseURL: 'http://127.0.0.1:5000'
    });

    await axios({
      method: 'GET',
      url: "/api/annotations/"  
    })
    .then((response) => {
      this.setState({'annotations': response.data});
    });

    await axios({
      method: 'GET',
      url: "/api/image/",
      responseType: 'arraybuffer',
    })
    .then((response) => {
      const base64 = btoa(
        new Uint8Array(response.data).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          '',
        ),
      );
      this.setState({ 'avatar': "data:;base64," + base64 });
    });

    /** Pegando lista de fotos segundo as anotações */
    const annotations = this.state.annotations;

    for (var i in annotations) {
      const formData = new FormData()

      formData.append('path', annotations[i][8])

      await axios({
        method: 'POST',
        url: "/api/image/",
        data: formData,
        responseType: 'arraybuffer',
      })
      .then((response) => {
        const base64 = btoa(
          new Uint8Array(response.data).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            '',
          ),
        );

        var photos = this.state.photos;
        var actor = annotations[i][2];

        var result = this.isInside(photos, actor);

        if(result == 999) {
          photos.push({actor: actor, photos: [{'source': "data:;base64," + base64}]})

          this.setState({photos: photos}) 
        } else {
          photos[result]['photos'].push({'source': "data:;base64," + base64});

          this.setState({photos: photos});
        }
        
      });
    }
    
  }

  /** Escolhe uma opção na lista */
  chooseOption(code) {
    this.setState({"option": code});
    
  }

  /** Pesquisa no DB nomes de pessoas */
  handleChangeInput = async (event) => {
    event.preventDefault();
    /** q guarda o nome da pessoa pesquisada no DB */
    const q = event.target.value;

    await axios({
      method: 'GET',
      url: "/api/persons/" + q
    })
    .then((response) => {
      this.setState({persons: response.data});
    });

    /** Listando opções de pessoas na pesquisa */
    const persons = this.state.persons;

    var options = <p>Nenhum resultado encontrado!</p>

    /** Se existir correspondência na pesquisa, mostra as opções */
    if(persons.length > 0) {
      
      options = persons.map((person) => 
        <li onClick={() => this.chooseOption(person[0])}>{person[1]}</li>
      )
    }

    this.setState({'options': options})
  }

  loadModal = (actor) => {
    this.setState({'modalShow': true});
    this.setState({'code': actor});

  }

  getPhotos() {
    var photos = this.state.photos;
    var count = [];

    for(var i in photos) {
      count.push(i);
    }

    const listaDeImagens = count.map((index) =>

    <Col md={12}>
      <Card
        title=""
        content={
          <form onSubmit={this.handleSubmit}>

            <Row>
              <Col xs={12} md={12}>
                {photos[index].photos.map((source) => 
                  <Image src={source.source} rounded width={60} height={60}/>
                )}        
              </Col>
            </Row>
            
            <Row>
              <Col xs={6} md={4}>
                <Button variant="primary" onClick={() => this.loadModal(photos[index].actor)}>
                  Editar
                </Button>
              </Col>
            </Row>
            
            <div className="clearfix" />
          </form>
        }
      />
    </Col>
    )

    return listaDeImagens;
  }

  render() {

    const thArray = ["ID", "Video", "Ator", "X", "Y", "W", "H", "Tempo", "Caminho"];
    
    const tdArray = this.state.annotations;

    const listaDeFaces = this.getPhotos();
    const listaDeOpcoes = this.state.options;

    return (
      <div className="content">
        <Grid fluid>
          <Row>

            {listaDeFaces}

            <Col md={12}>
              <Card
                title="Lista de Anotações"
                category="Lista de anotações do vídeo X"
                ctTableFullWidth
                ctTableResponsive
                content={
                  <Table striped hover>
                    <thead>
                      <tr>
                        {thArray.map((prop, key) => {
                          return <th key={key}>{prop}</th>;
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {tdArray.map((prop, key) => {
                        return (
                          <tr key={key}>
                            {prop.map((prop, key) => {
                              return <td key={key}>{prop}</td>;
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
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

            <ul id="lista">
              { listaDeOpcoes }
            </ul>
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