import React, { useEffect } from "react";
import { Result, Button } from "antd";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {updateVendor} from "../actions/userActions"

const StripeConnectSuccess = () => {

  let dispatch = useDispatch()

  useEffect(()=>{
    dispatch(updateVendor())
  },[])

  return (
    <Result
      status="success"
      title="Congratulations you have successfully register as a Seller"
      subTitle="Thank you your onboarding process is completed."
      extra={[
        <Link type="primary" to="/profile" key="console">
          <Button type="primary" key="console">
            Go to Dashboad
          </Button>
        </Link>,
      ]}
    />
  );
};
export default StripeConnectSuccess;
