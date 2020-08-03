
import React, { Component } from "react";
import {
  Grid,
  Row,
  Col
} from "react-bootstrap";

import Button from "components/CustomButton/CustomButton.jsx";

import Card from "components/Card/Card.jsx";

import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { faPlay } from '@fortawesome/free-solid-svg-icons'
import { faShare } from '@fortawesome/free-solid-svg-icons'

import nba from "./nba.mp4";

class AnnotateDescriptionToScenes extends Component {
  constructor(props) {
    super(props);
 
    this.state = {
      videoOptions: null,
      video: null,
      description: "",
      startTime: "",
      endTime: "",
      scenes: [],
      startTimeForVideo: 0,
      endTimeForVideo: 0
    } 
  }

  async componentDidMount() {
    /** Definindo URL da API */
    axios.create({
      baseURL: 'http://127.0.0.1:5000'
    });
    await this.loadVideoOptions();
    await this.loadScenesOptions();
  }

  loadScenesOptions = async () => {
    let video = this.state.video ? this.state.video : 264;

    await axios({
      method: 'GET',
      url: "/api/videos/" + video + "/scenes/"
    })
    .then(({data}) => {
      console.log(data)
      const scenesOptions = data.map((scene) => 
      <section style={{marginLeft:"20px", marginRight: "20px", marginTop: "10px", border: "1px solid #ddd", padding: "10px"}}>
        <Button bsStyle="info" style={{marginRight: "10px"}} fill onClick={() => this.play(scene[3])}>
          <FontAwesomeIcon icon={faPlay} />
        </Button>
        <Button bsStyle="danger" style={{marginRight: "10px"}} fill onClick={() => this.deleteDescriptionToScene(scene[0])}>
          <FontAwesomeIcon icon={faTrash} />
        </Button>
        <label style={{marginRight:"10px"}}><strong>Começo:</strong> {scene[3]}</label>
        <label style={{marginRight:"10px"}}><strong>Fim:</strong> {scene[4]}</label>
        <label>{scene[2]}</label>
      </section>       
      )

      this.setState({'scenes': scenesOptions});
    });
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
    });
  }

  updateChosenVideo = async (event) => {
    this.setState({video: event.target.value});

    await this.loadScenesOptions();
  }

  play = async (start) => {
    let video = document.getElementById("video");
    let time = start.split(":") 
    video.currentTime =  Number(time[0] * 60) + Number(time[1]);
  }

  handleChangeStartTime = (event) => {
    this.setState({startTime: event.target.value});
  }

  handleChangeEndTime = (event) => {
    this.setState({endTime: event.target.value});
  }

  handleChangeDescription = (event) => {
    this.setState({description: event.target.value});
  }

  /* adiciona uma descrição textual a um trecho do vídeo */ 
  addDescriptionToScene = async () => {
    let video = this.state.video;
    let description = this.state.description;
    let startTime = this.state.startTime;
    let endTime = this.state.endTime;

    let formData = new FormData();

    formData.append("description", description);
    formData.append("startTime", startTime);
    formData.append("endTime", endTime);

    await axios({
      method: 'POST',
      url: "/api/videos/" + video + "/scenes/",
      data: formData
    })
    .then(({data}) => {
      console.log("adiciona uma descrição textual a um trecho do vídeo")
      console.log(data);

      this.loadScenesOptions();
    });
  } 

  /* adiciona uma descrição textual a um trecho do vídeo */ 
  deleteDescriptionToScene = async (scenesCode) => {

    await axios({
      method: 'DELETE',
      url: "/api/scenes/" + scenesCode,
    })
    .then(({data}) => {
      console.log("deleta uma descrição textual a um trecho do vídeo")
      console.log(data);

      this.loadScenesOptions();
    });
  } 

  render() {
    const {videoOptions} = this.state;
    const scenes = this.state.scenes ? this.state.scenes : <p></p>;

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
                      <select id="lang" onChange={this.updateChosenVideo} value={this.state.value}>
                        {videoOptions}
                      </select> 

                      <section style={{ display: "flex", flexDirection: "center", alignContent: "center", alignItems: "center", justifyContent: "center"}}>
                        <Button bsStyle="info" fill type="submit" style={{width: "200px"}}>
                          Pesquisar
                        </Button>
                        <label style={{margin: "10px"}}>Ou</label>

                        <Button bsStyle="success" fill type="submit" style={{width: "200px"}}>
                          Carregar Novo
                        </Button>
                      </section>
                    </div>
                  }
              />
              
            </Col>
          </Row>

          <Row>
            <Col lg={12} md={12}>

              <Card
                  title=""
                  category=""
                  ctTableFullWidth
                  ctTableResponsive
                  content={
                    <div>
                      <Row>
                        <Col lg={12} md={12}>
                          <section style={{marginRight: "20px", marginBottom: "50px"}}>
                            <Button bsStyle="success" onClick={() => window.location.replace("http://127.0.0.1:5000/api/videos/" + this.state.video +"/scenes/")} pullRight fill type="submit" style={{width: "50px"}}>
                              <FontAwesomeIcon icon={faShare} />
                            </Button>
                          </section>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg={6} md={6}>
                          <video id="video" width="400" controls style={{marginLeft: "20px"}}>
                            <source src={nba} type="video/mp4"></source>
                          </video>
                        </Col>

                        <Col lg={6} md={6}>
                          <label>Trecho em segundos</label><br></br>
                          <input type="time" value={this.state.startTime} onChange={this.handleChangeStartTime} style={{border: "1px solid #ddd", "width": "43%"}}></input>
                          <label style={{margin: "10px"}}>to</label>
                          <input type="time" value={this.state.endTime} onChange={this.handleChangeEndTime} style={{border: "1px solid #ddd", "width": "44%"}}></input><br></br>  
                          <label>Descrição do trecho</label><br></br>                      
                          <input type="text" value={this.state.description} onChange={this.handleChangeDescription} style={{border: "1px solid #ddd", "width": "95%", height: "70px"}}></input>

                          <section style={{ display: "flex", flexDirection: "center", alignContent: "center", alignItems: "center", justifyContent: "center", marginTop:"10px"}}>
                            <Button onClick={this.addDescriptionToScene} bsStyle="success" fill style={{width: "200px"}}>
                              Adicionar
                            </Button>
                          </section>
                        </Col>
                      </Row>

                      <div id="scenes">
                        {scenes}
                      </div>
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

export default AnnotateDescriptionToScenes;