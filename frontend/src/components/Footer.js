import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap'
import Axios from "axios"
import {useHistory} from 'react-router-dom'
import { useSelector, useDispatch } from "react-redux";
import VendorDrawerForm from "./../components/vendorDrowerForm"


const Footer = () => {

    let history = useHistory()

    const userInfo = useSelector((state) => state.userLogin.userInfo);

      const [email, setEmail] = useState(()=>'')
      const [success, setSuccess] = useState(()=>false)
      const [error, setError] = useState(()=>false)
      const [msg, setMsg] = useState(()=>'')
      const [contactInfo, setContactInfo] = useState(()=>{})
      const [categories, setCategories] = useState(()=>[])


      useEffect(() => {
        window.scrollTo(0, 0)

        Axios.get('/api/miscellaneous/contact-info')
        .then((res)=>{
              setContactInfo(res.data)
        })
        .catch((err)=>{
            console.log(err)
        })

        Axios.get(
            `/api/category/getall`
          )
          .then((res)=>{
                setCategories((old)=>[...old,...res.data.data])
          })
          .catch((err)=>{
              console.log(err)
          })

      }, [])

      const submitHandler = async (e) =>{

        e.preventDefault();
        if(!email){
            setError(true)
            setMsg("Please enter an email")
            setTimeout(reset, 3000)
        }

        let response = await Axios.post('/api/miscellaneous/subscribe', {email: email})
        setEmail('')
        if(response.data.type == 'success'){
         setSuccess(true)
         setMsg(response.data.message)
         setTimeout(reset, 2000)
        }else{
            setError(true)
            setMsg(response.data.message)
            setTimeout(reset, 2000)
        }


      }

      const reset = () => {
         setMsg('')
         setError(false)
         setSuccess(false)
      }

      const handleClick = (name, id) => {
        history.push(`/category/${name}/${id}`)
      }

  return (
    <footer className='footer-main'>
        <section className='footer-top-newsletter'>
            <div className='container'>
                <div className='row'>
                    <div className='col-md-12'>
                        <h3 className="widget-title">
                            <span className="txt_title">Sign Up To Newsletter</span>
                        </h3>
                        <div className="content">Sign up for all the news about our latest arrivals and get an exclusive early <br /> access shopping. <span>Join 60.000+ Subscribers</span> and get a new discount coupon on every Saturday.</div>
                        <div className='footer-mail'>
                            <form className='newsletter-form-footer'>
                                <div className='mc4wp-form-fields'>
                                    <div className='signup-newsletter-form'>
                                        <div className='col padding-0'>
                                            <input type="email" name="contact[email]" placeholder="Your email address..." value="" className=" input-text" required="required" />
                                        </div>
                                        <div className='col-auto padding-0'>
                                            <button type="submit" className="submit-btn truncate">
                                                <span>
                                                    Subscribe
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <section className='footer-link-wraper'>
            <Container className='container'>
                <Row>
                    <Col md={12} lg={4}>
                        <div className='footer-right-border'>
                            <div className='footer-contactInfo'>
                                <h4>About The Store</h4>
                                <div className="phone">
                                    <i className="las la-headset"></i>
                                    <span>Got Question? Call us 24/7!</span>
                                    <span>{contactInfo?contactInfo.phone: <></>}</span>
                                </div>
                                <ul>
                                    <li><i className='las la-map-marker'></i> {contactInfo?<>{`${contactInfo.street1} ${contactInfo.street2}, ${contactInfo.city}, ${contactInfo.state}`}</>:<></>}</li>
                                    {/* <li><i className='las la-mobile'></i> <a href={`tel: ${contactInfo?contactInfo.phone: <></>}`}>{contactInfo?contactInfo.phone: <></>}</a></li> */}
                                </ul>
                                <p className='add'><span>Opening Hours: Monday - Friday: 9:00-20:00</span></p>
                                <p><span>Saturday: 11:00 - 17:00</span></p>
                                <p className="mail"><a href={`mailto: ${contactInfo?contactInfo.supportEmail: <></>}`}>Mail: {contactInfo?contactInfo.supportEmail:<></>}</a></p>
                                {/* <p>If you have any question, please contact us at <a href={`mailto: ${contactInfo?contactInfo.supportEmail: <></>}`}>{contactInfo?contactInfo.supportEmail:<></>}</a></p> */}
                                
                            </div>
                        </div>
                    </Col>
                    <Col md={12} lg={8}>
                        <Row>
                            <Col md={4}>
                                <div className='footer-links'>
                                    <h4>Find it Fast</h4>
                                    <ul>
                                        {
                                            categories.length != 0?
                                            categories.filter((e1, i)=>(i<=7)).map((e, i)=>(
                                                <li key={i}><Link to={`/category/${e.slug}/${e._id}`}>{e.name}</Link></li>
                                                 ) )
                                            :
                                            <></>
                                        }
                                        {/* <li><Link to='/'>Accessories</Link></li>
                                        <li><Link to='/'>Gaming</Link></li>
                                        <li><Link to='/'>Laptops & Computer</Link></li>
                                        <li><Link to='/'>Mac Computers</Link></li>
                                        <li><Link to='/'>PC Computers</Link></li>
                                        <li><Link to='/'>Ultrabooks</Link></li>
                                        <li><Link to='/'>EMI Payment</Link></li>
                                        <li><Link to='/'>Shipping Policy</Link></li> */}
                                    </ul>
                                </div>
                            </Col>
                            {/* <Col md={4}>
                                <div className='footer-links'>
                                    <h4>Extra Links</h4>
                                    <ul>
                                    {userInfo && <li><VendorDrawerForm /></li>}

                                        <li><Link to='/how-does-it-work'>How Does It Work</Link></li>
                                        
                                        <li><Link to='/privacy-policy'>Policies& Rules</Link></li>
                                    </ul>
                                </div>
                            </Col> */}
                            <Col md={4}>
                                <div className='footer-links'>
                                    <h4>Information</h4>
                                    <ul>
                                        {/* <li><Link to='/'>About Us</Link></li>
                                        <li><Link to='/'>Contact Us</Link></li> */}
                                        {/* <li><Link to='/'>All Collection</Link></li> */}
                                        <li><Link to='/privacy-policy'>Privacy Policy</Link></li>
                                        <li><Link to='/terms-conditions'>Terms & Conditions</Link></li>
                                        <li><Link to="/cookie-policy">Cookie Policy</Link></li>
                                        {/* <li><Link to='/'>Blog</Link></li> */}
                                        {/* <li><Link to='/'>FAQ</Link></li> */}
                                        {/* <li><Link to='/'>Awards</Link></li> */}
                                    </ul>
                                </div>
                            </Col>
                        </Row>
                    </Col>

                </Row>
                {/* <div className='footer-newsletter'>
                    <Row>
                        <Col>
                        {
                            success || error?
                                <Alert variant={success? "success": error? "danger": ""}>{msg}</Alert>
                                :
                                <></>
                        }

                        </Col>
                    </Row>
                    <Row>
                        <Col md={12} lg={6} xl={5}>
                            <div className='media'>
                                <div className='mr-3'>
                                    <div className='media leftSide'>
                                        <div className='mr-3'>
                                            <svg width='35' height='34' viewBox='0 0 35 34' fill='none' xmlns='http://www.w3.org/2000/svg'>
                                                <path d='M7 18L15.332 23.5546C16.6498 24.4332 18.362 24.4514 19.6983 23.6011L28.5 18' stroke='#2AA8F2' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round'/>
                                                <path d='M1.5 28.5V13.994C1.5 13.3679 1.79321 12.7779 2.29228 12.3998L14.2614 3.3323C16.458 1.66817 19.5058 1.71439 21.651 3.44438L32.7555 12.3996C33.2263 12.7793 33.5 13.3516 33.5 13.9564V28.5C33.5 30.7091 31.7091 32.5 29.5 32.5H5.5C3.29086 32.5 1.5 30.7091 1.5 28.5Z' stroke='#2AA8F2' strokeWidth='1.5'/>
                                            </svg>
                                        </div>
                                        <div className='media-body'>
                                        <h5 className='mt-0'>Sign up for <br />NEWSLETTER</h5>
                                        </div>
                                    </div>
                                </div>
                                <div className='media-body content-rightSide'>
                                    <h5 className='mt-0'>Subscribe to the weekly newsletter for all the latest updates</h5>
                                </div>
                            </div>
                        </Col>
                        <Col md={12} lg={6} xl={5}>
                            <Form>
                                <Form.Group className='search-wraper'>
                                    <Form.Control  className='search_query form-control' type="email" value={email} onChange={(e)=>{setEmail(e.target.value)}} placeholder="Your email..." />
                                    <Button variant="btn" type='submit' onClick={submitHandler}>Submit</Button>
                                </Form.Group>
                            </Form>
                        </Col>
                    </Row>
                </div> */}
                {/* <Row>
                    <Col md={12}>
                        <div className='footer-helpLinks'>
                            <ul>
                                <li><Link to='/'>Home</Link></li>
                                <li><Link to='/'>Shop</Link></li>
                                <li><Link to='/'>About</Link></li>
                                <li><Link to='/'>Blog</Link></li>
                                <li><Link to='/'>Contact</Link></li>
                            </ul>
                        </div>
                    </Col>
                </Row> */}
            </Container>
        </section>
        <section className='copyright-main'>
            <Container>
                <Row>
                    <Col md={6}>
                        <div className='copyright'>
                            <p>Copyright © 2021 <Link to='/'>istudio</Link> All Rights Reserved</p>
                        </div>
                    </Col>
                    <Col md={6}>
                        <div className='social-links'>
                            <ul>
                                <li><a href='https://www.facebook.com/istudio-112915663809273' target='_blank'><i className='fab fa-facebook-f'>facebook</i></a></li>
                                {/* <li><Link to='/'><i className='fab fa-twitter'>twitter</i></Link></li> */}
                                <li><a href='https://instagram.com/istudio?r=nametag' target='_blank'><i className='fab fa-instagram'>instagram</i></a></li>
                                {/* <li><Link to='/'><i className='fab fa-youtube'>youtube</i></Link></li> */}
                            </ul>
                        </div>
                    </Col>
                </Row>
            </Container>
        </section>
    </footer>
  )
}

export default Footer
