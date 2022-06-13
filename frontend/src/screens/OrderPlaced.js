import React, { useEffect, useState } from 'react'
import { Container, Row, Col, Table, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/Loader'
import SideBar from "../components/Sidebar"
import SimilarProduct from "../components/SimilarProduct"
import axios from 'axios'
import { Popconfirm } from 'antd';
import CancelReasonModal from '../screens/cancelReasonModal'

const OrderPlaced = ({ history }) => {

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const [ordersList, setOrders] = useState(()=>[])

  //states for cancelling order

  const [ show, setShow] = useState(()=>false)

  useEffect(()=>{
            let order = JSON.parse(localStorage.getItem('orders'))
            setOrders(order)
            window.scrollTo(0, 0)
  },[])


  const [loading, setLoading] = useState(()=>false)


  const handleSave = async (id, reason, comments) => {

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    setLoading(true)
    let response = await axios.put(`/api/orders/cancel/${id}`, {reason:reason, comments:comments},config)
    history.push('/cancelled-orders')
  }

  return (
    <>
      <section className="accountMain-wraper">
        <Container>
          <Row>
            <div className="col-md-12">
              <h1 className="main-heading">My Account</h1>
            </div>
          </Row>
          <Row>
            <SideBar />
            <Col md={12} lg={9} xl={9}>
              <div className="paymentMethod-main myorder-info full-size">
                <h4 className="heading">Order Summary</h4>
                
                {/* <OrderSteps /> */}
                <div style={{display: loading?'initial':'none'}}>
                <Loader />
                </div>
                
                  <div className="orderListing"  style={{display: loading?'none':'initial'}}>                  
                      <div className="order-detail box-shadow">
                        <div className="title">
                        <Row>
                            <Col md={9} sm={12}>
                              <div className="full-size">
                                <p>Order Created</p>
                              </div>
                            </Col>
                            <Col md={3} sm={12}>
                              <div className="full-size text-right right-sec">
                                <h4>order placed</h4>
                                {/* <p>dec-10-2020</p> */}
                              </div>
                            </Col>
                          </Row>
                          </div>
                        {
                           ordersList.length != 0?
                           ordersList.map((e, i)=>(
                              <figure className="single-item" key={i}>
                              <div className="image">
                                <img src={e.productImage} alt="" />
                              </div>
                              <div className="content">
                                <h5>{e.variantName}</h5>
                                <p>$ {e.price}</p>
                                <div className="button">
                                  {
                                    e.fromPrintful?
                                    <></>
                                    :
                                    <></>
                                  // <a className="order" href={e.tracking_url_provider} target='_blank'>track order</a>
                                  }

                                  <CancelReasonModal isCancel={false} handleSave={handleSave} id={e._id}/>
                                  {/* <a className="chat chat-seller-btn" href=""> chat with seller</a> */}
                                </div>
                              </div>
                            </figure>
                           ))
                           :
                           <></>
                    }
                      </div>
                  </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      
      <SimilarProduct />
    </>
  )
}

export default OrderPlaced
