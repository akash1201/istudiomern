import React, { useEffect, useState} from 'react'
import SideBar from "../components/Sidebar"
import Loader from "../components/Loader"
import { Container, Row, Col, Card, Button, Modal, Accordion, Form, Alert } from 'react-bootstrap'
import Axios from 'axios'
import {useSelector} from "react-redux"
import { Empty,Popconfirm } from 'antd';


const PaymentMethods = () => {

    const userLogin = useSelector((state) => state.userLogin)
    const { userInfo } = userLogin

    //For Bootstrap Modal
    const [show, setShow] = useState(false);

    const [cardNo, setCardNo] = useState(()=>'')
    const [expiryMonth, setExpiryMonth] = useState(()=>'1')
    const [expiryYear, setExpiryYear] = useState(()=>'2022')
    const [name, setName] = useState(()=>'')
    const [cvv, setCvv] = useState(()=>'')

    const [isUpdate, setIsUpdate] = useState(()=>false)

    const [cards, setCards] = useState(()=>[])

    const [loading ,setLoading] = useState(()=>true)
    const [msg, setMsg] = useState(()=>'')

    const [success, setSuccess] = useState(()=>false)
    const [error, setError] = useState(()=>false)

    const handleClose = () =>{
        setName("")
        setCardNo("")
        setCvv("")
        setExpiryMonth("01")
        setExpiryYear("2022")
        setShow(false)
    
    };

    const handleShow = () => {
        
        setIsUpdate(false)
        setShow(true)
    }

    const handleCardSave = (e) => {
     
        e.preventDefault()

        let data = {
            cardNumber: cardNo,
            expiryMonth: expiryMonth,
            expiryYear: expiryYear,
            name: name,
            cvv: cvv
        }

        
        setLoading(true)
        Axios.post(`/api/users/paymentMethods/${userInfo._id}`, data)
        .then((res)=>{
              setCards((old)=>[...old, res.data])
              setMsg("Card Added Successfully")
            setSuccess(true)
            setTimeout(()=>{setMsg(''); setError(false); setSuccess(false)},3000)
              setLoading(false)
              setShow(false)
        })
        .catch((err)=>{
            setShow(false)
            setMsg("Please enter valid card details")
            setError(true)
            setTimeout(()=>{setMsg(''); setError(false); 
            setSuccess(false)},3000)
            setLoading(false)
        })
    }

    const handleCardDelete = (id) => {

        setLoading(true)
        Axios.delete(`/api/users/paymentMethods/${userInfo._id}/${id}`)
        .then((res)=>{
            let data = cards.filter((e)=>e.id != id)
            setCards(data)
            setLoading(false)
        })
        .catch((err)=>{
            console.log(err)
        })
    }

    const handleCardEdit = (id) => {

        localStorage.setItem('updateCardId', id)
        setIsUpdate(true)
        for(let i=0; i<cards.length; ++i){
             if(cards[i].id == id){
                 setName(cards[i].name)
                 setCardNo(`${cards[i].last4}`)
                 setExpiryMonth(cards[i].exp_month)
                 setExpiryYear(cards[i].exp_year)
             }
        }
      setShow(true)
    }

    const handleCardUpdate = () => {
        setLoading(true)
        let data = {
            name: name,
            expiryMonth: expiryMonth,
            expiryYear: expiryYear
        }


        Axios.put(`/api/users/paymentMethods/${userInfo._id}/${localStorage.getItem('updateCardId')}`, data)
        .then((res)=>{
            console.log(res.data)
            let data = cards.filter((e)=>e._id != localStorage.getItem('updateCardId'))
            data = [...data, res.data]
            setCards(data)
            setShow(false)
            setLoading(false)
        })
        .catch((err)=>{
              setMsg("Invalid Card Details")
              setTimeout(()=>{setMsg('')},3000)
              setLoading(false)
        })
    }

    useEffect(()=>{
        Axios.get(`/api/users/paymentMethods/${userInfo._id}`)
        .then((res)=>{
            setLoading(false)
             setCards(res.data)
        })
        .catch((err)=>{
            console.log(err)
        })
    },[])

return(<>
    <section className="accountMain-wraper">
        <Container>
            <Row>
                <Col md={12}>
                    <h1 className="main-heading">My Account</h1>
                </Col>
            </Row>
            <Row>
                <SideBar/>
                <Col md={12} lg={9} xl={9}>
                    <div>
                    <div className="paymentMethod-main">
                        <h4 className="heading">Payment Methods</h4>
                        <div style={{display: loading? "initial": "none"}}>
                            <Loader />
                        </div>
                        <div className="paymentCardBox" style={{display: loading? "none": "initial"}}>
                            {success&&<Alert variant="success">{msg}</Alert>}
                            {error&&<Alert variant="danger">{msg}</Alert>}
                            <div className="cardBox-heading">
                                <Row className="row">
                                    <Col md={7}>
                                        <p><strong>Your Saved Credit / Debit Cards</strong></p>
                                    </Col>
                                    <Col md={5}>
                                        <p>Expires</p>
                                    </Col>
                                </Row>                                
                            </div>
                            <div className="paymentCard-listing">
                                <Accordion defaultActiveKey='0'>
                                    {cards.length != 0?
                                        cards.map((e,i)=>(
                                            <Card key={i}>
                                            <Card.Header>
                                                <Accordion.Toggle as={Button} variant="link cardHeading" eventKey={`${i}`}>
                                                    <div className="row align-items-center">
                                                        <div className="col-12 col-md-7">
                                                            <h5>{e.funding} Card <span>ending in {e.last4}</span></h5>
                                                        </div>
                                                        <div className="col-9 col-md-2">
                                                            <p>{e.exp_month}/{e.exp_year}</p>
                                                        </div>
                                                        {
                                                            e.brand == 'Visa'?
                                                            <div className="col-3 col-md-3">
                                                            <img src="assets/img/icon-visa.png" alt="img" />
                                                            </div>
                                                            :
                                                            e.brand == 'MasterCard'?
                                                            <div className="col-3 col-md-3">
                                                            <img src="assets/img/icon-masterCard.png" alt="img" />
                                                             </div>
                                                            :
                                                            <></>
                                                        }
                                                    </div>
                                                </Accordion.Toggle>
                                            </Card.Header>
                                            <Accordion.Collapse eventKey={`${i}`}>
                                                <Card.Body>
                                                    <h4>{e.name}</h4>
                                                    {/* <p>398 Sandra Squares Swiftchester,<br /> MT 00301</p> */}
                                                    <div className="cardUpdateBtn">

                                                        <a onClick={()=>{handleCardEdit(e.id)}} className="edit"><i className="far fa-edit"></i></a>

                                                        <Popconfirm
                                                            title="Are you sure?"
                                                            okText="Yes"
                                                            cancelText="No"
                                                            onConfirm={()=>{handleCardDelete(e.id)}}
                                                        >
                                                            <a className="delete"><i className="far fa-trash-alt"></i></a>
                                                        </Popconfirm>
                                                    </div>
                                                </Card.Body>
                                            </Accordion.Collapse>
                                        </Card>
                                        ))
                                        :
                                      <Empty description={'No Payment Method Added!!'}/>
                                    }
                                </Accordion>
                                
                            </div>
                            <div className="paymentAddNewCard-wraper">
                                <Button variant="" onClick={handleShow}>
                                    <i className="fas fa-plus"></i> Add new Card
                                </Button>
                                <Modal show={show} onHide={handleClose} className="paymentAddNewCard">
                                    <Modal.Header closeButton>
                                        <h5 className="modal-title">{isUpdate? "Edit Card":"Add New Card"}</h5>
                                    </Modal.Header>
                                    <Modal.Body>
                                    <div style={{display: loading? "initial": "none"}}>
                                        <Loader />
                                    </div>
                                        {/* <span style={{color: 'red'}}>{msg}</span> */}
                                        <Form style={{display: loading? "none": "initial"}}>
                                            <Row className="align-items-end">
                                                <Col md={6}>
                                                    <Form.Group controlId="addCardNumber">
                                                        <Form.Label>Card Number {isUpdate?"(End With)":""}</Form.Label>
                                                        <Form.Control disabled={isUpdate} type="number" value={cardNo} onChange={(e)=>{setCardNo(e.target.value)}} />
                                                    </Form.Group>
                                                </Col>
                                                <Col md={3}>
                                                    <Form.Group controlId="addExpireDate">
                                                        <Form.Label>Expire Date</Form.Label>
                                                        <Form.Control as="select" value={expiryMonth} onChange={(e)=>{setExpiryMonth(e.target.value)}}>
                                                            <option value="1">Jan</option>
                                                            <option value="2">Feb</option>
                                                            <option value="3">Mar</option>
                                                            <option value="4">Apr</option>
                                                            <option value="5">May</option>
                                                            <option value="6">June</option>
                                                            <option value="7">July</option>
                                                            <option value="8">Aug</option>
                                                            <option value="9">Sep</option>
                                                            <option value="10">Oct</option>
                                                            <option value="11">Nov</option>
                                                            <option value="12">Dec</option>
                                                        </Form.Control>
                                                    </Form.Group>
                                                </Col>
                                                <Col md={3}>
                                                    <Form.Group controlId="addYear">
                                                        {/* <Form.Label>Expire Date</Form.Label> */}
                                                        <Form.Control as="select" value={expiryYear} onChange={(e)=>{setExpiryYear(e.target.value)}}>
                                                            <option value="2021">2021</option>
                                                            <option value="2022">2022</option>
                                                            <option value="2023">2023</option>
                                                            <option value="2024">2024</option>
                                                            <option value="2025">2025</option>
                                                            <option value="2026">2026</option>
                                                            <option value="2027">2027</option>
                                                            <option value="2028">2028</option>
                                                            <option value="2029">2029</option>
                                                        </Form.Control>
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                            <Row className="align-items-end">
                                                <Col md={6}>
                                                    <Form.Group controlId="addCardName">
                                                        <Form.Label>Card Name</Form.Label>
                                                        <Form.Control type="text" value={name} onChange={(e)=>{setName(e.target.value)}} />
                                                    </Form.Group>
                                                </Col>
                                                <Col md={6} style={{display: isUpdate?"none":"initial"}}>
                                                    <Form.Group controlId="addCVV">
                                                        <Form.Label>CVV</Form.Label>
                                                        <Form.Control type="number" value={cvv} onChange={(e)=>{setCvv(e.target.value)}} />
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                            {/* <Form.Group as={Row} controlId="addSavecard">
                                                <Col md={12}>
                                                    <Form.Check label="Save card" />
                                                </Col>
                                            </Form.Group> */}
                                            <button onClick={isUpdate?handleCardUpdate:handleCardSave} className="btn btn-primary">{isUpdate? "Update":"Save"}</button>
                                        </Form>
                                    </Modal.Body>
                                </Modal>
                                
                            </div>
                        </div> 
                    </div>
                    </div>
                </Col>
            </Row>
        </Container>
    </section>
</>);
}

export default PaymentMethods;