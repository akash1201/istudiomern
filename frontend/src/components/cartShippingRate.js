import React, {useState, useEffect} from "react"
import { Row,Col,Dropdown, Alert } from "react-bootstrap"
import Loader from "../components/Loader"
import { useSelector, useDispatch } from "react-redux"
import Axios from "axios";
import { updateShippingMethod, updateIndividualShippingRate } from "../actions/cartActions"
import { propTypes } from "react-bootstrap/esm/Image";

const CartShippingRate = (params) => {

  let dispatch = useDispatch()
  const [loading, setLoading] = useState(()=>true)

  const cart = useSelector((state) => state.cart)
 
  const { shippingAddress } = cart
  const [rates, setRates] = useState(()=>[])
  const [providers, setProviders] = useState(()=>[])
  const [providersName, setProvidersName] = useState(()=>[]) 
  const [selectedObj, setSelectedObj] = useState({})
  const [danzShipping, setDanzShipping] = useState(()=>{})
  const [activeProvider, setActiveProvider] = useState(()=>'')
  const [method, setMethod] = useState(()=>'')

  useEffect(()=>{
     
    getRates()

  },[shippingAddress])

  const getRates = async () => {

    if(shippingAddress){

      if(params.fromPrintful){

        let address = {
          name: shippingAddress.FirstName+" "+shippingAddress.LastName,
          address1: shippingAddress.Address1,
          city: shippingAddress.City,
          state_code: shippingAddress.State,
          country_code: shippingAddress.Country,
          zip: shippingAddress.Zip,
          phone: shippingAddress.PhoneNo,
          email: shippingAddress.Email
        }
        let item = JSON.parse(params.product)

        let items = []

        if(item.variant.options.length != 0){
          items = [...items, {
            variant_id: item.vid,
            quantity: item.qty,
            files: [{
                  url: item.image,
            }],
            options: [{id : item.variant.options[0].id,
              value: item.variant.options[0].value}]
          }]
        }else{
          items = [...items, {
            variant_id: item.vid,
            quantity: item.qty,
            files: [{
                  url: item.image,
            }]
          }]
        }

        
        let response = null
        try{
          response = await Axios.post(`/api/printful/estimate-costs`, {
            address: address,
            product: items
          })
        }catch(err){
            setLoading(false)
        }
        setDanzShipping(response?response.data.costs:{})
        if(response){
          console.log(response.data)
          shippingMethod('standard')
          dispatch(updateIndividualShippingRate(response.data.costs.total,params.variantId))  
        }
       
        setLoading(false)
      }else{
        let to = {
          name: shippingAddress.FirstName+" "+shippingAddress.LastName,
          street1: shippingAddress.Address1,
          city: shippingAddress.City,
          state: shippingAddress.State,
          country: shippingAddress.Country,
          zip: shippingAddress.Zip,
          phone: shippingAddress.PhoneNo,
          email: shippingAddress.Email
        }
   
        let data = {
          destination: to,
          variant: params.variantId
        }
        let response = null;
        try{
          let buff = JSON.parse(params.product)
          response = await Axios.post(`/api/shippo/getRates/${params.vendor}/${buff.product}/${params.qty}`,data)
        }catch(err){
          setLoading(false)
        }
        
       
        setRates(response?response.data.rates:[])
        setSelectedObj(response?response.data.rates[0]:{})
        let data1 = []
        let pbuff = []
        if(response){
          for(let i=0; i<response.data.rates.length; ++i){
            if(!data1.includes(response.data.rates[i].provider)){
                   console.log(response.data.rates[i])
                  //  console.log()
                   let obj = {
                     provider: response.data.rates[i].provider,
                     image75: response.data.rates[i].provider_image_75,
                     image200: response.data.rates[i].provider_image_200,
                     amount: response.data.rates[i].amount,
                     duration: response.data.rates[i].estimated_days? response.data.rates[i].estimated_days:0,
                     service_level: response.data.rates[i].servicelevel.name
                   }
                   pbuff = [...pbuff, obj]
                   data1 = [...data1, response.data.rates[i].provider]
            }
          }
          console.log(pbuff)
          setProvidersName(data1)
          setProviders(pbuff)
          setLoading(false)
        }else{
          setLoading(false)
        }
       }
      }

    

  }
  
  const shippingMethod = (id) => {

    dispatch(updateShippingMethod(params.variantId, id))


  }

  const selectShippingMethod = (method,amount, name) => {
  
    setMethod(method)
    let data = null
   for(let i=0; i<rates.length; ++i){
       if(rates[i].object_id == method){
         data = rates[i]
       }
   }
   
   let data1 = [...providers]
   for(let i=0; i<data1.length; ++i){
        if((data1[i].provider == data.provider)){
         data1[i].amount = data.amount
         data1[i].duration = data.estimated_days? data.estimated_days:0
         data1[i].service_level = data.servicelevel.name
        }
   }
  setProviders(data1)

    setProvidersName(name)
    shippingMethod(method)
   dispatch(updateIndividualShippingRate(amount,params.variantId))
  }

  return (
    <div key={params.i}>
    
    <div style={{display: loading? 'initial':'none'}} >
      <Loader />
    </div>

    <div  style={{display: loading? 'none':'initial'}}>
    <Row className="grey-bg">
      <Col lg={12}>
        <h5>
          Shipping Methods<span>Shipping 1 of 2</span>
        </h5>
      </Col>

        {
          params.fromPrintful?
          danzShipping?
          <Col sm={6} md={4} lg={3} xl={4}>
          <div className="single-services mb-30 active">
          <div className="services-ion">
            <img src="/assets/img/logo.png" style={{width: '25%%'}}/>
          </div>
          <div className="services-cap">
            <p className="express">Standard Service</p>
            <p className="deliver">
              Standard Delivery <span>$ {danzShipping?parseFloat(danzShipping.total).toFixed(2):0}</span>
            </p>
          </div>
    
        </div>
        </Col>
        :
        <>
        <div style={{width: '300%'}}>
            <Alert variant={'danger'}>
            This product cannot be delivered at this address,please change your shipping address
            </Alert>
       </div>
       </>
          :
          providers.length != 0?
          providers.map((e,i)=>(
              <Col sm={6} md={4} lg={3} xl={4} key={i}>
                <div className={`single-services mb-30 ${providersName === e.provider?'active':''}`} style={{paddingBottom:'5%', height:'147px'}}>
                <div className="services-ion">
                  <img src={e.image200} style={{width: '29%'}}/>
                </div>
                <div className="services-cap">
                <p className="express">{e.service_level}</p>
                <p className="deliver">
                 {e.duration?` Delivered within ${e.duration} Day`:``} <span>$ {parseFloat(e.amount).toFixed(2)}</span>
                </p>
              </div>
              <Dropdown className="box-ship dropdown-box-ship" autoClose="inside">
                     <Dropdown.Toggle  id="dropdown-autoclose-inside" variant="box-ico"></Dropdown.Toggle>
         
                     <Dropdown.Menu className="dropdown-content" id='dropdown-expanded'>
                     <div className="ship-full">
                         <div className="box-content">

              {
                
                  rates.map((rate,i)=>(
                     rate.provider == e.provider?
                     <Dropdown.Item key={rate.object_id}>
                     <div className="media-box" >
                       <div className="media">
                         <div className="form-check-inline">
                           <label
                             className="form-check-label"
                             htmlFor="expressService_3"
                           >
                             <input
                               type="radio"
                               className="form-check-input"
                               id="expressService_3"
                               name={params.variantId}
                               onChange={(e)=>{setSelectedObj(rate); selectShippingMethod(e.target.value, rate.amount, rate.provider)}}
                               value={rate.object_id}
                               checked={rate.object_id === method? true : false}
                             />
                           </label>
                         </div>
                         <div className="wd-60">
                           <p className="mt-0 express">{rate.servicelevel.name}</p>
                           <p className="deliver">Delivered within {rate.estimated_days} Day </p>
                         </div>
                        
                         <div className="deliver-dro">
                           {" "}
                           <span>$ {parseFloat(rate.amount).toFixed(2)}</span>
                         </div>
                       </div>
              
           </div></Dropdown.Item>
                     :
                     <>
                     </>
                  ))
                } 
                </div>
               </div> 
           
         </Dropdown.Menu>
       </Dropdown>
          </div>
          </Col>
          ))
          : 
          <>
          <div style={{width: '300%'}}>
          <Alert variant={'danger'}>
              Item cannot be delivered, please change shipping address!
            </Alert>
          </div>
          </>
        }
    </Row>
    </div>
    </div>
  );
};
export default CartShippingRate;