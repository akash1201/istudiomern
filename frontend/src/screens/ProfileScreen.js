import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap'
import VendorDrawerForm from "./../components/vendorDrowerForm"
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { getUserDetails, updateUserProfile } from '../actions/userActions'
import { USER_UPDATE_PROFILE_RESET } from '../constants/userConstants'
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Sidebar from '../components/Sidebar'
import UserAddresses from '../components/UserAddresses'
import Axios from 'axios'
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  FacebookMessengerShareButton,

  FacebookIcon,
  FacebookMessengerIcon,
  TwitterIcon,
  WhatsappIcon,
} from "react-share";

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
}));


const ProfileScreen = ({ location, history }) => {
  const [name, setName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [dob, setDob] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState(null)
  const [successUpd, setSuccessUpd] = useState('')
  const [success1, setSuccess] = useState(()=>false)
  const [error1, setError] = useState(()=>false) 
  //category

  const dispatch = useDispatch()

  const userDetails = useSelector((state) => state.userDetails)
  const { loading, error, user } = userDetails
  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin
  const userUpdateProfile = useSelector((state) => state.userUpdateProfile)
  const { success } = userUpdateProfile
  useEffect(() => {
    
    if (!userInfo) {
      console.log("not logged in");
      history.push('/login')
    } else {
      if (!user || !user.name || success) {
        dispatch({ type: USER_UPDATE_PROFILE_RESET })
        dispatch(getUserDetails('profile'))
      } else {
        setName(user.name)
        setEmail(user.email)
        setLastName(user.lastName)
        setDob(user.dob)
      }
    }
  }, [dispatch, history, userInfo, user, success])
  const submitHandler = (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setMessage('Passwords do not match')
    } else {
      dispatch(updateUserProfile({ id: user._id, name, email, password,lastName,dob }))
    }
  }

  const AddUpdHandler=(status)=> {
    if(status){
      setSuccessUpd(status)
      dispatch({ type: USER_UPDATE_PROFILE_RESET })
      dispatch(getUserDetails('profile'))
    }
  }

  const resendVerification =async (e) => {
    e.preventDefault()
   try{
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    }
    let response = await Axios.post(`api/users/resend-verification`,{},config)
    setSuccess(true)
    setTimeout(()=>{setSuccess(false)}, 3000)
   }catch(err){
    setError(true)
    setTimeout(()=>{setError(false)}, 3000)
   }
  }

  const storeLinkHandler = (e) => {
    e.preventDefault()


    history.push(`/${userInfo.name}/store/${userInfo._id}`)
  }

  const classes = useStyles();

  return (
    <section className="accountMain-wraper">
      <Container>
        <Row>
          <Col md={12}>
            <h1 className="main-heading">My Account</h1>
          </Col>
        </Row>
        <Row>
          <Sidebar />
          <Col md={12} lg={9} xl={9}>
            <div className="paymentMethod-main">
              <h4 className="heading"><span >My Profile </span>
             <span style={{float: 'right'}}>
             <Button onClick={storeLinkHandler} variant='default' style={{fontSize: '125%', color: '#40a9ff'}} title='My Store'><i className="fas fa-store"></i></Button>
              <span style={{marginLeft: '2px'}}>
              <FacebookShareButton url={`https://istudio.com/vendor/all/${userInfo._id}`}><FacebookIcon size={25} round/></FacebookShareButton>
              </span>

              <span style={{marginLeft: '2px'}}>
              <FacebookMessengerShareButton url={`https://istudio.com/vendor/all/${userInfo._id}`}><FacebookMessengerIcon size={25} round/></FacebookMessengerShareButton>
              </span>

              <span style={{marginLeft: '2px'}}>
              <TwitterShareButton url={`https://istudio.com/vendor/all/${userInfo._id}`}><TwitterIcon size={25} round/></TwitterShareButton>
              </span>

              <span style={{marginLeft: '2px'}}>
              <WhatsappShareButton url={`https://istudio.com/vendor/all/${userInfo._id}`}><WhatsappIcon size={25} round/></WhatsappShareButton>
              </span>
             </span>
              </h4>
              
              {
                userInfo.isVerified?
                <></>
                :
              <>
              <Alert variant={'danger'}>
                Please verify your email.<Button onClick={resendVerification} style={{background: 'none', color: 'blue'}}>Resend Verification</Button>
              </Alert>
              </>
              }
              {
                success1 &&<Alert variant='success'>Verification sent</Alert>
              }
              {
                error1 && <Alert variant='danger'>Cannot send verification</Alert>
              }
              <div className="account-personalInfo">
                {message && <Message variant='danger'>{message}</Message>}
                {}
                {success && <Message variant='success'>Profile Updated</Message>}
                {loading ? (
                  <Loader />
                ) : error ? (
                  <Message variant='danger'>{error}</Message>
                ) : (

                      <Form onSubmit={submitHandler}>
                        <Row>
                          <Col md={6}>
                            <Form.Group controlId='name'>
                              <Form.Label>First Name</Form.Label>
                              <Form.Control
                                type='name'
                                placeholder='First name'
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                              ></Form.Control>
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group controlId='lastName'>
                              <Form.Label>Last Name</Form.Label>
                              <Form.Control
                                type='text'
                                placeholder='Last Name'
                                value={lastName}
                                onChange={(e)=>setLastName(e.target.value)}
                              ></Form.Control>
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group controlId='email'>
                              <Form.Label>Email Address</Form.Label>
                              <Form.Control
                                type='email'
                                placeholder='Enter email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                              ></Form.Control>
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <TextField
                              id="date"
                              label="D.O.B"
                              type="date"
                              value={dob}
                              onChange={(e) => setDob(e.target.value)}
                              className={classes.textField}
                              InputLabelProps={{ shrink: true, }}
                            />
                          </Col>
                          <Col md={6}>
                            <Form.Group controlId='password'>
                              <Form.Label>Password</Form.Label>
                              <Form.Control
                                type='password'
                                placeholder='Enter password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                              ></Form.Control>
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group controlId='confirmPassword'>
                              <Form.Label>Confirm Password</Form.Label>
                              <Form.Control
                                type='password'
                                placeholder='Confirm password'
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                              ></Form.Control>
                            </Form.Group>
                          </Col>
                          <Col md={12}  className="text-center">
                            <Button type='submit' variant='primary'>
                              Update
                            </Button>
                          </Col>
                        </Row>
                      </Form>
                    )}
              </div>
            </div>

            <UserAddresses profile={true} Addresses={user.addresses} success={successUpd} AddressUpdHandler={AddUpdHandler} />

          </Col>
        </Row>
      </Container>
    </section>
  );
}
// const ProfileScreen=[]
export default ProfileScreen
