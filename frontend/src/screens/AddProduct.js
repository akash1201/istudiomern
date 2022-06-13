import React, {useEffect, useState, Fragment} from "react"
import { useDispatch, useSelector } from 'react-redux'
import { Container, Row, Col, Form, Button, Modal, Tabs, Tab,Spinner, Image, OverlayTrigger, Tooltip } from 'react-bootstrap'
import axios from "axios"
import Message from '../components/Message'
import SideBar from "../components/Sidebar"

import { Popconfirm, Select, Table, Space,TreeSelect } from 'antd'



const { Option } = Select;


const AddProduct = ({history}) => {
 
          const dispatch = useDispatch()
          const userLogin = useSelector((state) => state.userLogin)
          const { userInfo } = userLogin

          const [addedSuccess, setAddedSuccess]= useState(()=>false)
          const [addedError, setAddedError] = useState(()=>false)
          const [message1, setMessage1] = useState(()=>'')

          useEffect(() => {
                    
                    if (!userInfo || !userInfo.userType == 'admin') {
                      history.push('/login')
                    }
                    
                  }, [
                    dispatch,
                    history,
                    userInfo
                  ])

                   useEffect(()=>{

                    window.scrollTo(0,0)

                    const config = {
                      headers: {
                        Authorization: `Bearer ${userInfo.token}`,
                      },
                    }

                    axios.get(
                      `/api/category/getall`,config
                    )
                    .then((res)=>{
                        
                      getCategories(res.data.data)
                      let allSubCats = res.data.data
      
                      //For Edit...
                      if(localStorage.getItem('isUpdate') == 'true'){

                        setLoading(true)
                        let id = localStorage.getItem('id')
                        axios.get(`/api/products/${id}`).then((res)=>{
              
                              setName(res.data.name)
                              setBrand(res.data.brand)
                              setProductCategory(res.data.category)
                              setProductSubCategory(res.data.subcategory)

                              for(let i=0;i<allSubCats.length; ++i){
                                if(allSubCats[i]._id == res.data.category){
                                  setSubCategories(allSubCats[i].children)
                                }
                              }
                             
                              setBasePrice(res.data.price)
                              setOfferPrice(res.data.offerPrice)
                              setBaseQty(res.data.qty)
                              setVariants(res.data.availableVariants)
                              setThumbnailImageName(res.data.thumbnailImage)
                              setSlug(res.data.slug)
                              setParentId(res.data._id)
                              setDescription(res.data.description)
                              setFeatured(res.data.featured)
                              setHasReturnOption(res.data.hasReturnOption?res.data.hasReturnOption:false)
                              setReturnDays(res.data.returnDays?res.data.returnDays: 7)
                              setLoading(false)
                              setHeight(res.data.dimensions.height)
                              setWeight(res.data.dimensions.weight)
                              setLength(res.data.dimensions.length)
                              setWidth(res.data.dimensions.weight)
                              setValues(res.data.specs.length !=0? res.data.specs : [{name: '', value: ''}])
                        })
                        .catch((e)=>{
                          console.log(e)
                        })
                        
    
                        axios.get(`/api/products/variants/${id}`)
                        .then((res)=>{
                          setAllVariant(res.data)
                        })
                        .catch((err)=>{
                          console.log(err)
                        })
                      }
                
                    })
                    .catch((err)=>{
                      console.log(err)
                    })

                    axios.get('/api/variants/all', config)
                    .then((res)=>{
                      setVariantList(res.data.data)
                    })
                    .catch((err)=>{
                      console.log(err)
                    })
 
                   },[])

                  
                  const getCategories = (arr) => {

                    for(let i = 0; i<arr.length; ++i){
                
                      setCategories((old)=>[...old, arr[i]]);
                      getCategories(arr[i].children);
                
                    }
                    return; 
                  }

                  const subCats = (arr) => {
                    for(let i = 0; i<arr.length; ++i){
                      setSubCategories((old)=>[...old, ...arr[i].children])
                      subCats(arr[i].children)
                    }
                  }

                  const [name, setName] = useState(()=>"")
                  const [productCategory, setProductCategory] = useState(()=>"")
                  const [productSubCategory, setProductSubCategory] = useState(()=>[])
                  const [brand, setBrand] = useState(()=>"")
                  const [thumbnailImage, setThumbnailImage] = useState(()=>null)
                  const [thumbnailImageName, setThumbnailImageName] = useState(()=>"")
                  const [slug, setSlug] = useState(()=>"")
                  const [desctiption, setDescription] = useState(()=>"")
                  const [basePrice, setBasePrice] = useState(()=>"")
                  const [baseQty, setBaseQty] = useState(()=>"")
                  const [parentId, setParentId] = useState(()=>"")
                  const [offerPrice, setOfferPrice] = useState(()=>"")
                  const [featured, setFeatured] = useState(()=>false)

                  const [height, setHeight] = useState(()=>'')
                  const [weight, setWeight] = useState(()=>'')
                  const [length, setLength] = useState(()=>'')
                  const [width, setWidth] = useState(()=>'')

                  const [hasReturnOption, setHasReturnOption] = useState(()=>false)
                  const [returnDays, setReturnDays] = useState(()=>7)

                  const [activeForm, setActiveForm] = useState(()=>"generaldescription")
                  //can be: 1.generaldescription  2.variants

                  const [categories, setCategories] = useState(()=>[])
                  const [subCategories, setSubCategories] = useState(()=>[])

                  const [error, setError] = useState(()=>"")
                  const [success, setSuccess] = useState(()=>"")
   
                  //variant management
                    const [variants, setVariants] = useState(()=>[])
                    const [variantList, setVariantList] = useState(()=>[])
                    const [bufferVariants, setBufferVariants] = useState(()=>[])

                    
                    const [allVariant, setAllVariant] = useState(()=>[])  
                    const [price, setPrice] = useState(()=>"")
                    const [qty, setQty] = useState(()=>"")
                    const [images, setImages] = useState(()=>[])
                    const [imagesName, setImagesname] = useState(()=>"")
                    const [variantOfferPrice, setVariantOfferPrice] = useState(()=>"")

                    const [loading, setLoading] = useState(()=>false)

                    const [modal, setModal] = useState(()=>false)
                    const [msg, setMsg] = useState(()=>"") 

                    const [variantObject, setVariantObject] = useState({})
                    const [availableVariantOption, setAvailableVariantOption] = useState({})

                    const [isUpdate, setIsUpdate] = useState(()=>false)

                    const [values, setValues] = useState(()=>[{
                      name: '',
                      value: ''
                    }])

                    const handleValueInput = (value, i, field) => {
    
                      let val = [...values];
                      val[i][field] = value;
                      setValues(val)
                  
                    }
                  
                    const addFeild = () => {
                  
                      let val = [...values];
                      val.push({
                        name: '',
                        value: '',

                      })
                  
                      setValues(val);
                    }

                    const removeField = (index) => {

                      let val = [];
                      for(let i =0; i<values.length; ++i){
                        if(i != index){
                              val.push(values[i])
                        }
                      }
                  setValues(val)
                    }

                    useEffect(()=>{
                      let data = [], id = []
                      
                      for(let i=0; i<variantList.length; ++i){
                         if(variantList[i].categories.includes(productCategory)){
                           if(!id.includes(variantList[i]._id)){
                               id = [...id, variantList[i]._id]
                               data = [...data, variantList[i]]
                           }
                         }
                      }
                      for(let i=0; i<variantList.length; ++i){
                        for(let j=0; j<productSubCategory.length; ++j){
                          if(variantList[i].categories.includes(productSubCategory[j])){
                            if(!id.includes(variantList[i]._id)){
                                id = [...id, variantList[i]._id]
                                data = [...data, variantList[i]]
                            }
                          }
                        }
                      }
                      setBufferVariants(data)
                    },[productCategory, productSubCategory,variantList])
           

                    if(localStorage.getItem('isLoading') == true){
                      setLoading(true)
                    }

                  const onCategoryChange = (e) => {
                    
                    setProductCategory(e)
                    setSubCategories([])
                    setProductSubCategory([]) 

                    for(let i = 0; i<categories.length; ++i){
                      if(e == categories[i]._id){
                        setSubCategories(categories[i].children)
                      }
                    }
                  }

                  const getChildrens = (id) => {

                    for(let i =0; i<categories.length; ++i){
                      if(id == categories[i].parentid){
                           setSubCategories((old)=>[...old,categories[i]])
                           getChildrens(categories[i]._id)
                      }
                    }

                  }

                  const validateGeneralProductDetails = (e) => {

                    e.preventDefault();

                    if(name.trim() == ""){
                         setError("Enter Product Name!!")
                         setTimeout(clearMsg, 3000)
                    }
                   else if(parseFloat(basePrice)<parseFloat(offerPrice)){
                      setError("Special Price Cannot Be More Than Base Price!!")
                      setTimeout(clearMsg, 3000)
                    }else if(hasReturnOption && returnDays<1){
                      setError("Return Period should be more than 1 day.")
                      setTimeout(clearMsg, 3000)
                    }
                    else if(localStorage.getItem('isUpdate') == 'true'){
                      updateBaseProduct(e)
                    }
                   else{
                    if(localStorage.getItem('isUpdate')=='false'){
                      if(thumbnailImage == null){
                        setError("Choose a thumbnail image!!")
                        setTimeout(clearMsg, 3000)
                        
                      }else{
                        setActiveForm('category')
                      }
                    }
                       
                    }
                     

                  }

                  const setTemplate = (e) => {
                       let obj = {}
                    for(let i =0; i<e.length; ++i){
                        obj[e[i]] = ''
                    }
                    setVariantObject(obj)
                  }

                  const clearMsg = () => {

                    setSuccess("")
                    setError("")
                    setMsg("")
                    setAddedSuccess(false)
                    setAddedError(false)
                    setMessage1('')

                  }

                  const updateVariantObject = (attr, value) => {
                    let obj = {...variantObject};
                    obj[attr] = value;
                    setVariantObject(obj);
                  }

                  const addProductVariant = async (e) => {
                    e.preventDefault();
                    
                    for(let i=0; i<variants.length; ++i){
                      if(!variantObject[variants[i]] || variantObject[variants[i]].trim()==''){                      
                        setMsg(`Please Select a ${variants[i]}`)
                        setTimeout(()=>{setMsg("")}, 3000)
                        return;
                      }
                    }
                    if(images.length == 0){
                      setMsg(`Upload Product Images`)
                      setTimeout(()=>{setMsg("")}, 3000)
                      return;
                    }
                    if(!price && price<=0){
                      setMsg(`Enter product price`)
                      setTimeout(()=>{setMsg("")}, 3000)
                      return;
                    }
                    if(variantOfferPrice){
                      if(parseFloat(variantOfferPrice)>parseFloat(price)){
                        setMsg(`Offer Price cannot be more than Base price`)
                        setTimeout(()=>{setMsg("")}, 3000)
                        return;
                      }
                    }
                    if(variantOfferPrice && parseFloat(variantOfferPrice)<=0){
                      setMsg(`Offer Price cannot be less than zero`)
                      setTimeout(()=>{setMsg("")}, 3000)
                      return;
                    }
                    if(!qty){
                      setMsg(`Enter variant quantity`)
                      setTimeout(()=>{setMsg("")}, 3000)
                      return;
                    }
                    if(qty<0){
                      setMsg(`Quantity should be greater than zero`)
                      setTimeout(()=>{setMsg("")}, 3000)
                      return;
                    }

                    setLoading(true)
                    let pname = name;
                    let obj = {...variantObject}
                    // obj.variantname = name

                    for(let i = 0; i<variants.length; ++i){
                      pname += " "+obj[variants[i]]
                    }

                    let exists = false;


                    for(let i = 0; i<allVariant.length; ++i){
                      if(JSON.stringify(allVariant[i].variant) === JSON.stringify(variantObject)){
                        exists = true;
                        setMsg("Variant already added!!");
                        setTimeout(()=>{setMsg("")},3000)
                        break;
                      }
                    }

                    if(parseFloat(price)<parseFloat(variantOfferPrice)){
                        setMsg("Special Price Cannot Be More Than Base Price!!")
                        setLoading(false)
                        setTimeout(()=>{setMsg("")},3000)
                    }
                    else if(exists == false){
                      let data = allVariant;

                      //Image Upload section begins.....
                      let imageData = [];
                        for(let i = 0; i<images.length; ++i){
                          
                          const formData = new FormData()
                          formData.append('image', images[i])

                          try{
                            const config = {
                              headers: {
                                'Content-Type': 'multipart/form-data',
                              },
                            }
  
  
                            const { data } = await axios.post('/api/upload', formData, config)
                              
                            imageData.push(data)
                          }
                          catch(err){
                             console.log(err)
                          }
                          

                        }

                      //image upload section ends.....

                      let dataObj = {
                        user: userInfo._id,
                        parentid: parentId,
                        name: pname,
                        images: imageData,
                        brand: brand,
                        category: productCategory,
                        subcategory: productSubCategory,
                        slug: pname.trim().replaceAll(" ", "-"),
                        description: desctiption,
                        availableVariants: variants,
                        price: price,
                        offerPrice: variantOfferPrice?variantOfferPrice:0,
                        qty: qty,
                        variant: variantObject
                      }

                      axios.post('/api/products',dataObj, {
                        headers: {
                          Authorization: `Bearer ${userInfo.token}`
                        },
                      })
                      .then((res)=>{
                        
                     setMessage1('Variant Added')
                     setAddedSuccess(true)
                     setTimeout(()=>{clearMsg()}, 3000)
                        data = [...data, res.data]
                        setAllVariant(data)
                        availableVariantObj(data)
                        
                         axios.put(`/api/products/updateActive/${parentId}`,{
                            status: true
                          }).
                          then((res)=>{
                            console.log(res)
                          })
                          .catch((err)=>{
                            setError("Something went wrong!")
                            setTimeout(clearMsg, 3000)
                            setLoading(false)
                            setModal(false)
                            console.log(err)
                          })            
                        setVariantObject({})                      
                        setPrice(0)
                        setVariantOfferPrice(0)
                        setQty(0)
                        setImages([])
                        setImagesname([])

                        setSuccess("Variant Added!")
                        setTimeout(clearMsg, 3000)
                        setLoading(false)
                        setModal(false)
                      })
                      .catch((err)=>{
                        setMessage1('Cannot add variant')
                        setAddedError(true)
                        setTimeout(clearMsg, 3000)
                        setLoading(false)
                        setModal(false)
                        console.log(err)
                      })
                      
                    }else{
                      setLoading(false)
                    }  
                  }

                  const availableVariantObj = async (arr) => {
                    let obj = {}

                    for(let i = 0; i<variants.length; ++i){
                      obj[variants[i]] = []
                    }
                    for(let i = 0; i<variants.length; ++i){
                      
                      for(let j = 0; j<arr.length; ++j){
                        
                        if(!(obj[variants[i]].includes(arr[j].variant[variants[i]]))){
                          obj[variants[i]].push(arr[j].variant[variants[i]])
                        }

                      }

                    }
                    console.log(obj)
                    console.log(localStorage.getItem('id'))
                   setAvailableVariantOption(obj)
                   //Update Base Product Here....
                  await  axios.put(`/api/products/updateAvailableOptions/${localStorage.getItem('id')}`, obj)

                  }

                  const editProductVariant = (e) => {
                    e.preventDefault();

                    for(let i=0; i<variants.length; ++i){
                      if(!variantObject[variants[i]] || variantObject[variants[i]].trim()==''){                      
                        setMsg(`Please Select a ${variants[i]}`)
                        setTimeout(()=>{setMsg("")}, 3000)
                        return;
                      }
                    }
                    if(!price && price<=0){
                      setMsg(`Enter product price`)
                      setTimeout(()=>{setMsg("")}, 3000)
                      return;
                    }
                    if(variantOfferPrice){
                      if(parseFloat(variantOfferPrice)>parseFloat(price)){
                        setMsg(`Offer Price cannot be more than Base price`)
                        setTimeout(()=>{setMsg("")}, 3000)
                        return;
                      }
                    }
                    if(variantOfferPrice && parseFloat(variantOfferPrice)<=0){
                      setMsg(`Offer Price cannot be less than zero`)
                      setTimeout(()=>{setMsg("")}, 3000)
                      return;
                    }
                    if(!qty){
                      setMsg(`Enter variant quantity`)
                      setTimeout(()=>{setMsg("")}, 3000)
                      return;
                    }
                    if(qty<0){
                      setMsg(`Quantity should be greater than zero`)
                      setTimeout(()=>{setMsg("")}, 3000)
                      return;
                    }


                    let pname = name;
                    let obj = {...variantObject}
             
                    let exists = false;

                    setLoading(true)

                    let productId = localStorage.getItem('productId')

                    for(let i = 0; i<variants.length; ++i){
                      pname += " "+obj[variants[i]]
                    }
                    if(parseFloat(price)<parseFloat(variantOfferPrice)){

                      setMsg("Special Price Cannot Be More Than Base Price!!")
                      setLoading(false)
                      setTimeout(()=>{setMsg("")}, 3000)

                    }
                    else if(exists == false){
                        let dataObj = {
                          user: userInfo._id,
                          parentid: parentId,
                          name: pname,
                          brand: brand,
                          category: productCategory,
                          subcategory: productSubCategory,
                          slug: pname.trim().replaceAll(" ", "-"),
                          description: desctiption,
                          availableVariants: variants,
                          price: price,
                          offerPrice: variantOfferPrice?variantOfferPrice: 0,
                          qty: qty,
                          variant: variantObject
                        }

                        axios.put(`/api/products/${productId}`,dataObj, {
                          headers: {
                            Authorization: `Bearer ${userInfo.token}`
                          },
                        })
                        .then((res)=>{
                          
                          let data = [];
                          console.log(res.data)
    
                          for(let i = 0; i<allVariant.length; ++i){
                            if(allVariant[i]._id != productId){
                              data.push(allVariant[i])
                            }
                          }
                          
                          setVariantObject({})                      
                          setPrice(0)
                          setVariantOfferPrice(0)
                          setQty(0)
                          setImages([])
                          setImagesname([])
                          data.push(res.data)
                          availableVariantObj(data)
                          setSuccess("Update Successful!!")
                          setTimeout(clearMsg, 3000)
                          setAllVariant(data)
                          setLoading(false)
                          setModal(false)
    
                        })
                        .catch((err)=>{
                          console.log(err)
                        })
                      }else{
                        setLoading(false)
                      }

                  }
                   //API calls
                    const saveBaseProduct = async (e) => {
                       e.preventDefault()

                       if(!name || name.trim() == ''){
                        setMsg("Enter Product name")
                        setTimeout(clearMsg, 3000)
                        setActiveForm('generaldescription')
                        return
                       }
                       if(!thumbnailImage){
                        setMsg("Upload a thumbnail Image")
                        setTimeout(clearMsg, 3000)
                        setActiveForm('generaldescription')
                        return
                       }
                       if(hasReturnOption && returnDays<1){
                        setMsg("Return Period must be more than 1 day")
                        setTimeout(clearMsg, 3000)
                        setActiveForm('generaldescription')
                        return
                       }
                       if(((thumbnailImage.name.split('.')[1].toLowerCase()) != 'jpg') && ((thumbnailImage.name.split('.')[1].toLowerCase()) != 'jpeg') && ((thumbnailImage.name.split('.')[1].toLowerCase())!= 'png')){
                        setMsg("Upload a valid thumbnail Image of JPG, JPEG or PNG")
                        setTimeout(clearMsg, 3000)
                        setActiveForm('generaldescription')
                        return
                       }
                       if(!basePrice || basePrice<=0){
                        setMsg("Enter a base price")
                        setTimeout(clearMsg, 3000)
                        setActiveForm('generaldescription')
                        return
                       }
                       if(offerPrice && parseFloat(offerPrice)>parseFloat(basePrice)){
                        setMsg("Offer Price should be less than base price")
                        setTimeout(clearMsg, 3000)
                        setActiveForm('generaldescription')
                        return
                       }
                       if(!baseQty || baseQty<=0){
                        setMsg("Enter base qty")
                        setTimeout(clearMsg, 3000)
                        setActiveForm('generaldescription')
                        return
                       }
                       
                       if(!productCategory || productCategory.trim() == ''){
                        setMsg("Choose Product Category")
                        setTimeout(clearMsg, 3000)
                        setActiveForm('category')
                        return
                       }
                       if(!height || !weight || !width || !length){
                        setMsg('Enter valid dimensions')
                       setTimeout(clearMsg, 3000)
                       setActiveForm('productDimension')
                       return
                      }

                      if(weight){
                       if(weight<=0 || weight>=30){
                         setMsg('Enter a valid weight between 0.1-30 lbs')
                         setTimeout(()=>{setMsg('')}, 2500)
                         setActiveForm('productDimension')
                         return
                       }
                     }
                     
                     if(height){
                       if(height<=0 || height>=30){
                         setMsg('Enter a valid height between 0.1-30 inches')
                         setTimeout(()=>{setMsg('')}, 2500)
                         setActiveForm('productDimension')
                         return
                       }
                     }
                     if(length){
                       if(length<=0 || length>=30){
                         setMsg('Enter a valid length between 0.1-30 inches')
                         setTimeout(()=>{setMsg('')}, 2500)
                         setActiveForm('productDimension')
                         return
                       }
                     }
                     if(width){
                       if(width<=0 || width>=20){
                         setMsg('Enter a valid width between 0.1-20 inches')
                         setTimeout(()=>{setMsg('')}, 2500)
                         setActiveForm('productDimension')
                         return
                       }            
                     }
                   
                      if(variants.length == 0){
                        setMsg('Choose Product Variants attribute')
                        setTimeout(clearMsg, 3000)
                        setActiveForm('variants')
                        return
                      }
                       const formData = new FormData()
                        formData.append('image', thumbnailImage)

                        try {
                          const config = {
                            headers: {
                              'Content-Type': 'multipart/form-data',
                            },
                          }


                          const { data } = await axios.post('/api/upload', formData, config)

                          const dataObj = {
                            user: userInfo._id,
                            parentid: 'parent',
                            name: name,
                            brand: brand,
                            category: productCategory,
                            subcategory: productSubCategory,
                            thumbnailImage: data,
                            slug: slug,
                            description: desctiption,
                            availableVariants: variants  ,
                            price: basePrice,
                            qty: baseQty,
                            offerPrice: offerPrice? offerPrice:0,
                            variant: {}, 
                            hasReturnOption: hasReturnOption,
                            returnDays: hasReturnOption? returnDays : 0,
                            featured: featured,
                            specs: values,
                            dimensions: {
                              height: height,
                              weight: weight,
                              length: length,
                              width: width
                            }
                          }
                          axios.post('/api/products',dataObj, {
                            headers: {
                              Authorization: `Bearer ${userInfo.token}`
                            },
                          })
                          .then((res)=>{
                            setParentId(res.data._id)
                            localStorage.setItem('id',res.data._id)
                             setActiveForm('createvariant')
                          })
                          .catch((err)=>{
                            setError("Something went wrong!")
                            setTimeout(clearMsg, 2000)
                            console.log(err)
                          })

                        }catch(err){
                          console.log(err)
                        }
      

                     

                    }
                    
                    const updateBaseProduct = async (e) => {

                      e.preventDefault()

                      if(!name || name.trim() == ''){
                        setMsg("Enter Product name")
                        setTimeout(clearMsg, 3000)
                        setActiveForm('generaldescription')
                        return
                       }
                       if(!basePrice || basePrice<=0){
                        setMsg("Enter a base price")
                        setTimeout(clearMsg, 3000)
                        setActiveForm('generaldescription')
                        return
                       }
                       if(!baseQty || baseQty<=0){
                        setMsg("Enter base qty")
                        setTimeout(clearMsg, 3000)
                        setActiveForm('generaldescription')
                        return
                       }
                       if(hasReturnOption && returnDays<1){
                        setMsg("Return Period must be more than 1 day")
                        setTimeout(clearMsg, 3000)
                        setActiveForm('generaldescription')
                        return
                       }
                       if(!productCategory || productCategory.trim() == ''){
                        setMsg("Choose Product Category")
                        setTimeout(clearMsg, 3000)
                        setActiveForm('category')
                        return
                       }

                       if(!height || !weight || !width || !length){
                         setMsg('Enter valid dimensions')
                        setTimeout(clearMsg, 3000)
                        setActiveForm('productDimension')
                        return
                       }

                       if(weight){
                        if(weight<=0 || weight>=30){
                          setMsg('Enter a valid weight between 0.1-30 lbs')
                          setTimeout(()=>{setMsg('')}, 2500)
                          setActiveForm('productDimension')
                          return
                        }
                      }
                      
                      if(height){
                        if(height<=0 || height>=30){
                          setMsg('Enter a valid height between 0.1-30 inches')
                          setTimeout(()=>{setMsg('')}, 2500)
                          setActiveForm('productDimension')
                          return
                        }
                      }
                      if(length){
                        if(length<=0 || length>=30){
                          setMsg('Enter a valid length between 0.1-30 inches')
                          setTimeout(()=>{setMsg('')}, 2500)
                          setActiveForm('productDimension')
                          return
                        }
                      }
                      if(width){
                        if(width<=0 || width>=20){
                          setMsg('Enter a valid width between 0.1-20 inches')
                          setTimeout(()=>{setMsg('')}, 2500)
                          setActiveForm('productDimension')
                          return
                        }            
                      }

                      if(variants.length == 0){
                        setMsg('Choose Product Variants attribute')
                        setTimeout(clearMsg, 3000)
                        setActiveForm('variants')
                        return
                      }
         
                      let image = thumbnailImageName;

                      //if the image is changed
                      if(thumbnailImage != null){
                        if(((thumbnailImage.name.split('.')[1].toLowerCase()) != 'jpg') && ((thumbnailImage.name.split('.')[1].toLowerCase()) != 'jpeg') && ((thumbnailImage.name.split('.')[1].toLowerCase())!= 'png')){
                          setMsg("Upload a valid thumbnail Image of JPG, JPEG or PNG")
                          setTimeout(clearMsg, 3000)
                          setActiveForm('generaldescription')
                          return
                         }
                        const formData = new FormData()
                        formData.append('image', thumbnailImage)
  
                        try {
                          const config = {
                            headers: {
                              'Content-Type': 'multipart/form-data',
                            },
                          }
                          const { data } = await axios.post('/api/upload', formData, config)
                          image = data;
                          setThumbnailImage(null)
                          setThumbnailImageName(data)
                   
                    }
                    catch(err){
                      console.log(err)
                    }
                    }
                      
                    const dataObj = {
                      user: userInfo._id,
                      parentid: 'parent',
                      name: name,
                      brand: brand,
                      category: productCategory,
                      subcategory: productSubCategory,
                      thumbnailImage: image,
                      slug: slug,
                      description: desctiption,
                      availableVariants: variants,
                      offerPrice: offerPrice?offerPrice:0,
                      price: basePrice,
                      qty: baseQty,
                      specs: values,
                      hasReturnOption: hasReturnOption,
                      returnDays: hasReturnOption? returnDays : 0,
                      variant: {}, 
                      featured: featured,
                      dimensions: {
                        height: height,
                        weight: weight,
                        length: length,
                        width: width
                      }                
                    }
                    let id = localStorage.getItem('id')
                    setLoading(true)
                    axios.put(`/api/products/${id}`,dataObj, {
                      headers: {
                        Authorization: `Bearer ${userInfo.token}`
                      },
                    })
                    .then((res)=>{
                      setLoading(false)
                      setSuccess("Updated!!")
                      setTimeout(clearMsg, 2000)
                    })
                    .catch((err)=>{
                      console.log(err)
                    })



                    }
                    //Delete and edit

                    const deleteVariant = (id) => {
                      setLoading(true)
                      let data = [];

                      axios.delete(`/api/products/${id}`,{
                        headers: {
                          Authorization: `Bearer ${userInfo.token}`
                        },
                      })
                      .then((res)=>{
                          for(let i = 0; i<allVariant.length; ++i){
                            if(allVariant[i]._id != id){
                              data.push(allVariant[i])
                            }
                          }
                          setAllVariant(data)
                          availableVariantObj(data)
                          setSuccess("Deleted Succesfully!")
                          if(data.length == 0){
                            axios.put(`/api/products/updateActive/${parentId}`,{
                              status: false
                            }).then((res)=>{
                              console.log(res)
                            })
                            .catch((err)=>{
                              console.log(err)
                            })
                          }
                          setLoading(false)
                          setTimeout(clearMsg, 3000)
                      })
                      .catch((e)=>{

                      })

                    }

                    const editVariant = (id) => {
                      
                      let obj;
                      localStorage.setItem("productId", id)

                      for(let i = 0; i<allVariant.length; ++i){
                        if(allVariant[i]._id == id){
                          obj = allVariant[i].variant
                          setPrice( allVariant[i].price)
                          setImagesname(allVariant[i].images)
                          setQty( allVariant[i].qty)
                          setVariantOfferPrice(allVariant[i].offerPrice)
                          setImages(null)
                        }
                      }

                      // for(let i = 0; i<variants.length; ++i){
                      //   stateObj[variants[i]] = obj[variants[i]]
                      // }

                      setVariantObject(obj)
                      setModal(true)

                    }
                    
                  //Components

                  const generalProductDetails = () => {
                    return (<>
                     <Form >
                           {error && <Message variant='danger'>{error}</Message>}
                           {success && <Message>{success}</Message>}
                           {msg && <Message variant='danger'>{msg}</Message>}
                           <div>
                           <Container style={{display: loading?'initial':'none'}}>
                                <Row>
                                   <Col className="d-flex justify-content-center"><Spinner animation="grow" /></Col>
                                   <Col className="d-flex justify-content-center"><Spinner animation="grow" /></Col>
                                   <Col className="d-flex justify-content-center"><Spinner animation="grow" /></Col>
                                 </Row>
                           </Container>
                           </div>

                           <div  style={{display: loading?'none':'initial'}}>
                           <Container>
                                       <Row style={{paddingTop: "2%"}}>
                                         <Col md={6}><h4>General Product Details</h4></Col>
                                       </Row>
                                        <Row>
                                           <Col md={6}>
                                           <Form.Group controlId='name'>
                                            <Form.Label>Product Name <sup style={{fontSize: "90%", color: "red"}}>*</sup></Form.Label>
                                            <Form.Control
                                              type='name'
                                              placeholder='Product Name'
                                              value={name}
                                              onChange={(e) => setName(e.target.value)}
                                              onBlur={()=>{setSlug(name.trim().replaceAll(" ", "-"))}}
                                            ></Form.Control>
                                          </Form.Group>
                                           </Col>

                                           <Col md={6}>
                                           <Form.Group controlId='name'>
                                            <Form.Label>Product Brand</Form.Label>
                                            <Form.Control
                                              type='name'
                                              placeholder='Product Brand'
                                              value={brand}
                                              onChange={(e) => setBrand(e.target.value)}
                                            ></Form.Control>
                                          </Form.Group>
                                           </Col>
                                        </Row>
                                        
                                      

                                        <Row>
                                          <Col md={6}>

                                          <Form.Group controlId='name'>
                                            <Form.Label>Total Quantity <sup style={{fontSize: "90%", color: "red"}}>*</sup></Form.Label>
                                            <Form.Control
                                              type='number'
                                              placeholder='Total Quantity'
                                              value={baseQty}
                                              onChange={(e)=>{setBaseQty(e.target.value)}}
                                            ></Form.Control>
                                            </Form.Group>
                                          </Col>
                                          <Col md={6}>
                                          <Form.Group controlId='name'>
                                            <Form.Label>Slug</Form.Label><OverlayTrigger
                                                                                      placement="top"
                                                                                      delay={{ show: 250, hide: 400 }}
                                                                                      overlay={<Tooltip id="button-tooltip">{`Product URL, you'll be assigned a slug automatically if you leave the field empty`}</Tooltip>}
                                                                                    >
                                                                                      <Button style={{background:'none', color: '#2aa8f2', paddingTop: '0px', paddingBottom: '0px'}}><i className="far fa-question-circle"></i></Button>
                                                                                    </OverlayTrigger>
                                            <Form.Control
                                              type='name'
                                              placeholder='Slug'
                                              value={slug}
                                              onChange={(e)=>{setSlug(e.target.value)}}
                                            ></Form.Control>
                                            </Form.Group>
                                          </Col>
                                        </Row>

                                        <Row>
                                          <Col md={6}>
                                          <Form.Group controlId='name'>
                                            <Form.Label>Original Price <sup style={{fontSize: "90%", color: "red"}}>*</sup></Form.Label>
                                            <Form.Control
                                              type='number'
                                              placeholder='Original Price'
                                              value={basePrice}
                                              max={1000000000}
                                              onChange={(e)=>{setBasePrice(e.target.value)}}
                                            ></Form.Control>
                                            </Form.Group>
                                          </Col>
                                          <Col md={6}>
                                          <Form.Group controlId='name'>
                                            <Form.Label>Discounted Price</Form.Label><OverlayTrigger
                                                                                      placement="top"
                                                                                      delay={{ show: 250, hide: 400 }}
                                                                                      overlay={<Tooltip id="button-tooltip">{`Amount Off on MRP, leave the field empty if there's no discount`}</Tooltip>}
                                                                                    >
                                                                                      <Button style={{background:'none', color: '#2aa8f2',  paddingTop: '0px', paddingBottom: '0px'}}><i className="far fa-question-circle"></i></Button>
                                                                                    </OverlayTrigger>
                                            <Form.Control type='number' max={1000000000} placeholder='Discounted Price' value={offerPrice} onChange={(e)=>{
                                              setOfferPrice(e.target.value)}}/>
                                            </Form.Group>
                                          </Col>
                                        </Row>

                                        <Row>
                                          <Col md={6}>
                                            <Form.Group controlId='name'>
                                              <Form.Label>Product Description</Form.Label>
                                              <Form.Control as="textarea" rows={5} value={desctiption} onChange={(e)=>{setDescription(e.target.value)}}/>
                                            </Form.Group>
                                          {/* <Form.Group controlId='name'>
                                            <Form.Label>Total Quantity <sup style={{fontSize: "90%", color: "red"}}>*</sup></Form.Label>
                                            <Form.Control
                                              type='number'
                                              placeholder='Total Quantity'
                                              value={baseQty}
                                              onChange={(e)=>{setBaseQty(e.target.value)}}
                                            ></Form.Control>
                                            </Form.Group> */}
                                          </Col>

                                          <Col md={6}>
                                            
                                              <Form.Group controlId='name'>
                                                <Form.Label>Thumbnail Image <sup style={{fontSize: "90%", color: "red"}}>*</sup></Form.Label>
                                                  <div style={{position: 'relative', textAlign: 'center', color: 'white'}}>
                                                        <div style={{position: 'absolute', top: '50%', left:'20%', transform: 'translate(-50%, -30%)', width: '40%'}}>
                                                              <Image 
                                                              style={{maxHeight: '150px'}}
                                                              src={thumbnailImage?window.URL.createObjectURL(thumbnailImage):thumbnailImageName != ''?thumbnailImageName:'/img/upload.PNG'}
                                                              />
                                                        </div>
                                                        <Form.File
                                                        style={{padding: '10%', marginTop: '5%'}}
                                                        id='image-file'
                                                        custom={true}
                                                        onChange={(e)=>{ 
                                                          if(e.target.files[0]){
                                                            setThumbnailImage(e.target.files[0]);
                                                            setThumbnailImageName(e.target.files[0]?e.target.files[0].name:'');
                                                          }
                                                        }}              
                                                    ></Form.File>
                                                  </div>
                                            </Form.Group>
                                          
                                          </Col>
                                        </Row>

                                        <Row>
                                           <Col md={6}>
                                              <Form.Group className="mb-3" controlId="formBasicCheckbox">
                                              <Form.Label>Has Return Option?</Form.Label>
                                                <Form.Check type="checkbox" checked={hasReturnOption} onChange={(e)=>{setHasReturnOption(e.target.checked)}}/>
                                              </Form.Group>
                                           </Col>
                                        </Row>

                                       {
                                         hasReturnOption?
                                         <Row>
                                         <Col md={6}>
                                             <Form.Group controlId='name'>
                                               <Form.Label>Return Period(In Days)</Form.Label>
                                               <Form.Control type='number' max={1000000000} placeholder='Return Period(In Days)' value={returnDays} onChange={(e)=>{
                                                setReturnDays(e.target.value)
                                                 }}/>
                                               </Form.Group>
                                            </Col>
                                         </Row>
                                         :
                                         <></>
                                       }


                                        <Row style={{paddingBottom: "2%"}}>
                                          <Col md={6}><Button onClick={validateGeneralProductDetails}>{localStorage.getItem('isUpdate') == 'true'?'Update Base Product':'Choose Product Category'}</Button></Col>
                                        </Row>
                                     </Container>
                           </div>
                                 </Form>
                         </>)
                  }
                 
                  const category = () =>{
                       return (<>

                        <div>
                           <Container style={{display: loading?'initial':'none'}}>
                                <Row>
                                   <Col className="d-flex justify-content-center"><Spinner animation="grow" /></Col>
                                   <Col className="d-flex justify-content-center"><Spinner animation="grow" /></Col>
                                   <Col className="d-flex justify-content-center"><Spinner animation="grow" /></Col>
                                 </Row>
                           </Container>
                           </div>
                       <Container>
                       {error && <Message variant='danger'>{error}</Message>}
                           {success && <Message>{success}</Message>}
                           {msg && <Message variant='danger'>{msg}</Message>}
                           <div style={{display: loading?'none':'initial'}}>
                           <Row style={{paddingTop: "2%"}}>
                                         <Col md={12}><h4>Product Category and Sub Categories</h4></Col>
                                       </Row>
                         <Row>
                                        <Col md={6}>
                                              <Form.Group controlId="formBasicPassword">
                                                  <Form.Label>Category <sup style={{fontSize: "90%", color: "red"}}>*</sup></Form.Label>
                                                 <br/>
                                                  <Select
                                                    style={{ width: '90%' }}
                                                    placeholder="Select a Category"
                                                    value={productCategory}
                                                    onChange={(e)=>{onCategoryChange(e)}}
                                                  >
                                                  { 
                                                  categories.filter((e)=> e.parentid === 'parent').map((e, i)=>{
                                                        return (<Option key={i} value={e._id}>{e.name}</Option>)
                                                      })
                                                      }
                                                  </Select>
                                               </Form.Group>
                                        </Col>

                                        <Col md={6}>
                                             <Form.Group controlId="formBasicPassword">
                                                  <Form.Label>Subcategory</Form.Label>
                                                  <br/>
                                                  <TreeSelect 
                                                   treeData={subCategories}
                                                   value={productSubCategory}
                                                   onChange={(e)=>{
                                                    setProductSubCategory(e)
                                                  }}
                                                   treeCheckable= {true}
                                                   showCheckedStrategy= {TreeSelect.SHOW_ALL}
                                                   placeholder= {'Select Sub Categories'}
                                                   style={{
                                                     width: '90%'
                                                   }}
                                                  />
                                               </Form.Group>
                                        </Col>
                                        </Row>

                                        <Row style={{paddingBottom: "2%"}}>
                                          <Col md={6}><Button onClick={
                                            ()=>{
                                              if(productCategory.trim()==""){
                                                  setMsg("Enter product category!!")
                                                  setTimeout(()=>{setMsg("")}, 3000)
                                              }else{
                                                setActiveForm('productDimension')
                                              }
                                              }
                                            // validateGeneralProductDetails
                                            }>{localStorage.getItem('isUpdate') == 'true'?'Update Base Product':'Enter Product Dimensions'}</Button></Col>
                                        </Row>

                           </div>
                                  </Container>
                       </>)
                  }

                  const productDimension = () => {
 
                    return(
                      <>
                       <div>
                           <Container style={{display: loading?'initial':'none'}}>
                                <Row>
                                   <Col className="d-flex justify-content-center"><Spinner animation="grow" /></Col>
                                   <Col className="d-flex justify-content-center"><Spinner animation="grow" /></Col>
                                   <Col className="d-flex justify-content-center"><Spinner animation="grow" /></Col>
                                 </Row>
                           </Container>
                           </div>
                       <Container>
                       {error && <Message variant='danger'>{error}</Message>}
                           {success && <Message>{success}</Message>}
                           {msg && <Message variant='danger'>{msg}</Message>}
                           <div style={{display: loading?'none':'initial'}}>
                           <Row style={{paddingTop: "2%"}}>
                                         <Col><h4>Product Dimensions and Weight</h4></Col>
                                       </Row>
                                   <Row>
                                        <Col md={6}>
                                        <Form.Group controlId='name'>
                                            <Form.Label>Product Package Weigth(in lbs)<sup style={{fontSize: "90%", color: "red"}}>*</sup></Form.Label>
                                            <Form.Control
                                              type='number'
                                              placeholder='Product Package Weigth'
                                              value={weight}
                                              onChange={(e) => setWeight(e.target.value)}
                                            ></Form.Control>
                                          </Form.Group>
                                        </Col>

                                        <Col md={6}>
                                        <Form.Group controlId='name'>
                                            <Form.Label>Product Package Height(in inch)<sup style={{fontSize: "90%", color: "red"}}>*</sup></Form.Label>
                                            <Form.Control
                                              type='number'
                                              placeholder='Product Package Height'
                                              value={height}
                                              onChange={(e) => setHeight(e.target.value)}
                                            ></Form.Control>
                                          </Form.Group>
                                        </Col>
                                        </Row>

                                        <Row>
                                        <Col md={6}>
                                        <Form.Group controlId='name'>
                                            <Form.Label>Product Package Width(in inch)<sup style={{fontSize: "90%", color: "red"}}>*</sup></Form.Label>
                                            <Form.Control
                                              type='number'
                                              placeholder='Product Package Width'
                                              value={width}
                                              onChange={(e) => setWidth(e.target.value)}
                                            ></Form.Control>
                                          </Form.Group>
                                        </Col>

                                        <Col md={6}>
                                        <Form.Group controlId='name'>
                                            <Form.Label>Product Package Length(in inch)<sup style={{fontSize: "90%", color: "red"}}>*</sup></Form.Label>
                                            <Form.Control
                                              type='number'
                                              placeholder='Product Package Length'
                                              value={length}
                                              onChange={(e) => setLength(e.target.value)}
                                            ></Form.Control>
                                          </Form.Group>
                                        </Col>
                                        </Row>


                                        <Row style={{paddingBottom: "2%"}}>
                                          <Col md={6}><Button onClick={(e)=>{
                                            e.preventDefault();

                                            if(!height || !weight || !width || !length){
                                              setMsg('Enter valid dimensions')
                                             setTimeout(clearMsg, 3000)
                                             setActiveForm('productDimension')
                                             return
                                            }

                                            if(weight){
                                              if(weight<=0 || weight>=30){
                                                setMsg('Enter a valid weight between 0.1-30 lbs')
                                                setTimeout(()=>{setMsg('')}, 2500)
                                                return
                                              }
                                              // setMsg('Enter a valid weight between 0.1-30 lbs')
                                              // setTimeout(()=>{setMsg('')}, 2500)
                                            }
                                            
                                            if(height){
                                              if(height<=0 || height>=30){
                                                setMsg('Enter a valid height between 0.1-30 inches')
                                                setTimeout(()=>{setMsg('')}, 2500)
                                                return
                                              }
                                          
                                              // setMsg('Enter a valid height between 0.1-30 inches')
                                              // setTimeout(()=>{setMsg('')}, 2500)
                                            }
                                            if(length){
                                              if(length<=0 || length>=30){
                                                setMsg('Enter a valid length between 0.1-30 inches')
                                                setTimeout(()=>{setMsg('')}, 2500)
                                                return
                                              }
                                            
                                              // setMsg('Enter a valid length between 0.1-30 inches')
                                              // setTimeout(()=>{setMsg('')}, 2500)
                                            }
                                            if(width){
                                              if(width<=0 || width>=20){
                                                setMsg('Enter a valid width between 0.1-20 inches')
                                                setTimeout(()=>{setMsg('')}, 2500)
                                                return
                                              }            
                                              // setMsg('Enter a valid width between 0.1-20 inches')
                                              // setTimeout(()=>{setMsg('')}, 2500)
                                            }
                                          
                                              setActiveForm('variants')
                                            
                                          }}>{localStorage.getItem('isUpdate') == 'true'?'Update Base Product':'Choose Variant Attribute'}</Button></Col>
                                        </Row>
                                  </div>
                                  </Container>
                      </>
                    )
                  }

                  const variantsComponent = () => {
                    return(<>
                            <Form >
                            {error && <Message variant='danger'>{error}</Message>}
                           {success && <Message>{success}</Message>}
                           {msg && <Message variant='danger'>{msg}</Message>}
                                     <Container>
                                       <Row style={{paddingTop: "2%"}}>
                                         <Col><h4>Attributes</h4></Col>
                                       </Row>

                                        <Row>
                                          <Col md={6}>
                                          <Form.Group controlId='name'>
                                            <Form.Label>Choose Variant Attributes <sup style={{fontSize: "90%", color: "red"}}>*</sup></Form.Label><OverlayTrigger
                                                                                                                                                      placement="top"
                                                                                                                                                      delay={{ show: 250, hide: 400 }}
                                                                                                                                                      overlay={<Tooltip id="button-tooltip">{`Product variant attributes, like a T-Shirt might have size and color as variant attribute. If the dropdown is empty that means you need to create variants from variant management screen`}</Tooltip>}
                                                                                                                                                    >
                                                                                                                                                      <Button style={{background:'none', color: '#2aa8f2',  paddingTop: '0px', paddingBottom: '0px'}}><i className="far fa-question-circle"></i></Button>
                                                                                                                                                    </OverlayTrigger>
                                            <Select
                                                  mode="multiple"
                                                  allowClear
                                                  style={{ width: '100%' }}
                                                  placeholder="Please select"
                                                  value={variants}
                                                  onChange={(e)=>{
                                                    setVariants(e)
                                                    setTemplate(e)
                                                  }}
                                                  disabled={parentId == "" && localStorage.getItem('isUpdate') == 'false'?false : true}
                                                >
                                                   {
                                                     bufferVariants.map((e, i)=>{
                                                       return (<Option key={i} value={e.variantsname}>{e.variantsname}</Option>)
                                                     })
                                                    }
                                                </Select>
                                          </Form.Group>
                                          </Col>
                                        
                                        </Row>

                                        <Form.Group controlId='slug' >
          <Form.Label>Properties/Specifications</Form.Label>
          {/* <OverlayTrigger
                                                  placement="top"
                                                  delay={{ show: 250, hide: 400 }}
                                                  overlay={<Tooltip id="button-tooltip">{`Products also has variant attribute, For ex: A T-shirt has Size as variant attribute, so the Variant attribute value can be anything that is valid size like XL, S, M, etc.`}</Tooltip>}
                                                >
                                                  <Button style={{background:'none', color: '#2aa8f2'}}><i className="far fa-question-circle"></i></Button>
                                                </OverlayTrigger> */}
             {
            values.map((e, i)=>
                             ( <Fragment key={`${e}~${i}`}>     

                             {
                               i == 0?
                                      <>
                                     <div style={{display: "flex"}}>
                                       <Form.Control
                                            type='name'
                                            style={{width: "90%"}}
                                            placeholder={'Name'}
                                            value={e.name}
                                            onChange={(val)=>{handleValueInput(val.target.value, i, 'name')}}
                                          ></Form.Control> 

                                             <Form.Control
                                            type='name'
                                            style={{width: "90%", marginLeft: '2%'}}
                                            placeholder={'Value'}
                                            value={e.value}
                                            onChange={(val)=>{handleValueInput(val.target.value, i, 'value')}}
                                          ></Form.Control> 
                                            <Button variant={'secondary'} onClick={addFeild}><i className="fas fa-plus"></i></Button>
                                            </div>
                                      </>
                                      :
                                      <>
                                     <div style={{display: "flex", marginTop:"2%"}}>
                                       <Form.Control
                                        type='name'
                                        style={{width: "90%"}}
                                        placeholder={'Value'}
                                        value={e.name}
                                        onChange={(val)=>{handleValueInput(val.target.value, i, 'name')}}
                                      ></Form.Control> 

                                         <Form.Control
                                            type='name'
                                            style={{width: "90%", marginLeft: '2%'}}
                                            placeholder={'Value'}
                                            value={e.value}
                                            onChange={(val)=>{handleValueInput(val.target.value, i, 'value')}}
                                          ></Form.Control> 
                                        <Button variant={'secondary'} onClick={()=>{removeField(i)}}><i className="fas fa-minus"></i></Button>
                                        </div>
                                      </>
                             }
                                </Fragment>)
                                )
           }       
         </Form.Group>

                                        <Row style={{marginTop: '1%',paddingBottom: '2%'}}>
                                          <Col md={6}>
                                             <Button variant='secondary' onClick={()=>{setActiveForm('generaldescription')}}>Back</Button>
                                          </Col>
                                          <Col md={6} style={{display: localStorage.getItem('isUpdate') == 'false'?'initial': 'none'}}>
                                             <Button className="float-right" onClick={(e)=>{
                                             if(variants.length == 0){
                                                    setError("Please Select Attributes!!")
                                                    setTimeout(clearMsg, 3000)
                                                 }else{
                                                  saveBaseProduct(e)
                                                 }
                                               }} disabled={parentId == ""?false : true}>Save  & Add Variants</Button>
                                          </Col>

                                          <Col md={6} style={{display: localStorage.getItem('isUpdate') == 'false'?'none': 'initial'}}>
                                             <Button className="float-right" onClick={validateGeneralProductDetails}>Update Base Product</Button>
                                          </Col>
                                        </Row> 
                                     </Container>
                                 </Form>
                           </>);
                  }

                  const createVariant = () => {
                           return (<>
                                    <Form>
                            {error && <Message variant='danger'>{error}</Message>}
                           {success && <Message>{success}</Message>}
                                     <Container>
                                       <Row style={{paddingTop: "2%"}}>
                                         <Col><h4>Create Product Variant</h4></Col>
                                       </Row>
                                       <Row>
                                         <Col>
                                           {/* {addedSuccess && <Message>{message1}</Message>}
                                           {addedError && <Message variant='danger'>{message1}</Message>} */}
                                         </Col>
                                       </Row>
                                    <Row>
                                      <Col>
                                         <Button  variant='secondary' className="float-right" style={{fontWeight: 'bold'}} onClick={()=>{
                                           setIsUpdate(false)
                                           setModal(true)}}>+ Add a variant</Button>
                                      </Col>                                          
                                    </Row>

                                        <Row>
                                          <Col >
                                          <Table columns={[  {
                                                            title: ' ',
                                                            dataIndex: 'image',
                                                            key: 'image',
                                                            width: "10%",
                                                            render: (text, record)=>(
                                                              <img src={record.images[0]} style={{width: '100%'}}/>
                                                            )
                                                          },
                                                            {
                                                            title: 'Variant Name',
                                                            dataIndex: 'name',
                                                            key: 'name',
                                                          },
                                                          {
                                                            title: 'Slug',
                                                            dataIndex: 'slug',
                                                            key: 'slug',
                                                          },
                                                          {
                                                            title: 'Quantity',
                                                            dataIndex: 'qty',
                                                            key: 'qty',
                                                          },
                                                          {
                                                            title: 'Price',
                                                            dataIndex: 'price',
                                                            key: 'price',
                                                          },
                                                          {
                                                            title: 'Action',
                                                            dataIndex: 'action',
                                                            key: 'action',
                                                            render: (text,record)=>(
                                                              <Space size="middle">
                                                                    <Popconfirm title="Are You Sure?" onConfirm={() => {deleteVariant(record._id)}}>
                                                                      <Button variant='secondary' style={{color: "red"}}><i className="fas fa-trash-alt"></i></Button>
                                                                    </Popconfirm>

                                                                    <Button variant='secondary' style={{color: "#2aa8f2"}} onClick={()=>{
                                                                      setIsUpdate(true)
                                                                      editVariant(record._id)}}><i className="fas fa-edit"></i></Button>
                                                              </Space>
                                                            )
                                                          },
                                                        ]} 
                                                        loading={loading}
                                                          rowKey={'_id'}
                                                          dataSource={allVariant} 
                                                          expandable={{
                                                            expandedRowRender: (record) => {
                                                                   return (<div style={{display: 'flex'}}>
                                                                          {record.images.map((e)=>(
                                                                             <img src={e} style={{width: '10%', marginRight: '1% '}}/>
                                                                          ))}
                                                                   </div>)
                                                            },
                                                          }}
                                                          />
                                          </Col>
                                        </Row>

                                        <Row style={{marginTop: '1%',paddingBottom: '2%'}}>
                                          <Col md={6}><Button  variant='secondary' onClick={()=>{setActiveForm('variants')}}>Back</Button></Col>
                                          <Col md={6}></Col>
                                        </Row>
                                        </Container>
                            </Form>
                                  </>)
                  }

                  const addModal = () => {
                    return(<>
                        <Modal show={modal} onHide={()=>{
                           setVariantObject({})                      
                           setPrice(0)
                           setVariantOfferPrice(0)
                           setQty(0)
                           setImages([])
                           setImagesname([])
                          setModal(false)}}>
                            <Modal.Header closeButton>
                            <Modal.Title>{isUpdate?"Edit Variant":"Add Product Variant"}</Modal.Title>
                          </Modal.Header>
                          <Modal.Body>
                               <Form>
                                 <div style={{display: loading?"initial": "none"}}>
                                 <Row>
                                   <Col className="d-flex justify-content-center"><Spinner animation="grow" /></Col>
                                   <Col className="d-flex justify-content-center"><Spinner animation="grow" /></Col>
                                   <Col className="d-flex justify-content-center"><Spinner animation="grow" /></Col>
                                 </Row>
                                 </div>

                                 <div style={{display: loading?"none": "initial"}}>
                                   <Row>
                                     <Col>
                                    {msg && <Message>{msg}</Message>}
                                     </Col>
                                   </Row>
                                 <Row>
                                   <Col>
                                   <Form.Group controlId='name'>
                                             
                                           {
                                             
                                             variantList.filter((e)=>variants.includes(e.variantsname)).map((e, i)=>{
                                               return (
                                                 <Row key={i} style={{marginTop: i == 0? "0%": "2%"}}>
                                                   <Col >
                                                   <Form.Label>{e.variantsname}</Form.Label>
                                                    <Form.Control as="select" value={variantObject[e.variantsname]?variantObject[e.variantsname] : ""} onChange={(opt)=>{updateVariantObject(e.variantsname, opt.target.value)}}>
                                                    <option key={""} value={""}>{`Select ${e.variantsname}`}</option>
                                                    {
                                                      e.options.map((val, i)=>{
                                                        return (<option key={i} value={val.value}>{val.value}</option>)
                                                      })
                                                    }
                                                    
                                                  </Form.Control>
                                                  
                                                   </Col>
                                                 </Row>
                                               )
                                             })

                                           }
                                           </Form.Group>

                                   </Col>
                                 </Row>
                                   
                                   <Row>
                                     <Col style={{width: '100%'}}>
                                     <Form.Group controlId='name'>
                                            <Form.Label style={{marginBottom: '12%'}}>Product Image<sup style={{fontSize: "90%", color: "red"}}>*</sup></Form.Label>     
                                           <div style={{position: 'relative', textAlign: 'center', color: 'white', }} >
                                                        <div style={{position: 'absolute', top: '50%', left:'17%', transform: 'translate(-50%, -40%)',width: '150px'}}>
                                                              <Image 
                                                              style={{width: '100%'}}
                                                              src={images && images.length != 0? window.URL.createObjectURL(images[0]) : imagesName.length != 0? imagesName[0]:'/img/upload.png'}
                                                              />
                                                        </div>
                                            <Form.File
                                                    id='product-image'
                                                    multiple
                                                    custom={true}
                                                    onChange={(e)=>{ 
                                                        // setImages(e.target.files)
                                                        let name = [];
                                                        let data = [];
                                                        for(let i=0; i<e.target.files.length; ++i){
                                                          // name = e.target.files[i].name
                                                          name.push(e.target.files[i].name)
                                                           data.push(e.target.files[i])
                                                        }
                                                        setImages(data)
                                                        setImagesname(name)
                                                    }}              
                                                ></Form.File>
                                                </div>
                                            </Form.Group>
                                     </Col>
                                   </Row>
                                     
                                     <Row style={{marginTop: '17%'}}>
                                       <Col>
                                       <Form.Group controlId='name'>
                                               <Form.Label>Original Price</Form.Label>
                                               <Form.Control
                                                   type='number'
                                                   placeholder='Original Price'
                                                   value={price}
                                                    onChange={(e) => setPrice(e.target.value)}
                                                ></Form.Control>
                                            </Form.Group>
                                       </Col>
                                       <Col>
                                            <Form.Label>Discounted Price</Form.Label>
                                               <Form.Control
                                                   type='number'
                                                   placeholder='Discounted Price'
                                                   value={variantOfferPrice}
                                                    onChange={(e) => setVariantOfferPrice(e.target.value)}
                                                ></Form.Control>
                                       </Col>
                                     </Row>

                                     <Row>
                                       <Col>
                                                <Form.Group controlId='name'>
                                               <Form.Label>Quantity</Form.Label>
                                               <Form.Control
                                                   type='number'
                                                   placeholder='Quantity'
                                                   value={qty}
                                                    onChange={(e) => setQty(e.target.value)}
                                                ></Form.Control>
                                            </Form.Group>
                                       </Col>
                                     </Row>
                                 </div>
                                 
                               </Form>
                          </Modal.Body>
                          <Modal.Footer>
                            <Button variant="secondary" disabled={loading} onClick={()=>{setModal(false)}}>
                              Close
                            </Button>
                            <Button disabled={loading} onClick={isUpdate?editProductVariant:addProductVariant} variant="primary">
                              {isUpdate?"Update":"Save"}
                            </Button>
                          </Modal.Footer>
                        </Modal>
                    </>)
                  }

          return(<>
                    <section className="accountMain-wraper">
                     <div className="container">
                       <div className="row">
                           <div className="col-md-12">
                               <h1 className="main-heading">Add Product</h1>
                           </div>
                       </div>
                       <div className="row">
                        <SideBar/>
                         <div className="col-md-12 col-lg-9 col-xl-9">
                         <div className="paymentMethod-main" >
                         <Tabs
                              id="controlled-tab-example"
                              activeKey={activeForm}
                              onSelect={(k) => setActiveForm(k)}
                            >
                              <Tab eventKey="generaldescription" title="General Description" >
                              {generalProductDetails()}
                              </Tab>
                              <Tab eventKey="category" title="Category">
                              {category()}
                              </Tab>
                              <Tab eventKey="productDimension" title="Package Dimensions">
                              {productDimension()}
                              </Tab>
                              <Tab eventKey="variants" title="Attributes">
                              {variantsComponent()}
                              </Tab>
                              <Tab eventKey="createvariant" title="Variants" disabled={parentId == ""?true : false}>
                              {createVariant()}
                               {addModal()}
                              </Tab>
                            </Tabs>
                           </div>
                          </div>
                       </div>
                     </div>
                   </section>
                   </>);

}

export default AddProduct;