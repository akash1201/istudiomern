import Axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import {Link, useHistory} from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Rating from './Rating'

const SimilarProduct = () => {

    let history = useHistory()
    const [productsList, setProductsList] = useState(()=>[])
    const [wishlist, setWishlist] = useState(()=>[])

    const userLogin = useSelector((state) => state.userLogin)
    const { userInfo } = userLogin
     
    useEffect(()=>{
        getAllProducts()
    },[])

    const getAllProducts = async () => {
          
    let response = await Axios.get(`/api/products`)
    let data = []
    for(let i=0; i<response.data.products.length;++i){
        if(i==3){
            break;
        }
        else{
            data = [...data,response.data.products[i]]
        }
    }
    setProductsList(data)
    }
    const [noti, setNoti] = useState(()=>'')

    const addToWishlist = (id) =>{
        if(userInfo){
           Axios.post('/api/wishlist',{
             userId: userInfo._id,
             productId: id
           }).then((res)=>{
                setWishlist((old)=>[...old, id])
               setNoti('Added to wishlist')
               setTimeout(()=>{setNoti('')}, 2000)
           })
           .catch((err)=>{
             console.log('error')
           })
        }else{
          setNoti('Please login to use wishlist feature!')
          setTimeout(()=>{setNoti('')}, 2000)
      }
      }

      const getWishlist =async () => {
    
        if(userInfo){     
          const response = await Axios.get(`/api/wishlist/${userInfo._id}`)
          setWishlist(response.data)
        }  
      }

      const removeFromWishlist = (id) => {
        if(userInfo){
    
          Axios.delete(`/api/wishlist/${userInfo._id}/${id}`)
          .then((res)=>{
            
            let data = []
    
            data = wishlist.filter((e)=> e != id)
            setWishlist(data)
            setNoti("Removed from wishlist")
            setTimeout(()=>{setNoti('')}, 2000)
    
          })
          .catch((err)=>{
            console.log(err)
          })
    
        }
       
      }

      const addToCartHandler = (id) => {
        history.push(`/product/${id}`)
      }

    return (
        <>
            <section className="similarpro-sec section-padding">
                <Container>
                    <div className="full-size mgs-products">
                        <div className="heading">
                            <h3>similar product</h3>
                        </div>
                        <div className='similar-slider'>
                            <Row>
                                {
                                    productsList.length != 0?
                                    productsList.map((product,i)=>(
                                 <Col md={6} lg={4} xl={3} key={i}>
                                    <div className='item product product-item box-shadow'>
        <div className='product-item-info'>
          <div className='product-top'>
            <Link to={`/product/${product._id}`} className='product photo product-item-photo'>
              <span className='product-image-container'>
                <span className='parent_lazy product-image-wrapper lazy_loaded' style={{ paddingBottom: '100%' }}>
                  <img src={product.thumbnailImage} className='img-fluid product-image-photo' />
                </span>
              </span>
            </Link>
          </div>
          <div className='product details product-item-details'>
            <strong className='product name product-item-name'>
                <Link to={`/product/${product._id}`} className='product-item-link'>
                  {product.name}
                </Link>
            </strong>
            <Row>
              <Col xs={6}>
                <div className='price-box price-final_price'>
                  {
                    product.offerPrice? <span className="dic">{`${Math.ceil((((product.price-product.offerPrice)/product.price)*100))}% Off`}</span>: <></>
                  }
                  {/* <span className="dic">(20% off)</span> */}

                  {
               product.offerPrice? <>
                                                         <span className='special-price'>
                                                            <span className='price-container price-final_price tax weee'>
                                                              <span className='price-label'>Special Price</span>
                                                              <span className='price-wrapper '>
                                                                <span className='price'>${product.offerPrice}</span>
                                                              </span>
                                                            </span>
                                                          </span>
                                                          <span className='old-price'>
                                                            <span className='price-container price-final_price tax weee'>
                                                              <span className='price-label'>Regular Price</span>
                                                              <span className='price-wrapper'>
                                                                <span className='price'>${product.price}</span>
                                                              </span>
                                                            </span>
                                                          </span>
                                                           </>
                                                           : 
                                                           <>
                                                          <span className='special-price'>
                                                            <span className='price-container price-final_price tax weee'>
                                                              <span className='price-label'>Price</span>
                                                              <span className='price-wrapper '>
                                                                <span className='price'>${product.price}</span>
                                                              </span>
                                                            </span>
                                                          </span>
                                                           </>
                  }
                  
                </div>
              </Col>
              <Col xs={6}>
                <div className="rating-reviews">
                  <div className="star">
                      <Rating
                          value={product.rating}
                          text={`${product.numReviews} reviews`}
                        />
                  </div>
                </div>
              </Col>
            </Row>
            <div className='product-item-inner'>
              <div className='product actions product-item-actions'>
                <div className='actions-primary'>
                  <form>
                    <button type='submit' title='Add to Cart' onClick={()=>{addToCartHandler(product._id)}} className='action tocart primary'>
                      <span>Add to Cart</span>
                    </button>
                  </form>
                </div>
                {
                  wishlist.includes(product._id)?
                  <div className='actions-secondary'>
                     <a className='action towishlist' onClick={()=>{removeFromWishlist(product._id)}} title='Already in Wishlist'>
                    <span><i className="fas fa-heart"></i> Already in Wishlist</span>
                  </a>
                </div>
                  :
                  <div className='actions-secondary'>
                  <a className='action towishlist' onClick={()=>{addToWishlist(product._id)}} title='Add to Wish List'>
                    <span><i className="far fa-heart"></i> Add to Wish List</span>
                  </a>
             </div>
                }
               
              </div>
            </div>
          </div>
        </div>
      </div>

                                </Col>
                                    ))
                                    :
                                    <></>
                                    
                                }
                                
                                {/* <Col md={6} lg={4} xl={3}>
                                    <div className='item product product-item box-shadow'>
                                        <div className='product-item-info'>
                                            <div className='product-top'>
                                                <a className='product photo product-item-photo'>
                                                    <span className='product-image-container'>
                                                        <span className='parent_lazy product-image-wrapper lazy_loaded' style={{ paddingBottom: '100%' }}>
                                                            <img src="assets/img/product/product-2.png" className='img-fluid product-image-photo' />
                                                        </span>
                                                    </span>
                                                </a>
                                            </div>
                                            <div className='product details product-item-details'>
                                                <strong className='product name product-item-name'>
                                                    <a href="#" className='product-item-link'>
                                                        Sceptre 147 cm (58 inches) 4k ultra hd.....
                                                    </a>
                                                </strong>
                                                <Row>
                                                    <Col xs={6}>
                                                        <div className='price-box price-final_price'>
                                                            <span className="dic">(20% off)</span>
                                                            <span className='special-price'>
                                                                <span className='price-container price-final_price tax weee'>
                                                                    <span className='price-label'>Special Price</span>
                                                                    <span className='price-wrapper '>
                                                                        <span className='price'>$55.00</span>
                                                                    </span>
                                                                </span>
                                                            </span>
                                                            <span className='old-price'>
                                                                <span className='price-container price-final_price tax weee'>
                                                                    <span className='price-label'>Regular Price</span>
                                                                    <span className='price-wrapper'>
                                                                        <span className='price'>$60.00</span>
                                                                    </span>
                                                                </span>
                                                            </span>
                                                        </div>
                                                    </Col>
                                                    <Col xs={6}>
                                                        <div className="rating-reviews">
                                                            <div className="star">
                                                                <i className="las la-star"></i>
                                                                <i className="las la-star"></i>
                                                                <i className="las la-star"></i>
                                                                <i className="las la-star"></i>
                                                                <i className="las la-star empty"></i>
                                                            </div>
                                                            <div className="reviews-count">
                                                                <a href="#">53  Reviews</a>
                                                            </div>
                                                        </div>
                                                    </Col>
                                                </Row>
                                                <div className='product-item-inner'>
                                                    <div className='product actions product-item-actions'>
                                                        <div className='actions-primary'>
                                                            <form>
                                                                <button type='submit' title='Add to Cart' className='action tocart primary'>
                                                                    <span>Add to Cart</span>
                                                                </button>
                                                            </form>
                                                        </div>
                                                        <div className='actions-secondary'>
                                                            <a href='#' className='action towishlist' title='Add to Wish List'>
                                                                <span><i className='far fa-heart'></i> Add to Wish List</span>
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col md={6} lg={4} xl={3}>
                                    <div className='item product product-item box-shadow'>
                                        <div className='product-item-info'>
                                            <div className='product-top'>
                                                <a className='product photo product-item-photo'>
                                                    <span className='product-image-container'>
                                                        <span className='parent_lazy product-image-wrapper lazy_loaded' style={{ paddingBottom: '100%' }}>
                                                            <img src="assets/img/product/product-3.png" className='img-fluid product-image-photo' />
                                                        </span>
                                                    </span>
                                                </a>
                                            </div>
                                            <div className='product details product-item-details'>
                                                <strong className='product name product-item-name'>
                                                    <a href="#" className='product-item-link'>
                                                        Sceptre 147 cm (58 inches) 4k ultra hd.....
                                                    </a>
                                                </strong>
                                                <Row>
                                                    <Col xs={6}>
                                                        <div className='price-box price-final_price'>
                                                            <span className="dic">(20% off)</span>
                                                            <span className='special-price'>
                                                                <span className='price-container price-final_price tax weee'>
                                                                    <span className='price-label'>Special Price</span>
                                                                    <span className='price-wrapper '>
                                                                        <span className='price'>$55.00</span>
                                                                    </span>
                                                                </span>
                                                            </span>
                                                            <span className='old-price'>
                                                                <span className='price-container price-final_price tax weee'>
                                                                    <span className='price-label'>Regular Price</span>
                                                                    <span className='price-wrapper'>
                                                                        <span className='price'>$60.00</span>
                                                                    </span>
                                                                </span>
                                                            </span>
                                                        </div>
                                                    </Col>
                                                    <Col xs={6}>
                                                        <div className="rating-reviews">
                                                            <div className="star">
                                                                <i className="las la-star"></i>
                                                                <i className="las la-star"></i>
                                                                <i className="las la-star"></i>
                                                                <i className="las la-star"></i>
                                                                <i className="las la-star empty"></i>
                                                            </div>
                                                            <div className="reviews-count">
                                                                <a href="#">53  Reviews</a>
                                                            </div>
                                                        </div>
                                                    </Col>
                                                </Row>
                                                <div className='product-item-inner'>
                                                    <div className='product actions product-item-actions'>
                                                        <div className='actions-primary'>
                                                            <form>
                                                                <button type='submit' title='Add to Cart' className='action tocart primary'>
                                                                    <span>Add to Cart</span>
                                                                </button>
                                                            </form>
                                                        </div>
                                                        <div className='actions-secondary'>
                                                            <a href='#' className='action towishlist' title='Add to Wish List'>
                                                                <span><i className='far fa-heart'></i> Add to Wish List</span>
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col md={6} lg={4} xl={3}>
                                    <div className='item product product-item box-shadow'>
                                        <div className='product-item-info'>
                                            <div className='product-top'>
                                                <a className='product photo product-item-photo'>
                                                    <span className='product-image-container'>
                                                        <span className='parent_lazy product-image-wrapper lazy_loaded' style={{ paddingBottom: '100%' }}>
                                                            <img src="assets/img/product/product-4.png" className='img-fluid product-image-photo' />
                                                        </span>
                                                    </span>
                                                </a>
                                            </div>
                                            <div className='product details product-item-details'>
                                                <strong className='product name product-item-name'>
                                                    <a href="#" className='product-item-link'>
                                                        Sceptre 147 cm (58 inches) 4k ultra hd.....
                                                    </a>
                                                </strong>
                                                <Row>
                                                    <Col xs={6}>
                                                        <div className='price-box price-final_price'>
                                                            <span className="dic">(20% off)</span>
                                                            <span className='special-price'>
                                                                <span className='price-container price-final_price tax weee'>
                                                                    <span className='price-label'>Special Price</span>
                                                                    <span className='price-wrapper '>
                                                                        <span className='price'>$55.00</span>
                                                                    </span>
                                                                </span>
                                                            </span>
                                                            <span className='old-price'>
                                                                <span className='price-container price-final_price tax weee'>
                                                                    <span className='price-label'>Regular Price</span>
                                                                    <span className='price-wrapper'>
                                                                        <span className='price'>$60.00</span>
                                                                    </span>
                                                                </span>
                                                            </span>
                                                        </div>
                                                    </Col>
                                                    <Col xs={6}>
                                                        <div className="rating-reviews">
                                                            <div className="star">
                                                                <i className="las la-star"></i>
                                                                <i className="las la-star"></i>
                                                                <i className="las la-star"></i>
                                                                <i className="las la-star"></i>
                                                                <i className="las la-star empty"></i>
                                                            </div>
                                                            <div className="reviews-count">
                                                                <a href="#">53  Reviews</a>
                                                            </div>
                                                        </div>
                                                    </Col>
                                                </Row>
                                                <div className='product-item-inner'>
                                                    <div className='product actions product-item-actions'>
                                                        <div className='actions-primary'>
                                                            <form>
                                                                <button type='submit' title='Add to Cart' className='action tocart primary'>
                                                                    <span>Add to Cart</span>
                                                                </button>
                                                            </form>
                                                        </div>
                                                        <div className='actions-secondary'>
                                                            <a href='#' className='action towishlist' title='Add to Wish List'>
                                                                <span><i className='far fa-heart'></i> Add to Wish List</span>
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                           */}
                            </Row>
                        </div>
                        
                    </div>
                </Container>
            </section>
        </>

    )
}



export default SimilarProduct


