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

import Slider from "react-slick";

const HomeScreen = ({ match }) => {
  const keyword = match.params.keyword?match.params.keyword : ""


  const pageNumber = match.params.pageNumber || 1


  const dispatch = useDispatch()

  const productList = useSelector((state) => state.productList)
  const { loading, error, products, page, pages } = productList

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  useEffect(() => {
    dispatch(listProducts(keyword, pageNumber))
  }, [dispatch, keyword, pageNumber])

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

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    speed: 500,
    autoplaySpeed: 5000,
  };

  var home_logo_slider = {
    dots: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1199,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 1,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      }
    ]
  };

  var home_categories_slider = {
    dots: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    speed: 500,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1199,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 1,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      }
    ]
  };

  var home_mostView_slider = {
    dots: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    speed: 500,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1199,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  useEffect(()=>{
    Axios.get(`/api/category/getall`)
    .then((res)=>{
       console.log(res.data.data);
       setCategories(res.data.data);
    })
    .catch(err=>{
      console.log(err);
    })
  }, [])
  
  const [categories, setCategories] = useState(()=>[]);

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
  
    <section className='home_banner_wraper'>
        <div className='home-slider slider-main'>
          <Slider {...settings}>
            <div className='slide'>
                <div  className="full-thumbnail">
                    <img src="img/banner-img-1.jpg" />
                </div>
                <div  className="slide-caption">
                    <div  className="slide-caption-wraper">
                        <div  className="slide-caption-content">
                            <p>Best Deals Online</p>
                            <h3>poco M3 <br />  smartphone</h3>
                            <p>Starting at <strong>$79</strong></p>
                            <div className='banner-btn'>
                              <a href='#' className='zoominleft'>Buy It Now</a>
                            </div>
                        </div>
                    </div>            
                </div>
            </div>
            <div className='slide'>
                <div  className="full-thumbnail">
                    <img src="img/banner-img-4.jpg" />
                </div>
                <div  className="slide-caption">
                    <div  className="slide-caption-wraper">
                        <div  className="slide-caption-content">
                            <p>Best Deals Online</p>
                            <h3>SamSung M12<br />  smartphone</h3>
                            <p>Starting at <strong>$79</strong></p>
                            <div className='banner-btn'>
                              <a href='#' className='zoominleft'>Buy It Now</a>
                            </div>
                        </div>
                    </div>            
                </div>
            </div>
            <div className='slide clr-black'>
                <div  className="full-thumbnail">
                    <img src="img/banner-img-2.jpg" />
                </div>
                <div  className="slide-caption">
                    <div  className="slide-caption-wraper">
                        <div  className="slide-caption-content">
                            <p>Weekend Promotions</p>
                            <h3>Combo oculus <br />  Samsung Gear VR</h3>
                            <p>only price <strong>$749</strong></p>
                            <div className='banner-btn'>
                              <a href='#' className='zoominleft'>Buy It Now</a>
                            </div>
                        </div>
                    </div>            
                </div>
            </div>
            <div className='slide clr-black'>
                <div  className="full-thumbnail">
                    <img src="img/banner-img-3.jpg" />
                </div>
                <div  className="slide-caption">
                    <div  className="slide-caption-wraper">
                        <div  className="slide-caption-content">
                            <p>Weekend Promotions</p>
                            <h3>Beat Solo Gold <br />  Headphone Wireless</h3>
                            <p>only price <strong>$199</strong></p>
                            <div className='banner-btn'>
                              <a href='#' className='zoominleft'>Buy It Now</a>
                            </div>
                        </div>
                    </div>            
                </div>
            </div>
          </Slider>
        </div>
    </section>

    <section className='hot-categories'>
      <div className='container'>
        <div className='row'>
          <div className='col-md-12'>
            <div className="title-home">Choose Categories</div>
            <p class="block-description">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor <br /> incididunt ut labore et dolore magna aliqua.</p>
          </div>
        </div>
      { categories.length != 0 && 
      <Slider {...home_categories_slider}>   

      {
        categories.map((item)=>(
          <div>
          <div className='cat-inner'>
            <div className='image-cat'>
              <a href='#'>
                <img src={item.image} alt="Category Image" />
              </a>
            </div>
            <div className='info-cat'>
              <h2>
                <a href='#'>{item.name}</a>
              </h2>
            </div>
          </div>
        </div>
        ))
      }       

          {/* <div>
            <div className='cat-inner'>
              <div className='image-cat'>
                <a href='#'>
                  <img src="img/mobile_4_2_1.jpg" alt="Category Image" />
                </a>
              </div>
              <div className='info-cat'>
                <h2>
                  <a href='#'>Smart Phone</a>
                </h2>
              </div>
            </div>
          </div>
          <div>
            <div className='cat-inner'>
              <div className='image-cat'>
                <a href='#'>
                  <img src="img/camera_2_1.jpg" alt="Category Image" />
                </a>
              </div>
              <div className='info-cat'>
                <h2>
                  <a href='#'>Cameras & Photos</a>
                </h2>
              </div>
            </div>
          </div>
          <div>
            <div className='cat-inner'>
              <div className='image-cat'>
                <a href='#'>
                  <img src="img/2_1.jpg" alt="Category Image" />
                </a>
              </div>
              <div className='info-cat'>
                <h2>
                  <a href='#'>Gaming</a>
                </h2>
              </div>
            </div>
          </div>
          <div>
            <div className='cat-inner'>
              <div className='image-cat'>
                <a href='#'>
                  <img src="img/computer_1_1.jpg" alt="Category Image" />
                </a>
              </div>
              <div className='info-cat'>
                <h2>
                  <a href='#'>Laptops & Computers</a>
                </h2>
              </div>
            </div>
          </div>
          <div>
            <div className='cat-inner'>
              <div className='image-cat'>
                <a href='#'>
                  <img src="img/mobile_4_2_1.jpg" alt="Category Image" />
                </a>
              </div>
              <div className='info-cat'>
                <h2>
                  <a href='#'>Smart Phone</a>
                </h2>
              </div>
            </div>
          </div>
          <div>
            <div className='cat-inner'>
              <div className='image-cat'>
                <a href='#'>
                  <img src="img/camera_2_1.jpg" alt="Category Image" />
                </a>
              </div>
              <div className='info-cat'>
                <h2>
                  <a href='#'>Cameras & Photos</a>
                </h2>
              </div>
            </div>
          </div>
          <div>
            <div className='cat-inner'>
              <div className='image-cat'>
                <a href='#'>
                  <img src="img/2_1.jpg" alt="Category Image" />
                </a>
              </div>
              <div className='info-cat'>
                <h2>
                  <a href='#'>Gaming</a>
                </h2>
              </div>
            </div>
          </div>
       */}
        </Slider>}
      </div>
    </section>

    <section className='grid-view-products py40'>
      <div className='container'>
        <div className='row'>
          <div className='col-md-12'>
            <div className='home-product-heading'>
              <h2>Top Best Selling <span class="sup-title">Product</span></h2>
              <ul>
                <li><a href='#' className="active">Latest Products</a></li>
                <li><a href='#'>Recently Viewed</a></li>
                <li><a href='#'>Top Selling</a></li>
              </ul>
            </div>
          </div>
        </div> 
        <div className='row'>
          <div className='col-md-3'>
            <div className="product-card">
              <div className="product-card-top">
                <a href="#" className="product-image">
                    <img src="img/samsung-galaxy-s21-2021-bundle.jpg" alt="product image" />
                </a>
                <div className="product-card-actions">
                  <button title="Wishlist" className="btn btn-wishlist">
                    <i className="la-heart lar"></i>
                  </button>
                  <button title="Compare" className="btn btn-compare">
                    <i className="las la-random"></i>
                  </button>
                </div>
                <ul className="list-inline product-badge">
                  <li className="badge badge-primary">New</li>
                  <li className="badge badge-success">-11.5%</li>
                </ul>
              </div>
              <div className="product-card-middle">
                <div className="product-rating">
                  <div className="back-stars">
                    <i className="las la-star"></i> <i className="las la-star"></i>
                    <i className="las la-star"></i> <i className="las la-star"></i>
                    <i className="las la-star"></i>
                    <div className="front-stars" style={{width: 40}}>
                      <i className="las la-star"></i> <i className="las la-star"></i>
                      <i className="las la-star"></i> <i className="las la-star"></i>
                      <i className="las la-star"></i>
                    </div>
                  </div>
                  <span className="rating-count">(0)</span>
                </div>
                <a href="#" className="product-name" ><h6>Fanmis Men's Luxury Analog Quartz Gold Wrist Watches</h6></a>
                <div className="product-price product-price-clone">
                  $15.92 <span className="previous-price">$17.99</span>
                </div>
              </div>
              <div className="product-card-bottom">
                <div className="product-price">
                  $15.92 <span className="previous-price">$17.99</span>
                </div>
                <button className="btn btn-primary btn-add-to-cart">
                  <i className="las la-cart-arrow-down"></i>
                  ADD TO CART
                </button>
              </div>
            </div>
          </div>
          <div className='col-md-3'>
            <div className="product-card">
              <div className="product-card-top">
                <a href="#" className="product-image">
                    <img src="img/samsung-galaxy-s21-2021-bundle.jpg" alt="product image" />
                </a>
                <div className="product-card-actions">
                  <button title="Wishlist" className="btn btn-wishlist">
                    <i className="la-heart lar"></i>
                  </button>
                  <button title="Compare" className="btn btn-compare">
                    <i className="las la-random"></i>
                  </button>
                </div>
                <ul className="list-inline product-badge">
                  <li className="badge badge-primary">New</li>
                  <li className="badge badge-success">-11.5%</li>
                </ul>
              </div>
              <div className="product-card-middle">
                <div className="product-rating">
                  <div className="back-stars">
                    <i className="las la-star"></i> <i className="las la-star"></i>
                    <i className="las la-star"></i> <i className="las la-star"></i>
                    <i className="las la-star"></i>
                    <div className="front-stars" style={{width: 40}}>
                      <i className="las la-star"></i> <i className="las la-star"></i>
                      <i className="las la-star"></i> <i className="las la-star"></i>
                      <i className="las la-star"></i>
                    </div>
                  </div>
                  <span className="rating-count">(0)</span>
                </div>
                <a href="#" className="product-name" ><h6>Fanmis Men's Luxury Analog Quartz Gold Wrist Watches</h6></a>
                <div className="product-price product-price-clone">
                  $15.92 <span className="previous-price">$17.99</span>
                </div>
              </div>
              <div className="product-card-bottom">
                <div className="product-price">
                  $15.92 <span className="previous-price">$17.99</span>
                </div>
                <button className="btn btn-primary btn-add-to-cart">
                  <i className="las la-cart-arrow-down"></i>
                  ADD TO CART
                </button>
              </div>
            </div>
          </div>
          <div className='col-md-3'>
            <div className="product-card">
              <div className="product-card-top">
                <a href="#" className="product-image">
                    <img src="img/samsung-galaxy-s21-2021-bundle.jpg" alt="product image" />
                </a>
                <div className="product-card-actions">
                  <button title="Wishlist" className="btn btn-wishlist">
                    <i className="la-heart lar"></i>
                  </button>
                  <button title="Compare" className="btn btn-compare">
                    <i className="las la-random"></i>
                  </button>
                </div>
                <ul className="list-inline product-badge">
                  <li className="badge badge-primary">New</li>
                  <li className="badge badge-success">-11.5%</li>
                </ul>
              </div>
              <div className="product-card-middle">
                <div className="product-rating">
                  <div className="back-stars">
                    <i className="las la-star"></i> <i className="las la-star"></i>
                    <i className="las la-star"></i> <i className="las la-star"></i>
                    <i className="las la-star"></i>
                    <div className="front-stars" style={{width: 40}}>
                      <i className="las la-star"></i> <i className="las la-star"></i>
                      <i className="las la-star"></i> <i className="las la-star"></i>
                      <i className="las la-star"></i>
                    </div>
                  </div>
                  <span className="rating-count">(0)</span>
                </div>
                <a href="#" className="product-name" ><h6>Fanmis Men's Luxury Analog Quartz Gold Wrist Watches</h6></a>
                <div className="product-price product-price-clone">
                  $15.92 <span className="previous-price">$17.99</span>
                </div>
              </div>
              <div className="product-card-bottom">
                <div className="product-price">
                  $15.92 <span className="previous-price">$17.99</span>
                </div>
                <button className="btn btn-primary btn-add-to-cart">
                  <i className="las la-cart-arrow-down"></i>
                  ADD TO CART
                </button>
              </div>
            </div>
          </div>
          <div className='col-md-3'>
            <div className="product-card">
              <div className="product-card-top">
                <a href="#" className="product-image">
                    <img src="img/samsung-galaxy-s21-2021-bundle.jpg" alt="product image" />
                </a>
                <div className="product-card-actions">
                  <button title="Wishlist" className="btn btn-wishlist">
                    <i className="la-heart lar"></i>
                  </button>
                  <button title="Compare" className="btn btn-compare">
                    <i className="las la-random"></i>
                  </button>
                </div>
                <ul className="list-inline product-badge">
                  <li className="badge badge-primary">New</li>
                  <li className="badge badge-success">-11.5%</li>
                </ul>
              </div>
              <div className="product-card-middle">
                <div className="product-rating">
                  <div className="back-stars">
                    <i className="las la-star"></i> <i className="las la-star"></i>
                    <i className="las la-star"></i> <i className="las la-star"></i>
                    <i className="las la-star"></i>
                    <div className="front-stars" style={{width: 40}}>
                      <i className="las la-star"></i> <i className="las la-star"></i>
                      <i className="las la-star"></i> <i className="las la-star"></i>
                      <i className="las la-star"></i>
                    </div>
                  </div>
                  <span className="rating-count">(0)</span>
                </div>
                <a href="#" className="product-name" ><h6>Fanmis Men's Luxury Analog Quartz Gold Wrist Watches</h6></a>
                <div className="product-price product-price-clone">
                  $15.92 <span className="previous-price">$17.99</span>
                </div>
              </div>
              <div className="product-card-bottom">
                <div className="product-price">
                  $15.92 <span className="previous-price">$17.99</span>
                </div>
                <button className="btn btn-primary btn-add-to-cart">
                  <i className="las la-cart-arrow-down"></i>
                  ADD TO CART
                </button>
              </div>
            </div>
          </div>
        </div>       
      </div>

    </section>

    <section className='pb40'>
      <div className='container'>
        <div className='row'>
          <div className='col-md-4'>
            <div className='banner-hover txt-black'>
              <a href='#'>
                <div className='banner-hoverWraper' style={{backgroundImage: `url('img/Img2.jpg')`}}>
                  <div className='banner-hoverOverlay'>
                    <div className='banner-hoverContent'>
                      <div>
                        <h3>Nikon RX10</h3>
                        <h4>32GB Unlocked</h4>
                        <p>4GB RAM | 64GB ROM | 20MP</p>
                        <p class="text-price mb-0">
                            <span>
                                <span style={{fontSize: '18px'}}>now at</span>
                                <span  style={{fontSize: '42px', lineHeight: '42px'}}>
                                    <strong><em>$</em> 749</strong>
                                </span>
                            </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            </div>
          </div>
          <div className='col-md-4'>
            <div className='banner-hover txt-white'>
              <a href='#'>
                <div className='banner-hoverWraper' style={{backgroundImage: `url('img/Img3.jpg')`}}>
                  <div className='banner-hoverOverlay'>
                    <div className='banner-hoverContent'>
                      <div>
                        <h3>Nikon RX10</h3>
                        <h4>32GB Unlocked</h4>
                        <p>4GB RAM | 64GB ROM | 20MP</p>
                        <p class="text-price mb-0">
                            <span>
                                <span style={{fontSize: '18px'}}>now at</span>
                                <span  style={{fontSize: '42px', lineHeight: '42px'}}>
                                    <strong><em>$</em> 749</strong>
                                </span>
                            </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            </div>
          </div>
          <div className='col-md-4'>
            <div className='banner-hover txt-black'>
              <a href='#'>
                <div className='banner-hoverWraper' style={{backgroundImage: `url('img/Img1.jpg')`}}>
                  <div className='banner-hoverOverlay'>
                    <div className='banner-hoverContent'>
                      <div>
                        <h3>Nikon RX10</h3>
                        <h4>32GB Unlocked</h4>
                        <p>4GB RAM | 64GB ROM | 20MP</p>
                        <p class="text-price mb-0">
                            <span>
                                <span style={{fontSize: '18px'}}>now at</span>
                                <span  style={{fontSize: '42px', lineHeight: '42px'}}>
                                    <strong><em>$</em> 749</strong>
                                </span>
                            </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>


    <section className="merch-product-listing home-productListing">
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
                  pages={pages}
                  page={page}
                  keyword={keyword ? keyword : ''}
                />
              </>
            )}
          </div>
        </Container>
    </section>

      
    <section className="home_brand_list">
      <div className="container">
          <div className="row brand_heading">
              <div className="col-md-2">
                  <h2>Master <br />brand list</h2>
              </div>
              <div className="col-md-8">
                  <p>Click the brand icons to see products available. Click here to see all manufacturers and brands we carry. If you don't see the brand you are looking for, send us an email and we'll see what we can do to get it for you. We add new brands and products every month!</p>
              </div>
              <div className="col-md-2">
                  <h4><a href="#">SEE ALL</a></h4>
              </div>
          </div>
          {/* <div className="row brands-letter home_logo_slider"> */}
          <Slider {...home_logo_slider} className="brands-letter home_logo_slider">
            <div>
                <div className="thumbnail-brand brand-image">
                    <a className="brand-img-link" href="#">
                        <img className="f-barnd-img" src="img/brands/brand-1.png" />
                    </a>
                </div>
            </div>
            <div>
                <div className="thumbnail-brand brand-image">
                    <a className="brand-img-link" href="#">
                        <img className="f-barnd-img" src="img/brands/brand-2.png" />
                    </a>
                </div>
            </div>
            <div>
                <div className="thumbnail-brand brand-image">
                    <a className="brand-img-link" href="#">
                        <img className="f-barnd-img" src="img/brands/brand-3.png" />
                    </a>
                </div>
            </div>
            <div>
                <div className="thumbnail-brand brand-image">
                    <a className="brand-img-link" href="#">
                        <img className="f-barnd-img" src="img/brands/brand-4.png" />
                    </a>
                </div>
            </div>
            <div>
                <div className="thumbnail-brand brand-image">
                    <a className="brand-img-link" href="#">
                        <img className="f-barnd-img" src="img/brands/brand-5.png" />
                    </a>
                </div>
            </div>
            <div>
                <div className="thumbnail-brand brand-image">
                    <a className="brand-img-link" href="#">
                        <img className="f-barnd-img" src="img/brands/brand-6.png" />
                    </a>
                </div>
            </div>
            <div>
                <div className="thumbnail-brand brand-image">
                    <a className="brand-img-link" href="#">
                        <img className="f-barnd-img" src="img/brands/brand-7.png" />
                    </a>
                </div>
            </div>
            <div>
                <div className="thumbnail-brand brand-image">
                    <a className="brand-img-link" href="#">
                        <img className="f-barnd-img" src="img/brands/brand-8.png" />
                    </a>
                </div>
            </div>
            <div>
                <div className="thumbnail-brand brand-image">
                    <a className="brand-img-link" href="#">
                        <img className="f-barnd-img" src="img/brands/brand-9.png" />
                    </a>
                </div>
            </div>
            <div>
                <div className="thumbnail-brand brand-image">
                    <a className="brand-img-link" href="#">
                        <img className="f-barnd-img" src="img/brands/brand-10.png" />
                    </a>
                </div>
            </div>
          </Slider>
      </div>
    </section>

    <section className='py40'>
      <div className='container'>
        <div className='row'>
          <div className='col-md-6'>
            <div className='banner-hover txt-black'>
              <a href='#'>
                <div className='banner-hoverWraper' style={{backgroundImage: `url('img/Img2.jpg')`}}>
                  <div className='banner-hoverOverlay'>
                    <div className='banner-hoverContent'>
                      <div>
                        <h3>Nikon RX10</h3>
                        <h4>32GB Unlocked</h4>
                        <p>4GB RAM | 64GB ROM | 20MP</p>
                        <p class="text-price mb-0">
                            <span>
                                <span style={{fontSize: '18px'}}>now at</span>
                                <span  style={{fontSize: '42px', lineHeight: '42px'}}>
                                    <strong><em>$</em> 749</strong>
                                </span>
                            </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            </div>
          </div>
          <div className='col-md-6'>
            <div className='banner-hover txt-white'>
              <a href='#'>
                <div className='banner-hoverWraper' style={{backgroundImage: `url('img/Img3.jpg')`}}>
                  <div className='banner-hoverOverlay'>
                    <div className='banner-hoverContent'>
                      <div>
                        <h3>Nikon RX10</h3>
                        <h4>32GB Unlocked</h4>
                        <p>4GB RAM | 64GB ROM | 20MP</p>
                        <p class="text-price mb-0">
                            <span>
                                <span style={{fontSize: '18px'}}>now at</span>
                                <span  style={{fontSize: '42px', lineHeight: '42px'}}>
                                    <strong><em>$</em> 749</strong>
                                </span>
                            </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section className='home-mostView'>
      <div className='container'>
      <div className="row">
          <div className="col-md-12">
            <div className="home-product-heading">
              <h2>Most View <span className="sup-title">Product</span></h2>
            </div>
          </div>
        </div>
        <Slider {...home_mostView_slider}>
          <div>
            <div className='vertical-product-card'>
              <a href='#' className='product-image'>
                <img src='img/vertical-pro-1.jpg' alt="img" />
              </a>
              <div className='product-info'>
                <a href='#' className='product-name'>
                  <h6>Apple Watch Series 3 (GPS, 42mm) - Space Gray</h6>
                </a>
                <div className='product-price'>
                  $400.00 <span className='previous-price'>$448.00</span>
                </div>
                <div className='product-rating'>
                  <div className='back-stars'>
                    <i className='las la-star'></i>
                    <i className='las la-star'></i>
                    <i className='las la-star'></i>
                    <i className='las la-star'></i>
                    <i className='las la-star'></i>
                    <div className='front-stars'>
                      <i className='las la-star'></i>
                      <i className='las la-star'></i>
                      <i className='las la-star'></i>
                      <i className='las la-star'></i>
                      <i className='las la-star'></i>
                    </div>
                    <span className='rating-count'>(0)</span>
                  </div>
                </div>
              </div>
            </div>
            <div className='vertical-product-card'>
              <a href='#' className='product-image'>
                <img src='img/vertical-pro-1.jpg' alt="img" />
              </a>
              <div className='product-info'>
                <a href='#' className='product-name'>
                  <h6>Apple Watch Series 3 (GPS, 42mm) - Space Gray</h6>
                </a>
                <div className='product-price'>
                  $400.00 <span className='previous-price'>$448.00</span>
                </div>
                <div className='product-rating'>
                  <div className='back-stars'>
                    <i className='las la-star'></i>
                    <i className='las la-star'></i>
                    <i className='las la-star'></i>
                    <i className='las la-star'></i>
                    <i className='las la-star'></i>
                    <div className='front-stars'>
                      <i className='las la-star'></i>
                      <i className='las la-star'></i>
                      <i className='las la-star'></i>
                      <i className='las la-star'></i>
                      <i className='las la-star'></i>
                    </div>
                    <span className='rating-count'>(0)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className='vertical-product-card'>
              <a href='#' className='product-image'>
                <img src='img/vertical-pro-1.jpg' alt="img" />
              </a>
              <div className='product-info'>
                <a href='#' className='product-name'>
                  <h6>Apple Watch Series 3 (GPS, 42mm) - Space Gray</h6>
                </a>
                <div className='product-price'>
                  $400.00 <span className='previous-price'>$448.00</span>
                </div>
                <div className='product-rating'>
                  <div className='back-stars'>
                    <i className='las la-star'></i>
                    <i className='las la-star'></i>
                    <i className='las la-star'></i>
                    <i className='las la-star'></i>
                    <i className='las la-star'></i>
                    <div className='front-stars'>
                      <i className='las la-star'></i>
                      <i className='las la-star'></i>
                      <i className='las la-star'></i>
                      <i className='las la-star'></i>
                      <i className='las la-star'></i>
                    </div>
                    <span className='rating-count'>(0)</span>
                  </div>
                </div>
              </div>
            </div>
            <div className='vertical-product-card'>
              <a href='#' className='product-image'>
                <img src='img/vertical-pro-1.jpg' alt="img" />
              </a>
              <div className='product-info'>
                <a href='#' className='product-name'>
                  <h6>Apple Watch Series 3 (GPS, 42mm) - Space Gray</h6>
                </a>
                <div className='product-price'>
                  $400.00 <span className='previous-price'>$448.00</span>
                </div>
                <div className='product-rating'>
                  <div className='back-stars'>
                    <i className='las la-star'></i>
                    <i className='las la-star'></i>
                    <i className='las la-star'></i>
                    <i className='las la-star'></i>
                    <i className='las la-star'></i>
                    <div className='front-stars'>
                      <i className='las la-star'></i>
                      <i className='las la-star'></i>
                      <i className='las la-star'></i>
                      <i className='las la-star'></i>
                      <i className='las la-star'></i>
                    </div>
                    <span className='rating-count'>(0)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className='vertical-product-card'>
              <a href='#' className='product-image'>
                <img src='img/vertical-pro-1.jpg' alt="img" />
              </a>
              <div className='product-info'>
                <a href='#' className='product-name'>
                  <h6>Apple Watch Series 3 (GPS, 42mm) - Space Gray</h6>
                </a>
                <div className='product-price'>
                  $400.00 <span className='previous-price'>$448.00</span>
                </div>
                <div className='product-rating'>
                  <div className='back-stars'>
                    <i className='las la-star'></i>
                    <i className='las la-star'></i>
                    <i className='las la-star'></i>
                    <i className='las la-star'></i>
                    <i className='las la-star'></i>
                    <div className='front-stars'>
                      <i className='las la-star'></i>
                      <i className='las la-star'></i>
                      <i className='las la-star'></i>
                      <i className='las la-star'></i>
                      <i className='las la-star'></i>
                    </div>
                    <span className='rating-count'>(0)</span>
                  </div>
                </div>
              </div>
            </div>
            <div className='vertical-product-card'>
              <a href='#' className='product-image'>
                <img src='img/vertical-pro-1.jpg' alt="img" />
              </a>
              <div className='product-info'>
                <a href='#' className='product-name'>
                  <h6>Apple Watch Series 3 (GPS, 42mm) - Space Gray</h6>
                </a>
                <div className='product-price'>
                  $400.00 <span className='previous-price'>$448.00</span>
                </div>
                <div className='product-rating'>
                  <div className='back-stars'>
                    <i className='las la-star'></i>
                    <i className='las la-star'></i>
                    <i className='las la-star'></i>
                    <i className='las la-star'></i>
                    <i className='las la-star'></i>
                    <div className='front-stars'>
                      <i className='las la-star'></i>
                      <i className='las la-star'></i>
                      <i className='las la-star'></i>
                      <i className='las la-star'></i>
                      <i className='las la-star'></i>
                    </div>
                    <span className='rating-count'>(0)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className='vertical-product-card'>
              <a href='#' className='product-image'>
                <img src='img/vertical-pro-1.jpg' alt="img" />
              </a>
              <div className='product-info'>
                <a href='#' className='product-name'>
                  <h6>Apple Watch Series 3 (GPS, 42mm) - Space Gray</h6>
                </a>
                <div className='product-price'>
                  $400.00 <span className='previous-price'>$448.00</span>
                </div>
                <div className='product-rating'>
                  <div className='back-stars'>
                    <i className='las la-star'></i>
                    <i className='las la-star'></i>
                    <i className='las la-star'></i>
                    <i className='las la-star'></i>
                    <i className='las la-star'></i>
                    <div className='front-stars'>
                      <i className='las la-star'></i>
                      <i className='las la-star'></i>
                      <i className='las la-star'></i>
                      <i className='las la-star'></i>
                      <i className='las la-star'></i>
                    </div>
                    <span className='rating-count'>(0)</span>
                  </div>
                </div>
              </div>
            </div>
            <div className='vertical-product-card'>
              <a href='#' className='product-image'>
                <img src='img/vertical-pro-1.jpg' alt="img" />
              </a>
              <div className='product-info'>
                <a href='#' className='product-name'>
                  <h6>Apple Watch Series 3 (GPS, 42mm) - Space Gray</h6>
                </a>
                <div className='product-price'>
                  $400.00 <span className='previous-price'>$448.00</span>
                </div>
                <div className='product-rating'>
                  <div className='back-stars'>
                    <i className='las la-star'></i>
                    <i className='las la-star'></i>
                    <i className='las la-star'></i>
                    <i className='las la-star'></i>
                    <i className='las la-star'></i>
                    <div className='front-stars'>
                      <i className='las la-star'></i>
                      <i className='las la-star'></i>
                      <i className='las la-star'></i>
                      <i className='las la-star'></i>
                      <i className='las la-star'></i>
                    </div>
                    <span className='rating-count'>(0)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Slider>
      </div>
    </section>

    <section className='py40'>
      <div className='container'>
        <div className='row'>
          <div className='col-md-12'>
            <div className='banner-hover txt-white'>
              <a href='#'>
                <div className='banner-hoverWraper' style={{backgroundImage: `url('img/Img3.jpg')`}}>
                  <div className='banner-hoverOverlay'>
                    <div className='banner-hoverContent'>
                      <div>
                        <h3>Nikon RX10</h3>
                        <h4>32GB Unlocked</h4>
                        <p>4GB RAM | 64GB ROM | 20MP</p>
                        <p class="text-price mb-0">
                            <span>
                                <span style={{fontSize: '18px'}}>now at</span>
                                <span  style={{fontSize: '42px', lineHeight: '42px'}}>
                                    <strong><em>$</em> 749</strong>
                                </span>
                            </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  )
}

export default HomeScreen
