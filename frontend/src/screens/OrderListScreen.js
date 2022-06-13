import Axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import OrderSteps from '../components/OrderSteps'
import SideBar from "../components/Sidebar"
import SimilarProduct from "../components/SimilarProduct"
import Loader from "../components/Loader"
import {Empty, Table} from 'antd'
import { Popconfirm } from 'antd';
import CancelReasonModal from './cancelReasonModal'
import Paginate from '../components/Paginate'
import ReviewProduct from './ReviewProduct' 

const OrderListScreen = ({ match,history }) => {
  
  let pageNo = match.params.pageNo || 1


  // const orderList = useSelector((state) => state.orderList)
  // const {  error, orders } = orderList

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const [listOrder, setListOrder] = useState(()=>[])
  const [loading, setLoading] = useState(()=>true)
  const [pages, setPages] = useState(()=>0)

  useEffect(()=>{
    window.scrollTo(0,0)
    getAllOrders()
  },[pageNo])

  const getAllOrders = async () => {

    let config = {
      headers:{
        Authorization: `Bearer ${userInfo.token}`
      }
    }
    setLoading(true)
    window.scrollTo(0,0)
    Axios.get(`/api/orders/getAllOrdersById/${userInfo._id}/${pageNo}`, config)
    .then((res)=>{
      console.log(res.data)
        setListOrder(res.data.orders)
        setPages(res.data.pages)
        setLoading(false)
    })
    .catch((err)=>{
      console.log(err)
    })

  }

  const cancelOrder = async (id, reason, comments) => {

    let config = {
      headers:{
        Authorization: `Bearer ${userInfo.token}`
      }
    }

  setLoading(true)
  
  let response = await Axios.put(`/api/orders/cancel/${id}`, {reason:reason, comments:comments},config)

  history.push('cancelled-orders')

  }

  const columns = [
    {
      title: ' ',
      dataIndex: 'orders',
      key: 'orders',
      width: '100%',
      render: (text, e)=>(
        <div key={e._id} className="order-detail box-shadow">
                        <div className="title">
                          <Row>
                            <Col md={9} sm={12}>
                              <div className="full-size">
                              <h4>
                                {/* arriving wednesday dec-16-2020  */}
                                <span>(order # {e._id.toUpperCase()})</span>
                                </h4>
                                <p style={{color: e.isCancel?'red':'#90EE90'}}>{e.shipping_status}</p>
                              </div>
                            </Col>
                            <Col md={3} sm={12}>
                              <div className="full-size text-right right-sec">
                                <h4>order placed</h4>
                                <p>{e.createdAt.split("T")[0].split("-")[2]+"-"+e.createdAt.split("T")[0].split("-")[1]+"-"+e.createdAt.split("T")[0].split("-")[0]}</p>
                              </div>
                            </Col>
                          </Row>
                        </div>
                        <figure className="single-item">
                          <div className="image">
                            <img src={e.productImage} alt="" />
                           
                          </div>
                          <div className="content">
                            <h5>{e.variantName}, {e.qty}-piece</h5>
                            <p>$ {e.price.toFixed(2)}</p>
                            <div className="button">
                              {
                                e.fromPrintful?
                                <></>
                                :
                                e.isCancel?
                                <></>
                                :
                                <a className="order" href={e.tracking_url_provider} target="_blank">track order</a>
                              }
                              {
                                e.isCancel?
                                <></>
                                :
                                <CancelReasonModal shipping_status={e.shipping_status} handleSave={cancelOrder} id={e._id}/>
                              }
                              {
                                e.shipping_status == 'Package Delivered' ? <ReviewProduct productId={e.productId}/> : <></>
                              }
                              {/* <a className="chat chat-seller-btn" href=""> chat with seller</a> */}
                            </div>
                          </div>

                          <div className="content" style={{paddingLeft:'5%'}}>
                            <h5>Shipping Address</h5>
                            <p>{e.shippingAddress.name+", "+e.shippingAddress.address+", "+e.shippingAddress.city+", ZIP:"+e.shippingAddress.postalCode}</p>
                          
                            <h5>Shipping Provider</h5>
                            <p>{e.provider}</p>
          
                          </div>
                        </figure>
                      </div>
      )
    },
  ]

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
                <h4 className="heading">My Orders</h4>
                <OrderSteps />
                <div style={{display: loading?'initial':'none'}}>
                   <Loader />
                </div>
                  <div className="orderListing" style={{display: loading?'none':'initial'}}>   
                  {
                    listOrder.length != 0 ?                    
                   <>
                     <Table 
                     rowKey={'_id'}
                     columns={columns}
                     dataSource={listOrder}
                     pagination={false}
                     />
                     <Paginate url='/orders' page={pageNo} pages={pages}/>
                   </>
                    : 
                    <Empty description={'Time to buy something...!'} />
                  }               
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

export default OrderListScreen
