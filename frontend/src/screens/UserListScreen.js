import React, { useEffect,useState }  from 'react'
import { Button , Row, Col,Modal, Form, Container, Tabs, Tab } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { listUsers, deleteUser } from '../actions/userActions'
import SideBar from '../components/Sidebar'
import { Table,Popconfirm } from 'antd'
import axios from 'axios'

const UserListScreen = ({ history }) => {
  const dispatch = useDispatch()
  
  const [showModal, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setName("")
    setLastName("")
        setEmail("")
        setPassword("")
        setUserType("")
        setCompanyName("")
        setCompanyEmail("")
        setCompanyRegNo("")

        setStreet1('')
        setCity('')
        setState('')
        setZip('')
        setCountry('')

    setIsUpdate(false)
    setShow(true)
  }

  const userList = useSelector((state) => state.userList)
  const { loading, error, users } = userList

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const userDelete = useSelector((state) => state.userDelete)
  const { success: successDelete } = userDelete

   const [allUsers, setAllUsers] = useState(()=>[])

   useEffect(()=>{
    
    setAllUsers(users)

   },[userList])

 const [name , setName] = useState(()=>"")
 const [lastName, setLastName] = useState(()=>'')
 const [email, setEmail] = useState(()=>"")
 const [password,setPassword] = useState(()=>"")
 const [usertype, setUserType] = useState(()=>"")
 const [confirmPass,setConfirmPass] = useState(()=>"")

 const [isUpdate, setIsUpdate] = useState(()=>false)
 const [loading1, setLoading1] = useState(()=>false)
 
 //....Company Details....

 const [companyName, setCompanyName] = useState(()=>'')
 const [companyRegNo, setCompanyRegNo] = useState(()=>'')
 const [companyEmail, setCompanyEmail] = useState(()=>'')

 const [street1, setStreet1] = useState(()=>'')
 const [city, setCity] = useState(()=>'')
 const [state, setState] = useState(()=>'')
 const [zip, setZip] = useState(()=>'')
 const [country, setCountry] = useState(()=>'')


  useEffect(() => {
    if (userInfo && userInfo.userType == 'admin') {
      dispatch(listUsers())
    } else {
      history.push('/login')
    }
  }, [dispatch, history, successDelete, userInfo])

  const deleteHandler = (id) => {
   
      dispatch(deleteUser(id))
    
  }


  const addUser = async () => {
  
    setLoading1(true)
     const   userData = {
          name:name,
          lastName: lastName,
          email:email,
          password:password,
          userType:usertype,
          companyName: companyName,
          companyRegNo: companyRegNo,
          companyEmail: companyEmail,
          companyAddress: {
               street1: street1,
               city: city,
               state: state,
               zip: zip,
               country: country
          }
      }
 
      axios.post('/api/users/', userData).then((res)=>{
        
        console.log(res.data)
        setAllUsers((old)=>[...old, res.data])
        setName("")
        setEmail("")
        setPassword("")
        setUserType("")
        setCompanyName("")
        setCompanyEmail("")
        setCompanyRegNo("")

        setStreet1('')
        setCity('')
        setState('')
        setZip('')
        setCountry('')

        setLoading1(false)

      }).catch((err)=>{
         console.log(err)
      })
       
  handleClose();
}

const editUser = (id) => {
  

  for(let i =0; i<allUsers.length; ++i){
       if(allUsers[i]._id == id){

        localStorage.setItem('userIdEdit', allUsers[i]._id)

         setName(allUsers[i].name)
         setLastName(allUsers[i].lastName? allUsers[i].lastName: "")
         setEmail(allUsers[i].email)

         setUserType(allUsers[i].userType)

         setCompanyName(allUsers[i].companyName? allUsers[i].companyName : "")
         setCompanyRegNo(allUsers[i].companyRegNo? allUsers[i].companyRegNo : "")
         setCompanyEmail(allUsers[i].companyEmail? allUsers[i].companyEmail : "" )

         setStreet1(allUsers[i].companyAddress?allUsers[i].companyAddress.street1 : "")
         setCity(allUsers[i].companyAddress?allUsers[i].companyAddress.city : "")
         setState(allUsers[i].companyAddress?allUsers[i].companyAddress.state : "")
         setZip(allUsers[i].companyAddress?allUsers[i].companyAddress.zip : "")
         setCountry(allUsers[i].companyAddress?allUsers[i].companyAddress.country : "")
         
       }
  }
  setIsUpdate(true)
  setShow(true)


}

const updateUser = async (e) => {

  e.preventDefault();

  setLoading1(true)
  let config = {
    headers: {
      Authorization : `Bearer ${userInfo.token}`
    }
  }
 
  let id = localStorage.getItem('userIdEdit')

  let userData = {
        name: name,
        lastName: lastName,
        email: email,
        userType: usertype,
        companyName: companyName,
        companyEmail: companyEmail,
        companyRegNo: companyRegNo,
  }

  let {data} = await axios.put(`/api/users/${id}`,userData, config)

  let fdata = allUsers.filter((e)=>e._id != id)

  fdata = [...fdata, data]

  setAllUsers(fdata)
  setLoading1(false)
  handleClose()
}

const columns = [
  // {
  //   title: 'id',
  //   dataIndex: '_id',
  //   key: '_id',
  // },
  {
    title: 'Name',
    dataIndex: 'fullName',
    key: 'fullName',
    width: '35%',
    render: (text, response)=>(
         response.lastName? response.name+" "+response.lastName : response.name
    )
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
    width: '35%',
    render: (text, response)=>(
      <a href={`mailto:${response.email}`}>{response.email}</a>
    )
  },
  {
    title: 'Admin',
    dataIndex: 'admin',
    key: 'admin',
    width: '10%',
    render: (text, response)=>(
      response.userType =='admin'?  <i className='fas fa-check' style={{ color: 'green' }}></i>
                                    :
                                    <i className='fas fa-times' style={{ color: 'red' }}></i>
 )
  },
  {
    title: 'Action',
    dataIndex: 'action',
    key: 'action',
    width: '20%',
    render: (text, response)=>(
      <>
      <Button variant='light' className='btn-sm' onClick={()=>{editUser(response._id)}}>
                        <i className='fas fa-edit'></i>
                      </Button>
                      <Popconfirm title="Sure to delete?" onConfirm={() => deleteHandler(response._id)}>
                      <Button
                      variant='danger'
                      className='btn-sm'
                    >
                      <i className='fas fa-trash'></i>
                    </Button>
                      </Popconfirm>
                    </>)
  }, 
];

  return (
    <>
         <section className="accountMain-wraper">
  <div className="container">
    <div className="row">
        <div className="col-md-12">
            <h1 className="main-heading">My Account</h1>
        </div>
    </div>
    <div className="row">
     <SideBar/>
      <div className="col-md-12 col-lg-9 col-xl-9">
      <div className="paymentMethod-main">
      <>
     <div>
     <Row className='align-items-center'>
       
     
      <Col>
     <h4 className="heading">User Management</h4>
     </Col>
     <Col className='text-right'>
          <Button variant="secondary" className='my-3' onClick={handleShow}>
            <i className='fas fa-plus'></i> Add User
          </Button>

        </Col>
        </Row>
        {}    
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>{error}</Message>
        ) : (
          <Table 
            dataSource={allUsers}
            columns={columns}
            rowKey={'_id'}
            loading={loading}
            expandable={{
              expandedRowRender: record => <p style={{ margin: 0 }}>User Id: {record._id}</p>,
            }}
          />
          // <Table striped bordered hover responsive className='table-sm'>
          //   <thead>
          //     <tr>
          //       <th>ID</th>
          //       <th>NAME</th>
          //       <th>EMAIL</th>
          //       <th>ADMIN</th>
          //       <th></th>
          //     </tr>
          //   </thead>
          //   <tbody>
          //     {
          //     allUsers? 
          //     allUsers.map((user) => (
          //       <tr key={user._id}>
          //         <td>{user._id}</td>
          //         <td>{user.lastName? user.name+" "+user.lastName : user.name}</td>
          //         <td>
          //           <a href={`mailto:${user.email}`}>{user.email}</a>
          //         </td>
          //         <td>
          //           {user.isAdmin ? (
          //             <i className='fas fa-check' style={{ color: 'green' }}></i>
          //           ) : (
          //             <i className='fas fa-times' style={{ color: 'red' }}></i>
          //           )}
          //         </td>
          //         <td>
          //           {/* <LinkContainer to={`/admin/user/${user._id}/edit`}> */}
          //             <Button variant='light' className='btn-sm' onClick={()=>{editUser(user._id)}}>
          //               <i className='fas fa-edit'></i>
          //             </Button>
          //           {/* </LinkContainer> */}
          //           <Button
          //             variant='danger'
          //             className='btn-sm'
          //             onClick={() => deleteHandler(user._id)}
          //           >
          //             <i className='fas fa-trash'></i>
          //           </Button>
          //         </td>
          //       </tr>
          //     ))
          //   :
          //   <></>
          //   }
          //   </tbody>
          // </Table>
        )}      
     </div>
     </>
      </div>
       </div>
    </div>
  </div>
</section>
<Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{isUpdate? "Update User":"Add User"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
           <div style={{display: loading1?"initial":"none"}}>
              <div style={{display: 'flex', justifyContent: 'center'}}>            
              <Loader />
              </div>
           </div>

        <Form style={{marginTop: "5%", display: loading1?"none":"initial"}}>

          <Container>
              <Row>
                  <Col>
                    <Form.Group controlId='name'>
                      <Form.Label>{"First Name"}</Form.Label>
                      <Form.Control
                        type='name'
                        placeholder={"First Name"}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      ></Form.Control>
                    </Form.Group>
                  </Col>

                  <Col>
                    <Form.Group controlId='name'>
                      <Form.Label>{"Last Name"}</Form.Label>
                      <Form.Control
                        type='name'
                        placeholder={"Last Name"}
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      ></Form.Control>
                    </Form.Group>
                  </Col>
              </Row>
          </Container>

          <Container>
              <Row>
                 <Col>
                 <Form.Group controlId='email'>
                    <Form.Label>{"Email"}</Form.Label>
                    <Form.Control
                      type='name'
                      placeholder={"Email"}
                      value={email}
                      onChange={(e)=>{setEmail(e.target.value)}}
                    ></Form.Control>
                  </Form.Group>
                 </Col>
              </Row>
          </Container>


         <Container style={{display: isUpdate?"none":"initial"}}>
             <Row>
                  <Col>
                  <Form.Group controlId='password'>
                          <Form.Label>{"Password"}</Form.Label>
                          <Form.Control
                            type='password'
                            placeholder={"Password"}
                            value={password}
                            
                            onChange={(e)=>{setPassword(e.target.value)}}
                          ></Form.Control>
                 </Form.Group>
                  </Col>
                  <Col>
                  <Form.Group controlId='password'>
                      <Form.Label>{"Confirm Password"}</Form.Label>
                      <Form.Control
                        type='password'
                        placeholder={"Confirm Password"}
                        value={confirmPass}
                        onChange={(e)=>{setConfirmPass(e.target.value)}}
                      ></Form.Control>
                  </Form.Group>
                    </Col>
             </Row>
         </Container>

         <Container>
             <Row>
               <Col>
                  <Form.Group controlId='usertype'>
                    <Form.Label>User Type</Form.Label>
                        <Form.Control value={usertype} onChange={(e)=>{
                          setCompanyName('')
                          setCompanyRegNo('')
                          setCompanyEmail('')
                          setUserType(e.target.value)}} as="select">
                                <option  value=" ">Please select UserType</option>
                                <option value="admin">admin</option>
                                <option value="vendor">vendor</option>
                                <option value="customer">customer</option>
                        </Form.Control>
              </Form.Group>
               </Col>
             </Row>
         </Container>
          
          {/* Company Details */}
          <div style={{display: usertype == 'vendor'? 'initial' : 'none'}}>
            <Container>
              <Row>
                <Col>
                    <Form.Group controlId='password'>
                        <Form.Label>{"Company Name"}</Form.Label>
                        <Form.Control
                          type='name'
                          placeholder={"Company Name"}
                          value={companyName}             
                          onChange={(e)=>{setCompanyName(e.target.value)}}
                        ></Form.Control>
                    </Form.Group>
                </Col>
                <Col>
                <Form.Group controlId='password'>
                        <Form.Label>{"Company Email"}</Form.Label>
                        <Form.Control
                          type='email'
                          placeholder={"Company Email"}
                          value={companyEmail}             
                          onChange={(e)=>{setCompanyEmail(e.target.value)}}
                        ></Form.Control>
                    </Form.Group>
                </Col>
              </Row>

              <Row>
                   <Col>
                   <Form.Group controlId='password'>
                        <Form.Label>{"Company Registration No."}</Form.Label>
                        <Form.Control
                          type='name'
                          placeholder={"Company Registration No."}
                          value={companyRegNo}             
                          onChange={(e)=>{setCompanyRegNo(e.target.value)}}
                        ></Form.Control>
                    </Form.Group>
                   </Col>
              </Row>

              <Row>
                  <Col>
                    <Form.Group controlId='password'>
                          <Form.Label>{"Street"}</Form.Label>
                          <Form.Control
                            type='name'
                            value={street1}
                            onChange={(e)=>{setStreet1(e.target.value)}}
                            placeholder={"Street"}
                          ></Form.Control>
                      </Form.Group>
                  </Col>
              </Row>

              <Row>
                  <Col>
                    <Form.Group controlId='password'>
                          <Form.Label>{"City"}</Form.Label>
                          <Form.Control
                            type='name'
                            value={city}
                            onChange={(e)=>{setCity(e.target.value)}}
                            placeholder={"City"}
                          ></Form.Control>
                      </Form.Group>
                  </Col>

                  <Col>
                    <Form.Group controlId='password'>
                          <Form.Label>{"State"}</Form.Label>
                          <Form.Control
                            type='name'
                            value={state}
                            onChange={(e)=>{setState(e.target.value)}}
                            placeholder={"State"}
                          ></Form.Control>
                      </Form.Group>
                  </Col>
              </Row>

              <Row>
                  <Col>
                    <Form.Group controlId='password'>
                          <Form.Label>{"ZIP"}</Form.Label>
                          <Form.Control
                            type='number'
                            value={zip}
                            onChange={(e)=>{setZip(e.target.value)}}
                            placeholder={"ZIP"}
                          ></Form.Control>
                      </Form.Group>
                  </Col>

                  <Col>
                    <Form.Group controlId='password'>
                          <Form.Label>{"Country"}</Form.Label>
                          <Form.Control
                            type='name'
                            value={country}
                            onChange={(e)=>{setCountry(e.target.value)}}
                            placeholder={"Country"}
                          ></Form.Control>
                      </Form.Group>
                  </Col>
              </Row>

            </Container>
          </div>


         </Form>   

        </Modal.Body>
        
        
        
        
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={isUpdate? updateUser:addUser}>
            {isUpdate? "Update":"Save"}
          </Button>
        </Modal.Footer>
      </Modal>
    
    </>
  )
}

export default UserListScreen
