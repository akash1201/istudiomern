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


const ContachInfo = ({ location, history }) => {

  const [message, setMessage] = useState(null)
  const [successUpd, setSuccessUpd] = useState('')
  //category

  const [street1, setStreet1] = useState(()=>'')
  const [street2, setStreet2] = useState(()=>'')
  const [city, setCity] = useState(()=>'')
  const [state, setState] = useState(()=>'')
  const [zip, setZip] = useState(()=>'')
  const [phone, setPhone] = useState(()=>'')
  const [officialEmail, setOfficialEmail] = useState(()=>'')
  const [supportEmail, setSupportEmail] = useState(()=>'')
  const [loading, setLoading] = useState(()=>true)

  const [success, setSuccess] = useState(()=>false)
  const [error, setError] = useState(()=>false)


  const dispatch = useDispatch()

  const userDetails = useSelector((state) => state.userDetails)
  const { user } = userDetails
  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin
  const userUpdateProfile = useSelector((state) => state.userUpdateProfile)
 
  useEffect(() => {
    
    if (!userInfo) {
      console.log("not logged in");
      history.push('/login')
    } else if(userInfo.userType != 'admin'){
          console.log("not admin");
          history.push('/')
    }
  }, [dispatch, history, userInfo, user, success])

  useEffect(()=>{
            Axios.get(`/api/miscellaneous/contact-info`)
            .then(res=>{
               setStreet1(res.data.street1)
               setStreet2(res.data.street2?res.data.street2:"")
               setCity(res.data.city)
               setState(res.data.state)
               setZip(res.data.zip)
               setPhone(res.data.phone)
               setSupportEmail(res.data.supportEmail)
               setOfficialEmail(res.data.officialEmail)
               setLoading(false)
            })
            .catch((err)=>{
                      console.log(err)
            })
  }, [])

  const submitHandler = async (e) => {
   
          e.preventDefault()
          setLoading(true)
           try{
            let obj = {
                      adminId: userInfo._id,
                      street1: street1,
                      street2: street2,
                      city: city,
                      state: state,
                      zip: zip,
                      phone: phone,
                      officialEmail: officialEmail,
                      supportEmail: supportEmail
            }
            let config = {
                      headers: {
                                'Authorization': `Bearer ${userInfo.token}` ,
                              },
            }
          let response = await Axios.put(`/api/miscellaneous/contact-info`, obj, config)
          setSuccess(true)
          setTimeout(()=>{setSuccess(false)}, 2000)
          setLoading(false)
           }catch(err){
            setError(true)
            setTimeout(()=>{setError(false)}, 2000)
            setLoading(false)
           }

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
              <h4 className="heading">Contact Information</h4>
          
              <div className="account-personalInfo">
                {loading ? (
                  <Loader />
                ) : error ? (
                  <Message variant='danger'>{error}</Message>
                ) : (

                      <Form onSubmit={submitHandler}>
                        <Row>
                           <Col>
                             {error&& <Alert variant='danger'>Update Failed</Alert>}
                             {success&& <Alert variant='success'>Updated</Alert>}
                           </Col>
                        </Row>
                        <Row>
                          <Col md={6}>
                            <Form.Group controlId='name'>
                              <Form.Label>Street 1</Form.Label>
                              <Form.Control
                                type='name'
                                placeholder='Street 1'
                                value={street1}
                                onChange={(e) => setStreet1(e.target.value)}
                              ></Form.Control>
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group controlId='lastName'>
                              <Form.Label>Street 2</Form.Label>
                              <Form.Control
                                type='text'
                                placeholder='Street 2'
                                value={street2}
                                onChange={(e)=>setStreet2(e.target.value)}
                              ></Form.Control>
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group controlId='email'>
                              <Form.Label>City</Form.Label>
                              <Form.Control
                                type='text'
                                placeholder='City'
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                              ></Form.Control>
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                          <Form.Group controlId='email'>
                              <Form.Label>State</Form.Label>
                              <Form.Control
                                type='text'
                                placeholder='State'
                                value={state}
                                onChange={(e) => setState(e.target.value)}
                              ></Form.Control>
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                          <Form.Group controlId='email'>
                              <Form.Label>Zip</Form.Label>
                              <Form.Control
                                type='text'
                                placeholder='Zip'
                                value={zip}
                                onChange={(e) => setZip(e.target.value)}
                              ></Form.Control>
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                          <Form.Group controlId='email'>
                              <Form.Label>Phone</Form.Label>
                              <Form.Control
                                type='text'
                                placeholder='Phone'
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                              ></Form.Control>
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                          <Form.Group controlId='email'>
                              <Form.Label>Official Email</Form.Label>
                              <Form.Control
                                type='email'
                                placeholder='Official Email'
                                value={officialEmail}
                                onChange={(e) => setOfficialEmail(e.target.value)}
                              ></Form.Control>
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                          <Form.Group controlId='email'>
                              <Form.Label>Support Email</Form.Label>
                              <Form.Control
                                type='email'
                                placeholder='Support Email'
                                value={supportEmail}
                                onChange={(e) => setSupportEmail(e.target.value)}
                              ></Form.Control>
                            </Form.Group>
                          </Col>
                          <Col md={12} className="text-center">
                            <Button type='submit' variant='primary'>
                              Update
                                </Button>
                          </Col>
                        </Row>
                      </Form>
                    )}
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}
// const ProfileScreen=[]
export default ContachInfo
