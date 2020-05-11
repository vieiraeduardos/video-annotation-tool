
import React, { Component } from "react";
import {
  Grid,
  Row,
  Col,
  Image,
  Modal,
  Button,
  Table,
  Alert

} from "react-bootstrap";

import Card from "components/Card/Card.jsx";

import axios from 'axios';

import './styles.css';

import avatar from '../assets/img/default-avatar.png';

class PreAnnotation extends Component {
  constructor(props) {
    super(props);
 
    this.state = {
        'persons': [],
        'modalShow': false,
        'code': null,
        'video_code': 16,
        'annotations': [],
        'photos': [],
        'options': null,
        'option': null,
        'name': "",
        'showMessage': false,
        'value': 'select',
        'videoOptions': (<option></option>),
        'tags': ""
    }
    
    this.handleChangeInput = this.handleChangeInput.bind(this);
    this.loadModal = this.loadModal.bind(this);
    this.confirm = this.confirm.bind(this);
    this.getPhotos = this.getPhotos.bind(this);
    this.change = this.change.bind(this);
 
  }

  isInside(photos, code) {
    for(var i in photos) {
      if(photos[i]["actor"] === code) {
        return i
      }
    }

    return 999
  }

  async getImage(i, annotations) {
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

        if(result === 999) {
          photos.push({actor: actor, photos: [{'source': "data:;base64," + base64}], name: annotations[i][10]})

          this.setState({photos: photos}) 
        } else {
          photos[result]['photos'].push({'source': "data:;base64," + base64});

          this.setState({photos: photos});
        }
        
      });

  }

  async componentDidMount() {
    /** Definindo URL da API */
    axios.create({
      baseURL: 'http://127.0.0.1:5000'
    });

    let formData = new FormData();

    formData.append('video', this.state.video_code);

    console.log(formData);

    await axios({
      method: 'POST',
      url: "/api/annotations/",
      data: formData
    })
    .then((response) => {
      this.setState({'annotations': response.data});
    });

    /** Pegando lista de fotos segundo as anotações */
    const annotations = this.state.annotations;

    for (var i in annotations) {
      this.getImage(i, annotations)
    }
    
    this.loadVideoOptions();
  }

  /** Escolhe uma opção na lista */
  chooseOption(person) {
    this.setState({"option": person[0]});
    this.setState({"name": person[1]});
    
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
        <li onClick={() => this.chooseOption(person)}>{person[1]}</li>
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
              <Col xs={12} md={12}>
                <Button variant="primary" onClick={() => this.loadModal(photos[index].actor)}>
                  Anotar
                </Button>

                <img style={{width: "30px", heigh: "30px", borderRadius: "50%", marginLeft: "auto"}} src={avatar} alt="loading..."/>

                <span>{photos[index].name}</span>
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

  async confirm() {
    const option = this.state.option;
    const actor = this.state.code;

    console.log("OPTION: " + option);
    console.log("ACTOR: " + actor);

    var formData = new FormData();

    formData.append("option", option);
    formData.append("actor", actor);

    /** Atualiza pessoa no conjunto de imagens */
    await axios({
      method: 'PUT',
      url: "/api/actors/",
      data: formData
    })
    .then((response) => {
      this.setState({'modalShow': false});

      this.setState({'showMessage': true});


    })
  }

  showMessage() {
    console.log(this.state.showMessage)
    if(this.state.showMessage) {
      return (
        <Col lg={12} md={12}>
          <Alert variant={"danger"}>
            Anotação realizada com sucesso!
          </Alert>
        </Col>
      );
    } 

    return (<div></div>)
  }

  change(event) {
      this.setState({value: event.target.value});

      this.setState({'photos': []})

      this.componentDidMount();
  }

  loadVideoOptions = async () => {

    await axios({
      method: 'GET',
      url: "/api/videos/"
    })
    .then(({data}) => {

    const videoOptions = data.map((video) => 
      <option value={video[0]}>{video[1]}</option>        
    )

    this.setState({'videoOptions': videoOptions});

    })
  }

  render() {

    const thArray = ["ID", "Video", "Ator", "X", "Y", "W", "H", "Tempo", "Caminho"];
    
    const tdArray = this.state.annotations;

    const listaDeFaces = this.getPhotos();
    const listaDeOpcoes = this.state.options;
    const m = this.showMessage();
    const name = this.state.name !== "" ? <Alert variant={"danger"}>{this.state.name}</Alert> : <p></p>;
    const videoOptions = this.state.videoOptions;
    console.log(videoOptions);
    return (
      <div className="content">
        <Grid fluid>
          <Row>
            <Col lg={12} md={12}>

            <Card
                title="Lista de Vídeos"
                category="Escolha um vídeo"
                ctTableFullWidth
                ctTableResponsive
                content={
                  <div style={{marginLeft: "15px"}}>
                    <select id="lang" onChange={this.change} value={this.state.value}>
                      {videoOptions}
                    </select> 
                  </div>
                }
              />
              
            </Col>
            {m}

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

            <input type='text' style={{width: "100%", marginBottom: "5px"}} onChange={this.handleChangeInput}/>

            {name}

            <ul id="lista">
              { listaDeOpcoes }
            </ul>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.confirm}>Confirmar</Button>
            <Button onClick={() => this.setState({'modalShow': false})}>Cancelar</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default PreAnnotation;