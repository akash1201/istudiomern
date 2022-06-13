import React, { useEffect, useState  } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Container, Row, Col,Toast } from 'react-bootstrap'
import Product from '../components/Product'
import Message from '../components/Message'
import Loader from '../components/Loader'
import Paginate from '../components/Paginate'
import ProductCarousel from '../components/ProductCarousel'
import ProductFilter from '../components/ProductFilter'
import Meta from '../components/Meta'
import { listProducts } from '../actions/productActions'
import Axios from 'axios'
import { Empty } from 'antd';

const VendorProductList = ({ match }) => {
  const keyword = match.params.keyword?match.params.keyword : ""
  const vendorId = match.params.vendorId
  const name = match.params.name


  const pageNumber = match.params.pageNumber || 1

  const dispatch = useDispatch()

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  useEffect(() => {
    dispatch(listProducts(keyword, pageNumber))
  }, [dispatch, keyword, pageNumber])

  const [filterType, setFilterType] = useState(()=>'latest')
  const [category, setCategory] = useState(()=>undefined)

  const [wishlist, setWishlist] = useState(()=>[])

  const [loading, setLoading] = useState(()=>true)
  const [displayProduct, setDisplayProduct] = useState(()=>[])
  const [products, setProducts] = useState(()=>[])
  const [noti, setNoti] = useState(()=>'')
  const [page, setPage] = useState(()=>0)
  const [pages, setPages] = useState(()=>0)

  useEffect(()=>{
         
        if(vendorId){
          Axios.get(`/api/products/vendor/all/${vendorId}/?keyword=${keyword}&pageNumber=${pageNumber}`)
          .then((res)=>{
                    setProducts(res.data.products)
                    setDisplayProduct(res.data.products)
                    setPage(res.data.page)
                    setPages(res.data.pages)
                    setLoading(false)
          })
          .catch((err)=>{
                    setLoading(false)
          })
        }
          
  }, [vendorId])

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
    
  },[filterType])

  useEffect(()=>{
   
    let data = products;
    data = data.filter((e)=>(e.category == category || e.subcategory == category))
    setDisplayProduct(data)

  },[category])

 

  //Can be latest----featured----popular----spacialdeals

  return (
    <>
    <Meta />
        {!keyword ? (
          <ProductCarousel />
        ) : (
          <Link to='/' className='btn btn-light'>
            Go Back
          </Link>
    )}
  
    <section className="merch-product-listing">
        <Container>
          <div className="products-listing">
            <ProductFilter store={true} vendorId={vendorId} category={category} setCategory={setCategory} filterType={filterType} setFilterType={setFilterType}/>
            {/* <h1>Latest Products</h1> */}
            {loading ? (
              <Loader />
            ) : (
              <>
              {noti? <Message>{noti}</Message>: <></>}
              <div className="products products-grid mgs-products">
              <div className="mgs-productsWraper">
                <Row>
                  {
                    (displayProduct && displayProduct.length != 0)?
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
                  isVendor={true}
                  pages={pages}
                  page={page}
                  keyword={keyword ? keyword : ''}
                />
              </>
            )}
          </div>
        </Container>
      </section>
    </>
  )
}

export default VendorProductList
