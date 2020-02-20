import React, { Component } from "react";
import ChartistGraph from "react-chartist";
import { Grid, Row, Col } from "react-bootstrap";

import { Card } from "components/Card/Card.jsx";
import { StatsCard } from "components/StatsCard/StatsCard.jsx";
import { Tasks } from "components/Tasks/Tasks.jsx";
import {
  dataPie,
  legendPie,
  dataSales,
  optionsSales,
  responsiveSales,
  legendSales,
  dataBar,
  optionsBar,
  responsiveBar,
  legendBar
} from "variables/Variables.jsx";

import { Player } from 'video-react';
import "../../node_modules/video-react/dist/video-react.css";

class Dashboard extends Component {

  createLegend(json) {
    var legend = [];
    for (var i = 0; i < json["names"].length; i++) {
      var type = "fa fa-circle text-" + json["types"][i];
      legend.push(<i className={type} key={i} />);
      legend.push(" ");
      legend.push(json["names"][i]);
    }
    return legend;
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
    return (
      <div className="content">
        <Grid fluid>
          
          <Row>
            <Col md={12}>
              <Player
                ref={player => {
                  this.player = player;
                }}
                src="https://media.w3.org/2010/05/sintel/trailer_hd.mp4"
              />

            <button onClick={this.play}>Tocar</button>
            <button onClick={this.pause}>Pausar</button>
            <button onClick={this.changeCurrentTime(10)}>Avançar</button>
            <button onClick={this.changeCurrentTime(-10)}>Retroceder</button>
            <button onClick={this.changePlaybackRateRate(-0.7)}>Lento</button>
            <button onClick={this.changePlaybackRateRate(0)}>Normal</button>
            <button onClick={this.changePlaybackRateRate(0.7)}>Rápido</button>
                       
            </Col>
            
          </Row>
        </Grid>
      </div>
    );
  }
}

export default Dashboard;
