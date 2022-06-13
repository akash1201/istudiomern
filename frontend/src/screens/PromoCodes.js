import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Row,
} from "react-bootstrap";
import {
  addPromoCode,
  addPromoCodeObj,
  removePromoCode,
  removePromoCodeObj,
  updatePromoDiscount
} from "../actions/cartActions"
import Axios from "axios";

const PromoCodes = (params) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [allCodes, setAllCodes] = useState(() => []);
  const [promoCodes, setPromoCodes] = useState(() => []);
  const [codes, setCodes] = useState(() => []);

  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;
  

  useEffect(() => {
    Axios.get("/api/promo/all/"+params.vendor)
      .then((res) => {
        setAllCodes(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const applyPromo = () => {
    let d = 0;
    let promoObj = JSON.parse(localStorage.getItem('promoCodeObj'))

    let vendors = []
    for(let i=0; i<cartItems.length; ++i){
         if(!vendors.includes(cartItems[i].vendor)){
           vendors = [...vendors, cartItems[i].vendor]
         }
    }
 
    let data = []

    for(let i=0; i<vendors.length; ++i){
      let total = 0
        for(let j=0; j<cartItems.length; ++j){
           if(vendors[i] === cartItems[j].vendor){
                 total += parseFloat(cartItems[j].price)*parseFloat(cartItems[j].qty)
           }
        }
        data = [...data, { vendor: vendors[i], amount: total, discount: 0}]
    }
 
    for(let i=0; i<data.length; ++i){
          for(let j=0; j<promoObj.length; ++j){
                if(promoObj[j].userid === data[i].vendor){
                      if(promoObj[j].type == 'amount'){
                         data[i].discount +=  parseFloat(promoObj[j].value)
                      }else{
                        let dis = ((parseFloat(promoObj[j].value) * parseFloat(data[i].amount))/100)
                        console.log(promoObj[j].value)
                        console.log(data[i].amount)
                        data[i].discount +=  parseFloat(dis)
                      }
                }
          }
    }
    
    for(let i=0; i<data.length; ++i){
      d += data[i].discount
    }
    dispatch(updatePromoDiscount(d))
  };


  const promoSuccess = () => {
    let data = {
      variant: "success",
      message: "Promocode Applied!!",
    };

    // params.setPromoMsg(data);

    setTimeout(() => {
      let data = {
        variant: "",
        message: "",
      };

      // params.setPromoMsg(data);
    }, 3000);
  };

  const promoError = () => {
    let data = {
      variant: "danger",
      message: "Promocode Removed!!",
    };

    // params.setPromoMsg(data);

    setTimeout(() => {
      let data = {
        variant: "",
        message: "",
      };

      // params.setPromoMsg(data);
    }, 3000);
  };

  const promoCodeClick = async (code) => {
    let applied = false;
    for (let i = 0; i < cart.promoCodes.length; ++i) {
      if (cart.promoCodes[i] == code) {
        applied = true;
        dispatch(removePromoCode(code))
        dispatch(removePromoCodeObj(code))
        applyPromo() 
        promoError();
        return;
      }
    }

    if (applied == false) {
      if (cartItems.length == 0) {
        params.setMsg("Your cart is empty");
        setTimeout(() => {
         params.setMsg("");
        }, 4000);
        return;
      }

      let response = await Axios.get(`/api/promo/promocode/${code}`);

      let promoObj = localStorage.getItem('promoCodeObj')?JSON.parse(localStorage.getItem('promoCodeObj')):[]

      for(let i=0; i<promoObj.length; ++i){
        if(promoObj[i].userid == response.data.userid){
          dispatch(removePromoCode(promoObj[i].code))
          dispatch(removePromoCodeObj(promoObj[i].code))
        }
      }

      if (response.data.hasMinPurchase) {
            let total = 0;
          
            if(params.vendor == 'admin'){
              for(let i=0; i<cartItems.length; ++i){
                    if(cartItems[i].fromPrintful){
                      total += parseFloat(cartItems[i].price)*parseInt(cartItems[i].qty)
                    }
              }
         }else{
           for(let i=0; i<cartItems.length; ++i){
            if(cartItems[i].base.user == params.vendor){
              total += parseFloat(cartItems[i].price)*parseInt(cartItems[i].qty)
            }
           }
           }

        if (total == 0 || response.data.minAmount > total) {
          params.setMsg("Minimum Purchase should be " + response.data.minAmount);
          window.scrollTo(0,0)
          setTimeout(() => {
            params.setMsg("");
          }, 4000);
          return;
        }
      }

      if (response.data == null) {
        params.setMsg("invalid Promo Code!!");
        setTimeout(() => {
          params.setMsg("");
        }, 1500);
      } else {
        let data = [...promoCodes, response.data];
        setCodes((old) => [...old, response.data.code]);
        setPromoCodes(data);

        //redux
        dispatch(addPromoCode(response.data.code))
        dispatch(addPromoCodeObj(response.data))
        applyPromo();

        promoSuccess();
      }
    } else {
      params.setMsg("Already Applied!");
      setTimeout(() => {
          params.setMsg("");
      }, 1500);
    }
  };

  return (
          <>   
          {
            allCodes.length !=0 ?
            <div className="cart-box promo-codes">
            <Row className="PromoCodeBox-wraper">
              <div className="col-md-12">
                <div className="cartPromoCodeBox">
                  <strong>Promocode Discount</strong>
                  <p>one promocode per one item. Choose the best one.</p>
                  <div style={{ display: "flex", flexWrap: "wrap" }}>
                    {allCodes.map((e, i) => (
                      <div
                        key={i}
                        onClick={() => {
                          promoCodeClick(e.code);
                        }}
                        className={`promoCode ${
                          cart.promoCodes.includes(e.code) ? " active" : ""
                        }`}
                        style={{ margin: "1%" }}
                      >
                        <div className="ribbon">
                          <img
                            src="../assets/img/check-icon.svg"
                            alt="icon"
                          />
                        </div>
                        <h4>{e.code}</h4>
                        <strong>
                          {e.type == "percentage"
                            ? `${e.value}% off ${
                                e.hasMinPurchase
                                  ? `on minimum $${e.minAmount} purchase`
                                  : ``
                              }`
                            : `$${e.value} off ${
                                e.hasMinPurchase
                                  ? `on minimum $${e.minAmount} purchase`
                                  : ``
                              }`}
                        </strong>
                        <div>{e.expiryDate?`Expires ${(e.expiryDate.split('T')[0]).split('-')[2]+"/"+(e.expiryDate.split('T')[0]).split('-')[1]+"/"+(e.expiryDate.split('T')[0]).split('-')[0]}`:``}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Row>
          </div>
            :
            <></>
          }                               
          </>
  );
};

export default PromoCodes;
