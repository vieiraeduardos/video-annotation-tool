import React, { Component } from "react";
import { Grid, Row, Col } from "react-bootstrap";

import "../../node_modules/video-react/dist/video-react.css";
import Button from 'components/CustomButton/CustomButton.jsx';

import { StatsCard } from "components/StatsCard/StatsCard.jsx";
import { UserCard } from "components/UserCard/UserCard.jsx";
import axios from 'axios';

import "./Main.css";

import avatar from 'assets/img/faces/eduardo.jpg';

import 'react-activity/dist/react-activity.css';

import Lottie from 'react-lottie';
import animation from './animation.gif';

class Dashboard extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      file: "",
      annotations: [],
      actors: [],
      data: [],
      isProcessing: false,
      href: null,
      isStopped: false, 
      isPaused: false

    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChangeFile = this.handleChangeFile.bind(this);
    this.fileInput = React.createRef();

  }

  componentDidMount() {
    const instance = axios.create({
      baseURL: 'http://127.0.0.1:5000'
    });
  }


  handleSubmit(event) {
    event.preventDefault();

    this.setState({file: this.fileInput.current.files[0]});
    
    console.log(this.fileInput.current.files[0])
  }

  handleChangeFile(event) {
    this.setState({file: event.target.value});

    console.log(this.state);
  }

  async handleSubmit(event) {
    var FileDownload = require('js-file-download');

    event.preventDefault();

    const uploaded_video = this.fileInput.current.files[0];

    const formData = new FormData()

    formData.append('file', uploaded_video)

    this.setState({isProcessing: true});

    const result = await axios({
      method: 'POST',
      url: "/api/videos",
      data: formData,
      responseType: 'arraybuffer',
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    })
    .then(({ data }) => {
      const downloadUrl = window.URL.createObjectURL(new Blob([data]));
      console.log(data);

      this.setState({"href": downloadUrl});

      this.setState({data: data});

      this.setState({isProcessing: false});
    });

    const data = this.state.data;

    console.log(data[0]);  

    this.setState({isLoading: true})

  }

  render() {
    const {isLoading, isProcessing} = this.state;

    if(isProcessing) {
      return (
        <Grid fluid>
          <Row>
            <Col lg={12} sm={12}>
              <img style={{width: "400px", heigh: "400px", display: "block", marginLeft: "auto", marginRight: "auto"}} src={animation} alt="loading..."/>
            </Col>
          </Row>
        </Grid>
      )

    } else {
      if(!isLoading) {
        return (
          <div className="content">
            <Grid fluid>
              
              <Row>
                <Col md={12}>
  
                <form onSubmit={this.handleSubmit} enctype="multipart/form-data">
                  <label>Por favor, carregar vídeo para anotação.</label>
                  <input type="file" ref={this.fileInput} />
  
                  <Button bsStyle="info" pullRight fill type="submit">
                    Enviar
                  </Button>
                  <div className="clearfix" />
                  
                  
                </form>
                  
                </Col> 
              </Row>
    
            </Grid>
          </div>
        )
      } else {
        return (
          <div className="content">
            <Grid fluid>
  
              <Row>
              <Col lg={4} sm={4}>
                  <StatsCard
                    bigIcon={<i className="pe-7s-note2 text-success" />}
                    statsText="Anotações"
                    statsValue="200"
                    statsIcon={<i className="fa fa-refresh" />}
                    statsIconText="Atualizar"
                  />
                </Col>
  
                <Col lg={8} sm={8}>
                  <StatsCard
                    bigIcon={<i className="pe-7s-user text-success" />}
                    statsText="Rostos Encontrados"
                    statsValue="20"
                    statsIcon={<i className="fa fa-refresh" />}
                    statsIconText="Atualizar"
                  />
                </Col>
      
              </Row>
  
              <Row>
                <Col lg={12} sm={12}>
                <UserCard
                    bgImage="https://ununsplash.imgix.net/photo-1431578500526-4d9613015464?fit=crop&fm=jpg&h=300&q=75&w=400"
                    avatar={avatar}
                    name="Eduardo Vieira"
                    userName="vieiraeduardos"
                    description={
                      <div>
                        <Row>
                          <Col lg={12} sm={12}>
                              <span>
                                O vídeo foi processado com sucessso!
                              </span>
                          </Col>
                        </Row>
                        <Row>
                          <Col lg={12} sm={12}>
                              <span>
                                Opções
                              </span>
                          </Col>
                        </Row>
                        <Row>
                          <Col lg={3} sm={3}></Col>
                          <Col lg={6} sm={6}>
                              <Button bsStyle="info" round block fill type="submit">
                                <a download="annotations.zip" href={this.state.href} style={{ 'color': "white" }}>Baixar</a>
                              </Button>
                            </Col>
                        </Row>
                      </div>
                    }
                    socials={
                        <div>
                            
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

  }
}

export default Dashboard;
