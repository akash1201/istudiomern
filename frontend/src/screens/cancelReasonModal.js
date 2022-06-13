import React, {useState} from 'react'
import { Alert , Row, Col, Container, Button, Modal, Form} from 'react-bootstrap'
import {Popconfirm} from 'antd'


const CancelReasonModal = ({isCancel,handleSave, id, shipping_status}) => {

          const [error, setError] = useState(()=>'')  
          const [reason, setReason] = useState(()=>'')
          const [comments, setComments] = useState(()=>'')
          const [show, setShow] = useState(()=>false)

          const handleDone = () => {
               if(reason.trim() == ''){
                         setError('Please select a reason')
                         setTimeout(()=>{setError('')}, 3000)
                         return
               }
               if((reason === 'others')&& (comments.trim() == '')){
                    setError('Please Write Reason in Comments')
                    setTimeout(()=>{setError('')}, 3000)
                    return
               }
               setShow(false)
            handleSave(id, reason, comments)
          }

          const handleClose = (e) => {               
                    setShow(false)
          }
         
          return(<>
                             { shipping_status == 'Order Created' && <Popconfirm
                                  title="Are You sure?"
                                  onConfirm={isCancel?()=>{}:()=>{setShow(true)}}
                                  >
                                  <a className="cancel" >{isCancel?"Cancelled":"Cancel"}</a>
                                  </Popconfirm>}
          <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                              <Modal.Title>Cancellation Reason</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                              <Container>
                                        <Row>
                                          <Col>
                                             {error && <Alert variant='danger'>{error}</Alert>}
                                          </Col>
                                        </Row>
                                        <Row>
                                           <Col>
                                           <Form.Group controlId="editCountrySelectCity">
                                                  <Form.Label>Reson</Form.Label>
                                                  <Form.Control as="select"
                                                  // type="text"
                                                  value={reason}
                                                  onChange={(e)=>{setReason(e.target.value)}}
                                                  placeholder="Select a Reason"
                                                  >
                                                  <option value="">{"Select a Reason"}</option>
                                                  <option value="Changed-My-Mind">{"Changed My Mind"}</option>
                                                  <option value="Expected-Delivery-Date-Has-Changed">{"Expected Delivery Date Has Changed"}</option>
                                                  <option value="Product-Is-Not-Required-Anymore">{"Product Is Not Required Anymore"}</option>
                                                  <option value="Cheaper-Alternative-Available">{"Cheaper Alternative Available"}</option>
                                                  <option value='others'>{'Other Reason(Please write in comments)'}</option>
                                                  </Form.Control>
                                                  </Form.Group>
                                           </Col>
                                        </Row>
                                        <Row>
                                           <Col>
                                           <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                                  <Form.Label>Comments</Form.Label>
                                                  <Form.Control as="textarea" rows={3} value={comments} onChange={(e)=>{setComments(e.target.value)}}/>
                                            </Form.Group>
                                           </Col>
                                        </Row>
                              </Container>
                    </Modal.Body>
                    <Modal.Footer>
                              <Button variant="secondary" onClick={handleClose}>
                              Close
                              </Button>
                              <Button variant="primary" onClick={handleDone}>
                               Done
                              </Button>
                    </Modal.Footer>
          </Modal>
               </>)
}

export default CancelReasonModal