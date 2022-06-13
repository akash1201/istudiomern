import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Container, Row, Col, Button } from "react-bootstrap";
import Message from "../components/Message";
import {
  addToCart,
  removeFromCart,
  clearCart,
  cartGrandTotal,
  updateCartQty,
  removePromoCode,
  removePromoCodeObj,
  updatePromoDiscount,
} from "../actions/cartActions";
import ItemsInCart from "../components/cartItems";
import Axios from "axios";
import SummaryRightBar from "../components/SummaryRightBar";
import { updateShippingMethod, updateIndividualShippingRate } from "../actions/cartActions"

const CartScreen = ({ match, location, history }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  var [qty, setQty] = useState(
    location.search ? Number(location.search.split("=")[1]) : 1
  );

  // const [grandTotal, setGrandTotal] = useState(() => 0);
  const [allCodes, setAllCodes] = useState(() => []);
  const productId = match.params.id;
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;
  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  useEffect(() => {
    Axios.get("/api/promo/all")
      .then((res) => {
        setAllCodes(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

      if(userInfo){
          let config = {
            headers: {
              'Authorization' : `Bearer ${userInfo.token}`
            }
          }
      }
      document.title = 'Cart'

      if(cart.cartItems.length != 0 ){
        for(let i=0; i<cart.cartItems.length; ++i){
          dispatch(updateShippingMethod(cart.cartItems[i].variantId, ''))
          dispatch(updateIndividualShippingRate('',cart.cartItems[i].variantId))  
        }
      }
  }, []);

  useEffect(() => {
  
    if (cart.cartItems.length == 0) {
      for (let i = 0; i < cart.promoCodes.length; ++i) {
        dispatch(removePromoCode(cart.promoCodes[i]))
        dispatch(removePromoCodeObj(cart.promoCodes[i]))
        applyPromo()
      }
    }
    let sum = 0;
    for (let i = 0; i < cartItems.length; ++i) {
      sum += cartItems[i].price * cartItems[i].qty
    }
    dispatch(cartGrandTotal(sum))
  }, [cartItems])

  useEffect(() => {
    if (productId) {
      dispatch(addToCart(productId, qty))
    }
  }, [dispatch, productId, qty])

  const applyPromo = () => {
    let d = 0
    let promoObj = JSON.parse(localStorage.getItem("promoCodeObj"))
    // for (let i = 0; i < promoObj.length; ++i) {
    //   if (promoObj[i].type == "percentage") {
    //     d += (promoObj[i].value * cart.grandTotal) / 100
    //   } else {
    //     d += promoObj[i].value
    //   }
    // }
    for(let i=0; i<promoObj.length; ++i){
      for(let j=0; j<cartItems.length; ++j){
           if(promoObj[i].userid == cartItems[j].base.user){                      
             if(promoObj[i].type == 'amount'){
                     d +=  parseFloat(promoObj[i].value)
             }else{
               let dis = 0;
               let totalAmt = cartItems[j].price * cartItems[j].qty
               dis = (totalAmt * promoObj[i].value)/100
               d += dis
                  // let d = ((parseFloat(promoObj[i].value) * parseFloat(data[i].amount))/100)
                  // data[i].discount = parseFloat(data[i].discount) + parseFloat(d)
             }
           }
      }
}
    dispatch(updatePromoDiscount(d));
  };

  const [msg, setMsg] = useState(() => "");
  const [promoMsg, setPromoMsg] = useState({
    variant: "",
    message: "",
  });

  const promoSuccess = () => {
    let data = {
      variant: "success",
      message: "Promocode Applied!!",
    };

    setPromoMsg(data);

    setTimeout(() => {
      let data = {
        variant: "",
        message: "",
      };

      setPromoMsg(data);
    }, 3000);
  };

  const removeAllItems = () => {
    dispatch(clearCart());
  };

  const goBack = () => {
    history.goBack()
  }

  return (
    <>
      <section className="cart-view">
        <Container>
          <Row>
            <Col md={12}>
              <h1 className="product-heading">Your Cart</h1>
            </Col>
          </Row>
          
          <Row>
          <Col lg={8} xl={9} className="order-2 order-lg-1"> 
          <div className="cart-removeAll">
          <Link className='btn btn-light my-3' to='#' onClick={goBack} style={{float:'left', color: 'black', fontWeight:'bold'}}>
                Go Back
              </Link>

            <Button
              variant="secondary"
              onClick={removeAllItems}
              
            >
              <i className="far fa-trash-alt"></i> Remove all items
            </Button>
          </div>
          {promoMsg?<Message variant={promoMsg.variant}>{promoMsg.message}</Message>: <></>}
          </Col> 
          </Row>
          <Row>
            <Col lg={8} xl={9} className="order-2 order-lg-1"> 
              <ItemsInCart promoMsg= {promoMsg} promoSuccess={promoSuccess} setPromoMsg={setPromoMsg} setMsg={setMsg}/>
              {/* <PromoCodes promoSuccess={promoSuccess} setPromoMsg={setPromoMsg} setMsg={setMsg} /> */}
            </Col>
            <Col lg={4} xl={3} className="order-1 order-lg-2">
              <SummaryRightBar promoSuccess={promoSuccess} setPromoMsg={setPromoMsg} setMsg={setMsg} msg={msg}/>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default CartScreen;
