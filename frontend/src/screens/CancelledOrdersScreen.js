import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Container, Row, Col } from 'react-bootstrap'
import OrderSteps from '../components/OrderSteps'
import SideBar from "../components/Sidebar"
import SimilarProduct from "../components/SimilarProduct"
import Axios from 'axios'
import { Empty, Table } from 'antd';
import Loader from '../components/Loader'
import Paginate from '../components/Paginate'

const CancelledOrdersScreen = ({ match, history }) => {

	let pageNo = match.params.pageNo || 1

	const [cancelledOrders, setCancelledOrders] = useState(()=>[])
	const [loading, setLoading] = useState(()=>true)
	const [pages, setPages] = useState(()=>0)


	const userLogin = useSelector((state) => state.userLogin)
	const { userInfo } = userLogin

	

	if(!userInfo){
		history.push('/login')
	}

	useEffect(()=>{
		getCancelledOrders()
	}, [pageNo])

	const getCancelledOrders = async () => {
		setLoading(true)
		window.scrollTo(0,0)
		let config ={
			headers: {
				Authorization: `Bearer ${userInfo.token}`
			}
		}
              try{
		let response = await Axios.get(`/api/orders/cancelled/${userInfo._id}/${pageNo}`,config)
		setLoading(false)	     
	          setCancelledOrders(response.data.orders)
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
								<h4>cancelled {e.updatedAt.split('T')[0].split('-')[2]+"-"+e.updatedAt.split('T')[0].split('-')[1]+"-"+e.updatedAt.split('T')[0].split('-')[0]}  <span>(order # {e._id.toUpperCase()})</span></h4>
								{/* <p>return window open till jun-02-2020</p> */}
							</div>
						</Col>
						<Col md={3} sm={12}>
							<div className="full-size text-right right-sec">
								<h4>order placed</h4>
								<p>{e.createdAt.split('T')[0].split('-')[2]+"-"+e.createdAt.split('T')[0].split('-')[1]+"-"+e.createdAt.split('T')[0].split('-')[0]}</p>
							</div>
						</Col>
					</Row>
				</div>
				<figure className="single-item">
					<div className="image">
						<img src={e.productImage} alt="" />
					</div>
					<div className="content">
						<h5>{e.variantName}</h5>
						<p>$ {e.price.toFixed(2)}</p>
						<div className="button">
							<a className="order" onClick={()=>{buyAgain(e.productId, e.fromPrintful)}}>buy again</a>
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

								<div className="orderListing" style={{display: loading? 'none':'initial'}}>
									{
									cancelledOrders.length != 0?
									<>
									<Table
									rowKey='_id'
									  dataSource={cancelledOrders}
									  columns={columns}
									  pagination={false}
									/>
									 <Paginate url='/cancelled-orders' page={pageNo} pages={pages}/>
						
									</>
									: 
									<Empty description={'No Orders Cancelled'} />	
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

export default CancelledOrdersScreen
