import React from "react";
import { Row, Col, Form, Button, Modal, Nav } from "react-bootstrap";
const ShippingSupport=(props)=>{
    return (<div className="support-sec">
    <Row className="justify-content-center">
      <Col sm={12} md={12} xl={4} className="item">
        <figure className="single-item">
          <span className="icon">
            <img
              src="assets/img/customer-support.svg"
              alt=""
            />
          </span>
          <h5>help</h5>
          <p>Call Us no 05 3456 342 123</p>
          <p>Mon-Fri 9am - 8am</p>
          <p>Sat-Sun: 10am - 6pm</p>
        </figure>
      </Col>
      <Col sm={12} md={12} xl={4} className="item">
        <figure className="single-item">
          <span className="icon">
            <img src="assets/img/box.svg" alt="" />
          </span>
          <h5>delivery</h5>
          <p>Track the Progess of your in real time</p>
          <p>
            <a>Find Out More</a>
          </p>
        </figure>
      </Col>
      <Col sm={12} md={12} xl={4} className="item">
        <figure className="single-item">
          <span className="icon">
            <img src="assets/img/return.svg" alt="" />
          </span>
          <h5>easy returns</h5>
          <p>
            15 Days Money-back returns if you change your mind
          </p>
          <p>
            <a>Find Out More</a>
          </p>
        </figure>
      </Col>
    </Row>
  </div>)
}
export default ShippingSupport;