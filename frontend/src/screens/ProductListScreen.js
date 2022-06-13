import React, { useEffect , useState} from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import Paginate from '../components/Paginate'
import {
  listProducts,
  deleteProduct,
  createProduct,
} from '../actions/productActions'
import { PRODUCT_CREATE_RESET } from '../constants/productConstants'

import SideBar from "../components/Sidebar" 
import Axios from 'axios'

const ProductListScreen = ({ history, match }) => {
  const pageNumber = match.params.pageNumber || 1

  const dispatch = useDispatch()

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

  const [products, setProducts] = useState(()=>[])

  useEffect(() => {
    dispatch({ type: PRODUCT_CREATE_RESET })

    // if (!userInfo || !userInfo.userType == 'admin') {
    //   history.push('/login')
    // }

    if (successCreate) {
      history.push(`/admin/product/${createdProduct._id}/edit`)
    } else {
      dispatch(listProducts('', pageNumber))
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
    Axios.get(`/api/products/vendor/all/${userInfo._id}`)
    .then((res)=>{    
      setProducts(res.data.products)
    })
    .catch((err)=>{
      console.log(err)
    })
  },[])

  const deleteHandler = (id) => {
    if (window.confirm('Are you sure')) {
      dispatch(deleteProduct(id))
    }

    let data = products.filter((e)=>e._id != id)
    setProducts(data)
  }

  const createProductHandler = () => {
    localStorage.setItem("isUpdate", "false")
    
    // dispatch(createProduct())

    history.push('/addProduct')
  }
  const editProducthandler = (id) => {
    
    localStorage.setItem('id', id)
    history.push('/editProduct')
    // history.push(`/admin/product/${id}/edit`)

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
          <h4 className="heading">Product Management</h4>
        </Col>
        <Col className='text-right'>
           <Button variant="secondary" className='my-3' onClick={createProductHandler}>
            <i className='fas fa-plus'></i> Create Product
          </Button>

        </Col>
      </Row>
       {loadingDelete && <Loader />}
      {errorDelete && <Message variant='danger'>{errorDelete}</Message>}
      {loadingCreate && <Loader />}
      {errorCreate && <Message variant='danger'>{errorCreate}</Message>}
      { (
        <>
          <Table striped bordered hover responsive className='table-sm'>
            <thead>
              <tr>
                <th></th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>Special Price</th>
                <th>BRAND</th>
                <th>Quantity</th>
                <th>Active</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.filter((e)=>e.parentid=='parent').map((product) => (
                <tr key={product._id}>
                  <td style={{width: "10%"}}><img src={product.thumbnailImage} style={{width: "100%"}}/></td>
                  <td style={{width: "10%"}}>{product.name}</td>
                  <td style={{width: "10%"}}>${product.price}</td>
                  <td style={{width: "10%"}}>${product.offerPrice?product.offerPrice:0}</td>
                  <td style={{width: "10%"}}>{product.brand}</td>
                  <td style={{width: "10%"}}>{product.qty}</td>
                  <td style={{width: "10%"}}>{product.active? <span style={{display: 'flex', justifyContent: 'center', marginTop: '25%', fontSize: '200%'}}><i style={{color: 'green'}} className="fas fa-check"></i></span>:<span style={{display: 'flex', justifyContent: 'center', marginTop: '25%', fontSize: '200%'}}><i style={{color: 'red'}} className="fas fa-times"></i></span>}</td>
                  <td style={{width: "10%"}}>  
                    <Button variant='light' className='btn-sm' onClick = {()=>{ 
                      localStorage.setItem('isUpdate', 'true')
                      editProducthandler(product._id)}}>
                        <i className='fas fa-edit'></i>
                      </Button>
                    <Button
                      variant='danger'
                      className='btn-sm'
                      onClick={() => deleteHandler(product._id)}
                    >
                      <i className='fas fa-trash'></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          {/* <Paginate pages={pages} page={page} url='/admin/productlist'/> */}
        </>
      )}
      </div>
       </div>
    </div>
  </div>
</section>
   
      {/* <Row className='align-items-center'>
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className='text-right'>
          <Button className='my-3' onClick={createProductHandler}>
            <i className='fas fa-plus'></i> Create Product
          </Button>
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
          <Table striped bordered hover responsive className='table-sm'>
            <thead>
              <tr>
                <th></th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td style={{width: "20%"}}><img src={product.image} style={{width: "100%"}}/></td>
                  <td style={{width: "40%"}}>{product.name}</td>
                  <td style={{width: "10%"}}>${product.price}</td>
                  <td style={{width: "10%"}}>{product.category}</td>
                  <td style={{width: "10%"}}>{product.brand}</td>
                  <td style={{width: "10%"}}>  
                    <Button variant='light' className='btn-sm' onClick = {()=>{editProducthandler(product._id)}}>
                        <i className='fas fa-edit'></i>
                      </Button>
                    <Button
                      variant='danger'
                      className='btn-sm'
                      onClick={() => deleteHandler(product._id)}
                    >
                      <i className='fas fa-trash'></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Paginate pages={pages} page={page} isAdmin={true} />
        </>
      )} */}
    </>
  )
}

export default ProductListScreen
