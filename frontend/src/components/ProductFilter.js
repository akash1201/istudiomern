import React, {useState, useEffect} from 'react'
import {Row, Col } from 'react-bootstrap'
import {  useSelector } from 'react-redux'
import axios from 'axios'
import { TreeSelect } from 'antd';




const ProductFilter = ({filterType, setFilterType, setCategory, category, isDanzMerch, store, vendorId}) => {

    const [active, setActive] = useState(false);
    const userLogin = useSelector((state) => state.userLogin)
        const { userInfo } = userLogin

    const [treeData, setTreeData] = useState(()=>[])

    const [cate, setCate] = useState(()=>undefined)
    const [storeName, setStoreName] = useState(()=>'')
        

    useEffect(()=>{


          axios.get(
            `/api/category/getall`
          )
          .then((res)=>{
                setTreeData((old)=>[...old,...res.data.data])

          })
          .catch((err)=>{
              console.log(err)
          })

          if(store){
               axios.get(`/api/users/vendor/store-name/${vendorId}`)
               .then((res)=>{
                   console.log(res.data)
                   setStoreName(res.data.storeName)
               })
               .catch((err)=>{
                   console.log(err)
               })
          }
 
    },[])

    const changeActive = (value) =>{      
        setFilterType(value)
    } 


  return (
        <div className="toolbar-products">            
            <div className="toolbar-category-listing">
                <h4 className="heading">Best Sellers <span>{store?`${storeName}`:isDanzMerch?"istudio Merchandise":"Products"}</span></h4>
                {

                }
               {
                   isDanzMerch?
                   <></>
                   :
                   
                   <div className="poroduct-listingCategory">
                   <ul>                  
                       <li><a onClick={()=>{changeActive('latest')}} className={filterType == 'latest'?'active':''}>Latest Release</a></li>
                       <li><a onClick={()=>{changeActive('featured')}} className={filterType == 'featured'?'active':''}>Featured</a></li>
                       <li><a onClick={()=>{changeActive('popular')}} className={filterType == 'popular'?'active':''}>Popular</a></li>
                       <li><a onClick={()=>{changeActive('special')}}  className={filterType == 'special'?'active':''}>Special Deals</a></li>
                   </ul>
               </div>
               }
            </div>
        </div>
  )

}



export default ProductFilter


