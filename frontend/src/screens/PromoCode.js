import React, { useEffect,useState, Fragment } from 'react'
import { Button, Row, Col,Modal, Form } from 'react-bootstrap'
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

const VariantScreen = ({ history, match }) => {
  
  const pageNumber = match.params.pageNumber || 1


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

    window.scrollTo(0,0)

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

   Axios.get(`/api/promo/${userInfo._id}`, config)
   .then((res)=>{
     setTableData(res.data)
     setLoading1(false)
   })
   .catch((err)=>{
             console.log(err)
   })
  
  }, [])
 


  const [success, setSuccess] = useState(()=>false)
  const [successMsg, setSuccessMsg] = useState(()=>"")

  const [err,setErr] = useState(()=>false)
  const [errorMsg, setErrorMsg] = useState(()=>"")


  // Promo Code states and methods data

  //Table Data
  const columns =[
           {
            title: 'Code',
            dataIndex: 'code',
            key: 'code',
          },
           {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
          },
           {
            title: 'Discount',
            dataIndex: 'Discount',
            key: 'Discount',
            render: (text, record) => (
                      record.type == 'percentage'? record.value+" % off" : "$ "+record.value+" off"
            )
          },
          {
            title: 'Min. Purchase',
            dataIndex: 'minAmount',
            key: 'minAmount',
          },
          {
            title: 'Expiry Date',
            dataIndex: 'expiryDate',
            key: 'expiryDate',
            render: (text, record) => (
                      record.expiryDate?(record.expiryDate.split('T')[0]).split('-')[2]+"-"+(record.expiryDate.split('T')[0]).split('-')[1]+"-"+(record.expiryDate.split('T')[0]).split('-')[0]:<></>
            )
          },
          {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            render: (text, record) => (
                      <Space>
                          <Popconfirm title={'Are You Sure?'} onConfirm={()=>{deletePromo(record._id)}}> 
                              <Button style={{color: 'red'}} variant='secondary'><i className="fas fa-trash-alt"></i></Button>
                          </Popconfirm>
                          <Button onClick={()=>{setIsUpdate(true); editPromo(record._id)}} style={{color: 'rgb(42, 168, 242)'}} variant='secondary'><i className="fas fa-edit"></i></Button>
                      </Space>
            )
          },
        ]

  const [code, setCode] = useState(()=>'')
  const [type, setType] = useState(()=>'')
  const [value, setValue] = useState(()=>0)
  const [hasMinPurchase, setHasMinPurchase] = useState(()=>true)
  const [minAmount, setMinAmount] = useState(()=>0)

  const [date, setDate] = useState(()=>undefined)

  const [msg, setMsg] = useState(()=>"")
  const [isUpdate, setIsUpdate] = useState(()=>false)

  const [modalVisibility, setModalVisibility] = useState(()=>false)

  const [loading1, setLoading1] = useState(()=>true)
  const [tableData, setTableData] = useState(()=>[])

  const addPromoCancel = () => {

          setCode("")
          setType("")
          setValue("")
          setHasMinPurchase(false)
          setMinAmount("")
          setDate(null)
          setModalVisibility(false)
          
  }

  const hideMessage = () => {
   
          setTimeout(()=>{
                    setErr(false)
                    setMsg("")
                    setSuccess(false)
                    setErrorMsg("")
                    setSuccessMsg("")
          }, 2000)      
        }

  const updatePromocode = (e) => {

          e.preventDefault()
          setLoading1(true)
          let id = localStorage.getItem('promocode')

          const config = {
                    headers: {
                      Authorization: `Bearer ${userInfo.token}`,
                    },
                  }

                  if (date) {
                    let d = new Date();
                    let dob = date.split("-");
                    if (dob[0] < d.getFullYear()) {
                      setMsg("Expiry Date cannot be less than today");
                      hideMessage()
                      return;
                    }
                    if (dob[0] <= d.getFullYear() && dob[1] < parseInt(d.getMonth()) + 1) {
                      setMsg("Expiry Date cannot be less than today");
                      hideMessage()
                      return;
                    }
                    if (
                      dob[0] <= d.getFullYear() &&
                      dob[1] <= d.getMonth() + 1 &&
                      dob[2] < d.getDate()
                    ) {
                      setMsg("Expiry Date cannot be less than today");
                      hideMessage()
                      return;
                    }
                  }

          if(code.trim()==""){
            setMsg("Enter Promo Code")
            hideMessage()
          }
          else if(type.trim() == ""){
               setMsg("select a Type")
               hideMessage()
          }
          else if(parseFloat(value) <= 0 ){
                    setMsg("Discount should be more than zero!!")
                    hideMessage()
          }
          else if(type === 'amount' && !hasMinPurchase){
            setHasMinPurchase(true)
            setMsg("Enter Min. Purchase Amount")
            hideMessage()    
      }
          else if(type == 'amount' && parseFloat(minAmount)<parseFloat(value)){
            setMsg("Discount cannot be more than minimum purchase amount")
            hideMessage() 
          }
          else if(hasMinPurchase){
                  if(minAmount<=0){
                    setMsg("Min. amount should be more than zero!!")
                    hideMessage()    
                  }
                  else{
                    let data = {
                              code: code,
                              type: type,
                              value: parseFloat(value),
                              hasMinPurchase: hasMinPurchase,
                              minAmount: hasMinPurchase?parseFloat(minAmount) : 0,
                              expiryDate: date
                    }
   

                    Axios.put(`/api/promo/${id}`, data, config)
                    .then((res)=>{
                          
                              
                        let data = tableData
                        data = data.filter((e)=>e._id != id)
                        data = [...data, res.data]
                        setTableData(data)
                        setModalVisibility(false)
                        setLoading1(false)
                        addPromoCancel()
                        setSuccessMsg("Updated")
                        setSuccess(true)
                        setTimeout(()=>{setSuccess(false); setSuccessMsg("")}, 3000)

                    })
                    .catch((err)=>{
                            
                              setMsg("Promo Code Exists!!")
                              hideMessage()
                    })
                    
                    
          }
          }
          else{
                    let data = {
                              code: code,
                              type: type,
                              value: parseFloat(value),
                              hasMinPurchase: hasMinPurchase,
                              minAmount: hasMinPurchase?parseFloat(minAmount) : 0,
                              expiryDate: date
                    }
   

                    Axios.put(`/api/promo/${id}`, data, config)
                    .then((res)=>{
                               
                        let data = tableData
                        data = data.filter((e)=>e._id != id)
                        data = [...data, res.data]
                        setTableData(data)
                        setModalVisibility(false)
                        setLoading1(false)
                        addPromoCancel()
                        setSuccessMsg("Updated")
                        setSuccess(true)
                        setTimeout(()=>{setSuccess(false); setSuccessMsg("")}, 3000)

                    })
                    .catch((err)=>{
                            
                              setMsg("Promo Code Exists!!")
                              hideMessage()
                    })  
          }

  }

  const handleSave = (e) => {

          e.preventDefault()
          setLoading1(true)

          const config = {
                    headers: {
                      Authorization: `Bearer ${userInfo.token}`,
                    },
                  }
              
                  if (date) {
                    let d = new Date();
                    let dob = date.split("-");
                    if (dob[0] < d.getFullYear()) {
                      setMsg("Expiry Date cannot be less than today");
                      hideMessage()
                      return;
                    }
                    if (dob[0] <= d.getFullYear() && dob[1] < parseInt(d.getMonth()) + 1) {
                      setMsg("Expiry Date cannot be less than today");
                      hideMessage()
                      return;
                    }
                    if (
                      dob[0] <= d.getFullYear() &&
                      dob[1] <= d.getMonth() + 1 &&
                      dob[2] < d.getDate()
                    ) {
                      setMsg("Expiry Date cannot be less than today");
                      hideMessage()
                      return;
                    }
                  }
          
          if(code.trim()==""){
                    setMsg("Enter Promo Code")
                    hideMessage()

          }else if(type.trim() == ""){
               setMsg("select a Type")
               hideMessage()
          }
          else if(parseFloat(value) <= 0 ){
                    setMsg("Discount should be more than zero!!")
                    hideMessage()
          }
          else if(type === 'amount' && !hasMinPurchase){
            setHasMinPurchase(true)
            setMsg("Enter Min. Purchase Amount")
            hideMessage()    
      }
          else if(type == 'amount' && parseFloat(minAmount)<parseFloat(value)){
            setMsg("Discount cannot be more than minimum purchase amount")
            hideMessage() 
          }
          else if(hasMinPurchase){
                  if(minAmount<=0){
                    setMsg("Min. amount should be more than zero!!")
                    hideMessage()    
                  }
                  else{
                    let data = {
                              userid: userInfo._id,
                              code: code,
                              type: type,
                              value: parseFloat(value),
                              hasMinPurchase: hasMinPurchase,
                              minAmount: hasMinPurchase?parseFloat(minAmount) : 0,
                              expiryDate: date
                    }
  

                    Axios.post(`/api/promo`, data, config)
                    .then((res)=>{
                            let data = tableData
                            data = [...tableData, res.data]
                            setTableData(data)
                            setLoading1(false)
                            setModalVisibility(false)
                            addPromoCancel()
                            setSuccessMsg("Added")
                            setSuccess(true)
                            setTimeout(()=>{setSuccess(false); setSuccessMsg("")}, 3000)

                    })
                    .catch((err)=>{
                            
                              setMsg("Promo Code Exists!!")
                              hideMessage()
                    })
                    
                    
          }
          }
          else{
                    let data = {
                              userid: userInfo._id,
                              code: code,
                              type: type,
                              value: parseFloat(value),
                              hasMinPurchase: hasMinPurchase,
                              minAmount: hasMinPurchase?parseFloat(minAmount) : 0,
                              expiryDate: date
                    }

                    Axios.post(`/api/promo`, data, config)
                    .then((res)=>{
                            let data = tableData
                            data = [...tableData, res.data]
                            setTableData(data)
                            setLoading1(false)
                            setModalVisibility(false)
                            addPromoCancel()
                            setSuccessMsg("Added")
                            setSuccess(true)
                            setTimeout(()=>{setSuccess(false); setSuccessMsg("")}, 3000)

                    })
                    .catch((err)=>{                          
                              setMsg("Promo Code Exists!!")
                              hideMessage()
                    })
                    
    
          }
      
          
        }

 const deletePromo = (id) => {

          setLoading1(true)
          const config = {
                    headers: {
                      Authorization: `Bearer ${userInfo.token}`,
                    },
                  }

          Axios.delete(`/api/promo/${id}`, config)
          .then((res)=>{
               let data = tableData
               data = data.filter((e)=>e._id != id)
               setLoading1(false)
               setTableData(data)
               setErrorMsg("Deleted!")
               setErr(true)
               setTimeout(()=>{setErr(false); setErrorMsg("")}, 3000)
          })
          .catch((err)=>{
                    setLoading1(false)
                    setErrorMsg("Cannot Delete")
                    setErr(true)
                    setTimeout(()=>{setErr(false); setErrorMsg("")}, 3000)
          })

 }

 const editPromo = (id) => {

          localStorage.setItem('promocode', id)
          for(let i =0; i<tableData.length; ++i){
                    if(tableData[i]._id == id){
                              console.log(tableData[i])
                              setCode(tableData[i].code)
                              setType(tableData[i].type)
                              setValue(tableData[i].value)
                              setHasMinPurchase(tableData[i].hasMinPurchase)
                              setMinAmount(tableData[i].minAmount)
                              setDate(tableData[i].expiryDate?tableData[i].expiryDate.split('T')[0]:null)
                              setModalVisibility(true)
                              
                    }
          }
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
          <h4 className="heading">Promo Codes</h4>
        </Col>
        <Col className='text-right'>
          <Button style={{marginRight: "1%"}} variant="secondary" className='my-3' onClick={()=>{
                                                                                               setIsUpdate(false)
                                                                                              setModalVisibility(true)}}>
            <i className='fas fa-plus'></i> Add a Promo Code
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
          <Modal show={modalVisibility} onHide={addPromoCancel}>
                  <Modal.Header closeButton>
                       <Modal.Title>{isUpdate?"Update Variant":"Add Promo Code"}</Modal.Title>
                  </Modal.Header>

                  <Modal.Body>
                  {msg && <Message variant='danger'>{msg}</Message>}
                  <Form style={{marginTop: "5%"}}>

          <Form.Group controlId='slug' >
          <Form.Label>Promo Code</Form.Label>
          <Form.Control
               type='name'
               placeholder={'Promo Code'}
               value={code}
               onChange={(e)=>{setCode(e.target.value.toLocaleUpperCase())}}
             ></Form.Control>
         </Form.Group>

         <Form.Group controlId='slug' >
          <Form.Label>Type</Form.Label>
           <div style={{display: 'flex'}}>
                     <div style={{width: '25%'}}>
                              <input type="radio"
                              name='type'
                              value={'percentage'} 
                              checked={type == 'percentage'? true: false}
                              onChange={e=>{setType(e.target.value)}} 
                              />
                              <small> Percentage</small>
                     </div>
                     <div style={{width: '25%'}}>
                              <input type="radio"
                              name='type'
                              value={'amount'}  
                              checked={type == 'amount'? true: false}
                              onChange={e=>{setType(e.target.value)}}
                              />
                              <small> Fixed Amount</small>
                     </div>
           </div>
         </Form.Group>

         <Form.Group controlId='slug' >
          <Form.Label>Discount</Form.Label>
          <Form.Control
               type='number'
               placeholder={'Fixed Amount / Percentage off'}
               value={value}
               onChange={(e)=>{setValue(e.target.value)}}
             ></Form.Control>
         </Form.Group>

         <Form.Group controlId='slug' >
          <Form.Label>Has minimum purchase amount?</Form.Label>
          <Form.Check type="checkbox" checked={hasMinPurchase}  onChange={(e)=>{ 
                    if(e.target.checked == false){
                              setMinAmount(0)
                    }
                    setHasMinPurchase(e.target.checked)}}/>
         </Form.Group>
          
          <div style={{display: hasMinPurchase? "initial" : "none"}}>
          <Form.Group controlId='slug' >
          <Form.Label>Minimum Purchase Amount</Form.Label>
          <Form.Control
               type='number'
               placeholder={'Minimum Purchase Amount'}
               value={minAmount}
               onChange={(e)=>{setMinAmount(e.target.value)}}
             ></Form.Control>
         </Form.Group>
          </div>

          <Form.Group controlId="duedate">
          <Form.Label>Expiry Date</Form.Label>
              <Form.Control
                type="date"
                name="duedate"
                placeholder="Expiry date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </Form.Group>
         
 
                  </Form>   
                  </Modal.Body>

                 <Modal.Footer>
                        <Button variant="secondary" onClick={addPromoCancel}>
                         Close
                        </Button>

                        <Button variant="primary" onClick={isUpdate?updatePromocode:handleSave}>
                           {isUpdate? "Update Promo Code":"Add Promo Code"}
                        </Button>
        </Modal.Footer>
      </Modal>
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
