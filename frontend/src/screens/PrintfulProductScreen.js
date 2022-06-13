import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Container, Row, Col,  Button, Form, Tab, Tabs, Modal} from 'react-bootstrap'
import Message from '../components/Message'
import Loader from '../components/Loader'
import Meta from '../components/Meta'
import { Skeleton } from 'antd'
import ReactImageMagnify from 'react-image-magnify'
import axios from 'axios'

const PrintfulProductScreen = ({ history, match }) => {

          const id = match.params.id

          const [baseProduct, setBaseProduct] = useState(()=>{})
          const [variants, setVariants] = useState(()=>[])
          const [activeVariant, setActiveVariant] = useState(()=>{})
          const [activeVariantId, setActiveVariantId] = useState(()=>'')
          const [loading, setLoading] = useState(()=>true)
          const [inWishlist, setIsInWishlist] = useState(()=>false)

          const [wish1, setWish1] = useState(()=>false)
          
          
          useEffect(()=>{
                    getProductVariants()
                    window.scrollTo(0, 0)
          }, [])

          const getProductVariants = async () => {
            let res = null;
            if(localStorage.getItem('userInfo')){

              let user = JSON.parse(localStorage.getItem('userInfo'))
              let config = {
                headers: {
                  'Authorization' : `Bearer ${user.token}`
                }
              }
              res = await axios.get(`/api/printful/getProductVariants/${id}`, config)
            }else{
              res = await axios.get(`/api/printful/getProductVariants/${id}`)
            }       
            console.log(res.data)
            setBaseProduct(res.data.sync_product)
            setIsInWishlist(res.data.sync_product.existsInWishlist?true:false)
            setVariants(res.data.sync_variants)
            setActiveVariant(res.data.sync_variants[0])
            setActiveVariantId(res.data.sync_variants[0].external_id)
            setLoading(false)

          }

  const [qty, setQty] = useState(1)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')

  const [variantId, setVariantId] = useState(()=>'')

  const [error, setError] = useState(()=>'')
  const [wls, setWls] = useState(()=>false)
  const [wle, setWle] = useState(()=>false)

  const [loading1, setLoading1] = useState(()=>false)

  const dispatch = useDispatch()

  // const { loading, error, product } = productDetails

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const productReviewCreate = useSelector((state) => state.productReviewCreate)
  const {
    success: successProductReview,
    loading: loadingProductReview,
    error: errorProductReview,
  } = productReviewCreate

  useEffect(() => {
    if (successProductReview) {
      setRating(0)
      setComment('')
    }
    // }
  }, [dispatch, match, successProductReview])

  const addToCartHandler = () => {
    localStorage.setItem('variantId', variantId)
    localStorage.setItem('fromPrintful', JSON.stringify(true))
    localStorage.setItem('baseProduct', JSON.stringify(baseProduct))
    localStorage.setItem('variant', JSON.stringify(activeVariant))
    history.push(`/cart/${match.params.id}?qty=${qty}`)
  }


  //For Bootstrap Modal
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);




  const removeFromWishlist = (id) => {
 
    setLoading1(true)
    if(userInfo){
      let config ={
        headers : {
          'Authorization' : `Bearer ${userInfo.token}`
        }
      }
      axios.delete(`/api/wishlist/${userInfo._id}/${id}`, config)
      .then((res)=>{
        setIsInWishlist(false)
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
      let obj = {
        userId: userInfo._id,
        productId: id,
        fromPrintful: true
      }
      let config = {
        headers : {
          'Authorization' : `Bearer ${userInfo.token}`
        }
      }
        axios.post(`/api/wishlist`,obj, config)
        .then((res)=>{
            
            setIsInWishlist(true)
            setLoading1(false)
            setWls(true)
            setTimeout(()=>{setWls(false)}, 1500)
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

  const changeBaseVariant = (id) => {
 
          for(let i=0; i<variants.length; ++i){
                    if(parseInt(id) == variants[i].id){
                              setActiveVariant(variants[i])
                              setActiveVariantId(variants[i].external_id)

                    }
          }

  }

  return (
    <>
      <section className="product-detail-view">
        <Container>
            <Link className='btn btn-light my-3' to='/istudio-merch'>
              Go Back
            </Link>
            <Row>
              <Col>
              {
                wls?<Message variant='success'>{"Added to wishlist"}</Message>:<></>
              }
              {
               wle?<Message variant='danger'>{"Removed from wishlist"}</Message>:<></>
              }
              {
                wish1?<Message>{'Please Login to use wishlist feature'}</Message>:<></>
              }
              </Col>
            </Row>
            {loading ? (
              <Loader />
            ) : error ? (
              <Message variant='danger'>{error}</Message>
            ) : (
              <>
                <Meta title={activeVariant.name? activeVariant.name : ''} />
                <Row>
                  <div className="col-lg-4 col-xl-3 order-2 order-lg-1 order-xl-1">
                    {/* <ProductDetailLeftSidebar category={category}/> */}
                  </div>
                  <div className="col-lg-8 col-xl-9 order-1 order-lg-2 order-xl-2">
                    <Row>
                      <Col xl={6}>
                      <ReactImageMagnify
                       enlargedImageContainerStyle={{zIndex:'99'}}
                       hoverDelayInMs={0}
                      {...{
                                          smallImage: {
                                              alt: activeVariant.name? activeVariant.name : '',
                                              isFluidWidth: true,
                                              src:(activeVariant.files.filter((e)=>e.type === 'preview'))[0].preview_url
                                              // src: activeVariant.files[2].thumbnail_url? activeVariant.files[2].thumbnail_url : ''
                                          },
                                          largeImage: {
                                              src: (activeVariant.files.filter((e)=>e.type === 'preview'))[0].preview_url,
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
                            {activeVariant.name? activeVariant.name : ''}
                          </h2>
                          {
                                                      <div className="homegoods">
                                                      <p>by <span>{`istudio`}</span></p>
                                                      </div>
                          }
                        
                         {
                           inWishlist?
                                                  <div className="wishlist-box">
                                                    <a className="toWishlist-btn" onClick={()=>{removeFromWishlist(match.params.id)}}><i className="fas fa-heart"></i> Added to Wishlist</a>
                                                  </div>
                                                  :
                                                  <div className="wishlist-box">
                                                    <a className="toWishlist-btn" onClick={()=>{addToWishlist(match.params.id)}}><i className="far fa-heart"></i> Add to Wishlist</a>
                                                  </div>
                         }
                         
                          { 
                            
                                          <div className="product-price">
                                              <ins>${activeVariant.retail_price? activeVariant.retail_price : '0.00'}</ins>
                                          </div>
                          }
                
                          {
                              <div className="size-box" style={{height: '300px',width:'400px', overflowY: 'scroll', overflowX: 'hidden'}}>
                              <label>{'Variants'}</label>
                              <ul>
                                {
                                          variants.length != 0?
                                          variants.map((val, i)=>(
                                        <li key={i} onClick={()=>{changeBaseVariant(val.id)}}><span style={{ width: '120px', fontSize: '65%', fontWeight: 'bold',overflow: 'hidden' }} className={` ${activeVariantId == val.external_id? 'active':''}`}>{val.product.name.split('(')[1]?val.product.name.split('(')[1].split(")")[0]:val.product.name}</span></li>
                                        
                                        // <li key={i} onClick={()=>{changeBaseVariant(val.id)}}><span className={`size ${parseInt(activeVariantId) == val.id? 'active':''}`}>{i}</span></li>
                                  ))
                                  :
                                  <></>
                                }
                              </ul>
                          </div>
                           
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
                                        <button onClick={addToCartHandler}   type="submit" title="Add to Cart" className="action tocart primary">
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
                              <p>{activeVariant.product.name?activeVariant.product.name: ''}</p>
                              <Row>
                                <Col md={6}>
                                  <div className="full-desc">
                                      <a href="#">See Full Description</a>
                                  </div>
                                </Col>
                                <Col md={6}>
                                  {/* <div className="report-popup">
                                      <a href="#" onClick={handleShow}><i className="fas fa-exclamation-circle"></i> Report</a>
                                  </div> */}

                                  <Modal show={show} onHide={handleClose} className="reportIssue">
                                    <Modal.Header closeButton>
                                        <h5 className="modal-title">Report an issue</h5>
                                    </Modal.Header>
                                    <Modal.Body>
                                          <div className="report-form">
                                            <Form>
                                                <Form.Group controlId="selectReason.ControlSelect1">
                                                  <Form.Label>Please select  reason to report</Form.Label>
                                                  <Form.Control as="select">
                                                    <option>Doesn’t match the product</option>
                                                    <option>Doesn’t match the product</option>
                                                    <option>Doesn’t match the product</option>
                                                    <option>Doesn’t match the product</option>
                                                    <option>Doesn’t match the product</option>
                                                  </Form.Control>
                                                </Form.Group>
                                                <Form.Group controlId="issueComment.ControlTextarea1">
                                                  <Form.Label>Comments (Optional)</Form.Label>
                                                  <Form.Control as="textarea" rows={3} />
                                                </Form.Group>
                                                <Button variant="btn btn-primary" type="submit">
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
                                <ul>
                                  {
                                    <li>Brand: <span>{`istudio`}</span></li>
                                  }
                                  
                                </ul>
                              </div>
                            </Tab>
                         
                            {/* <Tab eventKey="return-policy-tab" title="Return Policy">
                              <div className="return-policy">
                                  <p>Refund requests must be made within 14 days of delivery date. After 14 days from
                                    delivery date you must contact istudio Customer Service to determine the best course
                                    of action. istudio will not issue refunds for products purchased through other entities,
                                    such as distributors or retail partners. Defective units are covered under istudio 
                                    limited warranty policy will be replaced at istudio’s cost. See “Returning Products
                                    Under Warranty,” below, for information on warranty returns.</p>
                              </div>
                            </Tab> */}
                          </Tabs>
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={12}>
                        <div className="product info tabs">
                            <h4>Tags</h4>
                            <ul>
                     
                                
                                  <li><a href="#">{'istudio'}</a></li>
                                  <li><a href="#">{'Merchs'}</a></li>
                                  <li><a href="#">{'Printful'}</a></li>
                                  <li><a href="#">{baseProduct.name?baseProduct.name: ''}</a></li>

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

export default PrintfulProductScreen
