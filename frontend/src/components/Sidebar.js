import React, {useState, useEffect} from 'react'
import { useSelector } from 'react-redux'
import { Link, withRouter } from "react-router-dom"
import { useDispatch } from 'react-redux'
import { logout } from '../actions/userActions'
import {Modal, Button, Row, Col, Image, Form, } from 'react-bootstrap'
import Message from '../components/Message'
import axios from 'axios'
import Loader from '../components/Loader'
import {updateProfilePic} from '../actions/userActions'

const sideBarMenu = [
    {
        title: 'My Profile',
        path: '/profile',
        icon: '/assets/img/my-profile.svg',
        user: true,
        vendor: true,
        admin: true,
    },
    {
        title: 'Contach Info',
        path: '/contact-info',
        icon: '/assets/img/my-profile.svg',
        user: false,
        vendor: false,
        admin: true,
    },
    {
        title: 'Payment Method',
        path: '/paymentMethods',
        icon: '/assets/img/payment-methods.svg',
        user: true,
        vendor: true,
        admin: true,
    },
    {
        title: 'Platform Fee',
        path: '/platform-fee',
        icon: '/assets/img/payment-methods.svg',
        user: false,
        vendor: false,
        admin: true,
    },
    {
        title: 'Notifications',
        path: '/notifications',
        icon: '/assets/img/notifications.svg',
        user: true,
        vendor: true,
        admin: true,
    },
    {
        title: 'Orders',
        path: '/orders',
        icon: '/assets/img/basket.svg',
        user: true,
        vendor: true,
        admin: true,
    },
    {
        title: 'Orders Received',
        path: '/ordersReceived',
        icon: '/assets/img/basket.svg',
        user: false,
        vendor: true,
        admin: true,
    },
    {
        title: 'Product Management',
        path: '/admin/productlist',
        icon: '/assets/img/account-settings.svg',
        user: false,
        vendor: true,
        admin: true,
    },
    {
        title: 'Category Management',
        path: '/admin/categorylist',
        icon: '/assets/img/plus.svg',
        user: false,
        vendor: false,
        admin: true,
    },
    {
        title: 'User Management',
        path: '/admin/userlist',
        icon: '/assets/img/plus.svg',
        user: false,
        vendor: false,
        admin: true,
    },
    {
        title: 'Promo Codes',
        path: '/admin/promocode',
        icon: '/assets/img/plus.svg',
        user: false,
        vendor: true,
        admin: true,
    },
    {
        title: 'Variant Management',
        path: '/admin/variants',
        icon: '/assets/img/account-settings.svg',
        user: false,
        vendor: true,
        admin: true,
    },
    {
        title: 'Banner Management',
        path: '/admin/banner-management',
        icon: '/assets/img/account-settings.svg',
        user: false,
        vendor: false,
        admin: true,
    },
    {
        title: 'Wishlist',
        path: '/wishlist',
        icon: '/assets/img/wishlist.svg',
        user: true,
        vendor: true,
        admin: true,
    },
    {
        title: 'Account Settings',
        path: '/accountSetting',
        icon: '/assets/img/account-settings.svg',
        user: false,
        vendor: false,
        admin: true,
    },
];


const SideBar = ({ history }) => {

    const dispatch = useDispatch()

    const signout = () => {
        dispatch(logout())
    }

    const currentTab = (history, path) => {

        if (history.location.pathname == path) {
            return "active"
        } else {
            return " "
        }

    }

    const userLogin = useSelector((state) => state.userLogin)
    const { userInfo } = userLogin
    const [show, setShow] = useState(()=>false)
    const [image, setImage]= useState(null)
    const [imageName, setImageName] = useState(()=>'')
    const [error, setError] = useState(()=>false)
    const [loading, setLoading] = useState(()=>false)
    const [src, setSrc] = useState(()=>userInfo? userInfo.profilePic?userInfo.profilePic:'/assets/img/logo.png':'/assets/img/logo.png')

    useEffect(() => {
        // create the preview
      if(image){
        const objectUrl = window.URL.createObjectURL(image)
        setSrc(objectUrl)
      }
     
        // // free memory when ever this component is unmounted
        // return () => URL.revokeObjectURL(objectUrl)
     }, [image])

    const showModal = () => {
       setShow(true)
    }
    const hideModal = () => {
        setSrc(()=>userInfo? userInfo.profilePic?userInfo.profilePic:'/assets/img/logo.png':'/assets/img/logo.png')
        setImage(null)
        setImageName('')
        setShow(false)
    }
    
    const uploadHandler = async (e) => {

        e.preventDefault()
        if(image){
            setLoading(true)
            const formData = new FormData()
            formData.append('image', image)

            try{
                const config = {
                    headers: {
                      'Content-Type': 'multipart/form-data',
                    },
                  }
                  const { data } = await axios.post('/api/upload', formData, config)
                //   const body = {
                //       url : data
                //   }
                const config1 = {
                    headers: {
                        'Authorization' : `Bearer ${userInfo.token}`
                    }
                }
                  let response = await axios.put(`/api/users/update-profile-pic/${userInfo._id}`, {url : data},config1)
                
                 dispatch(updateProfilePic(data))
                  
                  setLoading(false)
                  setImage(null)
                setImageName('')
                setShow(false)
            }catch(err){
                setLoading(false)
                setImage(null)
                setImageName('')
                setError(true)
                setTimeout(()=>{
                    setError(false)
                }, 3000)
            }
        }else{
           setLoading(false)
           setShow(false)
        }
    }


    return (
        <>
            <div className="col-md-12 col-lg-3 col-xl-3">
                <div className="account-sidebarLeft">
                    <div className="sidebar-accountMenu">
                        <div className="media">
                            <div className="mr-3 img profileImg">
                                <img src={src} alt="img" className='imageProfile'/>
                                <div className="overlay">
                                    <a onClick={showModal} className="icon1" title="User Profile">
                                    <i className="fas fa-edit"></i>
                                    </a>
                                </div>
                            </div>
                            <div className="media-body">
                                <h5 className="mt-0">Hello..!!</h5>
                                <p>{userInfo.name}</p>
                            </div>
                        </div>
                        <ul>
                            {
                                userInfo.userType == 'admin' ?
                                    sideBarMenu.filter(e => e.admin === true).map(
                                        (e, i) => {
                                            return (<li key={i}>
                                                <Link className={currentTab(history, e.path)} to={e.path}>
                                                    <img src={e.icon} alt="SVG" />
                                                    <span>{e.title}</span>
                                                </Link>
                                            </li>);
                                        }
                                    )
                                    :
                                    userInfo.userType == 'customer' ?
                                        sideBarMenu.filter(e => e.user === true).map(
                                            (e, i) => {
                                                return (<li key={i} >
                                                    <Link className={currentTab(history, e.path)} to={e.path}>
                                                        <img src={e.icon} alt="SVG" />
                                                        <span>{e.title}</span>
                                                    </Link>
                                                </li>);
                                            }
                                        )
                                        :
                                        sideBarMenu.filter(e => e.vendor === true).map(
                                            (e) => {
                                                return (<li key={e.path} >
                                                    <Link className={currentTab(history, e.path)} to={e.path}>
                                                        <img src={e.icon} alt="SVG" />
                                                        <span>{e.title}</span>
                                                    </Link>
                                                </li>);
                                            }
                                        )

                            }
                            <li key={""}>
                                <a href="#" onClick={signout}>
                                    <img src="/assets/img/sign-out.svg" alt="SVG" />
                                    <span>Sign out</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            {/* Modal */}
            <Modal show={show} onHide={hideModal}>
                <Modal.Header closeButton>
                <Modal.Title>Update Profile Image</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {
                      error && <Message variant={'danger'}>Upload valid image (JPEG, JPG or PNG)</Message>
                    }
                   <div style={{display: loading? 'none' : 'initial'}}>
                   <Row>
                    <Col  style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <Image src={src} roundedCircle />
                    </Col>
                </Row>
                <Row>
                    <Col style={{textAlign: 'center', margin: '5%'}}>
                      ----Or----
                    </Col>
                </Row>

                <Row>
                    <Col>
                         <Form.Group controlId='name'>
                            <Form.File
                                    id='image-file'
                                    label={imageName?imageName : "Upload a picture" }
                                    custom={true}
                                    onChange={(e)=>{ 
                                    setImage(e.target.files[0]);
                                    setImageName(e.target.files[0].name);
                                    }} 
                                    style={{overflow: 'hidden'}}             
                                ></Form.File>
                        </Form.Group>
                    </Col>
                </Row>
                   </div>
                   <div style={{display: loading? 'initial' : 'none'}}>
                       <Loader />
                   </div>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={hideModal}>
                    Close
                </Button>
                <Button variant="primary" onClick={uploadHandler}>
                    Save Changes
                </Button>
                </Modal.Footer>
            </Modal>
            {/* Modal Ends */}
        </>
    )
}
export default withRouter(SideBar)