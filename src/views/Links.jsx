
import React, { Component } from "react";
import {
  Grid,
  Row,
  Col,
  Image
} from "react-bootstrap";

import { Card } from "components/Card/Card.jsx";

import axios from "axios";

import Button from "components/CustomButton/CustomButton.jsx";

class Links extends Component {

  constructor(props) {
      super(props);

      this.state = {
        personsList: null,
        listaDeFaces: null,
        annotations: null,
        wrongAnnotations: []

      }
  }

  async componentDidMount() {
    /** Definindo URL da API */
    axios.create({
      baseURL: 'http://127.0.0.1:5000'
    });

    await this.getAnnotationsByPerson();
    await this.loadPhotos();
    await this.mountView();
  }

  

  getAnnotationsByPerson = async () => {
    var url_atual = window.location.href;

    let person_code = url_atual.split("/")[5];

    await axios({
      method: 'GET',
      url: "/api/persons/"+ person_code +"/annotations/"
    })
    .then((response) => {
      this.setState({'annotations': response.data});
    });
  }

  async mountView() {
    var annotations = this.state.annotations;
    var count = [];

    for(var i in annotations) {
      count.push(i);
    }
    
    const listaDeImagens = count.map((index) =>
      <Col xs={4} md={4} style={{marginBottom: "30px"}}>
        <Image  id={annotations[index][0]} onClick={() => this.selectPhoto(annotations[index][0])} className="faces" src={annotations[index][2]} style={{border: "thick solid green", width: "100px", heigh: "100px", borderRadius: "50%", marginLeft: "auto"}}/>
      </Col>
    )

    this.setState({"listaDeFaces": listaDeImagens});
  }

  selectPhoto = (code) => {
    var element = document.getElementById(code);

    element.style.border = "thick solid red"

    console.log(code);

    let annotations = this.state.wrongAnnotations;

    annotations.push(code);

    this.setState({"wrongAnnotations": annotations});

    console.log(this.state.wrongAnnotations);
  }


  loadPhotos = async () => {
    
    let annotations = this.state.annotations;

    for (let i in annotations) {
      console.log(annotations[i][2])

      let formData = new FormData();

      formData.append('path', annotations[i][2])

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

        let source = "data:;base64," + base64;

        annotations[i][2] = source;

        this.setState({"annotations": annotations})
      })
    }

  }

  loadPersonsList = async () => {
    await axios({
      method: 'GET',
      url: "/api/persons/"
    })
    .then((response) => {
      this.setState({'personsList': response.data});
    });
  }

  chooseYes = async () => {
    let formData = new FormData();

    formData.append('wrongAnnotations[]', this.state.wrongAnnotations);

    await axios({
      method: 'PUT',
      url: "/api/annotations/",
      data: formData
    })
    .then((response) => {
        console.log(response.data);
    })

  }

  render() {

    const {listaDeFaces} = this.state;

    return (
      <div className="content">
        <Grid fluid>
          <Row>

          <Col md={12}>
      
            <Card
              title="Selecione abaixo as anotações, caso estejam erradas, e confirme."
              content={
                <div>
                  <Row>
                      {listaDeFaces}
                  </Row>

                  <Row>
                  <div style={{ display: "flex", flexDirection: "center", alignContent: "center", alignItems: "center", justifyContent: "center"}}>
          
                    <Button fill bsStyle="success" onClick={() => this.chooseYes()} type="submit">
                        Confirmar
                    </Button>
                </div>
                  </Row>
                  
                  <div className="clearfix" />
                </div>
              }
            />
          </Col>
            
          </Row>
        </Grid>
      </div>
    );
  }
}

export default Links;