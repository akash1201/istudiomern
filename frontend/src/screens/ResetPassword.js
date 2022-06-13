import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Container, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import Axios from 'axios'
import LoginLeftbar from '../components/LoginLeftBar'



const ResetPassword = ({ match,location, history }) => {

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  let userId = match.params.id
 

  if(!userId){
            history.push('/login')
  }

  const dispatch = useDispatch()

  const userLogin = useSelector((state) => state.userLogin)
  const { loading, error, userInfo } = userLogin

  const redirect = location.search ? location.search.split('=')[1] : '/'

  useEffect(() => {
    if (userInfo) {
      history.push(redirect)
    }
  }, [history, userInfo, redirect])

  const [password, setPassword] = useState(()=>'')
  const [confirmPassword, setConfirmPassword] = useState(()=>'')
  const [msg, setMsg] = useState(()=>'')
  const [reset, setReset] = useState(()=>false)
  const [loading1, setLoading1] = useState(()=>false)

  const submitPassword = (e) => {

          e.preventDefault();
          
          let regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/
          
         
          if(password.match(regex)){
                
                    if(password !== confirmPassword){
                              setMsg("New password and confirm password doesn't match!!")
                              setTimeout(()=>{setMsg('')}, 6000)
                    }
                    else{
                              setLoading1(true)
                         Axios.put(`/api/users/reset/${match.params.id}`, {
                              password: password
                         }).then((res)=>{
                              setReset(true)
                              setLoading1(false)
                         })
                         .catch((err)=>{
                                   console.log(err)
                         })
                    }

          }else{
              setMsg("Password length must be minimum 8, at least a number, and at least a special character.")
              setTimeout(()=>{setMsg('')}, 6000)
          }

  }

  

  return (<>

    <section className="hm-category-main forgotPasswordForm">
      <Container>
        <div className="loginPageForm">
          <Row className="align-content-center justify-content-center">
            <Col lg={5} md={6} className="order-2 order-md-1">
              <LoginLeftbar type="resetPassword" redirect={redirect}/>
            </Col>
            <Col lg={5} md={6} className="order-1 order-md-2">
              <div className="login-form">
                <div className="login-logo">
                  <Link className="btn" to='/'>
                    <img src="/img/logo-1.png" alt="Logo" />
                  </Link>
                </div>
                <h2>{reset?'Reset Successful!!':'Reset Password'}</h2>
                {msg && <Message variant='danger'>{msg}</Message>}
                {loading1 && <Loader />}
                <div style={{display: reset?'none':'initial'}}>
                <Form>
                  <Form.Group controlId='email'>
                    <Form.Label>New Password</Form.Label>
                    <Form.Control
                      type='password'
                      placeholder='New Password'
                      value={password}
                      onChange={(e)=>{setPassword(e.target.value)}}
                    ></Form.Control>
                  </Form.Group>

                  <Form.Group controlId='email'>
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                      type='password'
                      placeholder='Confirm Password'
                      value={confirmPassword}
                      onChange={(e)=>{setConfirmPassword(e.target.value)}}
                    ></Form.Control>
                    
                  </Form.Group>
                  <div className="form-group">
                    <Button type='submit' onClick={submitPassword} variant='primary'>
                      Reset
                    </Button>
                  </div>
                </Form>
                </div>

                <div style={{display: reset?'initial':'none', marginTop: '5%', display: 'flex', justifyContent: 'center'}}>
                       <a href='/login'>Login with new Password</a>
                </div>
              </div>
            </Col>
          </Row>
        </div>

      </Container>
    </section>

  </>)
}

export default ResetPassword
