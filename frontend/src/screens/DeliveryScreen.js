import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Modal,
  Dropdown,
  Image,
  Nav,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import ItemsInCart from "../components/cartItems";
import CheckoutSteps from "../components/CheckoutSteps";
import { addToCart, removeFromCart } from "../actions/cartActions";
import SummaryRightBar  from "../components/SummaryRightBar"
import Message from "../components/Message";
const DeliveryScreen = ({ match, location, history }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const productId = match.params.id;

  const qty = location.search ? Number(location.search.split("=")[1]) : 1;

  const dispatch = useDispatch();
  const [disabled, setDisabled] = useState(()=>true)
  const [err, setErr] = useState(()=>false)

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  useEffect(() => {
    if (productId) {
      dispatch(addToCart(productId, qty));
    }
  }, [dispatch, productId, qty]);

  useEffect(()=>{

    let count = 0;
    for(let i = 0; i<cartItems.length; ++i){
           if(cartItems[i].shipping_Obj){
              if(cartItems[i].shipping_Obj.trim() != ''){
                    ++count;
                   
              }
           }
    }
    if(count == cartItems.length){
      setDisabled(false)
    }else{
      setDisabled(true)
    }

  },[cartItems])

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if(disabled){
        setErr(true)
        window.scrollTo(0,0)
        setTimeout(()=>{setErr(false)}, 4000)
    }else{
      //dispatch(saveShippingAddress({ address, city, postalCode, country }))
    history.push("/payment");
    }

    // history.push("/payment");
  };

  return (
    <>
      <section className="checkout-sec section-padding nvS-deliveryScreen">
        <Container>
          <div className="inner-sec full-size">
            <div className="heading">
              <h3>checkout</h3>
            </div>
            <div className="main-sec full-size">
              <CheckoutSteps step1 step2 step3 />
             
              <Row>

                <Col md={12} lg={8} xl={9} className="order-2 order-lg-1">
                  <div className="shipping-methods">
                    <h4>Delivery</h4>
                    <Row>
                      <Col>
                         {err && <Message variant='danger'>Please Select a shipping method</Message>}
                      </Col>
                    </Row>
                    <ItemsInCart shipping={true} />
                    <Form onSubmit={submitHandler}>
                      <div className="form full-size">
                        <div className="full">
                          <div className="button">
                            <LinkContainer to="/shipping" className="previous">
                              <Nav.Link>Previous</Nav.Link>
                            </LinkContainer>
                            <Button type="submit" variant="primary next">
                              Continue
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Form>
                  </div>
                </Col>

                <Col md={12} lg={4} xl={3} className="order-1 order-lg-2">
                <SummaryRightBar />
                </Col>
              </Row>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
};

export default DeliveryScreen;
