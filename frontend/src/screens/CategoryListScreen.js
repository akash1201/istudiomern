import React, { useEffect,useState } from 'react'
import { Button, Row, Col,Modal, Form } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import Paginate from '../components/Paginate'
import {
listCategories,
deleteCategory,
createProduct,
} from '../actions/categoryActions'
import { CATEGORY_CREATE_RESET } from '../constants/categoryConstants'
import SideBar from "../components/Sidebar"
import axios from "axios"
import { Table, Space, Popconfirm} from 'antd';
import 'antd/dist/antd.css';
import {Alert} from 'react-bootstrap'

const CategoryListScreen = ({ history, match }) => {
  
  const pageNumber = match.params.pageNumber || 1


  const dispatch = useDispatch()

  const categoryList = useSelector((state) => state.categoryList)

  const { loading, categories,error , page, pages } = categoryList

  const [addSuccess, setAddSuccess] = useState(()=>false)
  const [addError, setAddError] = useState(()=>false)
  
  

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

  const [allcategories, setAllCategories] = useState(()=>[]);

  useEffect(()=>{

 window.scrollTo(0,0)
   let userInfo = JSON.parse(localStorage.getItem("userInfo"))

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }
    const { data } = axios.get(
      `/api/category/getall`,config
    ).then((res)=>{

      setTableData(res.data.data);
      setLoading1(false);
      getCategories(res.data.data);

    })
    .catch((err)=>{
      console.log(err)
    })
    
  
  }, [])

  const getCategories = (arr) => {

    for(let i = 0; i<arr.length; ++i){

      setAllCategories((old)=>[...old, arr[i]]);
      getCategories(arr[i].children);

    }
    return; 
  }


  const deleteHandler = async (id) => {
    
    // if (window.confirm('Are you sure')) {
    //   dispatch(deleteCategory(id))
    // }
    setLoading1(true)
    let config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`
      }
    }
  try{
    let response = await axios.delete(`/api/category/delete/${id}`,config)

    setTableData(response.data.data)
    setAllCategories([])
    getCategories(response.data.data)
    setLoading1(false)
    dispatch(listCategories())
    setMsg('Deleted!!')
    setAddError(true)
    setTimeout(()=>{setMsg(''); setAddError(false)}, 3000)
  }catch(err){
    setLoading1(false)
    setMsg('Cannot Delete!')
    setAddError(true)
    setTimeout(()=>{setMsg(''); setAddError(false)}, 3000)
  }
    // window.location.reload();
  }

  
  const [modalVisibility, setModalVisibility] = useState(()=>false)
  const [categoryName, setCategoryName] = useState(()=>"")
  const [imageName, setImageName] = useState(()=>"Choose a file")
  const [image, setImage] = useState(null)

  const [slug, setSlug] = useState(()=>"");

  //for sub category
   
  const [categoryId, setcategoryId] = useState(()=>"")
  const [msg, setMsg] = useState(()=>"")

  const [isUpdate, setIsUpdate] = useState(()=>false)
  const [uImage, setUImage] = useState(()=>"")
  const [id, setId] = useState(()=>"")

  const [loading1, setLoading1] = useState(()=>true);
  
  const [tableData, setTableData] = useState(()=>[]);

//Table Data
  const columns =[
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: '50%',
      filterMultiple: false,
      onFilter: (value, record) => record.name.indexOf(value) === 0,
      sorter: (a, b) => a.name.length - b.name.length,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      width: "16%",
      render: (text, record) => (
        <Space size="middle">
         <img src={record.image} style={{width: "50%"}}/>
         </Space>
      ),
    },
    {
      title: 'Action',
      dataIndex: 'action',
      width: '16%',
      fixed: 'right',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
           <Popconfirm
            title="Are You sure?"
            onConfirm={()=>{deleteHandler(record._id)}}
            >
          <Button variant="secondary" style={{color: "red"}}><i className="fas fa-trash-alt"></i></Button>
          </Popconfirm>
          <Button variant="secondary" style={{color: "#2aa8f2"}} onClick={()=>{editCategory(record._id)}}><i className="fas fa-edit"></i></Button>
        </Space>
      ),
    },
  ];

  const editCategory = (id) => {

    setId(id);
    console.log(id)

    for(let i =0; i<allcategories.length; ++i){

      if(allcategories[i]._id == id){
              
        if(allcategories[i].parentid != 'parent'){
             setcategoryId(allcategories[i].parentid)
        }
        setCategoryName(allcategories[i].name)
        setSlug(allcategories[i].slug)
        setUImage(allcategories[i].image);
        
        setIsUpdate(true);
        setModalVisibility(true);

        break;

      }

    }

  }

  const addCategory = async () => {

    setLoading1(true)
    
    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
      let img = '/assets/img/logo.png';
      if(image){
        const formData = new FormData()
        formData.append('image', image)
        
        const { data } = await axios.post('/api/upload', formData, config)
        img = data
      }
      
      
      let catData;
      let s = slug;

      s = s.trim().replaceAll(" ", "-");

      if(categoryId.trim() == ""){
        catData = {
          image: img,
          active: 1,
          name: categoryName,
          slug: s,
          parentid: "parent"
         
}
      }else{
        catData = {
          image: img,
          active: 1,
          name: categoryName,
          slug: s,
          parentid: categoryId
}
      }

      
      axios.post('/api/category/add', catData).then((res)=>{
        
        setMsg("");
        setCategoryName("");
        setImageName("");
        setImage(null);
        setSlug("");
        setcategoryId("");
        setCategoryName("");
        setTableData(res.data.data)
        setAllCategories([])
        getCategories(res.data.data)
        dispatch(listCategories())
        setAddSuccess(true)
        setMsg('Category Added')
        setTimeout(()=>{setMsg(''); setAddSuccess(false)}, 3000)
        setLoading1(false)

      }).catch((err)=>{
        setAddError(true)
        setMsg("Cannot add cateory")
        setTimeout(()=>{setAddError(false); setMsg('')}, 3000)
        setLoading1(false)
      })
     
    } catch (error) {
      console.error(error)
      
    }

    setModalVisibility(false);
  }

  const addCategorySave = (e) => {

    e.preventDefault();
    
    let data = null;

    
      if(categoryName.trim() == ""){
        setMsg("Enter Category name")
      }else if (image && ((image.name.split('.')[1] != 'jpeg') && (image.name.split('.')[1] != 'png') && (image.name.split('.')[1] != 'jpg')) ){
         setMsg("Upload a valid image with extenstion JPG, JPEG or PNG")
      }
      else{
        addCategory();
      }
      

    
  }
  const addCategoryCancel = () => {

    setMsg("");
    setImageName("");
    setCategoryName("");
    setImage(null);
    setSlug("")
    setcategoryId("");
    setCategoryName("");
    setModalVisibility(false)
    setIsUpdate(false);
  }

  const updateCategory = async (e) => {

    e.preventDefault();
    let img;

    setLoading1(true)

    if(categoryName.trim() == ""){
      setMsg("Enter Category name")
    }else{
      
      if(image != null){

        try{
          const formData = new FormData()
          formData.append('image', image)

          const config = {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }

          const { data } = await axios.post('/api/upload', formData, config)

          img = data;
          setUImage(data);

        }catch(err){
            console.log(err);
        }
      }else{
        img = uImage;
      }

     let catData = {
        id: id, 
      parentid: categoryId.trim() == ""? "parent" : categoryId,
      name: categoryName,
      slug: slug.trim().replaceAll(" ", "-"),
      image: img,
      active: 1
     }
     const config = {
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${userInfo.token}`
      }
     }

     axios.put('/api/category/update',catData, config).then((res)=>{
        
      setMsg("");
      setCategoryName("");
      setImageName("");
      setImage(null);
      setSlug("");
      setcategoryId("");
      setCategoryName("");
      setId("");
      setIsUpdate(false);
      setUImage("");
      setModalVisibility(false);
      setTableData(res.data.data)
      setAllCategories([])
      getCategories(res.data.data)
      setLoading1(false)
      setMsg('Updated!')
      setAddSuccess(true)
      setTimeout(()=>{setMsg(''); setAddSuccess(false)}, 3000)
      dispatch(listCategories())
      // window.location.reload();

    }).catch((err)=>{
      setMsg('Cannot Update!!')
      setAddError(true)
      setTimeout(()=>{setMsg(''); setAddError(false)}, 3000)
      setLoading1(false)
    })
      

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
          <h4 className="heading">Categories</h4>
        </Col>
        <Col className='text-right'>
          <Button variant="secondary" className='my-3' onClick={()=>{
            setModalVisibility(true)}}>
            <i className='fas fa-plus'></i> Add Category
          </Button>

        </Col>
      </Row>
      <Row>
           <Col>
           {addSuccess && <Message>{msg}</Message>}
           {addError && <Message variant='danger'>{msg}</Message>}
           </Col>
        </Row>
      {loadingDelete && <Loader />}
      {errorDelete && <Message variant='danger'>{errorDelete}</Message>}
      {loadingCreate && <Loader />}
      {errorCreate && <Message variant='danger'>{errorCreate}</Message>}
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
                       <Modal.Title>{isUpdate?"Update Category":"Add Category"}</Modal.Title>
                  </Modal.Header>

                  <Modal.Body>
                    {msg&&<Alert variant='danger'>{msg}</Alert>}
                  <Form style={{marginTop: "5%"}}>
                    <div style={{display: loading1?'initial':'none'}}>
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

export default CategoryListScreen
