import React, { Component } from "react";
import { Grid, Row, Col, form, FormGroup, ControlLabel, HelpBlock, FormControl} from "react-bootstrap";

import  {Form} from 'react-bootstrap';

import { Player } from 'video-react';
import "../../node_modules/video-react/dist/video-react.css";
import Button from 'components/CustomButton/CustomButton.jsx';

import { FormInputs } from "components/FormInputs/FormInputs.jsx";

function FieldGroup({ id, label, help, ...props }) {
  return (
    <FormGroup controlId={id}>
      <ControlLabel>{label}</ControlLabel>
      <FormControl {...props} />
      {help && <HelpBlock>{help}</HelpBlock>}
    </FormGroup>
  );
}

class Dashboard extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      file: ""
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChangeFile = this.handleChangeFile.bind(this);
    this.fileInput = React.createRef();

  }

  play = () => {
    this.player.play();
  }

  pause = () => {
    this.player.pause();
  }

  changeCurrentTime = (seconds) =>{
    return () => {
      const { player } = this.player.getState();
      this.player.seek(player.currentTime + seconds);
    };
  }

  changePlaybackRateRate(steps) {
    return () => {
      const { player } = this.player.getState();

      if(steps == 0) {
        this.player.playbackRate = 1;
      } else {
        this.player.playbackRate = 1 + steps;
      }
    };
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

  render() {
    const isLoading = this.state.isLoading;

    if(!isLoading) {
      return (
        <div className="content">
          <Grid fluid>
            
            <Row>
              <Col md={12}>

              <form onSubmit={this.handleSubmit}>
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
              <Col md={10}>              
              
                <Player
                  ref={player => {
                    this.player = player;
                  }}
                  src="https://media.w3.org/2010/05/sintel/trailer_hd.mp4"
                />
                         
              </Col>  
  
              <Col md={2}>
                <Row>
                  <Button bsStyle="primary" onClick={this.play} fill block>Tocar</Button>
                </Row>
                <Row>
                  <Button bsStyle="primary" onClick={this.pause} fill block>Pausar</Button>
                </Row>
                <Row>
                  <Button bsStyle="primary" onClick={this.changeCurrentTime(10)} fill block>Avançar</Button>
                </Row>
                <Row>
                  <Button bsStyle="primary" onClick={this.changeCurrentTime(-10)} fill block>Retroceder</Button>
                </Row>
  
                <Row>
                  <Button bsStyle="primary" onClick={this.changePlaybackRateRate(-0.7)} fill block>Lento</Button>
                </Row>
  
                <Row>
                  <Button bsStyle="primary" onClick={this.changePlaybackRateRate(0)} fill block>Normal</Button>
                </Row>
  
                <Row>
                  <Button bsStyle="primary" onClick={this.changePlaybackRateRate(0.7)} fill block>Rápido</Button>
                </Row>
              </Col> 
            </Row>
  
          </Grid>
        </div>
      );

    }
  }
}

export default Dashboard;
