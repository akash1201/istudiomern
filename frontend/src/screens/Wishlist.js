import React, {useEffect, useState} from "react"
import SideBar from "../components/Sidebar"
import { Container, Row, Col } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import Axios from 'axios'
import { Empty } from 'antd'
import Loader from '../components/Loader'
import Message from "../components/Message"

const Wishlist = ({history}) => {

    const userLogin = useSelector((state) => state.userLogin)
    const { userInfo } = userLogin
     
    if(!userInfo){
        history.push('/login')
    }
     
    const [wishlist, setWishlist] = useState(()=>[])
    const [loading, setLoading] = useState(()=>true)
    const [success, setSuccess] = useState(()=>false)

    useEffect(()=>{
        getAllWishlist()
        window.scrollTo(0,0)
    },[])

    const getAllWishlist = async () =>{
        
        if(userInfo){
            let config = {
                headers : {
                    'Authorization' : `Bearer ${userInfo.token}`
                }
            }
            Axios.get(`/api/wishlist/products/${userInfo._id}`, config)
            .then((res)=>{
                setWishlist(res.data.data)
                setLoading(false)
            })
            .catch((err)=>{
                console.log(err)
            })
        }
    }

    const removeFromWishlist = (id) => {
      if(userInfo){
          let config = {
              headers : {
                  'Authorization' : `Bearer ${userInfo.token}`
              }
          }
          setLoading(true)
          Axios.delete(`/api/wishlist/${userInfo._id}/${id}`, config)
          .then((res)=>{
               let data = []
               data = wishlist.filter((e)=>e._id != id)
               setWishlist(data)
               setLoading(false)
               setSuccess(true)
               setTimeout(()=>{setSuccess(false)}, 3000)
               
          })
          .catch((err)=>{
              console.log(err)
              setLoading(false)
          })
      }
    }

    const addToCart = (fromPrintful, id) => {

        if(fromPrintful){
           history.push(`/istudio-merch/product/${id}`)
        }else{
            history.push(`/product/${id}`)
            // product/60d9f65a015e0b72a8198a90
        }
    }

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
          <div className="paymentMethod-main wishlist-item-sec">
            <h4 className="heading">My Wishlist</h4> 
            <Row>
                <Col>
                  {success &&  <Message variant='danger'>Removed from wishlist</Message>}
                </Col>
            </Row>
            <div style={{display: loading? 'initial':'none'}}>
            <Loader />
            </div>
            <div className="wishlist-item-sec"  style={{display: loading? 'none':'initial'}}>
                {
                    wishlist && wishlist.length == 0?
                    <Empty description={<b style={{color:'black'}}>Your wishlist is empty</b>} image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    :
                    wishlist.map((e)=>(
                        <figure key={e._id} className="single-list">
                  <div className="full-size item">
                      <div className="image">
                          <img src={e.thumbnailImage} />
                      </div>
                      <div className="detail">
                          <h5>{e.name}</h5>
                          <span className="auther"><span className="gray">by:</span> {e.brand}</span>
                          <div className="button">
                              <a className="btn blue" onClick={()=>{addToCart(e.fromPrintful, e._id)}}><i className="las la-shopping-cart"></i> add to cart</a>
                              <a className="btn gray" onClick={()=>{removeFromWishlist(e._id)}}>remove</a>
                          </div>
                      </div>
                      <span>
                      <i className="fas fa-calendar-alt"></i> {(e.createdAt.split('T')[0]).split('-')[2]+"-"+(e.createdAt.split('T')[0]).split('-')[1]+"-"+(e.createdAt.split('T')[0]).split('-')[0]}
                      </span>
                  </div>
                  <hr/>
                </figure>
                    ))
                }
            </div>  
          </div>
        </Col>
      </Row>
    </Container>
  </section>
 </>);

}

export default Wishlist;