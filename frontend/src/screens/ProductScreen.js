import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Container, Row, Col, ListGroup, Button, Form, Tab, Tabs, Modal, Image, Table} from 'react-bootstrap'
import Rating from '../components/Rating'
import Message from '../components/Message'
import Loader from '../components/Loader'
import Meta from '../components/Meta'
import { Skeleton } from 'antd'
import ProductDetailLeftSidebar from '../components/ProductDetailLeftSidebar'
import ReactImageMagnify from 'react-image-magnify'

import {
  createProductReview,
} from '../actions/productActions'
import axios from 'axios'

const ProductScreen = ({ history, match }) => {
  const [qty, setQty] = useState(1)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')

  const [productVariants, setProductVariant] = useState(()=>[])
  const [baseVariant, setBaseVariant] = useState(()=>{})
  const [activeVariant, setActiveVariant] = useState(()=>{})
  const [variantId, setVariantId] = useState(()=>'')
  const [product, setProduct] = useState(()=>{})

  const [category, setCategory] = useState(()=>'')

  const [price, setPrice] = useState(()=>'')
  const [offerPrice, setOfferPrice] = useState(()=>'')
  const [avQty, setAvQty] = useState(()=>'')
  const [thumbnail, setThumbnail] = useState(()=>'')
  const [variantname, setVariantname] = useState(()=>'')

  const [wishlist, setWishlist] = useState(()=>[])
  const [wls, setWls] = useState(()=>false)
  const [wle, setWle] = useState(()=>false)
  const [wish1, setWish1] = useState(()=>false)

  const [loading, setLoading] = useState(()=>true)
  const [error, setError] = useState(()=>'')

  const [loading1, setLoading1] = useState(()=>false)

  const [tags, setTags] = useState(()=>[])

  const [reason, setReason] = useState(()=>'')
  const [comments, setComments] = useState(()=>'')
  const [message, setMessage] = useState(()=>'')
  const [reportLoading, setReportLoading] = useState(()=>false)
  const [rsuccess, setRSuccess] = useState(()=>false)

  const [specs, setSpecs] = useState(()=>[])

  const reportProduct = async(e) => {
    e.preventDefault()
    if(!userInfo){
      setMessage('Please login to report')
    }
    let obj = {
      userId: userInfo._id,
      productId: match.params.id,
      reason: reason,
      comments: comments
    }
    console.log(obj)
    let config = {
      headers : {
        Authorization : `Bearer ${userInfo.token}`
      }
    }
    setReportLoading(true)

    try{
      let response = await axios.post(`/api/products/report`, obj,config)
      setShow(false)
      setReportLoading(false)
      setRSuccess(true)
      window.scrollTo(0,0)
      setTimeout(()=>{setRSuccess(false)}, 3000)
    }catch(err){
      setMessage(err.response.data.message)
      setReportLoading(false)
    }
  }


  const dispatch = useDispatch()
  const [inWishList, setInWishlist] = useState(()=>false)
  // const { loading, error, product } = productDetails

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const productReviewCreate = useSelector((state) => state.productReviewCreate)
  const {
    success: successProductReview,
    loading: loadingProductReview,
    error: errorProductReview,
  } = productReviewCreate

  useEffect(()=>{

    getProductDetails()
    window.scrollTo(0,0)

  }, [match.params.id])


  useEffect(() => {
    if (successProductReview) {
      setRating(0)
      setComment('')
    }
    // if (!product._id || product._id !== match.params.id) {
    //   dispatch(listProductDetails(match.params.id))
    //   dispatch({ type: PRODUCT_CREATE_REVIEW_RESET })
    // }
  }, [dispatch, match, successProductReview])

  const addToCartHandler = () => {
    localStorage.setItem('variantId', variantId)
    localStorage.setItem('fromPrintful', JSON.stringify(false)) 
    localStorage.setItem('baseProduct', JSON.stringify(product))
    localStorage.setItem('variant', JSON.stringify(activeVariant))
    history.push(`/cart/${match.params.id}?qty=${qty}`)
  }

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(
      createProductReview(match.params.id, {
        rating,
        comment,
      })
    )
  }


  const getProductDetails = async () => {

    setLoading(true)
   const {data} = await axios.get(`/api/products/variants/${match.params.id}`)
   if(data.length !== 0){
    setProductVariant(data)
    setBaseVariant(data[0].variant)
    setActiveVariant(data[0])
    setCategory(data[0].category)

    setVariantId(data[0]._id)
    setPrice(data[0].price)
    setVariantname(data[0].name)
    setOfferPrice(data[0].offerPrice)
    setAvQty(data[0].qty)
    setThumbnail(data[0].images[0])
   }  
   if(userInfo){
  let config = {
    headers : {
      'Authorization' : `Bearer ${userInfo.token}`
    }
    
  }
  const response = await axios.get(`/api/products/${match.params.id}`, config)
     
    setProduct(response.data)
    setInWishlist(response.data.existsInWishlist?true:false)
    const res = await axios.get(`/api/category/name/${response.data.category}/${response.data.subCategroy?response.data.subCategroy: '00'}`)
    setTags(res.data)
  setLoading(false)
   }else{
    const response = await axios.get(`/api/products/${match.params.id}`)
    setProduct(response.data)
    setInWishlist(response.data.existsInWishlist?true:false)
    const res = await axios.get(`/api/category/name/${response.data.category}/${response.data.subCategroy?response.data.subCategroy: '00'}`)
    setTags(res.data)
    //wishlist
     setLoading(false)
   }
    
  }

  //For Bootstrap Modal
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const changeBaseVariant = (name, value) => {
    let obj = {...baseVariant}
    obj[name] = value;
    setBaseVariant(obj)
    checkVariant(obj)
  }

  const checkVariant = (obj) => {
    let match = false;
    for(let i = 0; i<productVariants.length; ++i){
          if(JSON.stringify(productVariants[i].variant) == JSON.stringify(obj)){        
            setVariantId(productVariants[i]._id)
            setVariantname(productVariants[i].name)
            setAvQty(productVariants[i].qty)
            setThumbnail(productVariants[i].images[0])
            setPrice(productVariants[i].price)
            setOfferPrice(productVariants[i].offerPrice)
            setActiveVariant(productVariants[i])
            match = true
          }
    }
     if(match == false){
          setAvQty(0)
          setThumbnail(product.thumbnailImage)

     }
  }


  const removeFromWishlist = (id) => {
 
    setLoading1(true)
    if(userInfo){
     let config = {
       headers : {
         'Authorization' : `Bearer ${userInfo.token}`
       }
     }
      axios.delete(`/api/wishlist/${userInfo._id}/${id}`, config)
      .then((res)=>{
        setInWishlist(false)
        setLoading1(false)
        setWle(true)
        setTimeout(()=>{setWle(false)}, 1500)
        
      })
      .catch((err)=>{
        console.log(err)
      })
    }else{
      alert('Login to use wishlist!!')
    }

  }

  const addToWishlist = (id) => {
    
    setLoading1(true)
    if(userInfo){
      let config = {
        headers : {
          'Authorization' : `Bearer ${userInfo.token}`
        }
      }
        axios.post(`/api/wishlist`,{
          userId: userInfo._id,
          productId: id
        }, config)
        .then((res)=>{
            
            setInWishlist(true)
            setWls(true)
            setTimeout(()=>{setWls(false)}, 1500)
            setLoading1(false)
        })
        .catch((err)=>{
          console.log(err)
        })
    }
    else{
      setLoading1(false)
      setWish1(true)
      window.scrollTo(0,0)
      setTimeout(()=>{setWish1(false)}, 3000)
    }

  }

  return (
    <>
      <section className="product-detail-view">
        <Container>
            <Link className='btn btn-light my-3' to='#' onClick={()=>{history.goBack()}}>
              Go Back
            </Link>
            <Row>
              <Col>
            {rsuccess? <Message variant='success'>{'Reported Succesfully'}</Message>:<></>}
              {
                wls?<Message variant='success'>{"Added to wishlist"}</Message>:<></>
              }
              {
               wle?<Message variant='danger'>{"Removed from wishlist"}</Message>:<></>
              }
              {
               wish1?<Message variant='danger'>{'Login to use wishlist feature'}</Message>:<></>
              }
              </Col>
            </Row>
            {loading ? (
              <Loader />
            ) : error ? (
              <Message variant='danger'>{error}</Message>
            ) : (
              <>
                <Meta title={product.name} />
                <Row>
                  <div className="col-lg-4 col-xl-3 order-2 order-lg-1 order-xl-1">
                    <ProductDetailLeftSidebar category={category}/>
                  </div>
                  <div className="col-lg-8 col-xl-9 order-1 order-lg-2 order-xl-2">
                    <Row>
                      <Col >
                      <ReactImageMagnify
                       enlargedImageContainerStyle={{zIndex:'99'}}
                       hoverDelayInMs={0}
                      {...{
                                          smallImage: {
                                              alt: product.name,
                                              isFluidWidth: true,
                                              src: thumbnail
                                          },
                                          largeImage: {
                                              src: thumbnail,
                                              width: 1200,
                                              height: 1800                                        
                                          },
                                          enlargedImageContainerDimensions: {
                                            width: '200%',
                                            height: '100%'
                                        }
                                      }} 
                                      />
                        {/* <Image src={thumbnail} alt={product.name} fluid /> */}
                      </Col>
                      <Col style={{display: loading1?'initial':'none'}}>
                      <Skeleton active />
                      </Col>
                      <Col xl={6} style={{display: loading1? 'none':'initial'}}>                    
                        <div className="product-main-info">
                          <h2 className="product-name">
                            {product.name}
                          </h2>
                          {
                            product.brand?
                                                      <div className="homegoods">
                                                      <p>by <span>{product.brand.trim()}</span></p>
                                                      </div>
                                                      :
                                                      <></>
                          }
                          
                          <div className="rating-reviews">
                              <div className="star">
                                  <Rating
                                  value={product.rating}
                                  text={`${product.numReviews} reviews`}
                                />
                              </div>
                          </div>
                         {
                           inWishList?
                                                  <div className="wishlist-box">
                                                    <a className="toWishlist-btn" onClick={()=>{removeFromWishlist(match.params.id)}}><i className="fas fa-heart"></i> Added to Wishlist</a>
                                                  </div>
                                                  :
                                                  <div className="wishlist-box">
                                                    <a className="toWishlist-btn" onClick={()=>{addToWishlist(match.params.id)}}><i className="far fa-heart"></i> Add to Wishlist</a>
                                                  </div>
                         }
                         
                          { 
                          avQty === 0?
                          <div className="product-price">
                              <ins style={{color: 'red'}}>Out Of Stock</ins>
                          </div>
                          :
                            activeVariant.offerPrice?
                                          <div className="product-price">
                                              <ins>{activeVariant.offerPrice}</ins>
                                              <del>{activeVariant.price}</del>
                                          </div>
                                          :
                                          <div className="product-price">
                                              <ins>{activeVariant.price}</ins>
                                          </div>
                          }
                          
                          {
                            product.availableVariants ? 
                            product.availableVariants.map((e)=>(
                              e.toLowerCase() == 'color' || e.toLowerCase() == 'colour'?
                              <div key={e} className="colors-box" style={{cursor: 'pointer'}}>
                              <label>{e}</label>
                              <ul>
                                {
                                  product.availableVariantOption[e].map((val)=>(
                                    <li key={val} onClick={()=>{changeBaseVariant(e,val)}}><span className={`${val} color ${baseVariant[e] == val? 'active':''}`} style={{backgroundColor: `${val}`}}>{val}</span></li>
                                  ))
                                }
                              </ul>
                            </div>
                              :
                              <div key={e} className="size-box" style={{cursor: 'pointer'}}>
                              <label>{e}</label>
                              <ul>
                                {
                                  product.availableVariantOption[e].map((val)=>(
                                        <li key={val} onClick={()=>{changeBaseVariant(e,val)}}><span className={`size ${baseVariant[e] == val? 'active':''}`}>{val}</span></li>
                                  ))
                                }
                              </ul>
                          </div>
                            ))
                              :
                              <></>
                          }
                          <div className="qty-counter">
                              <label>Quantity</label>
                              <div className="qty-input">
                                <i className="less" style={{background: "none"}} onClick={()=>qty >1 ? setQty(qty - 1 ):1}>-</i>
                                <Form.Control type="text" value={qty} style={{width:"120%" , outline:"none"}}  onChange={()=>{}}/>
                                  <i className="more" style={{background: "none"}} onClick={()=>setQty(qty + 1 )}> +</i>
                              </div>
                              
                          </div>
                          <div className="row">
                            <div className="col-md-6">
                                <div className="btn-wraper buy-now">
                                    <form>
                                        <button onClick={addToCartHandler} style={{cursor: avQty == 0? 'not-allowed': 'pointer'}} disabled={avQty == 0? true: false} type="submit" title="Add to Cart" className="action tocart primary">
                                            <span>Buy Now</span>
                                        </button>
                                    </form>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="btn-wraper addTo-cart">
                                    <Button
                                      onClick={addToCartHandler}
                                      className='action tocart primary'
                                      type='button'
                                      style={{cursor: avQty == 0? 'not-allowed': 'pointer'}}
                                      disabled={avQty == 0? true: false}
                                    >
                                      <i className="fas fa-shopping-cart"></i><span> Add To Cart</span>
                                    </Button>
                                </div>
                            </div>
                          </div>
                        </div>
                        
                      </Col>
                    </Row>
                    <Row>
                      <Col md={12}>
                        <div className="product info detailed">
                          <Tabs defaultActiveKey="product-description-tab" id="product-detail-tab">
                            <Tab eventKey="product-description-tab" title="Product Description">
                              <p>{product.description}</p>
                              <Row>
                                <Col md={6}>
                                  <div className="full-desc">
                                      <a href="#">See Full Description</a>
                                  </div>
                                </Col>
                                <Col md={6}>
                                  <div className="report-popup">
                                      <a href="#" onClick={handleShow}><i className="fas fa-exclamation-circle"></i> Report</a>
                                  </div>

                                  <Modal show={show} onHide={handleClose} className="reportIssue">
                                    <Modal.Header closeButton>
                                        <h5 className="modal-title">Report an issue</h5>
                                    </Modal.Header>
                                    <Modal.Body>
                                      <div style={{display: reportLoading?'initial':'none'}}>
                                        <Loader />
                                      </div>
                                          <div className="report-form" style={{display: reportLoading?'none':'initial'}}>
                                            <Form>
                                                <Form.Group controlId="selectReason.ControlSelect1">
                                                  <Form.Label>Please select  reason to report</Form.Label>
                                                  <Form.Control as="select" onChange={(e)=>{setReason(e.target.value)}}>
                                                    <option value='Does+not+match+the+product'>Doesn’t match the product</option>
                                                    <option value='Product+quality+not+good'>Product quality not good</option>
                                                    <option value='Fake+product'>Fake Product</option>
                                                    {/* <option value='others'>Others</option> */}
                                                  </Form.Control>
                                                </Form.Group>
                                                <Form.Group controlId="issueComment.ControlTextarea1">
                                                  <Form.Label>Comments (Optional)</Form.Label>
                                                  <Form.Control as="textarea" rows={3} onChange={(e)=>{setComments(e.target.value)}}/>
                                                </Form.Group>
                                                <Button variant="btn btn-primary" type="submit" onClick={reportProduct}>
                                                  Submit
                                                </Button>
                                            </Form>
                                        </div>
                                    </Modal.Body>
                                  </Modal>
                                </Col>
                              </Row>
                            </Tab>
                            <Tab eventKey="details-tab" title="Details">
                              <div className="product-details">
                                <Table striped bordered hover>
                                <tbody>
                                  {
                                    product.brand !== ''? <tr><td style={{width:'100px'}}><strong>Brand:</strong></td> <td>{product.brand}</td></tr>: <></>
                                  }
                                  
                                   {
                                     product && activeVariant?
                                     product.availableVariants.map((e, i)=>(
                                       <tr key={i}><td style={{width:'100px'}}><strong>{e}:</strong></td> <td>{activeVariant.variant[e]}</td></tr>
                                     ))
                                     :<></>
                                   }

                                   {
                                     product.specs && product.specs.length !=0?
                                     product.specs.map((e)=>(
                                      <tr key={Math.random()}><td style={{width:'100px'}}><strong>{e.name}:</strong></td> <td>{e.value}</td></tr>
                                     ))
                                     :
                                     <></>
                                   }
                                  </tbody>
                                </Table>
                              </div>
                            </Tab>
                            <Tab eventKey="review-ratings-tab" title="Review Ratings">
                              <Row>
                                <Col md={6}>
                                  <h2>Reviews</h2>
                                  {product.reviews.length === 0 && <Message>No Reviews</Message>}
                                  <ListGroup variant='flush'>
                                    {product.reviews.map((review) => (
                                      <ListGroup.Item key={review._id}>
                                        <strong>{review.name}</strong>
                                        <Rating value={review.rating} />
                                        <p>{review.createdAt.substring(0, 10)}</p>
                                       <Row>
                                          {
                                            review.images && review.images.length != 0?
                                            review.images.map((e)=>(
                                              <Col xs={6} md={4}>
                                              <Image src={e} rounded />
                                            </Col>
                                            ))
                                            :
                                            <></>
                                          }
                                        </Row>
                                        <p>{review.comment}</p>
                                      </ListGroup.Item>
                                    ))}
                                    <ListGroup.Item>
                                      <h2>Write a Customer Review</h2>
                                      {successProductReview && (
                                        <Message variant='success'>
                                          Review submitted successfully
                                        </Message>
                                      )}
                                      {loadingProductReview && <Loader />}
                                      {errorProductReview && (
                                        <Message variant='danger'>{errorProductReview}</Message>
                                      )
                                    }
                                      {userInfo ? (
                                        <Form onSubmit={submitHandler}>
                                          <Form.Group controlId='rating'>
                                            <Form.Label>Rating</Form.Label>
                                            <Form.Control
                                              as='select'
                                              value={rating}
                                              onChange={(e) => setRating(e.target.value)}
                                            >
                                              <option value=''>Select...</option>
                                              <option value='1'>1 - Poor</option>
                                              <option value='2'>2 - Fair</option>
                                              <option value='3'>3 - Good</option>
                                              <option value='4'>4 - Very Good</option>
                                              <option value='5'>5 - Excellent</option>
                                            </Form.Control>
                                          </Form.Group>
                                          <Form.Group controlId='comment'>
                                            <Form.Label>Comment</Form.Label>
                                            <Form.Control
                                              as='textarea'
                                              row='3'
                                              value={comment}
                                              onChange={(e) => setComment(e.target.value)}
                                            ></Form.Control>
                                          </Form.Group>
                                          <Button
                                            disabled={loadingProductReview}
                                            type='submit'
                                            variant='primary'
                                          >
                                            Submit
                                          </Button>
                                        </Form>
                                      ) : (
                                        <Message>
                                          Please <Link to='/login'>sign in</Link> to write a review{' '}
                                        </Message>
                                      )}
                                    </ListGroup.Item>
                                  </ListGroup>
                                </Col>
                              </Row>
                            </Tab>
                            <Tab eventKey="return-policy-tab" title="Return Policy">
                              <div className="return-policy">
                                {
                                  console.log(product)
                                }
                                {
                                  product.hasReturnOption?
                                  <p>Refund requests must be made within {product.returnDays} days of delivery date. After {product.returnDays} days from
                                  delivery date you must contact the vendor to determine the best course
                                  of action. istudio will not issue refunds for products purchased through other entities,
                                  such as distributors or retail partners. Defective units are covered under Vendor's 
                                  limited warranty policy will be replaced at vendor’s cost.</p>
                                  :
                                  <p>The product has no return option.</p>
                                }
                                
                              </div>
                            </Tab>
                          </Tabs>
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={12}>
                        <div className="product info tabs">
                            <h4>Tags</h4>
                            <ul>
                            {product.brand !== ''? <li><a href='#'><span>{product.brand}</span></a></li>: <></>}
                                {
                                  tags.map((e)=>(
                                  <li key={e}><a href="#">{e}</a></li>
                                  ))
                                }
                            </ul>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </Row>
              </>
            )}
        </Container>
      </section>
    </>
  )
}

export default ProductScreen
