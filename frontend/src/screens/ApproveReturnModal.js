import Axios from 'axios'
import React, {useEffect, useState} from 'react'
import {Button, Modal, Row,Col,Dropdown, Container, } from 'react-bootstrap'
import Loader from '../components/Loader'
import {useSelector} from "react-redux"
import {Empty} from 'antd'
import Message from '../components/Message'

const ApproveReturnModal = ({orderId, orders, setListOrder }) => {

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

          const [show, setShow] = useState(()=>false)
          const handleShow = () => {
          
            setShow(true)
          
          }
          const handleClose = () => {setShow(false)}

          const [loading, setLoading] = useState(()=>false)

          const [shippingObj, setShippingObj] = useState(()=>{})
          const [rates, setRates] = useState(()=>[])
          const [selectedMethod, setSelectedMethod] = useState(()=>'')

          const [cards, setCards] = useState(()=>[])
          const [selectedCard, setSelectedCard] = useState(()=>'')

          const [msg, setMsg] = useState(()=>'')

          useEffect(()=>{
                  if(show){
                    getRatesandCards()
                  }  
          }, [show])

          const getRatesandCards = async () => {
                    
                   setLoading(true)
                    let response = await Axios.get(`/api/shippo/get-return-rates/${orderId}`)
                    setRates(response.data)
                    let res = await Axios.get(`/api/users/paymentMethods/${userInfo._id}`)
                    setCards(res.data)
                    setLoading(false)
          }

          const handleSubmit = async (e) => {
             e.preventDefault()
            if(selectedMethod.trim()==''){
              setMsg('select shipping method')
              setTimeout(()=>{setMsg('')}, 3000)
              return
            }
            if(selectedCard.trim() == ''){
              setMsg('select a card')
              setTimeout(()=>{setMsg('')}, 3000)
              return
            }
            const config = {
              headers : {
                'Authorization' : `Bearer ${userInfo.token}`
              }
            }
            try{   
              setLoading(true) 
            let response = await Axios.put(`/api/orders/approveReturn/${orderId}`, {shipping_obj_id: selectedMethod, card: selectedCard, amount: shippingObj.amount },config)
            let data = [...orders]
            for(let i=0; i<data.length; ++i){
              if(data[i]._id == orderId){
                data[i].returnApproved = true
              }
            }
            setListOrder(data)
            setLoading(false) 
          }catch(err){
            console.log(err)
            setMsg('Return Not Approved')
            setTimeout(()=>{setMsg(''); setLoading(false); setShow(false)}, 5000)
            }
          }

          return (<>
                   <Button variant="primary" onClick={handleShow}>
                    Approve
                    </Button>

                    <Modal show={show} onHide={handleClose} id='return-modal'>
                    <Modal.Header closeButton>
                              <Modal.Title>Approve Return</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                            <Container>
                              <Row>
                                <Col>
                                {msg && <Message variant='danger'>{msg}</Message>}
                                </Col>
                              </Row>
                            {
                              !loading?
                               <>
                               <Row>
                                 <Col>
                                   <Message variant='warning'>Please Note that, you're subjected to pay the return delivery charges and amount credited for the product will be automatically refunded from your account.</Message>
                                 </Col>
                               </Row>
                               <Row className='grey-bg nvS-deliveryScreen'>
                                 <Col lg={12}>
                                  <h5>
                                    Shipping Methods<span>Shipping 1 of 2</span>
                                  </h5>
                                </Col>
                              {
                                rates.map((e,i)=>(
                                  <Col sm={6} md={4} lg={4} xl={4} key={i}>
                               <div className={`single-services mb-30 ${ e.provider?'active':''}`} style={{paddingBottom:'5%' }}>
                               <div className="services-ion">
                                 <img src={e.image} style={{width: '29%'}}/>
                               </div>
                               <div className="services-cap">
                               <p className="express">{e.rates[0].servicelevel.name}</p>
                               <p className="deliver">
                               {e.duration?` Delivered within ${e.rates[0].estimated_days} Day`:``} <span>$ {parseFloat(e.rates[0].amount).toFixed(2)}</span>
                               </p>
                             </div>
                             <Dropdown className="box-ship dropdown-box-ship" autoClose="inside">
                                   <Dropdown.Toggle  id="dropdown-autoclose-inside" variant="box-ico"></Dropdown.Toggle>
                       
                                   <Dropdown.Menu className="dropdown-content" id='dropdown-expanded'>
                                   <div className="ship-full">
                                       <div className="box-content">
 
                             {
                               
                                 e.rates.map((rate,i)=>(
                                   rate.provider == e.provider?
                                   <Dropdown.Item key={rate.object_id}>
                                   <div className="media-box" >
                                     <div className="media">
                                       <div className="form-check-inline">
                                         <label
                                           className="form-check-label"
                                           htmlFor="expressService_3"
                                         >
                                           <input
                                             type="radio"
                                             className="form-check-input"
                                             id="expressService_3"
                                             name={rate.provider}
                                             onChange={(e)=>{setShippingObj(rate); setSelectedMethod(e.target.value)}}
                                             value={rate.object_id}
                                             checked={rate.object_id === selectedMethod? true : false}
                                           />
                                         </label>
                                       </div>
                                       <div className="wd-60">
                                         <p className="mt-0 express">{rate.servicelevel.name}</p>
                                         <p className="deliver">Delivered within {rate.estimated_days} Day </p>
                                       </div>
                                       
                                       <div className="deliver-dro">
                                         {" "}
                                         <span>$ {parseFloat(rate.amount).toFixed(2)}</span>
                                       </div>
                                     </div>
                             
                         </div></Dropdown.Item>
                                   :
                                   <>
                                   </>
                                 ))
                               } 
                               </div>
                             </div> 
                         
                       </Dropdown.Menu>
                     </Dropdown>
                         </div>
                         </Col>
                                ))
                              }
                               </Row>
                               
                               <Row>
                               <Col lg={12}>
                                  <h5>
                                    Payment Methods
                                  </h5>
                                </Col>
                               {
                                       userInfo?
                                       cards.length != 0? 
                                       cards.map((e, i)=>(
                                        <div className="save-card-detail" key={i}>
                                        <div className="full-size card-inner">
                                            <Row className="align-items-center">
                                                <Col sm={12} md={6} lg={5}>
                                                <label className="radio radiocheck">
                                                    <input className="radio-input" type="radio" name="stripeSaveCardList" onClick={(e)=>{setSelectedCard(e.target.value)}} value={e.id} />
                                                    <small>{e.funding} Card <small className="gray">ending in {e.last4}</small></small>
                                                    <span></span>
                                                </label>
                                                </Col>
                                                <Col xs={6} sm={6} md={3} lg={3}>
                                                <div className="full-size name text-center">
                                                    <h5>{e.name}</h5>
                                                </div>
                                                </Col>
                                                <Col xs={6} sm={6} md={3} lg={2}>
                                                <div className="full-size name text-center">
                                                    <h5>{e.exp_month}/{e.exp_year}</h5>
                                                </div>
                                                </Col>
                                                <Col sm={12} md={6} lg={2}>
                                                    {
                                                        e.brand == 'Visa'?
                                                        <div className="image">
                                                           <img src="assets/img/icon-visa.png" alt="" />
                                                        </div>
                                                        :
                                                        e.brand == 'MasterCard'?
                                                        <div className="image">
                                                          <img src="assets/img/icon-mastercard.png" alt="" />
                                                        </div>
                                                        :
                                                        <></>
                                                    }
                                                </Col>	
                                            </Row>
                                        </div>
                                    </div>
                                       ))
                                       :
                                       <Empty description={'Add Payment Methods'}/>
                                       :
                                       <Empty description={'Login to add payment '}/>
                                   }
                          
                               </Row>
                               </>
                               :
                               <Row>
                                 <Col>
                                  <Loader/>
                                 </Col>
                               </Row>
                            } 
                            </Container>
                    </Modal.Body>
                    <Modal.Footer>
                              <Button variant="secondary" onClick={handleClose}>
                              Close
                              </Button>
                              <Button variant="primary" onClick={handleSubmit}>
                              Approve
                              </Button>
                    </Modal.Footer>
                    </Modal>
                 </>)
}

export default ApproveReturnModal