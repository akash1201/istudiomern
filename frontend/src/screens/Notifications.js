import React, {useState, useEffect} from "react"
import { Container, Row, Col, Media, Dropdown, Button } from 'react-bootstrap'
import SideBar from "../components/Sidebar"
import Loader from "../components/Loader"
import { useSelector } from 'react-redux'
import Axios from "axios"
import {Empty} from 'antd'

const Notifications = () => {

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const [pageNo, setPageNo] =useState(()=>0)
  const [notifications, setNotifications] = useState(()=>[])

  const [loading, setLoading] = useState(()=>true)
  const [loading1, setLoading1] = useState(()=>true)

  useEffect(()=>{
    getNotifications()
  },[])

  const getNotifications = async (pageNo = 1) =>{

    setPageNo(pageNo)
  if(userInfo){
    let config = {
      headers:{
        'Authorization' : `Bearer ${userInfo.token}`
      }
    }
    setLoading1(true)
    Axios.get(`/api/miscellaneous/get-notifications/${userInfo._id}?pageNo=${pageNo}`, config)
    .then((res)=>{
      console.log(res.data.notifications)
      setNotifications(res.data.notifications)
      setLoading1(false)
      setLoading(false)

    })
    .catch((err)=>{
      setLoading1(false)
      setLoading(false)
      console.log(err)
    })
  }

  }

  const markAsRead = async(id) =>{

    setLoading1(true)
    setLoading(true)
    if(userInfo){
      let config = {
        headers:{
          'Authorization' : `Bearer ${userInfo.token}`
        }
      }
      let res = await Axios.put(`/api/miscellaneous/mark-as-read/${id}`,{},config)
      let data = [...notifications]

      for(let i=0; i<data.length; ++i){
        if(data[i]._id == id){
          data[i].isRead = true
        }
      }
      setNotifications(data)
      setLoading1(false)
      setLoading(false)
    }
  }

  const deleteNotification = async (id) =>{
    setLoading1(true)
    setLoading(true)
    if(userInfo){
      let config ={
        headers: {
          'Authorization': `Bearer ${userInfo.token}`
        }
      }
      let res = await Axios.delete(`/api/miscellaneous/delete-notification/${id}`, config)
      let data = notifications.filter((e)=>e._id != id)
      setNotifications(data)
      setLoading1(false)
      setLoading(false)
    }
    
  }

  

return(<>
 <section className="accountMain-wraper">
  <Container>
    <Row>
        <Col md={12}>
            <h1 className="main-heading">My Account</h1>
        </Col>
    </Row>
    <Row>
     <SideBar/>
       {
         loading?
         <Loader />
         :
         <Col md={12} lg={9} xl={9}>
         <div className="paymentMethod-main">
           <h4 className="heading">Notifications</h4> 
           <div className="notifications-wraper">
           {notifications.filter((e)=>(new Date().getTime()-new Date(e.createdAt).getTime())/(24*60*60*1000)<=1).length != 0?  
            <div>
              <h4>Today</h4>
             {
              notifications.filter((e)=>(new Date().getTime()-new Date(e.createdAt).getTime())/(24*60*60*1000)<=1).map((e, i)=>(
                <div className="listing" key={i}>
                <Media className={e.isRead?" ":"today" }>
                  
                  {console.log((new Date().getTime()-new Date(e.createdAt).getTime())/(24*60*60*1000))}
                  <img
                    width={42}
                    height={42}
                    className="mr-3"
                    src={e.image}
                    alt="Image"
                  />
                  <Media.Body>
                    <p>
                      {e.notification}
                    </p>
                    <strong>{((new Date().getTime()-new Date(e.createdAt).getTime())/(24*60*60*1000))<=1?'Today':((new Date().getTime()-new Date(e.createdAt).getTime())/(24*60*60*1000))<=2?'Yesterday':e.createdAt.split('T')[0]}</strong>
                    <Dropdown>
                      <Dropdown.Toggle id="">
                        <i className="las la-ellipsis-v"></i>
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        <Dropdown.Item onClick={()=>{markAsRead(e._id)}}>Mark as Read </Dropdown.Item>
                        <Dropdown.Item onClick={()=>{deleteNotification(e._id)}} className="delete">Delete</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </Media.Body>
                </Media>
               
            </div>
              ))      
            
            }   
             </div>
             :
              <></>}

{notifications.filter((e)=>((new Date().getTime()-new Date(e.createdAt).getTime())/(24*60*60*1000)>1)).filter((e)=>((new Date().getTime()-new Date(e.createdAt).getTime())/(24*60*60*1000)<=2)).length != 0?  
            <div>
              <h4>Yesterday</h4>
             {
              notifications.filter((e)=>((new Date().getTime()-new Date(e.createdAt).getTime())/(24*60*60*1000)>1)).filter((e)=>((new Date().getTime()-new Date(e.createdAt).getTime())/(24*60*60*1000)<=2)).map((e, i)=>(
                <div className="listing" key={i}>
                <Media className={e.isRead?" ":"today" }>
                  
                  {console.log((new Date().getTime()-new Date(e.createdAt).getTime())/(24*60*60*1000))}
                  <img
                    width={42}
                    height={42}
                    className="mr-3"
                    src={e.image}
                    alt="Image"
                  />
                  <Media.Body>
                    <p>
                      {e.notification}
                    </p>
                    <strong>{((new Date().getTime()-new Date(e.createdAt).getTime())/(24*60*60*1000))<=1?'Today':((new Date().getTime()-new Date(e.createdAt).getTime())/(24*60*60*1000))<=2?'Yesterday':e.createdAt.split('T')[0]}</strong>
                    <Dropdown>
                      <Dropdown.Toggle id="">
                        <i className="las la-ellipsis-v"></i>
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        <Dropdown.Item onClick={()=>{markAsRead(e._id)}}>Mark as Read </Dropdown.Item>
                        <Dropdown.Item onClick={()=>{deleteNotification(e._id)}} className="delete">Delete</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </Media.Body>
                </Media>
               
            </div>
              ))      
            
            }   
             </div>
             :
              <></>}


         {notifications.filter((e)=>(new Date().getTime()-new Date(e.createdAt).getTime())/(24*60*60*1000)>2).length != 0?  
            <div>
              <h4>Earlier</h4>
             {
              notifications.filter((e)=>(new Date().getTime()-new Date(e.createdAt).getTime())/(24*60*60*1000)>2).map((e, i)=>(
                <div className="listing" key={i}>
                <Media className={e.isRead?" ":"today" }>
                  
                  <img
                    width={42}
                    height={42}
                    className="mr-3"
                    src={e.image}
                    alt="Image"
                  />
                  <Media.Body>
                    <p>
                      {e.notification}
                    </p>
                    <strong>{((new Date().getTime()-new Date(e.createdAt).getTime())/(24*60*60*1000))<=1?'Today':((new Date().getTime()-new Date(e.createdAt).getTime())/(24*60*60*1000))<=2?'Yesterday':e.createdAt.split('T')[0]}</strong>
                    <Dropdown>
                      <Dropdown.Toggle id="">
                        <i className="las la-ellipsis-v"></i>
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        <Dropdown.Item onClick={()=>{markAsRead(e._id)}}>Mark as Read </Dropdown.Item>
                        <Dropdown.Item onClick={()=>{deleteNotification(e._id)}} className="delete">Delete</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </Media.Body>
                </Media>
               
            </div>
              ))      
            
            }   
             </div>
             :
              <></>}

             <div className="nt-viewMore">
             <Button variant="primary" onClick={()=>{getNotifications(pageNo+1)}} disabled={loading1}>View More</Button>
             </div>
           </div>   
         </div>
        </Col>
       }
    </Row>
  </Container>
</section>
</>);
}

export default Notifications;