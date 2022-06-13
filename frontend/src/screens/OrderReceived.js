import Axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { listOrders } from '../actions/orderActions'
import SideBar from "../components/Sidebar"
import SimilarProduct from "../components/SimilarProduct"
import Loader from '../components/Loader'
import { Empty, Table } from 'antd'
import Paginate from '../components/Paginate'
import ReceivedOrderSteps from '../components/ReceivedOrderSteps'

const OrderReceived = ({ match, history }) => {
  const dispatch = useDispatch()
  
  const pageNo = match.params.pageNo || 1
  console.log(pageNo)
  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const [listOrder, setListOrder] = useState(()=>[])
  const [pages, setPages] = useState(()=>0)
  const [loading, setLoading] = useState(()=>true)

  if(!userInfo){
            history.push('/login')
  }

  useEffect(() => {
    if (userInfo && (userInfo.userType == 'admin' || userInfo.userType == 'vendor')) {
      dispatch(listOrders())
    } else {
      history.push('/login')
    }
  }, [dispatch, history, userInfo])

  useEffect(()=>{
    getAllOrders()
    document.title = 'Order Received'
  },[pageNo])

  const getAllOrders = async () => {

    let config = {
      headers:{
        Authorization: `Bearer ${userInfo.token}`
      }
    }
    window.scrollTo(0,0)
    setLoading(true)
    Axios.get(`/api/orders/vendorGetOrdersById/${userInfo._id}/${pageNo}`, config)
    .then((res)=>{
        setLoading(false)
        setListOrder(res.data.orders)
        setPages(res.data.pages)
    })
    .catch((err)=>{
      console.log(err)
      setLoading(false)
    })
  }

  const columns = [
    {
      title: 'Product Image',
      dataIndex: 'productImage',
      key: 'productImage',
      render: (text, e) => {
        return(
           <img src={e.productImage} style={{width: '100%'}}/>
        )
      }
    },
    {
      title: 'Product Name',
      dataIndex: 'variantName',
      key: 'variantName',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Shipping Address',
      dataIndex: 'shippingAddress',
      key: 'shippingAddress',
      render: (text, e) => {
        return(
          e.shippingAddress.name+", "+e.shippingAddress.address+", "+e.shippingAddress.city+", ZIP:"+e.shippingAddress.postalCode
        )
      }
    },
    {
      title: 'Order Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text, e) => {
        return(
          e.createdAt.split("T")[0].split("-")[2]+"-"+e.createdAt.split("T")[0].split("-")[1]+"-"+e.createdAt.split("T")[0].split("-")[0]
        )
      }
    },
    {
      title: 'Quantity',
      dataIndex: 'qty',
      key: 'qty',
    },
    {
      title: 'Track Order',
      dataIndex: 'tracking_url_provider',
      key: 'tracking_url_provider',
      render: (text, e) => (
        <a href={e.tracking_url_provider} target='_blank'>Track</a>
      )
    },
    {
      title: 'Shipping Label',
      dataIndex: 'label_url',
      key: 'label_url',
      render: (text, e) => (
        <a href={e.label_url} target='_blank'>Click</a>
      )
    },
  ];



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
                <h4 className="heading">Orders Received</h4>
                <ReceivedOrderSteps />
                  {loading ? (
                  <Loader />
                ) : (
                 <>
                <div className='antd-date'>
                <Table 
                  columns={columns}
                  dataSource={listOrder}
                  rowKey={'_id'}
                  pagination={false}
                 />
                </div>
                 <Paginate url='/ordersReceived' page={pageNo} pages={pages}/>
                 </>
                    )}
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      
      <SimilarProduct />
    </>
  )
}

export default OrderReceived
