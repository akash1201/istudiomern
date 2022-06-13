import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Container, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { login } from '../actions/userActions'
import {syncCartToDB} from '../actions/cartActions'
import LoginLeftbar from '../components/LoginLeftBar'
const LoginScreen = ({ location, history }) => {

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const dispatch = useDispatch()

  const userLogin = useSelector((state) => state.userLogin)
  const { loading, error, userInfo } = userLogin

  const redirect = location.search ? location.search.split('=')[1] : '/'

  useEffect(() => {
    if (userInfo) {
      history.push(redirect)
    }
  }, [history, userInfo, redirect])

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(login(email, password))
    
  }

  return (<>

    <section className="hm-category-main">
      {/* <Container><Loader/></Container> */}
      <Container>
        <div className="loginPageForm">
          <Row className="align-content-center justify-content-center">
            <Col lg={5} md={6} className="order-2 order-md-1">
            <LoginLeftbar type="login" redirect={redirect}/>
            </Col>
            <Col lg={5} md={6} className="order-1 order-md-2">
              <div className="login-form">
                <div className="login-logo">
                  <Link className="btn" to='/'>
                    <img src="img/logo-1.png" alt="Logo" />
                  </Link>
                </div>
                <h2>Login</h2>
                {error && <Message variant='danger'>{error}</Message>}
                {loading && <Loader />}
                <Form onSubmit={submitHandler}>
                  <Form.Group controlId='email'>
                    {/* <Form.Label>Email Address</Form.Label> */}
                    <Form.Control
                      type='email'
                      placeholder='Enter email'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    ></Form.Control>
                    <div className="icon">
                      <i className="las la-user"></i>
                    </div>
                  </Form.Group>
                  <Form.Group controlId='password'>
                    {/* <Form.Label>Password</Form.Label> */}
                    <Form.Control
                      type='password'
                      placeholder='Enter password'
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    ></Form.Control>
                    <div className="icon">
                      <i className="las la-lock"></i>
                    </div>
                  </Form.Group>
                  {/* <Form.Group controlId="loginRemember">
                    <Form.Check type="checkbox" label="Remember me" />
                  </Form.Group> */}

                  <div className="form-group">
                    <Button type='submit' variant='primary'>
                      Sign In
                        </Button>
                  </div>
                  <p className="text-center">
                    <Link className="text-2AA8F2" to='/forgot-password'>
                      Forgot Password?
                    </Link>
                  </p>
                </Form>
              </div>
            </Col>
          </Row>
        </div>

      </Container>
    </section>

  </>)
}

export default LoginScreen
