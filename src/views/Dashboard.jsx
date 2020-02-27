import React, { Component } from "react";
import { Grid, Row, Col, form, FormGroup, ControlLabel, HelpBlock, FormControl} from "react-bootstrap";


import { Player } from 'video-react';
import "../../node_modules/video-react/dist/video-react.css";
import Button from 'components/CustomButton/CustomButton.jsx';


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
    this.state = {isLoading: false};
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

  render() {
    const isLoading = this.state.isLoading;

    if(isLoading) {
      return (
        <div className="content">
          <Grid fluid>
            
            <Row>
              <Col md={12}>

              <form>
                <FieldGroup
                  id="formControlsFile"
                  type="file"
                  label="Carregar vídeo"
                  help="Por favor, carregue um vídeo em formato MP4 para processamento."
                />
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
