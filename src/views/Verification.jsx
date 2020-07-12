
import React, { Component } from "react";
import {
  Grid,
  Row,
  Col,
  Image
} from "react-bootstrap";

import { Card } from "components/Card/Card.jsx";

import avatar from "assets/img/faces/face-3.jpg";

import axios from "axios";

class Verification extends Component {

  constructor(props) {
      super(props);

      this.state = {
        personsList: null,
        listaDeFaces: null

      }
  }

  async componentDidMount() {
    /** Definindo URL da API */
    axios.create({
      baseURL: 'http://127.0.0.1:5000'
    });

    await this.loadPersonsList();
    await this.loadProfilePhotos();
    await this.mountView();

  }

  async mountView() {
    var personsList = this.state.personsList;
    var count = [];

    for(var i in personsList) {
      count.push(i);
    }
    
    const listaDeImagens = count.map((index) =>
      <Col xs={4} md={4} style={{marginBottom: "30px"}}>
        <a href={"http://localhost:3000/admin/links/" + personsList[index][0]}>
          <Image id={personsList[index][3]} onClick={() => console.log("OK")} className="faces" src={personsList[index][3]} style={{border: "thick solid green", width: "100px", heigh: "100px", borderRadius: "50%", marginLeft: "auto"}}/>
        </a>
      </Col>
    )

    this.setState({"listaDeFaces": listaDeImagens});
  }


  loadProfilePhotos = async () => {
    axios.create({
      baseURL: 'http://127.0.0.1:5000'
    });
    let personsList = this.state.personsList;

    for (let i in personsList) {
      let formData = new FormData();

      formData.append('path', personsList[i][3])

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

        personsList[i][3] = source;

        this.setState({"personsList": personsList})
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

  render() {

    const {listaDeFaces} = this.state;

    return (
      <div className="content">
        <Grid fluid>
          <Row>

          <Col md={12}>
      
            <Card
              title="Veja abaixo lista de pessoas cadastradas"
              content={
                <div>
                  <Row>
                      {listaDeFaces}
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

export default Verification;