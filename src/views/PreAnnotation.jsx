
import React, { Component } from "react";
import {
  Grid,
  Row,
  Col,
  Image
} from "react-bootstrap";

import { Card } from "components/Card/Card.jsx";

import avatar from "assets/img/faces/face-3.jpg";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck} from '@fortawesome/free-solid-svg-icons'

import axios from 'axios';

class PreAnnotation extends Component {
  constructor(props) {
    super(props);

    this.state = {
        'persons': []
    }
    
    this.handleChangeInput = this.handleChangeInput.bind(this);
 
  }

  componentDidMount() {
    const instance = axios.create({
      baseURL: 'http://127.0.0.1:5000'
    });
    
  }

  handleChangeInput = async (event) => {
    event.preventDefault();
    
    const name = event.target.value;

    const result = await axios({
      method: 'GET',
      url: "/api/persons/" + name,
      
    })
    .then((response) => {
      this.setState({persons: response.data});
    });

  }

  render() {

    const list1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((response) => 
      <Image src={avatar} rounded width={60} height={60}/>
    )

    return (
      <div className="content">
        <Grid fluid>
          <Row>
            <Col md={12}>
              <Card
                title="Pré anotação"
                content={
                  <form onSubmit={this.handleSubmit}>
                    
                    <Row>
                      <Col xs={6} md={4}>
                          {list1}
                      </Col>

                      <Col xs={6} md={4}>
                          {list1}
                      </Col>

                      <Col xs={6} md={4}>
                          {list1}
                      </Col>
                    </Row>

                    <Row>
                      <Col xs={6} md={4}>
                        <input type='text' style={{width: "90%"}}/>

                        <button>
                            <FontAwesomeIcon icon={faCheck} />
                        </button>
                      </Col>

                      <Col xs={6} md={4}>
                        <input type='text' style={{width: "90%"}}/>

                        <button>
                            <FontAwesomeIcon icon={faCheck} />
                        </button>
                      </Col>

                      <Col xs={6} md={4}>
                        <input type='text' style={{width: "90%"}} onChange={this.handleChangeInput}/>

                        <button>
                            <FontAwesomeIcon icon={faCheck} />
                        </button>

                        <p id="option"></p>

                      </Col>
                    </Row>

                    
                    <div className="clearfix" />
                  </form>
                }
              />
            </Col>
            
          </Row>
        </Grid>
      </div>
    );
  }
}

export default PreAnnotation;