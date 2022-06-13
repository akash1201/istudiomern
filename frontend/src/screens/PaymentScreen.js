import React, { useState, useEffect } from 'react'
import { Form, Button, Col, Container, Row, Nav } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import CheckoutSteps from '../components/CheckoutSteps'
import { savePaymentMethod } from '../actions/cartActions'
import { Empty } from 'antd'
import Axios from 'axios'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { clearCart } from '../actions/cartActions'
import SummaryRightBar from '../components/SummaryRightBar'
import {Spin} from 'antd'


const PaymentScreen = ({ history }) => {

    useEffect(() => {
        window.scrollTo(0, 0)
        document.title = "Payment"
      }, [])


  const cart = useSelector((state) => state.cart)
  const { shippingAddress } = cart
  console.log(cart)

  if (!shippingAddress) {
    history.push('/shipping')
  }

  useEffect(()=>{

    if(cart){
          if(cart.shippingCharge === 0 || cart.shippingCharge === '0'){
            history.push('/delivery')
          }
    }

  },[cart])

  const [paymentMethod, setPaymentMethod] = useState('')
  const [cardCVV, setCardCVV] = useState('')
  const [addCard, setAddCard] = useState(()=>false)

  const [cards, setCards] = useState(()=>[])

  const [selectedCard, setSelectedCard] = useState(()=>'')
  
  //add new card 

  const [cardNo, setCardNo] = useState(()=>'')
  const [expiryMonth, setExpiryMonth] = useState(()=>'')
  const [expiryYear, setExpiryYear] = useState(()=>'')
  const [cvv, setCvv] = useState(()=>'')
  const [name, setName] = useState(()=>'')

  const [loading, setLoading] = useState(()=>false)
  const [loading1, setLoading1] = useState(()=>false)

  const [success, setSuccess] = useState(()=>'')
  const [error, setError] = useState(()=>'')

  const dispatch = useDispatch()

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(savePaymentMethod(paymentMethod))
    history.push('/placeorder')
  }

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

   useEffect(()=>{
    
    if(userInfo){
        Axios.get(`/api/users/paymentMethods/${userInfo._id}`)
        .then((res)=>{
              setCards(res.data)
        })
        .catch((err)=>{
            console.log(err)
        })
    }

   },[userInfo])

   const saveCard = (e) => {

    e.preventDefault()
    if(!userInfo){
        setError('Please login to add payment method')

        setTimeout(()=>{
            setError('')
        }, 3000)

        return
    }

    if(name.trim() == ''){
        setError('Enter name!')
        setTimeout(()=>{
            setError('')
        },3000)

        return
    }

    if(!expiryMonth || !expiryYear){
        setError('Enter Expiry Date!')
        setTimeout(()=>{
            setError('')
        },3000)

        return
    }

    if(cardNo.trim() == ''){
        setError('Enter Card Number!')
        setTimeout(()=>{
            setError('')
        },3000)

        return
    }

    if(cvv.trim() == ''){
        setError('Enter CVV!')
        setTimeout(()=>{
            setError('')
        },3000)

        return
    }

    let data = {
        name: name,
        cardNumber: cardNo,
        expiryMonth: expiryMonth,
        expiryYear: expiryYear,
        cvv: cvv
    }

    setLoading(true)

    Axios.post(`/api/users/paymentMethods/${userInfo._id}`, data)
    .then((res)=>{
        setCards((old)=>[...old, res.data])
        setSuccess('Card added!!')

        setTimeout(()=>{
            setSuccess('')
        },3000)

        setName('')
        setCardNo('')
        setExpiryMonth('')
        setExpiryYear('')
        setCvv('')
        setLoading(false)
    })
    .catch((err)=>{
        setError('Invalid Details!!')
        setLoading(false)
        setTimeout(()=>{
            setError('')
        },3000)
    })

   }

   const placeOrder = async (e) => {
  
    let data = []
    let grandTotal = 0;
    for(let i=0;i<cart.cartItems.length; ++i){
        grandTotal += cart.cartItems[i].variant.offerPrice? cart.cartItems[i].variant.offerPrice:cart.cartItems[i].variant.price
        let buff = {
                    user: userInfo? userInfo._id : '',
                    vendorId: cart.cartItems[i].fromPrintful?'60a2164667eb7c1f2cc24337':cart.cartItems[i].variant.user,
                    productId: cart.cartItems[i].product,
                    variantId: cart.cartItems[i].variantId,
                    productName: cart.cartItems[i].name,
                    url: cart.cartItems[i].fromPrintful? cart.cartItems[i].image:'Normal Order',
                    fromPrintful: cart.cartItems[i].fromPrintful,
                    qty: cart.cartItems[i].qty,
                    variantName: cart.cartItems[i].variant.name,
                    productImage: cart.cartItems[i].fromPrintful? cart.cartItems[i].image : cart.cartItems[i].variant.images[0],
                    price:cart.cartItems[i].fromPrintful? cart.cartItems[i].price: cart.cartItems[i].variant.offerPrice? cart.cartItems[i].variant.offerPrice : cart.cartItems[i].variant.price,
                    shippingAddress: {
                        name: cart.shippingAddress.FirstName+" "+cart.shippingAddress.LastName,
                        email: cart.shippingAddress.Email,
                        phone: cart.shippingAddress.PhoneNo,
                        address: cart.shippingAddress.Address1,
                        city: cart.shippingAddress.City,
                        state: cart.shippingAddress.State,
                        postalCode: cart.shippingAddress.Zip,
                        country: cart.shippingAddress.Country,
                    },
                    BillingAddress:{
                        name: cart.shippingAddress.FirstName+" "+cart.shippingAddress.LastName,
                        email: cart.shippingAddress.Email,
                        phone: cart.shippingAddress.PhoneNo,
                        address: cart.shippingAddress.Address1,
                        city: cart.shippingAddress.City,
                        state: cart.shippingAddress.State,
                        postalCode: cart.shippingAddress.Zip,
                        country: cart.shippingAddress.Country,
                    },
                    paymentMethod: paymentMethod,
                    paymentStatus: 'unpaid',
                    card: selectedCard,
                    shipping_id: cart.cartItems[i].shipping_Obj,
                    shippingCharge: cart.cartItems[i].shippingCharge
        }
        data = [...data, buff]
    }
    console.log(data)
    try{
        window.scrollTo(0,0)
        setLoading1(true)
        console.log(cart.promoCodeObj)
        let response = await Axios.post(`/api/orders`, {orders: data, promoDiscount: cart.promoDiscount, promoCodes: cart.promoCodeObj, statusEmail: cart.statusEmail?cart.statusEmail:''})

        localStorage.setItem('orders', JSON.stringify(response.data))
        dispatch(clearCart())
        history.push('/orderPlaced')
    }
    catch(err){
        alert('Cannot Proceed with transaction....')
    }

   }

   const isDisabled = () => {
       
    if(paymentMethod.trim() == '' || selectedCard.trim() == ''){
     return true
    }else{
        return false
    }
   }

  return (
    <>
    <section style={{display: loading1? 'initial':'none'}}>
        <div style={{fontWeight: 'bold',position: 'absolute', top: '50%', left: '50%', transform: 'translateX(-50%) translateY(-50%)'}}>
           <Spin size='large' tip='Your Order is being processed please wait....'></Spin>
           <br/>
           <span style={{fontWeight: 'bold', color: '#2aa8f2'}}>Please don't refresh the page or don't close the window</span>
        </div>
    </section>
    <section className="checkout-sec section-padding" style={{display: loading1? 'none':'initial'}}>
      <Container>
        <div className="inner-sec full-size">
            <div className="heading">
                <h3>checkout</h3>
            </div>
            <div className="main-sec full-size">
              <CheckoutSteps step1 step2 step3 step4 />
              <Row>
                <Col md={12} lg={8} xl={9} className="order-2 order-lg-1">
                  <div className="payment-sec">
                      <h4>payment information</h4>
                      <h4>your saved credit / debit cards</h4>
                      <div className="payment-option">
                        <Form onSubmit={submitHandler}>
                            <div className={paymentMethod == 'card'?"paymentCardList active":"paymentCardList"}>
                                <div className="card-info">
                                    <Row>
                                        <Col sm={12} md={6} lg={6}>
                                            <label className="radio">
                                                <input type="radio" onClick={(e)=>{setPaymentMethod(e.target.value)}} value={'card'} name="payment[method]" 
                                                />
                                                <small>Credit / Debit Cards</small>
                                                <span></span>
                                            </label>
                                        </Col>
                                        <Col sm={12} md={6} lg={6}>
                                            <div className="card-icon">
                                                <span className="image">
                                                    <img src="assets/img/visa.png" alt="" />
                                                </span>
                                                <span className="image">
                                                    <img src="assets/img/mastercard.png" alt="" />
                                                </span>
                                                <span className="image">
                                                    <img src="assets/img/american-express.png" alt="" />
                                                </span>
                                            </div>
                                        </Col>
                                        <span className="bottom-line"></span>
                                    </Row>
                                </div>
                                <div className={paymentMethod == 'card'?"paymentCardBox active animated bounceIn":"paymentCardBox"}>
                                   {
                                       userInfo?
                                       cards.length != 0? 
                                       cards.map((e, i)=>(
                                        <div className="save-card-detail" key={i}>
                                        <div className="full-size card-inner">
                                            <Row className="align-items-center">
                                                <Col sm={12} md={6} lg={5}>
                                                <label className="radio radiocheck">
                                                    <input className="radio-input" type="radio" name="stripeSaveCardList" onClick={(e)=>{setAddCard(false);setCardCVV("");setSelectedCard(e.target.value)}} value={e.id} />
                                                    <small>{e.funding} Card <small className="gray">ending in {e.last4}</small></small>
                                                    <span></span>
                                                </label>
                                                </Col>
                                                <Col xs={6} sm={6} md={3} lg={3}>
                                                <div className="full-size name text-center">
                                                    <h5>{e.name}</h5>
                                                </div>
                                                </Col>
                                                <Col xs={6} sm={6} md={3} lg={2}>
                                                <div className="full-size name text-center">
                                                    <h5>{e.exp_month}/{e.exp_year}</h5>
                                                </div>
                                                </Col>
                                                <Col sm={12} md={6} lg={2}>
                                                    {
                                                        e.brand == 'Visa'?
                                                        <div className="image">
                                                           <img src="assets/img/icon-visa.png" alt="" />
                                                        </div>
                                                        :
                                                        e.brand == 'MasterCard'?
                                                        <div className="image">
                                                          <img src="assets/img/icon-mastercard.png" alt="" />
                                                        </div>
                                                        :
                                                        <></>
                                                    }
                                                </Col>	
                                            </Row>
                                        </div>
                                    </div>
                                       ))
                                       :
                                       <Empty description={'Add Payment Methods'}/>
                                       :
                                       <Empty description={'Login to add payment '}/>
                                   }
                                    <div className="card-info">
                                        <h5>Add New Card</h5>
                                        <Row>
                                            <Col sm={12} md={6} lg={6}>
                                                <label className="radio radiocheck">
                                                    <input type="radio" name="stripeSaveCardList" onClick={(e)=>{setSelectedCard('');setAddCard(true)}} value={'stripeAddNewCard'} />
                                                    <small>credit / debit card</small>
                                                    <span></span>
                                                </label>
                                            </Col>
                                            <Col sm={12} md={6} lg={6}>
                                                <div className="card-icon">
                                                    <span className="image">
                                                        <img src="assets/img/visa.png" alt="" />
                                                    </span>
                                                    <span className="image">
                                                        <img src="assets/img/mastercard.png" alt="" />
                                                    </span>
                                                    <span className="image">
                                                        <img src="assets/img/american-express.png" alt="" />
                                                    </span>
                                                </div>
                                            </Col>
                                        </Row>
                                        <div className={addCard?"addNewCard active animated bounceIn":"addNewCard"}>
                                            <Row>
                                                <Col>
                                                {
                                                    success? <Message>{success}</Message>:<></>
                                                }
                                                {
                                                    error? <Message variant={'danger'}>{error}</Message>:<></>
                                                }
                                                </Col>
                                            </Row>

                                            <Row style={{display: loading? 'initial':'none'}}>
                                                <Col>
                                                   <Loader/>
                                                </Col>
                                            </Row>

                                            <Row style={{display: loading? 'none':'initial'}}>
                                                <Col sm={12} md={9} lg={9}>
                                                    <Row>
                                                        <Col sm={12} md={6} lg={8} className="input-feild">
                                                            <span className="input-name">Full Name</span>
                                                            <input type="text" className="form-control" value={name} onChange={(e)=>{setName(e.target.value)}}  required={true} />
                                                        </Col>
                                                        <Col sm={12} md={6} lg={4} className="input-feild">
                                                            <span className="input-name">Expriy Date</span>
                                                            <select className="custom-select" value={expiryMonth} onChange={(e)=>{setExpiryMonth(e.target.value)}}>
                                                                <option hidden="hidden"></option>
                                                                <option value='1'>Jan</option>
                                                                <option value='2'>Feb</option>
                                                                <option value='3'>March</option>
                                                                <option value='4'>April</option>
                                                                <option value='5'>May</option>
                                                                <option value='6'>June</option>
                                                                <option value='7'>July</option>
                                                                <option value='8'>Aug</option>
                                                                <option value='9'>Sep</option>
                                                                <option value='10'>Oct</option>
                                                                <option value='11'>Nov</option>
                                                                <option value='12'>Dec</option>
                                                            </select>
                                                            <select className="custom-select" value={expiryYear} onChange={(e)=>{setExpiryYear(e.target.value)}}>
                                                                <option hidden="hidden"></option>
                                                                <option value='2021'>2021</option>
                                                                <option value='2022'>2022</option>
                                                                <option value='2023'>2023</option>
                                                                <option value='2024'>2024</option>
                                                                <option value='2025'>2025</option>
                                                                <option value='2026'>2026</option>
                                                                <option value='2027'>2027</option>
                                                                <option value='2028'>2028</option>
                                                                <option value='2029'>2029</option>
                                                                <option value='2030'>2030</option>
                                                            </select>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col sm={12} md={6} lg={8} className="input-feild">
                                                            <span className="input-name">Card Number</span>
                                                            <input type="text" className="form-control" value={cardNo} onChange={(e)=>{setCardNo(e.target.value)}} />
                                                        </Col>
                                                        <Col sm={12} md={6} lg={4} className="input-feild">
                                                            <span className="input-name">CVV</span>
                                                            <input type="text" className="form-control" value={cvv} onChange={(e)=>{setCvv(e.target.value)}}/>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                                <Col sm={12} md={9} lg={9}>
                                                    {/* <div className="full-size">
                                                        <Form.Group controlId="newSaveCardCheck1">
                                                            <Form.Check label="Save Card" />
                                                        </Form.Group>
                                                    </div> */}
                                                </Col> 
                                                <Col sm={12} md={9} lg={9}>
                                                    <Button variant="primary" onClick={saveCard}>Save</Button>
                                                </Col>                                               
                                            </Row>
                                        </div>
                                        
                                    </div>
                                </div>
                            </div>
                          <div className="final-address">
                              <Row className="row">
                                  <Col sm={12} md={6} lg={4}>
                                      <figure className="full-size">
                                          <h5>Billing Address </h5>
                                          <p>{cart.shippingAddress.Address1}, {cart.shippingAddress.State} {cart.shippingAddress.PhoneNo}</p>
                                      </figure>
                                  </Col>
                              </Row>
                          </div>
                          <div className="button">
                              <LinkContainer to='/delivery' className="previous"><Nav.Link>Previous</Nav.Link></LinkContainer>
                              <Button onClick={placeOrder} disabled={isDisabled()} style={{backgroundColor: '#007BF8', color: 'white'}} variant='primary next'>
                                  Pay & Place Order
                              </Button>
                          </div> 
                        </Form>
                      </div>
                        
                      <div className="clearfix"></div>
                      <div className="support-sec">
                        <Row className="justify-content-center">
                            <Col sm={12} md={12} xl={4} className="item">
                                <figure className="single-item">
                                    <span className="icon">
                                        <img src="assets/img/customer-support.svg" alt="" />
                                    </span>
                                    <h5>help</h5>
                                    <p>Call Us no 05 3456 342 123</p>
                                    <p>Mon-Fri 9am - 8am</p>
                                    <p>Sat-Sun: 10am - 6pm</p>
                                </figure>
                            </Col>
                            <Col sm={12} md={12} xl={4} className="item">
                                <figure className="single-item">
                                    <span className="icon">
                                        <img src="assets/img/box.svg" alt="" />
                                    </span>
                                    <h5>delivery</h5>
                                    <p>Track the Progess of your in real time</p>
                                    <p><a href="">Find Out More</a></p>
                                </figure>
                            </Col>
                            <Col sm={12} md={12} xl={4} className="item">
                                <figure className="single-item">
                                    <span className="icon">
                                        <img src="assets/img/return.svg" alt="" />
                                    </span>
                                    <h5>easy returns</h5>
                                    <p>15 Days Money-back returns if you change your mind</p>
                                    <p><a href="">Find Out More</a></p>
                                </figure>
                            </Col>
                        </Row>
                      </div>
                  </div>

                  
                </Col>
                <Col md={12} lg={4} xl={3} className="order-1 order-lg-2">
                  <SummaryRightBar />
                </Col>
              </Row>
            </div>
        </div>
      </Container>
    </section>
    </>
  )
}

export default PaymentScreen
