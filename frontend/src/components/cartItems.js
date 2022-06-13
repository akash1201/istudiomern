import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Message from "../components/Message";
import { Row, Button, Image } from "react-bootstrap";
import {
  removeFromCart,
  clearCart,
  cartGrandTotal,
  updateCartQty,
  updatePromoDiscount,
  removePromoCode,
  removePromoCodeObj,
} from "../actions/cartActions";
import { useSelector, useDispatch } from "react-redux";
import CartShippingRate from "../components/cartShippingRate";
import PromoCodes from "../screens/PromoCodes";
import { updateShippingMethod, updateIndividualShippingRate } from "../actions/cartActions"

const ItemsInCart = (props) => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const { cartItems, promoCodeObj } = cart;

  const [vendors, setVendors] = useState(()=>[])

  useEffect(()=>{
    let data1 = []
    let d = 0
    let vendors = []
    for(let i=0; i<cartItems.length; ++i){
        if(!data1.includes(cartItems[i].base.user)){
          data1 = [...data1, cartItems[i].base.user]
        }
        if(!vendors.includes(cartItems[i].vendor)){
          vendors = [...vendors, cartItems[i].vendor]
        }
    }
    setVendors(data1)

let data = []

for(let i=0; i<vendors.length; ++i){
  let total = 0
    for(let j=0; j<cartItems.length; ++j){
       if(vendors[i] === cartItems[i].vendor){
             total += parseFloat(cartItems[j].price)*parseFloat(cartItems[j].qty)
       }
    }
    data = [...data, { vendor: vendors[i], amount: total, discount: 0}]
}

for(let i=0; i<data.length; ++i){
      for(let j=0; j<promoCodeObj.length; ++j){
            if(promoCodeObj[j].userid === data[i].vendor){
                  if(promoCodeObj[j].type == 'amount'){
                     data[i].discount +=  parseFloat(promoCodeObj[j].value)
                  }else{
                    let dis = ((parseFloat(promoCodeObj[j].value) * parseFloat(data[i].amount))/100)
                    data[i].discount +=  parseFloat(dis)
                  }
            }
      }
}

for(let i=0; i<data.length; ++i){
  d += data[i].discount
}
    dispatch(updatePromoDiscount(d));
  }, [cartItems])
  
  
  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };
  const applyPromo = () => {
    let d = 0;
    let promoObj = localStorage.getItem("promoCodeObj")?JSON.parse(localStorage.getItem("promoCodeObj")): [];

    let sum = 0;
    let cartItems = JSON.parse(localStorage.getItem('data'))

    // let promoObj = localStorage.getItem("promoCodeObj")?JSON.parse(localStorage.getItem("promoCodeObj")): [];

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
                        data[i].discount +=  parseFloat(dis)
                      }
                }
          }
    }
    
    for(let i=0; i<data.length; ++i){
      d += data[i].discount
    }
    dispatch(updatePromoDiscount(d));
  };
 
  const handlePlus = (id) => {
   let data = JSON.parse(localStorage.getItem('cartItems'))
    for (let i = 0; i < data.length; ++i) {
      if (data[i].variantId == id) {     
          data[i].qty = parseInt(data[i].qty) + 1
          localStorage.setItem('data', JSON.stringify(data))
      }
    }
    dispatch(updateCartQty(id, 1));
    validatePromo(data)
    updateGrandTotal();
  };
  const updateGrandTotal = () => {
    let sum = 0;
    let data = JSON.parse(localStorage.getItem('cartItems'))
    // console.log(JSON.parse(localStorage.getItem('cartItems')))
    for (let i = 0; i < data.length; ++i) {
      sum += data[i].price * data[i].qty;
    }
    dispatch(cartGrandTotal(sum));
    applyPromo()
  };
  const handleMinus = (id) => {

    let data = JSON.parse(localStorage.getItem('cartItems'))
    for (let i = 0; i < data.length; ++i) {
      if (data[i].variantId == id) {
        if (data[i].qty > 1) {
          data[i].qty -= 1
          localStorage.setItem('data', JSON.stringify(data))
          dispatch(updateCartQty(id, -1))
        }
      }
    }
   validatePromo(data)
    updateGrandTotal()
  };

  const validatePromo = (data) => {

    console.log(data)
    let promoObj = localStorage.getItem('promoCodeObj')?JSON.parse(localStorage.getItem('promoCodeObj')) : []
    console.log(promoObj)
    for(let i=0; i<promoObj.length; ++i){
       if(promoObj[i].hasMinPurchase){
         let sum = 0;
         for(let j=0; j<data.length; ++j){
           if(promoObj[i].userid == data[j].vendor){
            sum += data[j].price * data[j].qty
           }
         }
        
         if(sum<promoObj[i].minAmount){
           console.log("here true")
          dispatch(removePromoCode(promoObj[i].code))
          dispatch(removePromoCodeObj(promoObj[i].code))
         }
       }
    }
  }
//  console.log(count)
  const removeAllItems = () => {
    dispatch(clearCart());
  };
  return (
    <>
      {cartItems.length === 0 ? (
        <Message>
          Your cart is empty <Link to="/">Go Back</Link>
        </Message>
      ) : (
        <>

          {/* <div className="cart-removeAll">
            <Button
              variant="secondary"
              onClick={removeAllItems}
              style={{ color: "#CE4A88" }}
            >
              <i className="far fa-trash-alt"></i> Remove all items
            </Button>
          </div> */}
          <div className="">
            {/* {props.promoMsg?<Message variant={props.promoMsg.variant}>{props.promoMsg.message}</Message>: <></>} */}
             {
               vendors.length != 0?
               vendors.map((e,i)=>{
               return <div key={i} className={'cart-box'}>
                  {cartItems.filter((e1)=>e1.vendor === e).map((item, j)=>(
                  <>
                     <div className="cart-box" key={item.variantId}>
              {props.shipping &&<div key={j}><CartShippingRate fromPrintful={item.fromPrintful} product={JSON.stringify(item)} variantId={item.variantId} shipping_obj={item.shipping_Obj} vendor={item.base.user} dimension={JSON.stringify(item.dimensions)} qty={item.qty} i={i}/></div>}
                <Row className={props.shipping?'mb-4 mt-3 product-cart':''}>
                  <div className="col-md-2">
                    <div className="cart-img">
                      <Link to={item.fromPrintful?`/istudio-merch/product/${item.product}`:`/product/${item.product}`}>
                        {item.variant && (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        )}
                      </Link>
                    </div>
                  </div>
                  <div className="col-md-10">
                    <div className="row">
                      <div className="col-lg-12 col-xl-6">
                        <h2 className="product-name">
                          <Link to={item.fromPrintful?`/istudio-merch/product/${item.product}`:`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </h2>
                        <div className="homegoods">
                          {item.brand ? (
                            <p>
                              by <span>{item.brand}</span>
                            </p>
                          ) : (
                            <></>
                          )}
                        </div>
                        {
                          item.fromPrintful?
                          <></>
                          :
                          <div className="size-color-box">
                          {item.base &&
                            item.base.availableVariants.map((e, i) => (
                              <div
                                key={i}
                                className={e == "colour" ? "color" : e}
                                style={{ margin: "1%" }}
                              >
                                <p>
                                  {e}: <span>{item.variant.variant[e]}</span>
                                </p>
                              </div>
                            ))}
                        </div>
                        }
                      </div>
                      <div className="col-lg-6 col-xl-3">
                        <div className="qty-counter">
                          <label><span style={{fontWeight: 'bold'}}>Qty:</span> {props.shipping?item.qty:<></>}</label>
                          { !props.shipping?
                            <div className="qty-input">
                            <i
                              className="less"
                              onClick={() => {
                                handleMinus(item.variantId);
                              }}
                            >
                              -
                            </i>
                            <input
                              type="text"
                              onChange={() => {}}
                              value={item.qty}
                            />
                            <i
                              className="more"
                              onClick={() => {
                                handlePlus(item.variantId);
                              }}
                            >
                              +
                            </i>
                          </div>
                          :
                         <></>
                          }
                        </div>
                      </div>
                      <div className="col-lg-6 col-xl-3">
                        <div className="cartPriceDelete">
                        <label><strong>Price:</strong></label>
                          <div className="price">
                            <p>${item.price}</p>
                          </div>
                          <div className="delete">
                            <Button
                              type="button"
                              variant=""
                              onClick={() =>
                                removeFromCartHandler(item.variantId)
                              }
                            >
                              <i className="far fa-trash-alt"></i>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Row>
              </div>
                  </>
                  )
                )}
                {/* promo codes */}
                <PromoCodes key={i} promoSuccess={props.promoSuccess} setPromoMsg={props.setPromoMsg} setMsg={props.setMsg} vendor={e}/>
                </div>
              }
               )
               : 
               <></>
             }
          </div>
        </>
      )}
    </>
  );
};
export default ItemsInCart;
