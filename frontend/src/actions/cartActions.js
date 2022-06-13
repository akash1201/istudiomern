import axios from 'axios'
import {
  CART_ADD_ITEM,
  CART_REMOVE_ITEM,
  CART_SAVE_SHIPPING_ADDRESS,
  CART_SAVE_PAYMENT_METHOD,
  CART_CLEAR_ITEMS,SAVE_PROMO_CODE
} from '../constants/cartConstants'
import uuid from 'react-uuid'

export const addToCart = (id, qty) => async (dispatch, getState) => {

  let printful = JSON.parse(localStorage.getItem('fromPrintful'))
  let cartId = null;

if(localStorage.getItem('userInfo')){
  cartId = JSON.parse(localStorage.getItem('userInfo'))._id
}else{
  cartId = uuid()
  localStorage.setItem('cartId', cartId)
}

if(localStorage.getItem('userInfo')){

  let config = {
    headers: {
      'Authorization' : `Bearer ${JSON.parse(localStorage.getItem('userInfo')).token}`
    }
  }
  if(printful){

    let base = JSON.parse(localStorage.getItem('baseProduct'))
    let variant = JSON.parse(localStorage.getItem('variant'))

    try{
      let res = await axios.post(`/api/cart/add-cart-items`,{
        product: base.external_id,
        variantId: variant.external_id,
        fromPrintful: true,
        qty
      }, config)
    }catch(err){
      console.log(err)
    }

    dispatch({
      type: CART_ADD_ITEM,
      payload: {
        product: base.external_id,
        variantId: variant.external_id,
        vid: variant.variant_id,
        name: variant.name,
        brand: 'istudio',
        image: (variant.files.filter((e)=>e.type === 'preview'))[0].thumbnail_url,
        price: variant.retail_price,
        countInStock: 1000,
        base: base,
        variant: variant,
        vendor: base.user,
        fromPrintful: true,
        qty
      },
    })

  }else{

    // const { data } = await axios.get(`/api/products/${id}`)

    let vid = localStorage.getItem('variantId')
    let base = JSON.parse(localStorage.getItem('baseProduct'))
    let variant = JSON.parse(localStorage.getItem('variant'))
  
   try{
    let res = await axios.post(`/api/cart/add-cart-items`,{
      product: base._id,
      variantId: vid,
      fromPrintful: false,
      qty
    }, config)

   }catch(err){
   console.log(err)
   }

    dispatch({
      type: CART_ADD_ITEM,
      payload: {
        product: base._id,
        variantId: vid,
        name: base.name,
        brand: base.brand,
        image: variant.images[0],
        dimensions: base.dimensions,
        price: variant.offerPrice?variant.offerPrice: variant.price,
        countInStock: base.qty,
        base: base,
        variant: variant,
        vendor: base.user,
        fromPrintful: false,
        qty
      },
    })

  }
}else{
  //if user isn't logged in

  if(printful){

    let base = JSON.parse(localStorage.getItem('baseProduct'))
    let variant = JSON.parse(localStorage.getItem('variant'))

    dispatch({
      type: CART_ADD_ITEM,
      payload: {
        product: base.external_id,
        variantId: variant.external_id,
        vid: variant.variant_id,
        name: variant.name,
        brand: 'istudio',
        image: (variant.files.filter((e)=>e.type === 'preview'))[0].thumbnail_url,
        price: variant.retail_price,
        countInStock: 1000,
        base: base,
        variant: variant,
        vendor: base.user,
        fromPrintful: true,
        qty
      },
    })

  }else{

    // const { data } = await axios.get(`/api/products/${id}`)

    let vid = localStorage.getItem('variantId')
    let base = JSON.parse(localStorage.getItem('baseProduct'))
    let variant = JSON.parse(localStorage.getItem('variant'))
    // const response = await axios.get(`/api/products/${vid}`)

    dispatch({
      type: CART_ADD_ITEM,
      payload: {
        product: base._id,
        variantId: vid,
        name: base.name,
        brand: base.brand,
        image: variant.images[0],
        dimensions: base.dimensions,
        price: variant.offerPrice?variant.offerPrice: variant.price,
        countInStock: base.qty,
        base: base,
        variant: variant,
        vendor: base.user,
        fromPrintful: false,
        qty
      },
    })

  }
}
 

  localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))
}

export const syncCartToDB = () =>async (dispatch, getState) => {

  let cartData = JSON.parse(localStorage.getItem('cartItems'))
  let userInfo = JSON.parse(localStorage.getItem('userInfo'))
  console.log("Load Synced DB")
  console.log(cartData)
  console.log(userInfo)
  let data = []
     if(cartData && cartData.length>0){
      for(let i=0; i<cartData.length; ++i){
        data = [...data, {
          product: cartData[i].product,
          variantId: cartData[i].variantId,
          user: userInfo._id,
          fromPrintful: cartData[i].fromPrintful,
          qty: cartData[i].qty
        }]
      }
      try{
        let config = {
          headers: {
            'Authorization' : `Bearer ${userInfo.token}`
          }
        }
          let res = await axios.post(`/api/cart/sync-cart`, data, config)
      
       let response = await axios.get(`/api/cart/cart-items`, config)
       console.log(response.data)
       dispatch({
        type: 'LOAD_SYNCED_DB',
        payload: response.data
      })
      localStorage.setItem('cartItems', JSON.stringify(response.data))

      // dispatch({
      //   type: "USER_LOGIN_SUCCESS",
      //   payload: userInfo,
      // });

      }catch(err){
        console.log(err)
      }
     }else{
      try{
        let config = {
          headers: {
            'Authorization' : `Bearer ${userInfo.token}`
          }
        }
      
       let response = await axios.get(`/api/cart/cart-items`, config)
     
       dispatch({
        type: 'LOAD_SYNCED_DB',
        payload: response.data
      })
      localStorage.setItem('cartItems', JSON.stringify(response.data))

      dispatch({
        type: "USER_LOGIN_SUCCESS",
        payload: userInfo,
      });

      }catch(err){
        console.log(err)
      }
     }
}

export const removeFromCart = (id) => async(dispatch, getState) => {
  
  if(localStorage.getItem('userInfo')){
    let config = {
          headers: {
            'Authorization' : `Bearer ${JSON.parse(localStorage.getItem('userInfo')).token}`
          }
    }
    await axios.delete(`/api/cart/remove-from-cart/${id}`, config)
  }

  let items = getState().cart.cartItems
  let data = items.filter((x) => x.variantId !== id)

  dispatch({
    type: CART_REMOVE_ITEM,
    payload: id,
  })


  localStorage.setItem('cartItems', JSON.stringify(data))
}

export const saveShippingAddress = (data) => (dispatch) => {
  dispatch({
    type: CART_SAVE_SHIPPING_ADDRESS,
    payload: data,
  })

  localStorage.setItem('shippingAddress', JSON.stringify(data))
}
export const saveStatusEmail = (data) => (dispatch) => {
  dispatch({
    type: 'CART_SAVE_STATUS_EMAIL',
    payload: data,
  })
  localStorage.setItem('statusEmail', JSON.stringify(data))
}
export const savePaymentMethod = (data) => (dispatch) => {
  dispatch({
    type: CART_SAVE_PAYMENT_METHOD,
    payload: data,
  })

  localStorage.setItem('paymentMethod', JSON.stringify(data))
}

export const clearCart = () => async(dispatch) => {
  localStorage.removeItem('cartItems')
  if(localStorage.getItem('userInfo')){
    let user = JSON.parse(localStorage.getItem('userInfo'))
    let config = {
      headers : {
        'Authorization' : `Bearer ${user.token}`
      }
    }
    try{
      await axios.delete(`/api/cart/clear-cart`, config)
    }catch(err){
      console.log(err)
    }
  }
  dispatch({
    type: CART_CLEAR_ITEMS
  })
}

export const savePromoCode=(data)=>(dispatch)=>{
  dispatch({
    type: SAVE_PROMO_CODE,
    payload: data,
  })
}
export const updateCartQty=(id, val)=>async(dispatch,getState)=>{

  if(localStorage.getItem('userInfo')){
    let config = {
      headers: {
        'Authorization' : `Bearer ${JSON.parse(localStorage.getItem('userInfo')).token}`
      }
    }
    await axios.put(`/api/cart/update-cart/${id}`, {qty: val}, config)
  }
  dispatch({
    type: 'UPDATE_CART_QTY',
    payload: {
      id: id,
      val: val
    },
  })
  localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))
}

export const addPromoCode=(code)=>(dispatch,getState)=>{
  dispatch({
    type: 'ADD_PROMO_CODE',
    payload: code
  })
  localStorage.setItem('promoCodes', JSON.stringify(getState().cart.promoCodes))
}
export const removePromoCode = (code) => (dispatch,getState) => {
  dispatch({
    type: 'REMOVE_PROMO_CODE',
    payload: code
  })
  localStorage.setItem('promoCodes', JSON.stringify(getState().cart.promoCodes))
}

export const addPromoCodeObj=(obj)=>(dispatch,getState)=>{
  dispatch({
    type: 'ADD_PROMO_CODE_OBJ',
    payload: obj
  })
  localStorage.setItem('promoCodeObj', JSON.stringify(getState().cart.promoCodeObj))
}

export const removePromoCodeObj=(code)=>(dispatch,getState)=>{
  dispatch({
    type: 'REMOVE_PROMO_CODE_OBJ',
    payload: code
  })
  localStorage.setItem('promoCodeObj', JSON.stringify(getState().cart.promoCodeObj))
}
export const updatePromoDiscount=(amount)=>(dispatch,getState)=>{
  dispatch({
    type: 'UPDATE_PROMO_DISCOUNT',
    payload: amount
  })
  localStorage.setItem('promoDiscount', JSON.stringify(getState().cart.promoDiscount))
}

export const updateShippingRate=()=>(dispatch,getState)=>{
  dispatch({
    type: 'UPDATE_SHIPPING_RATE',
  })
}

export const updateIndividualShippingRate=(amount, variant)=>(dispatch,getState)=>{
  dispatch({
    type: 'UPDATE_INDIVIDUAL_SHIPPING_RATE',
    payload: {
      amount: amount,
      variant: variant
    }
  })
}

export const updateShippingMethod = (variantId, shipping_id)=>(dispatch,getState)=>{
  dispatch({
    type: 'UPDATE_SHIPPING_METHOD',
    payload: {
      variant: variantId,
      shipping_id: shipping_id
    }
  })
  localStorage.setItem('promoDiscount', JSON.stringify(getState().cart.promoDiscount))
}

export const cartGrandTotal = (data) => (dispatch) => {
        dispatch({
          type: 'CART_UPDATE_GRANDTOTAL',
          payload: data
        })
}