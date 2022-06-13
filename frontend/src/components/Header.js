import React, { useEffect, useState } from 'react'
import { Route, Link, useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'
import { Navbar, Nav, Container, NavDropdown, Dropdown, Row, Col } from 'react-bootstrap'
import SearchBox from './SearchBox'
import { logout } from '../actions/userActions'
import Axios from 'axios'
import VendorDrawerForm from "./../components/vendorDrowerForm"

const Header = () => {
  const dispatch = useDispatch()
  const [topMenuBtn, TopMenuActive] = useState(false);
  const [active, setActive] = useState(false);
  const [srchToggleActive, srchToggle] = useState(false);
  const [bellToggleActive, bellToggle] = useState(false);
  const [notifications, setNotifications] = useState(()=>[])
  const [unread, setUnread]  = useState(()=>0)

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin
  const cart = useSelector((state) => state.cart)
  const { cartItems } = cart
  const logoutHandler = () => {
    dispatch(logout())
  }

  const categoryList = useSelector((state) => state.categoryList)

  let history = useHistory();

  const [categories, setCategories] = useState(() => [])
  const [allcats, setAllCats] = useState(() => [])
  const [catShow, setCatShow] = useState(()=>[])

  useEffect(()=>{

    setCategories(categoryList.categories)
    let data = []
    for(let i=0; i<categoryList.categories.length; ++i){

      data = [...data, {
                          name: categoryList.categories[i].name,
                          visible: false
                        }]
    }
    setCatShow(data)
    getAllcat(categoryList.categories)

  },[categoryList])

  useEffect(() => {
    Axios.get(`/api/category/getall`)
    .then((res)=>{
      setCategories(res.data.data)
      let data = []
      for(let i=0; i<res.data.data.length; ++i){

        data = [...data, {
                            name: res.data.data[i].name,
                            visible: false
                          }]
      }
      setCatShow(data)
      getAllcat(res.data.data)
      // all(res.data.data)
    })
    .catch((err)=>{
      console.log(err)
    })
    

  },[])

  useEffect(()=>{
    if(userInfo){
      let config= {
        headers: {
          'Authorization' : `Bearer ${userInfo.token}`
        }
      }
      Axios.get(`/api/miscellaneous/get-notifications/${userInfo._id}`, config)
      .then((res)=>{
             setUnread(res.data.unread)
             setNotifications(res.data.notifications)
      })
      .catch((err)=>{
        console.log(err)
      })
    }
  },[userInfo])

  const getAllcat = (data) => {

    for (let i = 0; i < data.length; ++i) {
      setAllCats((old) => [...old, data[i]])
      getAllcat(data[i].children)
    }

  }



  const getChildren = (data) => {
    
    return(<>
       {
         data? data.map((e,i)=>(
          <ul key={e._id} className={`list-unstyled ${e.children && e.children.length != 0?'subCategory':''}`}>
          <span>
            <li className="px10--"><a href="#" onClick={()=>{categoryRedirect(e.slug, e._id)}}>{e.children.length != 0? <b>{e.name}</b>: `${e.name}`}</a></li>
              {e.children.length != 0?getChildren(e.children):<></>}   
          </span>
          </ul>
         )):<></>
       }
    </>)

  }

  const getChildren1 = (data, name) => {

  
    
    return(<>
    <ul className="list-unstyled">
       {
         data? data.map((e,i)=>(
          
                <li key={i}><a onClick={()=>{categoryRedirect1(e.slug, e._id, name)}} style={{fontWeight: e.children.length != 0? 'bold':'initial'}}>{e.name}</a>
                    {
                      e.children.length != 0 ?
                      getChildren1(e.children, name)
                      :
                      <></>
                    }
                </li>
       
         )):<></>
       }
    </ul>
    </>)

  }

  const [selected, setSelected] = useState(()=>'')
  const [show, setShow] = useState(()=>false)

  const [activeCat, setActiveCat] = useState(()=>'')

  const categoryRedirect = (name, id) => {
    setSelected(name)
    history.push(`/category/${name}/${id}`)
    closeAll()

  }

  const categoryRedirect1 = (name, id, buff) => {
    setSelected(name)
    history.push(`/category/${name}/${id}`)
    

  }

  const closeAll = () => {
    document.getElementById('mega-menu-mobile').className = 'full-width mega-menu-sec'
   
      if(document.getElementById(activeCat)){
        document.getElementById(activeCat).style.display = 'none'
      }
  }

  const showMenu = () =>{
   document.getElementById('mega-menu-mobile').className = 'full-width mega-menu-sec active'
  }
  const hideMenu = () => {
    document.getElementById('mega-menu-mobile').className = 'full-width mega-menu-sec'
    if(document.getElementById(activeCat)){
      document.getElementById(activeCat).style.display = 'none'
    }
  }

  const showMegaMenu = () => {
   if(document.getElementById('mega-menu-id').style.display == 'none' || document.getElementById('mega-menu-id').style.display == ''){
    document.getElementById('mega-menu-id').style.display = 'block'
   }else{
    document.getElementById('mega-menu-id').style.display = 'none'
   }
  }

  const showChild = (id) => {
  
    if(document.getElementById(id)&&(document.getElementById(id).style.display == 'none' || document.getElementById(id).style.display == '')){
      document.getElementById(id).style.display = 'block'
    }else{
      if(document.getElementById(id)){
        document.getElementById(id).style.display = 'none'
      }
    }  

   if(id != activeCat){
    if(document.getElementById(activeCat)){
      document.getElementById(activeCat).style.display = 'none'
    }
    setActiveCat(id)
   }
  }


  const [scrolled,setScrolled]=React.useState(false);

  const handleScroll=() => {
    const offset=window.scrollY;
    if(offset > 200 ){
      setScrolled(true);
    }
    else{
      setScrolled(false);
    }
  }
  useEffect(() => {
    window.addEventListener('scroll',handleScroll)
  })

  let x=['main-header'];
  if(scrolled){
    x.push('scrolled');
  }

  const [contactInfo, setContactInfo] = useState(()=>{})
  useEffect(() => {
    Axios.get('/api/miscellaneous/contact-info')
        .then((res)=>{
              setContactInfo(res.data)
        })
        .catch((err)=>{
            console.log(err)
        })
  }, [])


  return (
    <header className={x.join(" ")}>
      <div className="navbar-expand-lg logo-wraper">
        <div className="topBar">
          <div className="container">
            <Row>
              
              <Col xs={2} sm={4} md={4} lg={7}>
                <button className={topMenuBtn ? "navbar-toggler active" : "navbar-toggler"} type="button" onClick={() => TopMenuActive(!topMenuBtn)}>
                  <div className="burger">
                    <span className="menu_toggle">
                      <span className="hamburger">
                        <span></span>
                        <span></span>
                        <span></span>
                      </span>
                      <span className="hamburger-cross">
                        <span></span>
                        <span></span>
                      </span>
                    </span>
                  </div>
                </button>
                <div className={topMenuBtn ? "topNav active" : "topNav"}>
                  <div className="navbar-mobile-back navbar-toggler" onClick={() => TopMenuActive(!topMenuBtn)}><span className="menu-back"><i className="las la-angle-left"></i> back</span></div>                  
                  <ul>
                      <li className="nav-item"><a href="#"><i className="fas fa-user"></i> My Account</a></li>
                      <li className="nav-item"><a href="#"><i className="fas fa-exchange-alt"></i> compare</a></li>
                      <li className="nav-item"><a href="#"><i className="fas fa-heart"></i> Wish List</a></li>
                      <li className="nav-item"><a href="#">About Us</a></li>
                      <li className="nav-item"><a href="#">Contact Us</a></li>
                  </ul>
                </div>
              </Col>
              <Col xs={10} sm={8} md={8} lg={5}>
                <div className="top-rightbar">
                  <span className='offerTitle'>Summer Discount - Up to 50% Off</span>
                  {/* <div className="socials-header">
                    <ul>
                      // <li><VendorDrawerForm/></li>
                      <li><a href="https://www.facebook.com/istudio-112915663809273" target='_blank'><i className="fab fa-facebook-square">facebook</i></a></li>
                    </ul>
                  </div> */}
                  {/* <div className='myaccount-links'>
                    <div className='language'>
                      <span style={{color:'white'}}><img src='/assets/img/us_flag.jpg' alt='EN' /> ENG</span>
                    </div>
                  </div> */}
                
                </div>
              </Col>
            </Row>
          </div>
        </div>
        <Container>
          <Row>
            <div className="header-logo">
              <LinkContainer to='/' className="previous"><Nav.Link>
                <h3 style={{color : 'white'}}>IStudios</h3>
                {/* <img src="/assets/img/logo.png" /> */}
                </Nav.Link></LinkContainer>
            </div>
            <div className="menu-notifications-icon">
                <div className="header-srch">
                  <a className={srchToggleActive ? "srch-toggle is-active" : "srch-toggle"} onClick={() => srchToggle(!srchToggleActive)}><i className="las la-search"></i></a>
                  <div className={srchToggleActive ? "search-form animated bounceIn is-active" : "search-form animated bounceIn"}>
                    <Route render={({ history }) => <SearchBox history={history} />} />
                  </div>
                </div>
                <div className="menu-icons">
                  <div className="bell-dropdown">
                    <a className={bellToggleActive ? "bell is-active" : "bell"} onClick={() => bellToggle(!active)}><i className="far fa-bell"></i><span className="count">{unread?unread:0}</span></a>
                    <div className={bellToggleActive ? "dropdown-content animated bounceIn is-active" : "dropdown-content animated bounceIn"}>
                      <div className="bell-popup-content">
                        <div className="heading">
                          <h4>Notifications</h4>
                          <p><a className={bellToggleActive ? "box-close is-active" : "box-close"} onClick={() => bellToggle(active)}><i className="las la-times"></i></a></p>
                        </div>
                        <div className="box-content">
                          {
                            notifications.length != 0?
                            notifications.filter((e,i)=>i<=2).map((e,i)=>(
                         <div className="media-box" key={i}>
                            <div className="media">
                              <img src={e.image} className="mr-3" alt="img" style={{width: '25%'}}/>
                              <div className="media-body">
                                <h5 className="mt-0">{e.notification}</h5>
                                <p><span>{
                                  (new Date(e.createdAt)).getHours()<24 ? `${(new Date(e.createdAt)).getHours()} hrs ago` : (e.createdAt.split("T")[0].split('-')[2]+"-"+e.createdAt.split("T")[0].split('-')[1]+"-"+e.createdAt.split("T")[0].split('-')[0])
                                  }</span></p>
                              </div>
                            </div>
                          </div>
                            ))
                            : 
                            <></>
                          }
                      
                        </div>
                        <div className="box-footer">
                          <Link onClick={()=>{bellToggle(false)}} to='/notifications'>View All Notifications</Link>
                        </div>
                      </div>
                    </div>
                  </div>
                  <LinkContainer to='/cart'>
                    <Nav.Link>
                      <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
                          <path className="path1" d="M409.6 1024c-56.464 0-102.4-45.936-102.4-102.4s45.936-102.4 102.4-102.4S512 865.136 512 921.6 466.064 1024 409.6 1024zm0-153.6c-28.232 0-51.2 22.968-51.2 51.2s22.968 51.2 51.2 51.2 51.2-22.968 51.2-51.2-22.968-51.2-51.2-51.2z"></path>
                          <path className="path2" d="M768 1024c-56.464 0-102.4-45.936-102.4-102.4S711.536 819.2 768 819.2s102.4 45.936 102.4 102.4S824.464 1024 768 1024zm0-153.6c-28.232 0-51.2 22.968-51.2 51.2s22.968 51.2 51.2 51.2 51.2-22.968 51.2-51.2-22.968-51.2-51.2-51.2z"></path>
                          <path className="path3" d="M898.021 228.688C885.162 213.507 865.763 204.8 844.8 204.8H217.954l-5.085-30.506C206.149 133.979 168.871 102.4 128 102.4H76.8c-14.138 0-25.6 11.462-25.6 25.6s11.462 25.6 25.6 25.6H128c15.722 0 31.781 13.603 34.366 29.112l85.566 513.395C254.65 736.421 291.929 768 332.799 768h512c14.139 0 25.6-11.461 25.6-25.6s-11.461-25.6-25.6-25.6h-512c-15.722 0-31.781-13.603-34.366-29.11l-12.63-75.784 510.206-44.366c39.69-3.451 75.907-36.938 82.458-76.234l34.366-206.194c3.448-20.677-1.952-41.243-14.813-56.424zm-35.69 48.006l-34.366 206.194c-2.699 16.186-20.043 32.221-36.39 33.645l-514.214 44.714-50.874-305.246h618.314c5.968 0 10.995 2.054 14.155 5.782 3.157 3.73 4.357 9.024 3.376 14.912z"></path>
                      </svg>
                      <span className="count">{cartItems.length}</span>
                    </Nav.Link>
                  </LinkContainer>
                  
                  
                  <Nav className='ml-auto'>
                    {(userInfo) ? (
                      <NavDropdown title={userInfo.name} id='username'>
                       
                        <LinkContainer to='/profile'>
                          <NavDropdown.Item>Profile</NavDropdown.Item>
                        </LinkContainer>

                        <LinkContainer to='/orders'>
                          <NavDropdown.Item>Orders</NavDropdown.Item>
                        </LinkContainer>

                        <LinkContainer to='/wishlist'>
                          <NavDropdown.Item>Wishlist</NavDropdown.Item>
                        </LinkContainer>

                        <NavDropdown.Item onClick={logoutHandler}>
                          Logout
                                  </NavDropdown.Item>
                      </NavDropdown>
                    ) : (
                        <LinkContainer to='/login'>
                          <Nav.Link style={{color: '#1890ff'}}>
                            <i className='fas fa-user'></i> <span>Sign In</span>
                          </Nav.Link>
                        </LinkContainer>
                      )}
                  
                  </Nav>


                </div>
              </div>
          </Row>
        </Container>
      </div>


      <div className="mainSubCategory full-width">
        <div className="container">
            <div className="full-width position-relative">
                <button className="product-toggler" type="button" onClick={showMenu}>
                    <div className="hamburger">
                        <span></span>
                        <span></span>
                        <span></span>   
                    </div>
                    <p>Product categories</p>
                </button>
                <div id={`mega-menu-mobile`} className="full-width mega-menu-sec">
                    <div className="mobile-back-button" onClick={hideMenu}>
                        <span className="menu-back"><i className="las la-angle-left"></i> back
                        </span>
                    </div>
                    <ul>
                        <li>
                            <a href='#'>All Categories <span className="down-arrow" onClick={showMegaMenu}><i className="fas fa-caret-down"></i></span></a>
                            <ul className="mega-menu" id='mega-menu-id'>
                                <div className="category-name">
                                  {
                                    categories.map((e)=>(
                                      <li key={e._id}>
                                        <a href="#" onClick={()=>{categoryRedirect(e.slug, e._id)}} onMouseOver={()=>{showChild(e._id)}}>{e.name}</a><span className="right-arrow" onClick={()=>{showChild(e._id)}}><i className="las la-angle-right"></i></span>
                                        {
                                          e.children.length !=0?
                                          <ul className="mega-category-link" id={e._id} style={{display: 'none'}}>
                                            <div className="row">
                                              {
                                                e.children.length != 0?
                                                e.children.map((e1)=>(
                                                  <div className="col-xl-3 col-lg-4" key={Math.random()}>
                                                    <div className="full-width">
                                                        <li><a href="#" onClick={()=>{categoryRedirect(e1.slug, e1._id)}}><b>{e1.name}</b></a></li>
                                                         {
                                                           e1.children.length != 0?
                                                           getChildren(e1.children)
                                                           :
                                                           <></>
                                                         }
                                                    </div>
                                                </div>
                                                ))
                                                :
                                                <></>
                                              }
                                               
                                            </div>
                                        </ul>
                                        :
                                        <></>
                                        }
                                    </li>
                                    ))
                                  }
                                </div>
                            </ul>
                        </li>
                        <li>
                          <a href='#'>Hot Deals</a>
                        </li>
                        <li>
                          <a href='#'>Best Sellers</a>
                        </li>
                        <li>
                          <a href='#'>New Arrivals</a>
                        </li>
                        {/* <li>
                            <a href='#' onClick={()=>{closeAll(); history.push('/istudio-merch')}}>istudio Merch</a>
                        </li> */}
                    </ul>

                    <div className="icon-box">
                      <i><img src="/img/phone.png" alt="Phone" /></i>
                      <p>phone Number</p>
                      <h4><a href="">{contactInfo?contactInfo.phone: <></>}</a></h4>
                  </div>
                </div>
            </div>
        </div>
    </div>
    </header>
  )
}

export default Header
