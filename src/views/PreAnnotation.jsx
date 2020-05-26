
import React, { Component } from "react";
import {
  Grid,
  Row,
  Col,
  Image,
  Modal,
  Button,
  Alert

} from "react-bootstrap";

import { FormInputs } from "components/FormInputs/FormInputs.jsx";

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
        'modalSignUpIsVisible': false,
        'code': null,
        'video_code': 20,
        'annotations': [],
        'photos': [],
        'options': null,
        'option': null,
        'name': "",
        'showMessage': false,
        'value': 'select',
        'videoOptions': (<option></option>),
        'tags': "",
        'listaDeFaces': null,
        'formuniversity': "",
        'formname': "",
        'formemail': ""
    }
    
    this.handleChangeInput = this.handleChangeInput.bind(this);
    this.loadModal = this.loadModal.bind(this);
    this.confirm = this.confirm.bind(this);
    this.getPhotosComponent = this.getPhotosComponent.bind(this);
    this.change = this.change.bind(this);

    this.handleChangeName = this.handleChangeName.bind(this);
    this.handleChangeEmail = this.handleChangeEmail.bind(this);
    this.handleChangeUniversity = this.handleChangeUniversity.bind(this);
    this.signUp = this.signUp.bind(this);
 
  }

  async componentDidMount() {
    /** Definindo URL da API */
    axios.create({
      baseURL: 'http://127.0.0.1:5000'
    });

    await this.getAnnotationsByVideo();

    await this.extractPhotosInAnnotations();
    
    await this.loadVideoOptions();

    this.getPhotosComponent();

    console.log("OK")
  }

  isInside(photos, code) {
    for(var i in photos) {
      if(photos[i]["actor"] === code) {
        return i
      }
    }

    return 999
  }

  /**
   * Obtem um conjunto de anotações de rostos segundo o código do vídeo.
   * 
   */
  getAnnotationsByVideo = async () => {
    let formData = new FormData();

    formData.append('video', this.state.video_code);

    await axios({
      method: 'POST',
      url: "/api/annotations",
      data: formData
    })
    .then((response) => {
      this.setState({'annotations': response.data});
    });
  }

  /**
   * Obtem uma imagem do banco de dados
   *  
   */
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
        console.log(annotations[i][13])

        photos.push({actor: actor, photos: [{'source': "data:;base64," + base64}], name: annotations[i][11], person: annotations[i][13]})

        this.setState({photos: photos}) 
      } else {
        photos[result]['photos'].push({'source': "data:;base64," + base64});

        this.setState({photos: photos});
      }
      
    });

  }

  /**
   * Extrai imagens das anotações do vídeo 
   * 
   */
  async extractPhotosInAnnotations() {
    /** Pegando lista de fotos segundo as anotações */
    const annotations = this.state.annotations;

    for (var i in annotations) {
      this.getImage(i, annotations)
    }
  }

  /** Escolhe uma pessoa na lista de opções */
  chooseOption(person) {
    console.log(person);
    this.setState({"option": person[0]});
    this.setState({"name": person[1]});
    
  }

  /**
   * Pesquisa no DB nomes de pessoas 
   * 
   */
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

  /**
   * Carrega o modal para escolher uma pessoa para o cluster
   * 
   */
  loadModal = (actor) => {
    this.setState({'modalShow': true});
    this.setState({'code': actor});

  }

  loadModalSignUp = (actor) => {
    this.setState({'modalShow': false});
    this.setState({'modalSignUpIsVisible': true});
    this.setState({'code': actor});
  }

  chooseYes = async (person) => {
    await this.chooseOption(person);

    await this.setState({'code': person[2]});

    await this.confirm();
  }

  /**
   * Montar o componente com as imagens do banco de dados
   * 
   */
  async getPhotosComponent() {
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
          <div>
            <Row>
              <Col xs={12} md={12}>
                {photos[index].photos.map((source) => 
                  <Image src={source.source} rounded width={60} height={60}/>
                )}        
              </Col>
            </Row>

            <Row style={{margin: "10px"}}>
              <div style={{ display: "flex", flexDirection: "center", alignContent: "center", alignItems: "center", justifyContent: "center"}}>
                <h4>Este é o {photos[index].name} <img style={{width: "30px", heigh: "30px", borderRadius: "50%", marginLeft: "auto"}} src={avatar} alt="loading..."/>?</h4>
              </div>              
            </Row>

            <Row>
              <div style={{ display: "flex", flexDirection: "center", alignContent: "center", alignItems: "center", justifyContent: "center"}}>
                <Button bsStyle="success" onClick={() => this.chooseYes([photos[index].person, photos[index].name, photos[index].actor])} type="submit">
                  Sim
                </Button>

                <Button bsStyle="danger"  type="submit" onClick={() => this.loadModal(photos[index].actor)}>
                  Não
                </Button>
              </div>
            </Row>
            
            
            
            <div className="clearfix" />
          </div>
        }
      />
    </Col>
    )

    this.setState({"listaDeFaces": listaDeImagens});
  }

  /**
   * Confirma a escolha da pessoa para o cluster
   * 
   */
  async confirm() {
    const option = this.state.option;
    const actor = this.state.code;

    var formData = new FormData();

    formData.append("option", option);
    formData.append("actor", actor);

    console.log(this.state)

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

    await this.getPhotosComponent();

  }

  /**
   * 
   */
  showMessage() {
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

      console.log(event.target.value)
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

  async signUp() {
    const {formname, formemail} = this.state;

    const formData  = new FormData();

    formData.append('name', formname);
    formData.append('email', formemail);

    await fetch('http://127.0.0.1:5000/api/persons/', {
        method: 'POST',
        body: formData,
    }).then((data) => {
      this.setState({"showMessage": true})
    });
 
  }

  handleChangeName(event) {
    this.setState({'formname': event.target.value});
  }

  handleChangeEmail(event) {
    this.setState({'formemail': event.target.value});
  }

  handleChangeUniversity(event) {
    this.setState({'formuniversity': event.target.value});
  }

  render() {
    const {listaDeFaces} = this.state;
    const listaDeOpcoes = this.state.options;
    const m = this.showMessage();
    const name = this.state.name !== "" ? <Alert variant={"danger"}>{this.state.name}</Alert> : <p></p>;
    const videoOptions = this.state.videoOptions;
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

            
            
          </Row>
        </Grid>

        <Modal
          show={this.state.modalSignUpIsVisible}
          onHide={() => this.setState({'modalShow': false})}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
                Novo usuário
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              Preencha o formulário para cadastrar um novo usuário
            </p>

            <FormInputs
              ncols={["col-md-6", "col-md-6", "col-md-12"]}
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
                },
                {
                  label: "Instituição",
                  type: "text",
                  bsClass: "form-control",
                  placeholder: "Universidade X",
                  onChange: this.handleChangeUniversity
                }
              ]}
            />
            
        </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => this.signUp()}>Cadastrar</Button>
            <Button onClick={() => this.setState({'modalSignUpIsVisible': false})}>Cancelar</Button>
          </Modal.Footer>
        </Modal>

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

            <Row>
              <div style={{ margin: "20px", display: "flex", flexDirection: "center", alignContent: "center", alignItems: "center", justifyContent: "center"}}>
                <Button variant="primary" onClick={() => this.loadModalSignUp(this.state.actor)}>
                  Criar Novo
                </Button>
              </div>
            </Row>

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