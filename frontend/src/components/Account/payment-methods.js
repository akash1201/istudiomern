import React, { useState} from 'react'
import Accordion from 'react-bootstrap/Accordion'
import { Container, Row, Col, Image, ListGroup, Card, Button, Form, Tab, Tabs, Modal} from 'react-bootstrap'



const PaymentMethods = () => {
    //For Bootstrap Modal
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <div className="paymentMethod-main">
                <h4 className="heading">Payment Methods</h4>
                <div className="paymentCardBox">
                    <div className="cardBox-heading">
                        <div className="row">
                            <div className="col-md-7">
                                <p><strong>Your Saved Credit / Debit Cards</strong></p>
                            </div>
                            <div className="col-md-5">
                                <p>Expires</p>
                            </div>
                        </div>
                    </div>
                    <div className="paymentCard-listing">
                        <Accordion defaultActiveKey="0">
                            <Card>
                                <Card.Header>
                                    <Accordion.Toggle as={Button} variant="link cardHeading" eventKey="0">
                                        <div className="row align-items-center">
                                            <div className="col-12 col-md-7">
                                                <h5>HDFC Bank Debit Card <span>ending in 7774</span></h5>
                                            </div>
                                            <div className="col-9 col-md-2">
                                                <p>12/2020</p>
                                            </div>
                                            <div className="col-3 col-md-3">
                                                <img src="assets/img/icon-visa.png" alt="img" />
                                            </div>
                                        </div>
                                    </Accordion.Toggle>
                                </Card.Header>
                                <Accordion.Collapse eventKey="0">
                                    <Card.Body>
                                        <h4>Tim Smith</h4>
                                        <p>398 Sandra Squares Swiftchester,<br /> MT 00301</p>
                                        <div className="cardUpdateBtn">
                                            <a href="#" className="edit"><i className="far fa-edit"></i></a>
                                            <a href="#" className="delete"><i className="far fa-trash-alt"></i></a>
                                        </div>
                                    </Card.Body>
                                </Accordion.Collapse>
                            </Card>
                            <Card>
                                <Card.Header>
                                    <Accordion.Toggle as={Button} variant="link cardHeading" eventKey="1">
                                        <div className="row align-items-center">
                                            <div className="col-12 col-md-7">
                                                <h5>ICICI Bank Credit Card  <span>ending in 5598</span></h5>
                                            </div>
                                            <div className="col-9 col-md-2">
                                                <p>09/2021</p>
                                            </div>
                                            <div className="col-3 col-md-3">
                                                <img src="assets/img/icon-masterCard.png" alt="img" />
                                            </div>
                                        </div>
                                    </Accordion.Toggle>
                                </Card.Header>
                                <Accordion.Collapse eventKey="1">
                                    <Card.Body>
                                        <h4>Tim Smith</h4>
                                        <p>398 Sandra Squares Swiftchester,<br /> MT 00301</p>
                                        <div className="cardUpdateBtn">
                                            <a href="#" className="edit"><i className="far fa-edit"></i></a>
                                            <a href="#" className="delete"><i className="far fa-trash-alt"></i></a>
                                        </div>
                                    </Card.Body>
                                </Accordion.Collapse>
                            </Card>
                        </Accordion>
                        
                    </div>
                    <div className="paymentAddNewCard-wraper">
                        
                        <Button variant="" onClick={handleShow}>
                            <i className="fas fa-plus"></i> Add new Card
                        </Button>
                        <Modal show={show} onHide={handleClose} className="paymentAddNewCard">
                            <Modal.Header closeButton>
                                <h5 className="modal-title">Add New Card</h5>
                            </Modal.Header>
                            <Modal.Body>
                                <form>
                                    <div className="row align-items-end">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label for="addCardNumber">Card Number</label>
                                                <input type="text" className="form-control" id="addCardNumber" />
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label for="addExpireDate">Expire Date</label>
                                                <select name="Month" className="form-control" id="addExpireDate">
                                                    <option value="january">January</option>
                                                    <option value="february">February</option>
                                                    <option value="march">March</option>
                                                    <option value="april">April</option>
                                                    <option value="may">May</option>
                                                    <option value="june">June</option>
                                                    <option value="july">July</option>
                                                    <option value="august">August</option>
                                                    <option value="september">September</option>
                                                    <option value="october">October</option>
                                                    <option value="november">November</option>
                                                    <option value="december">December</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <select name="Year" className="form-control">
                                                    <option value="2016">2016</option>
                                                    <option value="2017">2017</option>
                                                    <option value="2018">2018</option>
                                                    <option value="2019">2019</option>
                                                    <option value="2020">2020</option>
                                                    <option value="2021">2021</option>
                                                    <option value="2022">2022</option>
                                                    <option value="2023">2023</option>
                                                    <option value="2024">2024</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row align-items-end">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label for="addCardName">Card Name</label>
                                                <input type="text" className="form-control" id="addCardName" />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label for="addCVV">CVV</label>
                                                <input type="text" className="form-control" id="CVV" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group form-check">
                                        <input type="checkbox" className="form-check-input" id="addSavecard" />
                                        <label className="form-check-label" for="addSavecard">Save card</label>
                                    </div>
                                    <button type="submit" className="btn btn-primary">Save</button>
                                </form>
                            </Modal.Body>
                        </Modal>
                        
                    </div>
                </div>
            </div>
        </>
    )
}
export default PaymentMethods