import React, { Component } from "react";
import { Grid, Row, Col, Table } from "react-bootstrap";

import Card from "components/Card/Card.jsx";

import axios from "axios";

class Videos extends Component {
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

    const thArray = ["ID", "Nome"];
    
    const tdArray = this.state.videos;

    return (
      <div className="content">
        <Grid fluid>
          <Row>
            <Col md={12}>
              <Card
                title="Lista de Vídeos"
                category="Lista de vídeos processados"
                ctTableFullWidth
                ctTableResponsive
                content={
                  <Table striped hover>
                    <thead>
                      <tr>
                        {thArray.map((prop, key) => {
                          return <th key={key}>{prop}</th>;
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {tdArray.map((prop, key) => {
                        return (
                          <tr key={key}>
                            {prop.map((prop, key) => {
                              return <td key={key}>{prop}</td>;
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                }
              />
            </Col>

            
          </Row>
        </Grid>
      </div>
    );
  }
}

export default Videos;