import React, { useEffect,useState, Fragment } from 'react'
import { Button, Row, Col,Modal, Form , OverlayTrigger, Tooltip} from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import Paginate from '../components/Paginate'
import {
listCategories
} from '../actions/categoryActions'
import { CATEGORY_CREATE_RESET } from '../constants/categoryConstants'

import SideBar from "../components/Sidebar" 

import { Table, Space,Popconfirm } from 'antd';
import 'antd/dist/antd.css';
import Axios from 'axios'
import { TreeSelect } from 'antd'

const VariantScreen = ({ history, match }) => {
  
  const pageNumber = match.params.pageNumber || 1

  const { SHOW_ALL } = TreeSelect;


  const dispatch = useDispatch()

  const categoryList = useSelector((state) => state.categoryList)

  const { loading,error , page, pages } = categoryList
  
  

  const productDelete = useSelector((state) => state.productDelete)
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = productDelete

  const productCreate = useSelector((state) => state.productCreate)
  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
    product: createdProduct,
  } = productCreate

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  useEffect(() => {
    dispatch({ type: CATEGORY_CREATE_RESET })

    if (!userInfo || !userInfo.userType == 'admin') {
      history.push('/login')
    }
    

    if (successCreate) {
      history.push(`/admin/product/${createdProduct._id}/edit`)
    } else {
      dispatch(listCategories('', pageNumber))
    }
  }, [
    dispatch,
    history,
    userInfo,
    successDelete,
    successCreate,
    createdProduct,
    pageNumber,
  ])


  useEffect(()=>{


   let userInfo = JSON.parse(localStorage.getItem("userInfo"))

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    Axios.get(`/api/category/getall`, config)
    .then((res)=>{
      setCategories(res.data.data)
    })
    .catch((err)=>{
      console.log(err)
    })
    Axios.get('/api/variants/all', config)
    .then((res)=>{
      setTableData(res.data.data)
      setLoading1(false)
    })
    .catch((err)=>{
      console.log(err)
    })

  
  }, [])


  
  const [modalVisibility, setModalVisibility] = useState(()=>false)

 
   
  const [msg, setMsg] = useState(()=>"")
  const [isUpdate, setIsUpdate] = useState(()=>false)
  const [loading1, setLoading1] = useState(()=>true)
  const [tableData, setTableData] = useState(()=>[])

  const [categories, setCategories] = useState(()=>[])
  const [selectedCategories, setSelectedCategories] = useState(()=>[])

  

  const [name, setName] = useState(()=>"")
  const [id, setId] = useState(()=>"")

  const [values, setValues] = useState(()=>[{
    value: ""
  }])

  const [success, setSuccess] = useState(()=>false)
  const [successMsg, setSuccessMsg] = useState(()=>"")

  const [err,setErr] = useState(()=>false)
  const [errorMsg, setErrorMsg] = useState(()=>"")

//Table Data
  const columns =[
    {
      title: 'Variant Name',
      dataIndex: 'variantsname',
      key: 'variantsname',
      width: '50%',
    },
    {
      title: 'Options',
      dataIndex: 'options',
      key: 'options',
      render: record =>(<>
           <ul>
             {
               record.map((e,i)=>{
                 return (<li key={i}>{e.value}</li>)
               })
             }
           </ul>
      </>)
    },
    {
      title: 'Action',
      dataIndex: 'action',
      width: '16%',
      fixed: 'right',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
            <Popconfirm title="Are you sure?" onConfirm={() => deleteHandler(record._id)}>
            <Button variant="secondary" style={{color: "red"}} ><i className="fas fa-trash-alt"></i></Button>
            </Popconfirm>
            <Button variant="secondary" style={{color: "#2aa8f2"}} onClick={()=>{editHandler(record._id)}}><i className="fas fa-edit"></i></Button>
        </Space>
      ),
    },
  ];
  

  const editHandler = (id) => {

    setId(id)

    for(let i = 0; i<tableData.length; ++i){

      if(tableData[i]._id == id){
        setName(tableData[i].variantsname);
        setValues(tableData[i].options);
        setSelectedCategories(tableData[i].categories)
        setIsUpdate(true);
        setModalVisibility(true);
        break;
      }

    }

  }

  const handleSave = (e) => {

    e.preventDefault();
    let emp = false;

    if(name.trim()==""){
      setMsg("Enter Variant Name")
      setTimeout(()=>{setMsg('')}, 3000)
      return
    }
      for(let i = 0; i<values.length; ++i){
        if(values[i].value.trim()===""){
          setMsg("Variant value Cannot be empty")
          setTimeout(()=>{setMsg('')}, 3000)
          emp = true;
          return
        }
      
    }
    if(selectedCategories.length == 0){
      setMsg("Select Categories")
      setTimeout(()=>{setMsg('')}, 3000)
      return
    }

    if(emp === false){

      let data = {
        variantsname: name,
        user: userInfo._id,
        options: values,
        categories: selectedCategories
      }


      Axios.post('/api/variants/', data).then((res)=>{
      
          let tdata = {
            _id: res.data.data._id,
            variantsname: name,
            user: userInfo._id,
            options: values,
            categories: selectedCategories
          }
          setTableData([...tableData, tdata])

          setMsg("")
          setName("")
          setValues([{
            value: ""
          }])
          setSelectedCategories([])
          setModalVisibility(false);
          setSuccessMsg("Variant Added!!")
          setSuccess(true)
          setTimeout(hideMessage, 3000)
      })
      .catch((err)=>{
        setMsg("Variant already exists")
      })

      
    }

    
  }

  const updateVariant = () => {
   
    let data = [...tableData]

    let empty = false;

    if(name.trim() == ""){
      setMsg("Enter variant name")
      setTimeout(()=>{setMsg('')}, 3000)
      return
    }

    for(let i = 0; i<values.length; ++i){

      if(values[i].value.trim() == ""){
        setMsg("Enter variant values")
        empty = true
        setTimeout(()=>{setMsg('')}, 3000)
        return
      }

    }
    if(selectedCategories.length == 0){
      setMsg("Select Categories")
      setTimeout(()=>{setMsg('')}, 3000)
      return
    }

    if(empty == false){
      
      for(let i =0; i<data.length; ++i){

        if(data[i]._id == id){
          data[i].variantsname = name;
          data[i].options = values; 
          data[i].categories = selectedCategories
        }
  
      }

      let passData = {
        id: id,
        variantsname: name,
        options: values,
        user:userInfo._id ,
        categories: selectedCategories
  }

  Axios.put('/api/variants/update',passData).then((res)=>{
    setMsg("")
    setName("")
    setValues([{
      value: ""
    }])
    setSelectedCategories([])
    setTableData(data) 
    setModalVisibility(false)
          setSuccessMsg("Variant Updated!!")
          setSuccess(true)
          setTimeout(hideMessage, 3000)
  })
  .catch((err)=>{
    setMsg("Try again later")
  })

    }

  
  }

  const addCategoryCancel = () => {

    setMsg("")
    setName("")
    setValues([{
      value: ""
    }])
    setSelectedCategories([])
    setModalVisibility(false)
    setIsUpdate(false)
  }

  const handleValueInput = (value, i) => {
    
    let val = [...values];
    val[i].value = value;
    setValues(val)

  }

  const addFeild = () => {

    let val = [...values];
    val.push({
      value: ''
    })

    setValues(val);
  }

  const hideMessage = () => {
   
    setErr(false)
    setSuccess(false)
    setErrorMsg("")
    setSuccessMsg("")

  }

  const removeField = (index) => {

    let val = [];
    for(let i =0; i<values.length; ++i){
      if(i != index){
            val.push(values[i])
      }
    }
setValues(val)
  }

  const deleteHandler = (id) => {

    let data = [];

    Axios.delete(`/api/variants/delete/${id}`)
    .then((res)=>{

      for(let i =0; i<tableData.length; ++i){
        if(tableData[i]._id != id){
             data.push(tableData[i])
        }
      }

      setTableData(data)
      setModalVisibility(false)
      setSuccessMsg("Variant Deleted!!")
      setSuccess(true)
      setTimeout(hideMessage, 3000)
    })
    .catch((err)=>{
      setMsg("Try again later!")
    })

  }
 
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
     <SideBar />
      <div className="col-md-12 col-lg-9 col-xl-9">
      <div className="paymentMethod-main">
      <Row className='align-items-center'>
        <Col>
          <h4 className="heading">Variants</h4>
        </Col>
        <Col className='text-right'>
          <Button style={{marginRight: "1%"}} variant="secondary" className='my-3' onClick={()=>{
            setModalVisibility(true)}}>
            <i className='fas fa-plus'></i> Add Variant
          </Button>

        </Col>
      </Row>
      {loadingDelete && <Loader />}
      {loadingCreate && <Loader />}
      {errorCreate && <Message variant='danger'>{errorCreate}</Message>}
      {err && <Message variant='danger'>{errorMsg}</Message>}
      {success && <Message >{successMsg}</Message>}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <>
        <Table
        loading = {loading1}
        columns={columns}
        dataSource={tableData}
        rowKey={'_id'}
      />
          <Modal show={modalVisibility} onHide={addCategoryCancel}>
                  <Modal.Header closeButton>
                       <Modal.Title>{isUpdate?"Update Variant":"Add Variant"}</Modal.Title>
                  </Modal.Header>

                  <Modal.Body>
                   {msg && <Message variant='danger'>{msg}</Message>}
                  <Form style={{marginTop: "5%"}}>
                     
                  <Form.Group controlId='name' >
             <Form.Label>Variant Name</Form.Label><OverlayTrigger
                                                  placement="top"
                                                  delay={{ show: 250, hide: 400 }}
                                                  overlay={<Tooltip id="button-tooltip">{`Products have variant attribute, For ex: A T-shirt have Size and Color as variant attribute. So in this case Size and Color can variant name`}</Tooltip>}
                                                >
                                                  <Button style={{background:'none', color: '#2aa8f2'}}><i className="far fa-question-circle"></i></Button>
                                                </OverlayTrigger>
             <Form.Control
               type='name'
               placeholder={'Variant Name'}
               value={name}
               onChange={(e)=>{setName(e.target.value)}}
             ></Form.Control>
           </Form.Group>

          <Form.Group controlId='slug' >
          <Form.Label>Variant Value</Form.Label><OverlayTrigger
                                                  placement="top"
                                                  delay={{ show: 250, hide: 400 }}
                                                  overlay={<Tooltip id="button-tooltip">{`Products also has variant attribute, For ex: A T-shirt has Size as variant attribute, so the Variant attribute value can be anything that is valid size like XL, S, M, etc.`}</Tooltip>}
                                                >
                                                  <Button style={{background:'none', color: '#2aa8f2'}}><i className="far fa-question-circle"></i></Button>
                                                </OverlayTrigger>
             {
            values.map((e, i)=>
                             ( <Fragment key={`${e}~${i}`}>     

                             {
                               i == 0?
                                      <>
                                     <div style={{display: "flex"}}>
                                       <Form.Control
                                            type='name'
                                            style={{width: "90%"}}
                                            placeholder={'Value'}
                                            value={e.value}
                                            onChange={(val)=>{handleValueInput(val.target.value, i)}}
                                          ></Form.Control> 
                                            <Button variant={'secondary'} onClick={addFeild}><i className="fas fa-plus"></i></Button>
                                            </div>
                                      </>
                                      :
                                      <>
                                     <div style={{display: "flex", marginTop:"2%"}}>
                                       <Form.Control
                                        type='name'
                                        style={{width: "90%"}}
                                        placeholder={'Value'}
                                        value={e.value}
                                        onChange={(val)=>{handleValueInput(val.target.value, i)}}
                                      ></Form.Control> 
                                        <Button variant={'secondary'} onClick={()=>{removeField(i)}}><i className="fas fa-minus"></i></Button>
                                        </div>
                                      </>
                             }
                                </Fragment>)
                                )
           }       
         </Form.Group>

         <Form.Group controlId='name' >
             <Form.Label>Categories</Form.Label>
             <OverlayTrigger
              placement="top"
              delay={{ show: 250, hide: 400 }}
              overlay={<Tooltip id="button-tooltip">{`Categories that the variant is for`}</Tooltip>}
            >
              <Button style={{background:'none', color: '#2aa8f2'}}><i className="far fa-question-circle"></i></Button>
            </OverlayTrigger>
             <TreeSelect 
               treeData={categories}
               value={selectedCategories}
               onChange={(e)=>{
                setSelectedCategories(e)
              }}
               treeCheckable= {true}    
               showCheckedStrategy = {SHOW_ALL}
               placeholder= {'Select Categories'}
               style={{
                 width: '100%'
               }}
             />
             </Form.Group>
        
         
 
                  </Form>   
                  </Modal.Body>

                 <Modal.Footer>
                        <Button variant="secondary" onClick={addCategoryCancel}>
                         Close
                        </Button>

                        <Button variant="primary" onClick={isUpdate?updateVariant:handleSave}>
                           {isUpdate? "Update Variant":"Add Variant"}
                        </Button>
        </Modal.Footer>
      </Modal>

          <Paginate pages={pages} page={page} isAdmin={true} />
        </>
      )}
      </div>
       </div>
    </div>
  </div>
</section>
    </>
  )
}

export default VariantScreen
