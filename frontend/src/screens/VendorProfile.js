import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import Axios from 'axios'
import Product from '../components/Product'
import { Empty } from 'antd'
import Paginate from '../components/Paginate'

const VendorScreen = ({match, location, history }) => {

const keyword = match.params.keyword?match.params.keyword : ""
const vendorId = match.params.vendorId
const name = match.params.name
const pageNumber = match.params.pageNumber || 1

 
  //category
  
  const [loading, setLoading] = useState(()=>true)
  const [displayProduct, setDisplayProduct] = useState(()=>[])
  const [products, setProducts] = useState(()=>[])
  const [noti, setNoti] = useState(()=>'')
  const [page, setPage] = useState(()=>0)
  const [pages, setPages] = useState(()=>0)

  const [wishlist, setWishlist] = useState(()=>[])
  
  const [userInfo, setUserInfo] = useState(()=>{})
  const [categories, setCategories] = useState(()=>[])
  const [active, setActive] = useState(()=>'')


  useEffect(()=>{
         
          if(vendorId){

            Axios.get(`/api/products/vendor-get-products-category/${vendorId}`)
            .then((res)=>{
              setUserInfo(res.data.vendor)
              setCategories(res.data.data)
              if(res.data.data.length != 0){
                setActive(res.data.data[0].categoryId)
              }
              setLoading(false)
                console.log(res.data)
            })
            .catch((err)=>{

            })
          }
            
    }, [vendorId])
  
  

  return (
    <section className="accountMain-wraper">
      <Container>
        <Row>
          <Col md={12}>
            {/* <h1 className="main-heading">My Account</h1> */}
          </Col>
        </Row>
        <Row>
        <>
            <div className="col-md-12 col-lg-3 col-xl-3">
                <div className="account-sidebarLeft">
                <div className="card-wraper">
                    <div className="card-bg">
                        <div className="bg-img">
                            <img src={`/img/login-bg-1.png`} alt="img" />
                        </div>
                        <div className="card-user-wraper">
                            <div className="card-user">
                                <div className="user-img-wraper">
                                    <div className="user-img">
                                        <img src={userInfo?userInfo.profilePic:`/img/logo.png`} alt="img" />
                                    </div>
                                </div>
                            </div>
                            <div className="user-detail">
                                <h4>{userInfo?userInfo.name:''}</h4>
                                <p>{userInfo?userInfo.role:''}</p>
                            </div>
                        </div>
                    </div>
                    <div className="card-followers">
                        <ul>
                            <li>
                                <h4>Followers</h4>
                                <p>155</p>
                            </li>
                            <li>
                                <h4>Following</h4>
                                <p>398</p>
                            </li>
                        </ul>
                    </div>
                    <div className="box-footer">
                        <ul>
                            <li>
                                <a href="#"><i className="las la-user"></i> Social Profile</a>
                            </li>
                            <li>
                                <a href="#">
                                    <svg width="22" height="20" viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M21 10H17L14 19L8 1L5 10H1" stroke="white" stroke-width="1.5" stroke-linecap="round"
                                            stroke-linejoin="round" />
                                    </svg>
                                    Dashboard
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                    <div className="sidebar-accountMenu">
                        <div className="media">
                            <div className="mr-3 img profileImg">
                            <svg width="20" height="22" viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M4 1L1 5V19C1 19.5304 1.21071 20.0391 1.58579 20.4142C1.96086 20.7893 2.46957 21 3 21H17C17.5304 21 18.0391 20.7893 18.4142 20.4142C18.7893 20.0391 19 19.5304 19 19V5L16 1H4Z" stroke="#2AA8F2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                              <path d="M1 5H19" stroke="#2AA8F2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                              <path d="M14 9C14 10.0609 13.5786 11.0783 12.8284 11.8284C12.0783 12.5786 11.0609 13 10 13C8.93913 13 7.92172 12.5786 7.17157 11.8284C6.42143 11.0783 6 10.0609 6 9" stroke="#2AA8F2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                            </svg>
                            </div>
                            <div className="media-body">
                                <h5 className="mt-0">Product Categories</h5>
                           </div>
                        </div>
                        <ul>

                          {
                             categories.length != 0?
                             categories.map((e)=>(
                              <li key={""} key={e.categoryId}>
                              <a href="#" onClick={()=>{setActive(e.categoryId)}}>
                                  <span>{e.category}</span>
                              </a>
                          </li>
                             ))
                             :
                             <></>
                          }
                        </ul>
                    </div>

                    <div className="sidebar-accountMenu">
                        <div className="media">
                            <div className="mr-3 img profileImg">
                            <i className="fas fa-ellipsis-h"></i>
                            </div>
                            <div className="media-body">
                                <h5 className="mt-0">See More</h5>
                           </div>
                        </div>
                        <ul>
                              <li key={""} >
                              <a href="#" >
                                  <span>{userInfo?`${userInfo.name.split(' ')[0]}' TV`:``}</span>
                              </a>
                          </li>

                          <li key={""} >
                              <a href="#" >
                                  <span>{userInfo?`${userInfo.name.split(' ')[0]}' Social`:``}</span>
                              </a>
                          </li>

                          <li key={""} >
                              <a href="#" >
                                  <span>{userInfo?`${userInfo.name.split(' ')[0]}' Merch`:``}</span>
                              </a>
                          </li>

                          <li key={""} >
                              <a href="#" >
                                  <span>{userInfo?`${userInfo.name.split(' ')[0]}' Event`:``}</span>
                              </a>
                          </li>

                          <li key={""} >
                              <a href="#" >
                                  <span>{userInfo?`${userInfo.name.split(' ')[0]}' Virtual Classes`:``}</span>
                              </a>
                          </li>
                  
                        </ul>
                    </div>
                </div>
            </div>
        </>
          <Col md={12} lg={9} xl={9}>
            <div className="paymentMethod-main">
            <div className="products-listing">
           
            {loading ? (
              <Loader />
            ): (
              <>
              {/* {noti? <Message>{noti}</Message>: <></>} */}
              <div className="products products-grid mgs-products">
              <div className="mgs-productsWraper">

                {
                  categories && categories.length != 0?
                  categories.map((val)=>(
                    <div style={{display: val.categoryId == active?'initial':'none'}}>
                    <Row  key={Math.random()}>
                {
                    (val.products && val.products != 0)?
                    val.products.map((product) => (
                    <Col key={product._id} className='col-xl-4 col-lg-6 col-md-6 col-sm-12'>
                      <Product setNoti={setNoti} wishlist={wishlist} setWishlist={setWishlist} userInfo={userInfo} product={product} vendor={true}/>
                    </Col>
                  ))
                  : 
                  <div style={{margin: 'auto'}}>
                  <Empty
                      image="/assets/img/logo.png"
                      description={
                        <span style={{fontWeight: 'bold'}}>
                          No Product(s) to display
                        </span>
                      }
                    ></Empty>
                    </div>
                }
                </Row>
                </div>
                  ))
                  :
                  <></>
                }
                {/* <Row>
                {
                    (displayProduct && displayProduct.length != 0)?
                  displayProduct.filter((e)=>e.parentid == 'parent').map((product) => (
                    <Col key={product._id} className='col-xl-4 col-lg-6 col-md-6 col-sm-12'>
                      <Product setNoti={setNoti} wishlist={wishlist} setWishlist={setWishlist} userInfo={userInfo} product={product} vendor={true}/>
                    </Col>
                  ))
                  : 
                  <div style={{margin: 'auto'}}>
                  <Empty
                      image="/assets/img/logo.png"
                      description={
                        <span style={{fontWeight: 'bold'}}>
                          No Product(s) to display
                        </span>
                      }
                    ></Empty>
                    </div>
                }
                </Row> */}
              </div>
                
              </div>
{/*                 
                <Paginate
                  pages={pages}
                  page={page}
                  keyword={keyword ? keyword : ''}
                /> */}
              </>
            )}
          </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}
// const ProfileScreen=[]
export default VendorScreen
