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
  
  processing(annotations) {
    var processedAnnotations = [];

    for(var i = 0; i < annotations.length; i++) {
      var isFound = false;

      for(var j = 0; j < processedAnnotations.length; j++) {
        if(annotations[i].person_id == processedAnnotations[j].person_id) {
          isFound = true;
          processedAnnotations[j].end_time = annotations[i].time;
          break;          
        }
      }

      if(!isFound) {
        processedAnnotations.push({'code': annotations[i].code, 'person_id': annotations[i].person_id, 'start_time': annotations[i].time, 'end_time': annotations[i].time})
      } 
    }

    this.setState({'annotations': processedAnnotations})
  }

  handleSubmit(event) {
    event.preventDefault();

    const uploaded_video = this.fileInput.current.files[0];

    const annotations = [
      {
        'code': 1,
        'video_id': 1,
        'time': 1,
        'person_id': 1,
        'actor_id': null
      },
    
      {
        'code': 2,
        'video_id': 1,
        'time': 2,
        'person_id': 1,
        'actor_id': null
      },
    
      {
        'code': 3,
        'video_id': 1,
        'time': 3,
        'person_id': 1,
        'actor_id': null
      },
    
      {
        'code': 4,
        'video_id': 1,
        'time': 4,
        'person_id': 2,
        'actor_id': null
      },

      {
        'code': 5,
        'video_id': 1,
        'time': 4,
        'person_id': 3,
        'actor_id': null
      },
    ];

    this.setState({annotations: annotations});

    this.processing(annotations);

    this.setState({isLoading: true})


  }

  render() {
    const isLoading = this.state.isLoading;

    const listAnnotations = this.state.annotations.map((annotation) =>
      <li>ID : {annotation.person_id} START TIME: {annotation.start_time} END TIME: {annotation.end_time}</li>
    );

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

                {listAnnotations}
                         
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
