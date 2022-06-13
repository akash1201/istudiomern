import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Container, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import Axios from 'axios'
import LoginLeftbar from '../components/LoginLeftBar'



const ForgotPasswordScreen = ({ location, history }) => {

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const dispatch = useDispatch()

  const userLogin = useSelector((state) => state.userLogin)
  const { loading, error, userInfo } = userLogin

  const redirect = location.search ? location.search.split('=')[1] : '/'

  useEffect(() => {
    if (userInfo) {
      history.push(redirect)
    }
  }, [history, userInfo, redirect])

  const [email, setEmail] = useState(()=>'')
  const [uEmail, setUEmail] = useState(()=>'')
  const [msg, setMsg] = useState(()=>'')
  const [sentLink, setLinkSent] = useState(()=>false)
  const [success, setSuccess] = useState(()=>'')
  const [loading1, setLoading1] = useState(()=>false)

  const resetPassword = async (e) => {
    

    e.preventDefault()

    setLoading1(true)

    if(email.trim() == ''){
      setMsg('Enter an email')
      setLoading1(false)
      setTimeout(()=>{
        setMsg('')
      },2500)
      return;
    }

    try{
     let response = await Axios.get(`/api/users/reset/${email}`)
    
     setUEmail(response.data.email)
     setLinkSent(true)
     setLoading1(false)

    }catch(err){
    
       setLoading1(false)
       setMsg("User doesn't exists")
       setTimeout(()=>{setMsg('')}, 2500)
    }

  }

  const resendLink = () => {

  
    setSuccess("Resent the link again!")
    setTimeout(()=>{
      setSuccess('')
    }, 3000)

  }

  return (<>

    <section className="hm-category-main forgotPasswordForm">
      <Container>
        <div className="loginPageForm">
          <Row className="align-content-center justify-content-center">
            <Col lg={5} md={6} className="order-2 order-md-1">
              <LoginLeftbar type="forgetPassword" redirect={redirect}/>
            </Col>
            <Col lg={5} md={6} className="order-1 order-md-2" style={{display: sentLink?"none": "initial"}}>
              <div className="login-form">
                <div className="login-logo">
                  <Link className="btn" to='/'>
                    <img src="img/logo-1.png" alt="Logo" />
                  </Link>
                </div>
                <h2>Forgot Password</h2>
                <p>We will send you an email with a link to reset your password.</p>
                {success && <Message>{success}</Message>}
                {msg && <Message variant='danger'>{msg}</Message>}
                {loading1 && <Loader />}
                <Form>
                  <Form.Group controlId='email'>
                    {/* <Form.Label>Email Address</Form.Label> */}
                    <Form.Control
                      type='email'
                      placeholder='Email'
                      value={email}
                      disabled={loading1}
                      onChange={(e)=>{setEmail(e.target.value)}}
                    ></Form.Control>
                    <div className="icon">
                      <i className="las la-user"></i>
                    </div>
                  </Form.Group>
                  <div className="form-group">
                    <Button disabled={loading1} type='submit' variant='primary' onClick={resetPassword}>
                      Continue
                    </Button>
                  </div>
                </Form>
              </div>
            </Col>
            <Col md={6} className="order-1 order-md-2" style={{display: sentLink?"initial": "none"}}>
            <div className="login-form" style={{marginBottom: '5%'}}>
                <div className="login-logo">
                  <Link className="btn" to='/'>
                    <img src="img/logo-1.png" alt="Logo" />
                  </Link>
                </div>
                {success && <Message>{success}</Message>}
                {msg && <Message variant='danger'>{msg}</Message>}
                {loading && <Loader />}
            <h2>Password Reset Link Sent!!</h2>
            <p>We have sent you an email associated with the account with a link to reset your password.</p>
                <Form>
                  <div className="form-group">
                    <Button variant='primary' onClick={resendLink}>
                      Resend
                    </Button>
                  </div>
                </Form>
              </div>
            </Col>

          </Row>
        </div>

      </Container>
    </section>

  </>)
}

export default ForgotPasswordScreen
