import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { makeStyles } from '@material-ui/core/styles';
import Sidebar from '../components/Sidebar'
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


const AccountFee = ({ location, history }) => {

  const [message, setMessage] = useState(null)
  //category

  const [amount, setAmount] = useState(()=>0)
  const [id, setId] = useState(()=>'')
  const [success, setSuccess] = useState(()=>false)
  const [error, setError] = useState(()=>false)

  const [loading, setLoading] = useState(()=>true)


  const dispatch = useDispatch()

  const userDetails = useSelector((state) => state.userDetails)
  const { user } = userDetails
  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin
  
  useEffect(() => {
    
    if (!userInfo) {
      console.log("not logged in");
      history.push('/login')
    } else if(userInfo.userType != 'admin'){
          console.log("not admin");
          history.push('/')
    }
  }, [dispatch, history, userInfo, user, success])

  const submitHandler = async (e) => {
   
          e.preventDefault()
          setLoading(true)
          let config = {
            headers: {
                      'Authorization' : `Bearer ${userInfo.token}`
            }
        }
          
          let data = {
            id: id,
            amount: amount
          }

          Axios.put(`/api/miscellaneous/platform-fee`,data, config)
          .then((res)=>{
            setId(res.data._id)
            setAmount(res.data.amount)
            setSuccess(true)
            setTimeout(()=>{setSuccess(false)}, 2000)
            setLoading(false)
          })
          .catch((err)=>{
            setError(true)
            setTimeout(()=>{setError(false)}, 2000)
            setLoading(false)
          })

          

  }

  useEffect(()=>{
            let config = {
                      headers: {
                                'Authorization' : `Bearer ${userInfo.token}`
                      }
            }
            Axios.get(`/api/miscellaneous/platform-fee`, config).then((res)=>{
              setId(res.data._id)
              setAmount(res.data.amount)
              setLoading(false)
            })
            .catch((err)=>{
               setAmount(0)
               setId('0000')
               setLoading(false)
            })
  },[])

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
              <h4 className="heading">Platform Fee</h4>
          
              <div className="account-personalInfo">
                {error && <Message variant='danger'>{'Update Failed'}</Message>}
                {}
                {success && <Message variant='success'>Updated</Message>}
                {loading ? (
                  <Loader />
                ) : error ? (
                  <Message variant='danger'>{error}</Message>
                ) : (

                      <Form onSubmit={submitHandler}>
                        <Row>
                          <Col md={6}>
                            <Form.Group controlId='name'>
                              <Form.Label>Fees (in %)</Form.Label>
                              <Form.Control
                                type='number'
                                placeholder='Fees'
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
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
export default AccountFee
