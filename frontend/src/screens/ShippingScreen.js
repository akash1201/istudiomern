import React, { useState, useEffect } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Row, Col, Button, Nav, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { USER_UPDATE_PROFILE_RESET } from "../constants/userConstants";
import ShippingSupport from "../components/ShippingSupport";
import SummaryRightBar from "../components/SummaryRightBar";
import { getUserDetails } from "../actions/userActions";
import UserAddresses from "../components/UserAddresses";
import CheckoutSteps from "../components/CheckoutSteps";
import { saveShippingAddress, saveStatusEmail } from "../actions/cartActions";
import AddressForm from "../components/AddressForm";
import Message from '../components/Message'
const ShippingScreen = ({ history }) => {
  const [successUpd, setSuccessUpd] = useState("");
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Shipping"
  }, []);
  const cart = useSelector((state) => state.cart);
  const { shippingAddress, cartItems } = cart;

  const [shipCart, setShipCart] = useState(() => []);
  const userDetails = useSelector((state) => state.userDetails);
  const { loading, user } = userDetails;
  const [checked, setChecked] = useState(true);
  const [error, setError] = useState(()=>false)

  const [statusEmail, setStatusEmail] = useState(()=>'')

  const dispatch = useDispatch();
  useEffect(() => {
    setShipCart(cartItems);
    dispatch(getUserDetails("profile"));
  }, [cartItems]);
  const AddUpdHandler = (res) => {
    setSuccessUpd("Address Updated Successfully");
    dispatch({ type: USER_UPDATE_PROFILE_RESET });
    dispatch(getUserDetails("profile"));
  };

  function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}
  const submitHandler = (e) => {
    e.preventDefault();
     
    if(isEmpty(shippingAddress)){
        window.scrollTo(0,0)
        alert('Please select a shipping address')
      return;
    }
    dispatch(saveShippingAddress(shippingAddress));
    history.push("/payment");
  };

  const updateDelivery = (AddressData) => {
    delete AddressData._id;
    dispatch(saveShippingAddress(AddressData));
    if(statusEmail){
      dispatch(saveStatusEmail(statusEmail))
    }
    history.push("/payment");
  };

  return (
    <>
      <section className="checkout-sec section-padding">
        <div className="container">
          <div className="inner-sec full-size">
            <div className="heading">
              <h3>checkout</h3>
            </div>
            <div className="main-sec full-size">
              <CheckoutSteps step1 step2 />
              <Row>
                <Col md={12} lg={8} xl={9} className="order-2 order-lg-1">
                  <div className="address">
                    <h4>shipping address</h4>
                    <h4>select address</h4>
                   {error &&  <Message variant='danger'>Please Select Shipping Address</Message>}
                    <UserAddresses
                      Addresses={user.addresses}
                      success={successUpd}
                      AddressUpdHandler={AddUpdHandler}
                      updDelivery={updateDelivery}
                    />

                    <div className="form full-size">
                      <h4>add new shipping address</h4>
                      <AddressForm
                        key={Math.random()}
                        Address={{}}
                        formHandler={AddUpdHandler}
                      />

                      <div>
                        <div className="billing full-size">
                          <h4>billing address</h4>
                          <input
                            className="custom-control-input billingcheck"
                            id="check1"
                            type="checkbox"
                            name=""
                            checked={checked}
                            onChange={(e) => {
                              setChecked(e.target.checked);
                            }}
                          />
                          <label
                            className="custom-control-label"
                            htmlFor="check1"
                          >
                            use shipping address as billing address
                          </label>
                        </div>

                        <Row
                          className={
                            !checked
                              ? "row new-address active animated bounceIn"
                              : "row new-address"
                          }
                        >
                          <AddressForm
                            key={Math.random()}
                            Address={{}}
                            formHandler={AddUpdHandler}
                          />
                        </Row>
                        <div className="full-size">
                          <div className="bottom-input input-feild">
                            <span className="input-title">
                              Email to send shipping status.
                            </span>
                            <input type="email" value={statusEmail} onChange={(e)=>{setStatusEmail(e.target.value)}} />
                          </div>
                        </div>
                        <Form onSubmit={submitHandler}>
                      <div className="form full-size">
                      <div className="full">
                              <div className="button">
                                <LinkContainer to="/cart" className="previous">
                                  <Nav.Link>Previous</Nav.Link>
                                </LinkContainer>
                                <Button
                                  type="button"
                                  onClick={submitHandler}
                                  variant="primary next"
                                >
                                  Continue
                                </Button>
                              </div>
                          </div>
                      </div>
                    </Form>
                      </div>
                    </div>
                    <ShippingSupport />
                  </div>
                </Col>
                <Col md={12} lg={4} xl={3} className="order-1 order-lg-2">
                  <SummaryRightBar shipCart={shipCart} />
                </Col>
              </Row>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ShippingScreen;
 