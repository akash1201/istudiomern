import React from "react";
import { Result, Button } from "antd";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux'
// import SideBar from "../components/Sidebar"
import axios from "axios";
const StripeConnectFailure = () => {
    const userLogin = useSelector((state) => state.userLogin)
    const { userInfo } = userLogin
    const RetryStripeOnboarding=()=>{
        axios
          .post("/api/users/getStripeAccountLink",'',{
            headers: {
              Authorization: `Bearer ${userInfo.token}`
            }})
          .then((res) =>{
                //get link from api and redirect stripe onboarding process
                // console.log("get stripe link")
                // console.log(res)
                window.location.href=res.data.url
          } )
          .catch(err => console.error(err));
    }
  return (
    // <div className="row">
    // <SideBar/>
    //  <div className="col-md-12 col-lg-9 col-xl-9">
    <Result
      status="warning"
      title="There are some problems with your operation."
      subTitle="You can retry to complete the onboarding flow"
      extra={
       
          <Button type="primary" onClick={RetryStripeOnboarding} key="console">
            Retry Again
          </Button>
        
      }
    />
    // </div>
    // </div>
  );
};
export default StripeConnectFailure;
