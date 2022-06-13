import React, { useEffect, useState  } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Container, Row, Col,Toast , Breadcrumb} from 'react-bootstrap'
import Product from '../components/Product'
import Message from '../components/Message'
import Loader from '../components/Loader'
import Paginate from '../components/Paginate'
import ProductCarousel from '../components/ProductCarousel'
import ProductFilter from '../components/ProductFilter'
import Meta from '../components/Meta'
import { listProducts ,listCategoryProducts} from '../actions/productActions'
import Axios from 'axios'
import { Empty } from 'antd'

const CategoryScreen = ({ match }) => {

  useEffect(()=>{
    window.scrollTo(0, 0)
   
  },[match.params.id])

          let history = useHistory();

  const c = match.params.id
  const slug = match.params.name

  if(!c){
  history.push('/')
  }


  const pageNumber = match.params.pageNumber || 1


  const dispatch = useDispatch()

  const productList = useSelector((state) => state.productList)
  const { loading, error, products, page, pages } = productList

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  useEffect(() => {
    dispatch(listCategoryProducts(c, pageNumber))
  }, [dispatch, c, slug,pageNumber])

  const [filterType, setFilterType] = useState(()=>'latest')
  const [category, setCategory] = useState(()=>undefined)

  const [wishlist, setWishlist] = useState(()=>[])

  const [displayProduct, setDisplayProduct] = useState(()=>[])
  const [noti, setNoti] = useState(()=>'')

  useEffect(()=>{

    if(filterType == 'latest'){
      let data = []
      setDisplayProduct(products)
    }
    else if(filterType == 'featured'){
       let data = [];
      data = products.filter((e)=>(e.featured == true))
      setDisplayProduct(data)
    }
    else if(filterType == 'popular'){
      let data = [];
      data = products.filter((e)=>(e.featured == true))
      setDisplayProduct(data)
    }
    else if(filterType == 'special'){
      let data = [];
      data = products.filter((e)=>((((e.price-e.offerPrice)/e.price)*100)>=50 && e.offerPrice>0)) 
      setDisplayProduct(data)
    }
    
  },[productList,filterType])

  useEffect(()=>{
   
    let data = products;
    data = data.filter((e)=>(e.category == category || e.subcategory == category))
    setDisplayProduct(data)

  },[category])

  //Can be latest----featured----popular----spacialdeals

  const getWishlist =async () => {
    
    if(userInfo){
      setWishlist([])
    }
    
    

  }

  const goToHome = () => {
    history.push('/')
  }

  return (
    <>
    <Meta />
        {!c ? (
          <ProductCarousel />
        ) : (
          <Breadcrumb>
            <Breadcrumb.Item onClick={()=>{goToHome()}}>Home</Breadcrumb.Item>
            <Breadcrumb.Item>Category</Breadcrumb.Item>
            <Breadcrumb.Item>
            {
              slug.split('-').map((e)=>(
                 e+" "
              ))
            }
            </Breadcrumb.Item>
          </Breadcrumb>
    )}
  
    <section className="merch-product-listing">
        <Container>
          <div className="products-listing">
            <ProductFilter category={category} setCategory={setCategory} filterType={filterType} setFilterType={setFilterType}/>
            {/* <h1>Latest Products</h1> */}
            {loading ? (
              <Loader />
            ) : error ? (
              <Message variant='danger'>{error}</Message>
            ) : (
              <>
              {noti? <Message>{noti}</Message>: <></>}
              <div className="products products-grid mgs-products">
              <div className="mgs-productsWraper">
                <Row>
                  {
                    displayProduct.length !== 0?
                  displayProduct.filter((e)=>e.parentid == 'parent').map((product) => (
                    <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                      <Product setNoti={setNoti} wishlist={wishlist} setWishlist={setWishlist} userInfo={userInfo} product={product} />
                    </Col>
                  ))
                :
                <div style={{margin: 'auto'}}>
                <Empty
                    image="/assets/img/logo.png"
                    description={
                      <span style={{fontWeight: 'bold'}}>
                        No Product(s) to display
                      </span>
                    }
                  ></Empty>
                  </div>
                }
                </Row>
              </div>
                
              </div>
                
                <Paginate
                  pages={pages}
                  page={page}
                  keyword={slug ? slug : ''}
                />
              </>
            )}
          </div>
        </Container>
      </section>
    </>
  )
}

export default CategoryScreen
