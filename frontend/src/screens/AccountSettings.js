import React,{useState} from "react"
import SideBar from "../components/Sidebar"
import { useSelector } from 'react-redux'
import { Button } from 'react-bootstrap'
import Axios from "axios";
const AccountSettings = () => {
  const [journalData,setjournalData]=useState('');

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const connectToQuickBooks=()=>{
    Axios.get("api/quickbooks/authUri")
      .then(function (authUri) {
        console.log(authUri.data);
        // Launch Popup using the JS window Object
        var parameters = "location=1,width=800,height=650";
        parameters += ",left=" + (window.screen.width - 800) / 2 + ",top=" + (window.screen.height - 650) / 2;
        window.open(authUri.data, 'connectPopup', parameters);
    })
      .catch((err) => {
        console.log(err);
      });
  }
  const showGeneral=()=>{
    console.log("clicked on show journal")
    Axios.get("api/quickbooks/journal")
      .then((res)=>{
        console.log(res.data)
        setjournalData(res.data.QueryResponse)
        console.log(journalData)
      }).catch((err) => {
        console.log(err);
      })
  }
          return(<>
                    <section className="accountMain-wraper">
                   <div className="container">
                     <div className="row">
                         <div className="col-md-12">
                             <h1 className="main-heading">My Account</h1>
                         </div>
                     </div>
                     <div className="row">
                      <SideBar/>
                       <div className="col-md-12 col-lg-9 col-xl-9">
                       <div className="paymentMethod-main">
                              <span>Account Settings</span> 
                              <br/>
                             
                             {
                               userInfo.userType == 'admin'?
                               <div style={{display: 'flex'}}>
                               <Button onClick={connectToQuickBooks} style={{margin: '2%'}}>Connect to Quick Books</Button>
                               <Button onClick={showGeneral} style={{margin: '2%'}}>Show Journal</Button>
                               </div>
                               :
                               <></>
                             }
                              {journalData && journalData.JournalEntry.map((e,i)=>{
                                return (e.Line.map((event,j)=>{
                                  return(<p key={j}>{event.JournalEntryLineDetail.PostingType}:{event.Description}</p>)
                                }))
                                  
                              })}
                       </div>
                      
                        </div>
                     </div>
                   </div>
                 </section>
                  </>);

}

export default AccountSettings;