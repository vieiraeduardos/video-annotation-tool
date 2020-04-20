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
  render() {
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
          
          
        </Grid>
      </div>
    );
  }
}

export default Status;