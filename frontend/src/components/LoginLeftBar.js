import React from "react";
import { Link } from "react-router-dom";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import GoogleLogin from "react-google-login";
import { useDispatch } from "react-redux";
import Axios from "axios";
import { syncCartToDB } from "../actions/cartActions"

const LoginLeftbar = (props) => {
  const dispatch = useDispatch();

  const responseGoogle = async (response) => {
    
    try{
      let res = await Axios.post(`/api/google/signup`,{tokenId: response.tokenId})

      dispatch({
        type: "USER_REGISTER_SUCCESS",
        payload: res.data,
      });
  
      dispatch({
        type: "USER_LOGIN_SUCCESS",
        payload: res.data,
      });
  
      localStorage.setItem("userInfo", JSON.stringify(res.data));
      dispatch(syncCartToDB())
    }catch(err){
      console.log(err)
    }
    
  };

  const responseErrorGoogle = (param) =>{
    console.log(param)
  }

  const responseFacebook = async (response) => {
    console.log(response);

    try {
      let res = await Axios.post(`/api/facebook/signup`, {
        accessToken: response.accessToken,
        userId: response.userID,
        data: response,
      });
      dispatch({
        type: "USER_REGISTER_SUCCESS",
        payload: res.data,
      });

      dispatch({
        type: "USER_LOGIN_SUCCESS",
        payload: res.data,
      });

      localStorage.setItem("userInfo", JSON.stringify(res.data));
      dispatch(syncCartToDB())
    } catch (err) {
      console.log(err);
    }
  };

  const redirect = props.redirect;
  return (
    <div className="login-leftbar">
      <div className="login-leftImg">
        <img src="/img/login-bg-1.png" alt="img" />
      </div>
      <div className="login-leftContent">
        <div className="leftContent-wraper">
          <GoogleLogin
            clientId="706394601876-8vdp3mv9og382hvis8ed056i73eojdr7.apps.googleusercontent.com"
            render={(renderProps) => (
              <div className="google-btn">
                <a href="#" onClick={renderProps.onClick} className="btn">
                  <img src="/img/google-icon.png" alt="img" /> Login with Google
                </a>
              </div>
            )}
            buttonText="Login"
            onSuccess={responseGoogle}
            onFailure={responseErrorGoogle}
            cookiePolicy={"single_host_origin"}
          />

          <FacebookLogin
            appId="421632549149343"
            // autoLoad
            // onClick={componentClicked}
            callback={responseFacebook}
            render={(renderProps) => (
              <div className="facebook-btn">
                <a href="#" onClick={renderProps.onClick} className="btn">
                  <i className="fab fa-facebook-f"></i> Login with Facebook
                </a>
              </div>
            )}
          />
          {props.type !='signUp' && <div className="signup-btn">
            <p>Don’t have an account? </p>
            <Link
              className="btn"
              to={redirect ? `/register?redirect=${redirect}` : "/register"}
            >
              Sign up
            </Link>
          </div>}
          {props.type !='login' && <div className="signup-btn">
            <p>Already have Account? </p>
            <Link
              className="btn"
              to={redirect ? `/Login?redirect=${redirect}` : "/Login"}
            >
              Login
            </Link>
          </div>}
          {/* {props.type !='sellersignUp' && <div className="signup-btn" style={{ margin: "13px 0px 0px 0px" }}>
            <Link
              className="btn"
              to={
                redirect
                  ? `/register?u=Seller&redirect=${redirect}`
                  : "/register?u=seller"
              }
            >
              Want to Register as Seller?
            </Link>
          </div>} */}
        </div>
      </div>
    </div>
  );
};
export default LoginLeftbar;
