import React, { useEffect, useState  } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Container, Row, Col } from 'react-bootstrap'
import Product from '../components/Product'
import Message from '../components/Message'
import Loader from '../components/Loader'
import Paginate from '../components/Paginate'
import ProductCarousel from '../components/ProductCarousel'
import ProductFilter from '../components/ProductFilter'
import Meta from '../components/Meta'
import { listProducts } from '../actions/productActions'
import Axios from 'axios'
import { Empty } from 'antd'

const istudioMerch = ({ match }) => {
  const keyword = match.params.keyword?match.params.keyword : ""


  const pageNumber = match.params.pageNumber || 1


  const dispatch = useDispatch()

  const [pages, setPages] = useState(()=>0)
  const [page, setPage] = useState(()=>pageNumber)

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  useEffect(() => {
    dispatch(listProducts(keyword, pageNumber))
  }, [dispatch, keyword, pageNumber])


  const [filterType, setFilterType] = useState(()=>'latest')
  const [category, setCategory] = useState(()=>undefined)
  const [loading, setLoading] = useState(()=>true)

  const [wishlist, setWishlist] = useState(()=>[])

  const [displayProduct, setDisplayProduct] = useState(()=>[])
  const [noti, setNoti] = useState(()=>'')

//   useEffect(()=>{
   
// //     let data = products;
// //     data = data.filter((e)=>(e.category == category || e.subcategory == category))
// //     setDisplayProduct(data)

//   },[category])

  useEffect(()=>{
    getWishlist()

  },[pageNumber])

  //Can be latest----featured----popular----spacialdeals

  const getWishlist =async () => {
    setLoading(true)
    window.scrollTo(0,0)
    if(userInfo){  
      let config = {
        headers : {
          'Authorization' : `Bearer ${userInfo.token}`
        }
      }   
      setWishlist([])
      let res = await Axios.get(`/api/printful/getProducts/${pageNumber}`, config)
      console.log(res.data)
       setDisplayProduct(res.data.products)
       let total = res.data.paging
       let p = parseInt((total/10)+1)
       setPages(p)
    } else{
      let response = await Axios.get(`/api/printful/getProducts/${pageNumber}`)
    setDisplayProduct(response.data.products)
    let total = response.data.paging
    let p = parseInt((total/10)+1)
    setPages(p)
    }
    
    setLoading(false)
  }

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
            <ProductFilter isDanzMerch = {true} category={category} setCategory={setCategory} filterType={filterType} setFilterType={setFilterType}/>
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
                  displayProduct.length != 0?
                  displayProduct.map((product,i) => (
                    <Col key={i} sm={12} md={6} lg={4} xl={3}>
                      <Product isistudioMerch={true} setNoti={setNoti} wishlist={wishlist} setWishlist={setWishlist} userInfo={userInfo} product={product} />
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
                  keyword={keyword ? keyword : ''}
                  istudio={true}
                />
              </>
            )}
          </div>
        </Container>
      </section>
    </>
  )
}

export default istudioMerch
