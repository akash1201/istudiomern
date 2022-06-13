import React, { useEffect, useState } from 'react'
import {  useSelector } from 'react-redux'
import { Container, Row, Col } from 'react-bootstrap'
import OrderSteps from '../components/OrderSteps'
import SideBar from "../components/Sidebar"
import SimilarProduct from "../components/SimilarProduct"
import {useHistory} from 'react-router-dom'
import {Table, Empty, Popconfirm} from 'antd'
import Axios from 'axios'
import Loader from '../components/Loader'
import Paginate from "../components/Paginate"
import Message from '../components/Message'
import { QuestionCircleOutlined } from '@ant-design/icons';
import ReviewProduct from './ReviewProduct' 

const DeliveredOrdersScreen = ({match}) => {

	let pageNo = match.params.pageNo || 1
	let history = useHistory()
	const [deliveredOrders, setDeliveredOrders] = useState(()=>[])
	const [loading, setLoading] = useState(()=>true)
	const [pages, setPages] = useState(()=>0)

	const [msg, setMsg] = useState(()=>'')


	const userLogin = useSelector((state) => state.userLogin)
	const { userInfo } = userLogin

	

	if(!userInfo){
		history.push('/login')
	}

	useEffect(()=>{
		getDeliveredOrders()
	}, [pageNo])

	const getDeliveredOrders = async () => {
		setLoading(true)
		let config ={
			headers: {
				Authorization: `Bearer ${userInfo.token}`
			}
		}
              try{
		let response = await Axios.get(`/api/orders/getDeliveredOrders/${userInfo._id}/${pageNo}`,config)
		setLoading(false)	
		console.log(response.data.orders)  
		setDeliveredOrders(response.data.orders)
		setPages(response.data.pages)
	    }catch(err){
		    setLoading(false)
	    }
	}

	const buyAgain = (id, fromPrintful) => {
		if(fromPrintful){
			history.push(`/istudio-merch/product/${id}`)
		}else{
			history.push(`/product/${id}`)
		}
	        }

	const returnProduct = async (orderId) => {
              setLoading(true)
	    try{
		    const config = {
			    headers : {
				    Authorization : `Bearer ${userInfo.token}`
			    }
		    }
		    let response = await Axios.put(`/api/orders/requestReturn/${orderId}`, {}, config)
		let data = [...deliveredOrders]
		for(let i=0; i<data.length; ++i){
		    if(data[i]._id == orderId){
			    data[i].isReturn = true
		    }
		}
		setDeliveredOrders(data)
	    }catch(err){
		    setMsg(err.message)
	    }
	    setLoading(false)
	}

	        const columns = [{
		
			title: ' ',
			dataIndex: 'orders',
			key: 'orders',
			width: '100%',
			render: (text, e)=>(
				<div className="order-detail box-shadow" key={e._id}>
				<div className="title">
					<Row>
						<Col md={9} sm={12}>
							<div className="full-size">
								<h4>Delivered {e.updatedAt.split('T')[0].split('-')[2]+"-"+e.updatedAt.split('T')[0].split('-')[1]+"-"+e.updatedAt.split('T')[0].split('-')[0]} <span>(order # {e._id.toUpperCase()})</span></h4>
								{/* <p>return window open till jun-02-2020</p> */}
							</div>
						</Col>
						<Col md={3} sm={12}>
							<div className="full-size text-right right-sec">
								{/* <h4>order placed</h4>
								<p>{e.createdAt.split('T')[0].split('-')[2]+"-"+e.createdAt.split('T')[0].split('-')[1]+"-"+e.createdAt.split('T')[0].split('-')[0]}</p> */}
							</div>
						</Col>
					</Row>
				</div>
				         <div>
					{e.canBeReturned?e.isReturn && !e.returnApproved?<span style={{color: 'red'}}>Return request raised, waiting for vendor confirmation.</span>:e.isReturn && e.returnApproved?<span style={{color: 'red'}}>Return request approved, check mail for return label.</span>:<></>:<></>}
					</div>
				<figure className="single-item">
				
					<div className="image">
						<img src={e.productImage} alt="" />
					</div>
					<div className="content">
						<h5>{e.variantName}</h5>
						<p>$ {e.price.toFixed(2)}</p>
						<div className="button">
							{/* <a className="order" onClick={()=>{buyAgain(e.productId, e.fromPrintful)}}>buy again</a> */}
							{/* {e.fromPrintful?<></>:<a className="cancel" href="">product review</a>} */}
							{e.canBeReturned?e.isReturn?e.returnApproved?<a className="cancel" >Return Approved</a>:<></>:<Popconfirm title="Are you sure？" onConfirm={()=>{returnProduct(e._id)}} icon={<QuestionCircleOutlined style={{ color: 'red' }} />}><a className="cancel">Return</a></Popconfirm>:<></>}
							{e.canBeReturned?e.isReturn?e.returnApproved?<a className="cancel" href={e.return_shipping_label} target='_blank'>Return Label</a>:<></>:<></>:<></>}
							{e.canBeReturned?e.isReturn?e.returnApproved?<a className="cancel" href={e.return_tracking} target='_blank'>Return Status</a>:<></>:<></>:<></>}
							{e.shipping_status == 'Package Delivered' ? <ReviewProduct productId={e.productId}/> : <></>}
						</div>
					</div>
				</figure>
			</div>
			)
		        
	        }]

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
							<div className="paymentMethod-main myorder-info">
								<h4 className="heading">My Orders</h4>

								<OrderSteps />
								<div style={{display: loading? 'initial':'none'}}>
									<Loader />
								</div>

								<Row>
								  <Col>
								    {msg && <Message variant='danger'>{msg}</Message>}
								  </Col>
								</Row>

								<div className="orderListing" style={{display: loading? 'none':'initial'}}>
									{
									deliveredOrders.length != 0?
									<>
									<Table
									  dataSource={deliveredOrders}
									  columns={columns}
									  pagination={false}
									  rowKey='_id'
									/>
									<Paginate url='/delivered-orders' page={pageNo} pages={pages}/>
									</>
									: 
									<Empty description={'Time to buy something'} />	
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

export default DeliveredOrdersScreen
