import React, {  useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import {  Container, Row, Col } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import Loader from '../components/Loader'
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
import GoogleLogin from 'react-google-login';
import Axios from 'axios'
const VerifyScreen = ({ location, match }) => {

 let userId = match.params.userId
 console.log(userId)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  let history = useHistory()


  if(!userId){
     history.push('/')
  }

  const dispatch = useDispatch()


  const redirect = location.search ? location.search.split('=')[1] : '/'



  const responseFacebook = async (response) => {
    console.log(response)

    let res = await  Axios.post(`/api/facebook/signin`,{
      accessToken: response.accessToken,
      userId: response.userID,
      data: response
    })

    dispatch({
      type: 'USER_LOGIN_SUCCESS',
      payload: res.data,
    })

    localStorage.setItem('userInfo', JSON.stringify(res.data))

  }

  const responseGoogle = (response) => {
    console.log(response);
  }

  const [loading, setLoading] = useState(()=>true)

  useEffect(() => {
          window.scrollTo(0, 0)
          verify()
        }, [])

        const verify = async () => {

          let res = await Axios.put(`/api/users/verify-email/${userId}`)
          setLoading(false)
        }

  return (<>

    <section className="hm-category-main">
      <Container>
        <div className="loginPageForm">
          <Row className="align-content-center justify-content-center">
            <Col lg={5} md={6} className="order-2 order-md-1">
              <div className="login-leftbar">
                <div className="login-leftImg">
                  <img src="/img/login-bg-1.png" alt="img" />
                </div>
                <div className="login-leftContent">
                  <div className="leftContent-wraper">
                  <GoogleLogin
                      clientId="658977310896-knrl3gka66fldh83dao2rhgbblmd4un9.apps.googleusercontent.com"
                      render={renderProps => (
                        
                    <div className="google-btn">
                      <a href="#" onClick={renderProps.onClick} className="btn"><img src="/img/google-icon.png" alt="img" /> Login with Google</a>
                    </div>
                        )}
                      buttonText="Login"
                      onSuccess={responseGoogle}
                      onFailure={responseGoogle}
                      cookiePolicy={'single_host_origin'}
                    />
                    <FacebookLogin
                        appId="142872154533256"
                        // autoLoad
                        // onClick={componentClicked}
                        callback={responseFacebook}
                        render={renderProps => (
                          <div className="facebook-btn">
                            <a href="#" onClick={renderProps.onClick} className="btn"><i className="fab fa-facebook-f"></i> Login with Facebook</a>
                          </div>
                        )}
                      />
                    <div className="signup-btn">
                      <p>
                        Don’t have an account?{' '}
                      </p>
                      <Link className="btn" to={redirect ? `/login?redirect=${redirect}` : '/register'}>
                        Login
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
            <Col lg={5} md={6} className="order-1 order-md-2">
              <div className="login-form">
                <div className="login-logo">
                  <Link className="btn" to='/'>
                    <img src="/img/logo-1.png" alt="Logo" />
                  </Link>
                </div>
                {
                          loading?
                          <Loader />
                          :
                          <h2>Your account has been verified.<br/> Please login!</h2>
                }
              </div>
            </Col>
          </Row>
        </div>

      </Container>
    </section>

  </>)
}

export default VerifyScreen
