import React, { useEffect, useState } from "react";
import {  useSelector, useDispatch } from "react-redux";
import { useLocation, Link, useHistory } from 'react-router-dom';
import {
  InputGroup,
  FormControl,
  Button
} from "react-bootstrap";
import {
  addPromoCode,
  addPromoCodeObj,
  removePromoCode,
  removePromoCodeObj,
  updatePromoDiscount,
  cartGrandTotal,
  updateShippingRate
} from "../actions/cartActions"
import Axios from 'axios'

const SummaryRightBar = (props) => {

  const location = useLocation()
  const history = useHistory()
  const dispatch = useDispatch()

  //states
  // const [msg, setMsg] = useState(()=>'')
  const [promocode, setPromocode] = useState(()=>'')


  const CartData = useSelector((state) => state.cart)
  const {  cartItems } = CartData

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  // let discount = promoCode && promoCode.data ? promoCode.data.discount : 0;
  let sum = 0;
  for (let i = 0; i < cartItems.length; ++i) {
    sum += cartItems[i].price * cartItems[i].qty;
  }

  let totalAmount = 0
  let sCharge = 0
  for (let i = 0; i < cartItems.length; ++i) {
    let s = cartItems[i].shippingCharge? parseFloat(cartItems[i].shippingCharge) : 0
    totalAmount +=  cartItems[i].price * cartItems[i].qty
    sCharge += cartItems[i].qty * s
  }
  // setGrandTotal(totalAmount)
  // setShipping(sCharge)
//  dispatch(cartGrandTotal(sum))

useEffect(()=>{
  let sum = 0
  for (let i = 0; i < cartItems.length; ++i) {
    sum += cartItems[i].price * cartItems[i].qty;

  }
  dispatch(cartGrandTotal(sum))
  dispatch(updateShippingRate())
},[cartItems])
  //Functions 

  const checkoutHandler = () => {
    history.push("/login?redirect=shipping");
  };

  const promoCodeFunc = async () => {
    if (promocode.trim() == "") {
      props.setMsg("Enter a promo code!")

      setTimeout(() => {
        props.setMsg("")
      }, 2000)
      return;
    }

    let applied = false;
    for (let i = 0; i < CartData.promoCodes.length; ++i) {
      if (CartData.promoCodes[i] == promocode) {
        applied = true;
      }
    }

    if (applied == false) {
      if (cartItems.length == 0) {
        props.setMsg("Your cart is empty");
        setTimeout(() => {
          props.setMsg("");
        }, 4000);
        return;
      }

      let response = await Axios.get(`/api/promo/promocode/${promocode}`);

      if (response.data == null) {
        props.setMsg("Invalid Promo Code!!")
        setTimeout(() => {
          props.setMsg("")
        }, 1500)
        return
      }

      if (response.data.hasMinPurchase) {
        console.log(response.data)
        if (CartData.grandTotal == 0 || response.data.minAmount > CartData.grandTotal) {
          props.setMsg("Minimum Purchase should be " + response.data.minAmount);
          setTimeout(() => {
            props.setMsg("");
          }, 4000);
          return;
        }
      }

      if (response.data == null) {
        props.setMsg("invalid Promo Code!!");
        setTimeout(() => {
          props.setMsg("");
        }, 1500);
      } else {
        dispatch(addPromoCode(response.data.code))
        dispatch(addPromoCodeObj(response.data))
        applyPromo();

        props.promoSuccess();

      }
    } else {
      props.setMsg("Already Applied!");
      setTimeout(() => {
        props.setMsg("");
      }, 1500);
    }
  };

  const applyPromo = () => {
    let d = 0;
    let promoObj = JSON.parse(localStorage.getItem('promoCodeObj'))
    for (let i = 0; i < promoObj.length; ++i) {
      if (promoObj[i].type == "percentage") {
        d += (promoObj[i].value * CartData.grandTotal) / 100;
      } else {
        d += promoObj[i].value;
      }
    }
    dispatch(updatePromoDiscount(d))
  };

  const removePromo = (code) => {
   
    dispatch(removePromoCodeObj(code))
    dispatch(removePromoCode(code))
    applyPromo()

  };


  return (
    <>
    <div className="full-size summary-sec">
      <div style={{display: location.pathname.includes("cart")? 'initial':'none'}}>
      {/* <InputGroup className="mb-3">
                  <FormControl
                    placeholder="Promocode"
                    aria-label="Promocode"
                    aria-describedby="Promocode"
                    value={promocode}
                    onChange={(e) => {
                      setPromocode(e.target.value.toLocaleUpperCase());
                    }}
                  />
                  <InputGroup.Append>
                    <Button variant="outline-secondary"
                     onClick={promoCodeFunc}
                     >
                      Apply
                    </Button>
                  </InputGroup.Append>
         </InputGroup> */}
         <span style={{ color: "red" }}>{props.msg}</span>
      </div>
      {props.shipCart && <><h4>summary</h4>
       <ul className="full-size">
        {props.shipCart && props.shipCart.length != 0 ? (
          props.shipCart.map((e, i) => (
            <li key={i}>
              <span className="img">
                <img src={e.fromPrintful?e.image:e.variant.images[0]} alt="" />
              </span>
              <div className="detail">
                <h6>{e.variant.name}</h6>
                <p>quantity {e.qty}</p>
              </div>
            </li>
          ))
        ) : (
          <li></li>
        )}
      </ul></>}
      <div className="price-detail">
        <ol>
          {CartData.promoCodes &&
            CartData.promoCodes.map((promocode, Index) => {
              return (
                <li key={Index}>
                  <span className="code">{promocode}</span>
                  <a className="remove" onClick={()=>{removePromo(promocode)}}>Remove</a>
                </li>
              );
            })}

          <li>
            <span className="name">item subtotal</span>
            <span className="price">$ {sum.toFixed(2)}</span>
          </li>
          <li>
            <span className="name">promcode discount</span>
            <span className="price blue">- $ {CartData.promoDiscount.toFixed(2)}</span>
          </li>
          {/* <li>
            <span className="name">tax</span>
            <span className="price">$ 0.00</span>
          </li> */}
          <li>
            <span className="name">shipping</span>
            <span className="price">$ {parseFloat(sCharge).toFixed(2)}</span>
          </li>
          <li>
            <span className="name">Subtotal </span>
            <span className="price">({cartItems.length}) items</span>
          </li>
          <li className="total-rate">
            <span className="name">total</span>
            <span className="price">$ {(parseFloat(totalAmount) - parseFloat(CartData.promoDiscount) + parseFloat(sCharge)).toFixed(2)}</span>
          </li>
          <li 
          className="btn-checkout" 
          style={{display: location.pathname.includes("cart")? 'initial':'none'}} 
          >
                      <Button
                        type="button"
                        className="btn-block"
                        disabled={cartItems.length === 0}
                        onClick={checkoutHandler}
                      >
                        Proceed To Checkout
                      </Button>
                    </li>
        </ol>
      </div>
    </div>{
      location.pathname.includes("cart")? 
      <div className="btnContinueShopping" >
      
    <Link to="/">Continue Shopping</Link>
  </div>
      :
      <></>
      }
  </>
  );
};
export default SummaryRightBar;
