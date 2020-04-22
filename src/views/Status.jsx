
import React, { Component } from "react";
import { Grid, Row, Col } from "react-bootstrap";
import { StatsCard } from "components/StatsCard/StatsCard.jsx";

import axios from 'axios';

class Status extends Component {
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

  constructor(props) {
    super(props);

    this.state = {
      videos: []
    }
  }

  async componentDidMount() {
    const instance = axios.create({
      baseURL: 'http://127.0.0.1:5000'
    });

    const result = await axios({
      method: 'GET',
      url: "/api/videos"
    })
    .then(({ data }) => {
      this.setState({"videos": data});

    });
  }

  render() {

    const listaDeVideos = this.state.videos.map((video) => 
      <div>
        <p>{video[1]}</p>
      </div>
    )


    return (
      <div className="content">
        <Grid fluid>
          <Row>
            <Col lg={3} sm={6}>
              <StatsCard
                bigIcon={<i className="pe-7s-film text-warning" />}
                statsText="Vídeos Processados"
                statsValue="10"
                statsIcon={<i className="fa fa-refresh" />}
                statsIconText="Atualizar"
              />
            </Col>
            <Col lg={3} sm={6}>
              <StatsCard
                bigIcon={<i className="pe-7s-user text-success" />}
                statsText="Rostos Encontrados"
                statsValue="20"
                statsIcon={<i className="fa fa-refresh" />}
                statsIconText="Atualizar"
              />
            </Col>
            <Col lg={3} sm={6}>
              <StatsCard
                bigIcon={<i className="pe-7s-id text-danger" />}
                statsText="Rostos com nome"
                statsValue="5"
                statsIcon={<i className="fa fa-refresh" />}
                statsIconText="Atualizar"
              />
            </Col>
            <Col lg={3} sm={6}>
              <StatsCard
                bigIcon={<i className="pe-7s-id text-danger" />}
                statsText="Rostos sem nome"
                statsValue="15"
                statsIcon={<i className="fa fa-refresh" />}
                statsIconText="Atualizar"
              />
            </Col>
          </Row>

          <Row>
            <Col lg={12} sm={12}>
              {listaDeVideos}
            </Col>
          </Row>
          
          
        </Grid>
      </div>
    );
  }
}

export default Status;