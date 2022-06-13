import Axios from 'axios'
import React, { useEffect, useState, useRef } from 'react'
import { Container, Row, Col, Button,Tabs, Tab } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import SideBar from "../components/Sidebar"
import SimilarProduct from "../components/SimilarProduct"
import Loader from '../components/Loader'
import { Empty, Table } from 'antd'
import Paginate from '../components/Paginate'
import ReceivedOrderSteps from '../components/ReceivedOrderSteps'
import ApproveReturnModal from './ApproveReturnModal'

const OrderReceived = ({ match,history }) => {
  const dispatch = useDispatch()

  const pageNo = match.params.pageNo || 1
  
  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const [listOrder, setListOrder] = useState(()=>[])
  const [loading, setLoading] = useState(()=>true)
  const [pageSize, setPageSize] = useState(()=>0)


  if(!userInfo){
            history.push('/login')
  }

  useEffect(() => {
    if (userInfo && (userInfo.userType == 'admin' || userInfo.userType == 'vendor')) {
//       dispatch(listOrders())
    } else {
      history.push('/login')
    }
  }, [dispatch, history, userInfo])

  useEffect(()=>{
    getAllOrders()
    document.title = 'Cancelled Orders'
  },[pageNo])

  const getAllOrders = async () => {
     
    window.scrollTo(0,0)
    let config = {
      headers:{
        Authorization: `Bearer ${userInfo.token}`
      }
    }
   setLoading(true)
    Axios.get(`/api/orders/vendorGetCancelledOrdersById/${userInfo._id}/${pageNo}`, config)
    .then((res)=>{
        setLoading(false)
        setListOrder(res.data.orders)
        setPageSize(res.data.pages)
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
          title: 'Approve Cancellation',
          dataIndex: '',
          key: '',
          render: (text, e) => {
            return(<>
                {e.returnApproved?<span style={{color: 'green', fontSize: '150%'}}><i className="fas fa-check"></i></span>:<ApproveReturnModal orderId = {e._id} orders={listOrder} setListOrder={setListOrder}/>}
              </>)
          }
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
                <h4 className="heading">Return Requests</h4>
                <ReceivedOrderSteps />
                  {loading ? (
                  <Loader />
                ) : (
                 <>
                  <Table 
                  columns={columns}
                  dataSource={listOrder}
                  rowKey={'_id'}
                  pagination={false}
                 />
                 <Paginate url='/admin/approve-return-orders' page={pageNo} pages={pageSize}/>
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
