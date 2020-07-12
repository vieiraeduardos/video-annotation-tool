
import React, { Component } from "react";
import {
  Grid,
  Row,
  Col,
  Image,
  Modal,
  Alert

} from "react-bootstrap";

import { FormInputs } from "components/FormInputs/FormInputs.jsx";

import Card from "components/Card/Card.jsx";

import axios from 'axios';

import './styles.css';

import Button from "components/CustomButton/CustomButton.jsx";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { faPenSquare } from '@fortawesome/free-solid-svg-icons'

class PreAnnotation extends Component {
  constructor(props) {
    super(props);
 
    this.state = {
        'persons': [],
        'modalShow': false,
        'modalSignUpIsVisible': false,
        'code': null,
        'video_code': 12,
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
        'formemail': "",
        'photoCodeToRemoveOrMove': null,
        'isMoving': false,
        'profile_photo': [],
        'vetor': []
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
    var url_atual = window.location.href;

    formData.append('video', url_atual.split("/")[5]);

    await axios({
      method: 'POST',
      url: "/api/annotations",
      data: formData
    })
    .then((response) => {
      this.setState({'annotations': response.data});
    });
  }



  get_profile_photo = async () => {
    const photos = this.state.photos;

    console.log(photos);
    var urls = [];

    for (let i in photos) {
      urls.push(photos[i].profile_photo);
    }

    for (let i in urls) {
      let formData = new FormData()

      formData.append('path', urls[i]);

      await axios({
        method: 'POST',
        url: "/api/image/",
        data: formData,
        responseType: 'arraybuffer',
      })
      .then((response) => {
        var base64 = btoa(
          new Uint8Array(response.data).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            '',
          ),
        );

        //console.log("Eduardo \n" + base64)
        //console.log("--------------------")

        var vetor = this.state.profile_photo;

        vetor.push("data:;base64," + base64);

        this.setState({"profile_photo": vetor})
        
      });
    }
    
  }

  /**
   * Obtem uma imagem do banco de dados
   *  
   */
  async getImage(i, annotations) {
    let formData = new FormData()

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

        console.log(i);

        var profile = String(annotations[i][17]);

        var vetor = this.state.vetor;
        vetor.push(annotations[i][17]);

        this.setState({'vetor': vetor})

        photos.push({actor: actor, photos: [{'source': "data:;base64," + base64, 'image_id': annotations[i][0]}], 'profile_photo': profile, 'name': annotations[i][11], person: annotations[i][14]});

        this.setState({photos: photos})
      } else {
        photos[result]['photos'].push({'source': "data:;base64," + base64,  'image_id': annotations[i][0]});

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
      await this.getImage(i, annotations)
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
    console.log(actor);
    this.setState({'modalShow': true});
    this.setState({'code': actor});

  }

  loadModalSignUp = (actor) => {
    this.setState({'modalShow': false});
    this.setState({'modalSignUpIsVisible': true});
    this.setState({'code': this.state.code});
  }

  chooseYes = async (person) => {
    await this.chooseOption(person);

    await this.setState({'code': person[2]});

    await this.confirm();
  }

  selectPhoto = (code) => {
    var element = document.getElementById(code);

    element.style.border = "thick solid red"

    console.log(code);

    this.setState({"photoCodeToRemoveOrMove": code});
  }

  removePhoto = async () => {
    const photoCodeToRemoveOrMove = this.state.photoCodeToRemoveOrMove;

    await axios({
      method: 'DELETE',
      url: "/api/images/" + photoCodeToRemoveOrMove
    })
    .then((response) => {
      window.location.reload(false);
    });
  }

  movePhoto = async () => {
    this.setState({"isMoving": true});
    this.setState({"modalShow": true});
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

    await this.get_profile_photo();

    //console.log(this.state.profile_photo)
    
    const listaDeImagens = count.map((index) =>

    <Col md={12}>
      <Button bsStyle="info" pullRight fill onClick={() => this.movePhoto()}>
        
        <FontAwesomeIcon icon={faPenSquare} />
      </Button>

      <Button bsStyle="danger" pullRight fill onClick={() => this.removePhoto()}>
        
        <FontAwesomeIcon icon={faTrash} />
      </Button>
      <Card
        title=""
        content={
          <div>
            <Row>
              <Col xs={12} md={12}>
                {photos[index].photos.map((source) => 
                  <Image id={source.image_id} onClick={() => this.selectPhoto(source.image_id)} className="faces" src={source.source} rounded width={60} height={60}/>
                )}
              </Col>
            </Row>

            <Row style={{margin: "10px"}}>
              <div style={{ display: "flex", flexDirection: "center", alignContent: "center", alignItems: "center", justifyContent: "center"}}>
                <h4>Este é o {photos[index].name} <img style={{width: "30px", heigh: "30px", borderRadius: "50%", marginLeft: "auto"}} src={this.state.profile_photo[index]} alt="loading..."/>?</h4>
              </div>    
            </Row>

            <Row>
              <div style={{ display: "flex", flexDirection: "center", alignContent: "center", alignItems: "center", justifyContent: "center"}}>
                <Button fill bsStyle="success" onClick={() => this.chooseYes([photos[index].person, photos[index].name, photos[index].actor])} type="submit">
                  Sim
                </Button>

                <Button fill bsStyle="danger"  type="submit" onClick={() => this.loadModal(photos[index].actor)}>
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
    if(!this.state.isMoving) {
      const option = this.state.option;
      const actor = this.state.code;

      let formData = new FormData();

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
        this.setState({'modalSignUpIsVisible': false});
        this.setState({'showMessage': true});

        window.location.reload(false);
      })

      await this.getPhotosComponent();
    } else {

      const person = this.state.option;
      const image = this.state.photoCodeToRemoveOrMove;

      let formData = new FormData();

      formData.append("person", person);
      formData.append("image", image);

      /** Move imagem */
      await axios({
        method: 'PUT',
        url: "/api/images/",
        data: formData
      })
      .then((response) => {
        this.setState({'modalShow': false});

        this.setState({'showMessage': true});

        window.location.reload(false);
      })
    }

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

      window.location.replace("http://localhost:3000/admin/preannotation/" + event.target.value);

      console.log("CODE VIDEO" + event.target.value)
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
    const {formname, formemail, code} = this.state;

    const formData  = new FormData();

    formData.append('name', formname);
    formData.append('email', formemail);
    formData.append('actor', code);

    console.log(code)

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
