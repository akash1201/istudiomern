import {
  CART_ADD_ITEM,
  CART_REMOVE_ITEM,
  CART_SAVE_SHIPPING_ADDRESS,
  CART_SAVE_PAYMENT_METHOD,
  CART_CLEAR_ITEMS,
  SAVE_PROMO_CODE
} from '../constants/cartConstants'

export const cartReducer = (
  state = { cartItems: [], shippingAddress: {}, promoCodeObj: [], promoCodes: [] },
  action
) => {
  switch (action.type) {
    case CART_ADD_ITEM:
      const item = action.payload

      const existItem = state.cartItems.find((x) => x.variantId == item.variantId)

      if (existItem) {
        return {
          ...state,
          cartItems: state.cartItems.map((x) =>
            x.variantId == existItem.variantId ? item : x
          ),
        }
      } else {
        return {
          ...state,
          cartItems: [...state.cartItems, item],
        }
      }
    case CART_REMOVE_ITEM:
      return {
        ...state,
        cartItems: state.cartItems.filter((x) => x.variantId !== action.payload),
      }
    case CART_SAVE_SHIPPING_ADDRESS:
      return {
        ...state,
        shippingAddress: action.payload,
      }
      case 'CART_SAVE_STATUS_EMAIL':
         return {
           ...state,
           statusEmail: action.payload
         }

    case CART_SAVE_PAYMENT_METHOD:
      return {
        ...state,
        paymentMethod: action.payload,
      }
      case SAVE_PROMO_CODE:
      return {
        ...state,
        promoCode: action.payload,
      }
    case CART_CLEAR_ITEMS:
      return {
        ...state,
        cartItems: [],
      }
      case 'LOAD_SYNCED_DB':
      return {
        ...state,
        cartItems: action.payload,
      }
      case 'CART_UPDATE_GRANDTOTAL':
        return {
          ...state,
          grandTotal: action.payload
        }
        case 'UPDATE_CART_AFTER_LOGIN':
        return {
          ...state,
          cartItems: action.payload
        }
        case 'UPDATE_CART_QTY':
          let cartItems = state.cartItems
          for(let i = 0; i<cartItems.length; ++i){
            if(cartItems[i].variantId == action.payload.id){
              cartItems[i].qty = parseInt(cartItems[i].qty)+parseInt(action.payload.val)
            }
          }
          return {
            ...state,
            cartItems: cartItems
          }
          case 'ADD_PROMO_CODE':
            let code = [...state.promoCodes, action.payload]
           return {
             ...state,
             promoCodes: code
           }
           case 'ADD_PROMO_CODE_OBJ':
            let codeObj = [...state.promoCodeObj, action.payload]
           return {
             ...state,
             promoCodeObj: codeObj
           }
           case 'REMOVE_PROMO_CODE':
           return {
             ...state,
             promoCodes: state.promoCodes.filter((e)=>e != action.payload)
           }
           case 'REMOVE_PROMO_CODE_OBJ':           
           return {
             ...state,
             promoCodeObj: state.promoCodeObj.filter((e)=>e.code != action.payload)
           }
           case 'UPDATE_PROMO_DISCOUNT':           
           return {
             ...state,
             promoDiscount: action.payload
           }
           case 'UPDATE_SHIPPING_METHOD' :
             let data = [...state.cartItems]
             for(let i=0; i<data.length; ++i){
               if(data[i].variantId == action.payload.variant){
                 data[i].shipping_Obj = action.payload.shipping_id
               }
             }
           return {
             ...state,
             cartItems: data
           }
           case 'UPDATE_SHIPPING_RATE' :
            let sum = 0
            let cartData = [...state.cartItems]
            for(let i=0; i<cartData.length; ++i){
                sum += cartData[i].shippingCharge? cartData[i].shippingCharge : 0 
            }
            return {
              ...state,
              shippingCharge: sum
            }

            case 'UPDATE_INDIVIDUAL_SHIPPING_RATE' :
            let cartDataIndi = [...state.cartItems]
            for(let i=0; i<cartDataIndi.length; ++i){
                if(cartDataIndi[i].variantId == action.payload.variant){
                  cartDataIndi[i].shippingCharge = action.payload.amount 
                } 
            }
            return {
              ...state,
              cartItems: cartDataIndi
            }
          default:
            return state
  }
}
