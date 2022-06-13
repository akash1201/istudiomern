import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { register } from "../actions/userActions";
import LoginLeftbar from "../components/LoginLeftBar";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
function useQuery() {
  return new URLSearchParams(useLocation().search);
}
const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexWrap: "wrap",
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
}));

const RegisterScreen = ({ location, history }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  let query = useQuery();
  let userType = query.get("u");
  const type =(userType=='Seller')?'sellersignUp':'signUp';
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState(() => "");
  const [date, setDate] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [checked, setChecked] = useState(() => false);
//extra field for vendor

const [companyName, setCompanyName] = useState("");
const [companyRegNo, setCompanyRegNo] = useState("");
const [companyEmail, setCompanyEmail] = useState("");
const [street1, setStreet1] = useState("");
const [street2, setStreet2] = useState("");
const [comp_country, setcompCountry] = useState("");
const [comp_state, setcompState] = useState("");
const [city, setCity] = useState("");

  const [errorMsg, setErrorMsg] = useState(() => "");

  const dispatch = useDispatch();

  const userRegister = useSelector((state) => state.userRegister);
  const { loading, error, userInfo } = userRegister;

  const redirect = location.search ? location.search.split("=")[1] : "/";

  useEffect(() => {
    if (userInfo) {
      history.push(redirect);
    }
  }, [history, userInfo, redirect]);

  const submitHandler = (e) => {
    e.preventDefault();
    let d = new Date();
    if (date) {
      let dob = date.split("-");
      if (dob[0] > d.getFullYear()) {
        setMessage("D.O.B cannot be greater than today");
        setTimeout(() => {
          setMessage("");
        }, 2000);
        return;
      }
      if (dob[0] >= d.getFullYear() && dob[1] > parseInt(d.getMonth()) + 1) {
        setMessage("D.O.B cannot be greater than today");
        setTimeout(() => {
          setMessage("");
        }, 2000);
        return;
      }
      if (
        dob[0] >= d.getFullYear() &&
        dob[1] >= d.getMonth() + 1 &&
        dob[2] > d.getDate()
      ) {
        setMessage("D.O.B cannot be greater than today");
        setTimeout(() => {
          setMessage("");
        }, 2000);
        return;
      }
    }

    if (password.trim() == "") {
      setMessage("Passwords cannot be empty");
      setTimeout(() => {
        setMessage("");
      }, 2000);
      return;
    }
   
    let regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/

    if(!password.match(regex)){
      setMessage("Password length must more than 7,musst have at least a number, and a special character.");
      setTimeout(() => {
        setMessage("");
      }, 8000);
      return;
    }
  
    if (name.trim() == "") {
      setMessage("Enter first name");
      setTimeout(() => {
        setMessage("");
      }, 2000);
      return;
    }

    if (email.trim() == "") {
      setMessage("Enter email");
      setTimeout(() => {
        setMessage("");
      }, 2000);
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      setTimeout(() => {
        setMessage("");
      }, 2000);
    } else if (checked == false) {
      setMessage("Accept the privacy policy");
      setTimeout(() => {
        setMessage("");
      }, 2000);
    } else {
      let companyAddress={street1,street2,comp_country,comp_state,city}
      let registerRes=dispatch(register(name, lastName, date, email, password,companyName,companyRegNo,companyEmail,companyAddress,type));
      console.log(registerRes)
    }
  };

  const checkPswd = (pswd) => {
    if (password != pswd) {
      setErrorMsg("Passwords Don't Match...!");
    } else {
      setErrorMsg("");
    }
  };

  const classes = useStyles();

  return (
    <>
      <section className="hm-category-main registerForm">
        <Container>
          <div className="loginPageForm">
            <Row className="align-content-center justify-content-center">
              <Col lg={5} md={6} className="order-2 order-md-1">
              <LoginLeftbar type={type} redirect={redirect}/>
              </Col>
              <Col lg={5} md={6} className="order-1 order-md-2">
                <div className="login-form">
                  <div className="login-logo">
                    <Link className="btn" to="/">
                      <img src="img/logo-1.png" alt="Logo" />
                    </Link>
                  </div>
                  <h2>Signup</h2>
                  {message && <Message variant="danger">{message}</Message>}
                  {error && <Message variant="danger">{error}</Message>}
                  {loading && <Loader />}
                  <Form onSubmit={submitHandler}>
                    <Row>
                      <Col md="6">
                        <Form.Group controlId="name">
                          {/* <Form.Label>Name</Form.Label> */}
                          <Form.Control
                            type="name"
                            placeholder="Enter Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                          ></Form.Control>
                          <div className="icon">
                            <i className="las la-user"></i>
                          </div>
                        </Form.Group>
                      </Col>
                      <Col md="6">
                        <Form.Group controlId="name">
                          {/* <Form.Label>Name</Form.Label> */}
                          <Form.Control
                            type="name"
                            placeholder="Last Name"
                            value={lastName}
                            onChange={(e) => {
                              setLastName(e.target.value);
                            }}
                          ></Form.Control>
                          <div className="icon">
                            <i className="las la-user"></i>
                          </div>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group controlId="email">
                      {/* <Form.Label>Email Address</Form.Label> */}
                      <Form.Control
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      ></Form.Control>
                      <div className="icon">
                        <i className="far fa-envelope"></i>
                      </div>
                    </Form.Group>
                    <Form.Group controlId="dob">
                      <TextField
                        id="date"
                        label=""
                        type="date"
                        defaultValue=""
                        onChange={(e) => {
                          setDate(e.target.value);
                        }}
                        className={classes.textField}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Form.Group>
                    {/* extra field for seller */}
                    {userType == "Seller" && (
                      <>
                      <Row>
                      <Col md="6">
                        <Form.Group controlId="companyName">
                          <TextField
                            id="companyName"
                            label=""
                            type="text"
                            placeholder="Company Name"
                            value={companyName}
                            onChange={(e) => {setCompanyName(e.target.value)}}
                            className={classes.textField}
                            InputLabelProps={{ shrink: true }}
                          />
                        </Form.Group>
                        </Col>
                      <Col md="6">
                        <Form.Group controlId="companyEmail">
                          <TextField
                            id="companyEmail"
                            label=""
                            placeholder="Company Email"
                            type="text"
                            value={companyEmail}
                            onChange={(e) => {setCompanyEmail(e.target.value)}}
                            className={classes.textField}
                            InputLabelProps={{ shrink: true }}
                          />
                        </Form.Group>
                        </Col>
                        </Row>
                       
                        <Form.Group controlId="companyRegNo">
                          <TextField
                            id="companyRegNo"
                            label=""
                            placeholder="Company Registeration No"
                            type="text"
                            value={companyRegNo}
                            onChange={(e) => {setCompanyRegNo(e.target.value)}}
                            className={classes.textField}
                            InputLabelProps={{ shrink: true }}
                          />
                        </Form.Group>

                        <Row>
                          <Col md="6">
                        <Form.Group controlId="street1">
                          <TextField
                            id="street1"
                            label=""
                            placeholder="Company Address 1"
                            type="text"
                            value={street1}
                            onChange={(e) => {setStreet1(e.target.value)}}
                            className={classes.textField}
                            InputLabelProps={{ shrink: true }}
                          />
                        </Form.Group>
                        </Col>
                          <Col md="6">
                        <Form.Group controlId="street2">
                          <TextField
                            id="street2"
                            label=""
                            placeholder="Company Address 2"
                            type="text"
                            value={street2}
                            onChange={(e) => {setStreet2(e.target.value)}}
                            className={classes.textField}
                            InputLabelProps={{ shrink: true }}
                          />
                        </Form.Group>
                        </Col>
                       </Row>
                        <Row>
                        <Col md="4">
                        <Form.Group controlId="comp_country">
                          <TextField
                            id="comp_country"
                            label=""
                            placeholder="Country"
                            type="text"
                            value={comp_country}
                            onChange={(e) => {setcompCountry(e.target.value)}}
                            className={classes.textField}
                            InputLabelProps={{ shrink: true }}
                          />
                         
                        </Form.Group>
                        </Col>
                        <Col md="4">
                        <Form.Group controlId="comp_state">
                          <TextField
                            id="comp_state"
                            label=""
                            placeholder="State"
                            type="text"
                            value={comp_state}
                            onChange={(e) => {setcompState(e.target.value)}}
                            className={classes.textField}
                            InputLabelProps={{ shrink: true }}
                          />
                        </Form.Group>
                        </Col>
                        <Col md="4">
                        <Form.Group controlId="city">
                          <TextField
                            id="city"
                            label=""
                            placeholder="City"
                            type="text"
                            value={city}
                            onChange={(e) => {setCity(e.target.value)}}
                            className={classes.textField}
                            InputLabelProps={{ shrink: true }}
                          />
                        </Form.Group>
                        </Col>
                        </Row></>
                    )}

                    <Form.Group controlId="password">
                      {/* <Form.Label>Password</Form.Label> */}
                      <Form.Control
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      ></Form.Control>
                      <div className="icon">
                        <i className="las la-lock"></i>
                      </div>
                    </Form.Group>

                    <Form.Group controlId="confirmPassword">
                      {/* <Form.Label>Confirm Password</Form.Label> */}
                      <Form.Control
                        type="password"
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={(e) => {
                          checkPswd(e.target.value);
                          setConfirmPassword(e.target.value);
                        }}
                      ></Form.Control>
                      <div className="icon">
                        <i className="las la-lock"></i>
                      </div>
                    </Form.Group>
                    <span style={{ color: "red" }}>{errorMsg}</span>
                    <Form.Group
                      controlId="singUpAccept"
                      className="singUpAccept"
                    >
                      <Form.Check
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => {
                          setChecked(e.target.checked);
                        }}
                      />
                      <label className="form-check-label" for="singUpAccept">
                        I accept the{" "}
                        <Link to="/privacy-policy">Privacy Policy</Link> &amp;{" "}
                        <Link to="/terms-conditions">Terms of Use</Link>
                      </label>
                    </Form.Group>
                    <Form.Group>
                      <Button type="submit" variant="primary">
                        Sign up
                      </Button>
                    </Form.Group>
                  </Form>
                </div>
              </Col>
            </Row>
          </div>
        </Container>
      </section>

      {/* <FormContainer>
      <h1>Sign Up</h1>
      {message && <Message variant='danger'>{message}</Message>}
      {error && <Message variant='danger'>{error}</Message>}
      {loading && <Loader />}
      <Form onSubmit={submitHandler}>
        <Form.Group controlId='name'>
          <Form.Label>Name</Form.Label>
          <Form.Control
            type='name'
            placeholder='Enter name'
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId='email'>
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type='email'
            placeholder='Enter email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId='password'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Enter password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId='confirmPassword'>
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Confirm password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Button type='submit' variant='primary'>
          Register
        </Button>
      </Form>

      <Row className='py-3'>
        <Col>
          Have an Account?{' '}
          <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>
            Login
          </Link>
        </Col>
      </Row>
    </FormContainer> */}
    </>
  );
};

export default RegisterScreen;
