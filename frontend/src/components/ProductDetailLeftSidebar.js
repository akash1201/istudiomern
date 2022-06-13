import Axios from 'axios'
import React, { useEffect , useState} from 'react'
import { Media } from 'react-bootstrap'
import {useHistory} from 'react-router-dom'

const ProductDetailLeftSidebar = ({category}) => {

    
let history = useHistory()
const [product, setProduct] = useState(()=>[])
const [featured, setFeatured] = useState(()=>[])

useEffect(()=>{

    Axios.get(`/api/products/vendor/top/${category}`)
    .then((res)=>{
       
        setProduct(res.data)
    })
    .catch((err)=>{
         console.log(err)
    })

    Axios.get(`/api/products/vendor/featured/${category}`)
    .then((res)=>{
       
        setFeatured(res.data)
    })
    .catch((err)=>{
         console.log(err)
    })

},[category])

const handleClick = (id) => {
history.push(`/product/${id}`)
}

  return (
     <>                          
        <div className="sidebar sidebar-main">
            <div className="topProducts">
                <h3>Top Product Deals</h3>
                {
                    product.map((e)=>(
                        <Media key={e._id}>
                        <img 
                        className="mr-3"
                        src={e.thumbnailImage}
                        alt="image"
                        style={{width: '20%'}}
                        />
                        <Media.Body>
                            <h5 className="mt-0"><a onClick={()=>{handleClick(e._id)}}>{e.name} 
                            {
                                e.offerPrice?
                                <span>({Math.ceil((((e.price-e.offerPrice)/e.price)*100))}% Off)</span>
                                :
                                <></>
                            }
                            </a></h5>
                            {
                                e.offerPrice?
                                <div className="product-price">
                                <span style={{marginRight: '1.5%'}}><ins>${e.offerPrice}</ins></span>
                                <span style={{marginLeft: '1.5%'}}><del>${e.price}</del> </span>                               
                                 </div>
                                 :
                                 <div className="product-price">
                                 <ins>${e.price}</ins>                             
                                  </div>
                            }
                           
                        </Media.Body>
                    </Media> 
                    ))
                }
            </div>
            <div className="topProducts">
                <h3>Featured Products</h3>
                {
                    featured.map((e)=>(
                        <Media key={e._id}>
                        <img 
                        className="mr-3"
                        src={e.thumbnailImage}
                        alt="Generic placeholder"
                        style={{width: '20%'}}
                        />
                        <Media.Body>
                            <h5 className="mt-0"><a onClick={()=>{handleClick(e._id)}}>{e.name} 
                            {
                                e.offerPrice?
                                <span>({Math.ceil((((e.price-e.offerPrice)/e.price)*100))}% Off)</span>
                                :
                                <></>
                            }
                            </a></h5>
                            {
                                e.offerPrice?
                                <div className="product-price">
                                 <span style={{marginRight: '1.5%'}}><ins>${e.offerPrice}</ins></span>
                                <span style={{marginLeft: '1.5%'}}><del>${e.price}</del> </span>                             
                                 </div>
                                 :
                                 <div className="product-price">
                                 <ins>${e.price}</ins>                             
                                  </div>
                            }
                           
                        </Media.Body>
                    </Media> 
                    ))
                }
                </div>
        </div>
    

    </>          


      
  )
}



export default ProductDetailLeftSidebar


