import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { makeStyles } from '@material-ui/core/styles';
import Sidebar from '../components/Sidebar'
import Axios from 'axios';
import { Table,Popconfirm } from 'antd';

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


const BannerManagement = ({ location, history }) => {

  const [message, setMessage] = useState(null)
  //category

  const [success, setSuccess] = useState(()=>false)
  const [error, setError] = useState(()=>false)

  const [loading, setLoading] = useState(()=>true)


  const dispatch = useDispatch()

  const userDetails = useSelector((state) => state.userDetails)
  const { user } = userDetails
  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const [banners, setBanners] = useState(()=>[]);
  
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

  }

  useEffect(()=>{

            Axios.get(`/api/miscellaneous/get-all-banners`)
            .then((res)=>{
              console.log(res);
              setLoading(false)
            })
            .catch((err)=>{
              
               setLoading(false)
            })
  },[])

  const columns = [
          // {
          //   title: 'id',
          //   dataIndex: '_id',
          //   key: '_id',
          // },
          {
            title: 'Image',
            dataIndex: 'image',
            key: 'image',
            width: '25%',
            render: (text, response)=>(
                 <img src={response.image}/>
            )
          },
          {
            title: 'Heading',
            dataIndex: 'heading',
            key: 'heading',
            width: '25%',
          //   render: (text, response)=>(
          //     <a href={`mailto:${response.email}`}>{response.email}</a>
          //   )
          },
          {
            title: 'Tag Line',
            dataIndex: 'tagline',
            key: 'tagline',
            width: '25%',
//             render: (text, response)=>(
//               response.userType =='admin'?  <i className='fas fa-check' style={{ color: 'green' }}></i>
//                                             :
//                                             <i className='fas fa-times' style={{ color: 'red' }}></i>
//          )
          },
          {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            width: '25%',
            render: (text, response)=>(
              <>
              <Button variant='light' className='btn-sm' onClick={()=>{}}>
                                <i className='fas fa-edit'></i>
                              </Button>
                              <Popconfirm title="Sure to delete?" onConfirm={() => {}}>
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

  const classes = useStyles();

  return (
    <section className="accountMain-wraper">
      <Container>
        <Row>
          <Col md={12}>
            <h1 className="main-heading">Banner Management</h1>
          </Col>
        </Row>
        <Row>
          <Sidebar />
          <Col md={12} lg={9} xl={9}>
            <div className="paymentMethod-main">
              <h4 className="heading">Home Page Banner Management</h4>
              <Col className='text-right'>
                    <Button variant="secondary" className='my-3' onClick={()=>{}}>
                    <i className='fas fa-plus'></i> Add Banner
                    </Button>

          </Col>
          
              <div className="account-personalInfo">
                {error && <Message variant='danger'>{'Update Failed'}</Message>}
                {}
                {success && <Message variant='success'>Updated</Message>}
                {loading ? (
                  <Loader />
                ) : error ? (
                  <Message variant='danger'>{error}</Message>
                ) : (
                    <Table 
                    dataSource={banners}
                    columns={columns}
                    rowKey={'_id'}
                    loading={loading}
                    expandable={{
                      expandedRowRender: record => <p style={{ margin: 0 }}>Example</p>,
                    }}
                  />
                    )}
              </div>
            </div>
          </Col>
        </Row>
      </Container>
      {/* <Modal show={modalVisibility} onHide={addCategoryCancel}>
                  <Modal.Header closeButton>
                       <Modal.Title>{isUpdate?"Update Category":"Add Category"}</Modal.Title>
                  </Modal.Header>

                  <Modal.Body>
                    {msg&&<Alert variant='danger'>{msg}</Alert>}
                  <Form style={{marginTop: "5%"}}>
                    <div>
                      <Loader />
                    </div>
                    <div style={{display: loading1?'none':'initial'}}>
                    <div>
                    <Form.Group controlId="exampleForm.ControlSelect1">
                         <Form.Label>Parent Category</Form.Label>
                         <Form.Control as="select" defaultValue={categoryId} onChange={(e)=>{setcategoryId(e.target.value)}}>
                           <option key="" value={""}>{'Select a parent category'}</option>
                            {allcategories.map((e)=>{
                               return (<option key = {e._id} value={e._id}>{e.name}</option>)
                            })}
                         </Form.Control>
                     </Form.Group>
                    </div>
           <Form.Group controlId='categoryName'>
             <Form.Label>{"Category Name"}</Form.Label>
             <Form.Control
               type='name'
               placeholder={"Category Name"}
               value={categoryName}
               onChange={(e) => setCategoryName(e.target.value)}
               onBlur={()=>{
                setSlug(categoryName.trim().replaceAll(" ", "-"))
               }}
             ></Form.Control>
           </Form.Group>

           <Form.Group controlId='slug'>
             <Form.Label>{"Slug"}</Form.Label>
             <Form.Control
               type='name'
               placeholder={"Slug"}
               value={slug}
               onChange={(e)=>{setSlug(e.target.value)}}
             ></Form.Control>
           </Form.Group>


           <Form.Group controlId='image'>
             <Form.Label>Category Image</Form.Label>
             <Form.File
                id='image-file'
                label={imageName}
                custom={true}
                onChange={(e)=>{
                  
                  setImage(e.target.files[0]);
                  setImageName(e.target.files[0].name);
                }}              
             ></Form.File>
           </Form.Group>
           {
             isUpdate? <img src={uImage} style={{width: "25%"}}/>: <></>
           }
    </div>
         </Form>   
                  </Modal.Body>

                 <Modal.Footer>
                        <Button variant="secondary" onClick={addCategoryCancel}>
                         Close
                        </Button>

                        <Button variant="primary" onClick={isUpdate?updateCategory:addCategorySave}>
                           {isUpdate? "Update Category":"Add Category"}
                        </Button>
        </Modal.Footer>
      </Modal> */}
    </section>
  );
}
// const ProfileScreen=[]
export default BannerManagement;
