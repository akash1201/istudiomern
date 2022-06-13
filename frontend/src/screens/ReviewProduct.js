import React, {useState} from 'react'
import {Modal, Button, Form} from 'react-bootstrap'
import { useSelector } from 'react-redux'
import Message from '../components/Message'
import Axios from 'axios'

const ReviewProduct = ({productId}) => {

          const userLogin = useSelector((state) => state.userLogin)
          const { userInfo } = userLogin

          const [show, setShow] = useState(()=>false)
          const [rating, setRating] = useState(()=>0)
          const [comment, setComment] = useState(()=>'')

          const [images, setImages] = useState(()=>[])
           
          const [msg, setMsg] = useState(()=>'')

          const handleClose = (e) => {
                    setShow(false)
                    reset()
          }
          const showModal = () => {
                    setShow(true)
          }
           const reset = () => {
                     setRating(0)
                     setImages([])
                     setComment('')
           }
          const submitHandler = async (e) => {
                 e.preventDefault()

                 if(rating == '0'){
                           setMsg('Please rate the product')
                           setTimeout(()=>{setMsg('')}, 3500)
                           return
                 }
                 if(comment.trim() == ''){
                    setMsg('Please enter comment')
                    setTimeout(()=>{setMsg('')}, 3500)
                    return
                 }

                 let imgData = []

                 if(images.length != 0){
                   try{

                    for(let i=0; i<images.length; ++i){
                      if(((images[i].name.split('.')[1].toLowerCase()) != 'jpg') && ((images[i].name.split('.')[1].toLowerCase()) != 'jpeg') && ((images[i].name.split('.')[1].toLowerCase())!= 'png')){
                        setMsg("Upload a valid thumbnail Image of JPG, JPEG or PNG")
                        setTimeout(()=>{setMsg('')}, 3500)
                        return
                       }
                    }

                    const config = {
                      headers: {
                        'Content-Type': 'multipart/form-data',
                      },
                    }

                    for(let i=0; i<images.length; ++i){
                      const formData = new FormData()
                      formData.append('image', images[i])

                      const { data } = await Axios.post('/api/upload', formData, config)
                       
                      imgData = [...imgData, data]
                    }

                   }catch(err){
                     console.log(err)
                  }
                 }

                 let config = {
                           headers: {
                                     Authorization : `Bearer ${userInfo.token}`
                           }
                 }
                 try{
                    let response = await Axios.post(`/api/products/${productId}/reviews`, {rating: rating, comment: comment, images: imgData}, config)
                    setShow(false)
                    reset()
                 }catch(err){
                    setMsg(err.response.data.message)
                    setTimeout(()=>{setMsg('')}, 3500)
                 }
          }
          return(<>
          <a className="order" onClick={showModal}>Review Product</a>
          <Modal show={show} onHide={handleClose} animation={false}>
          <Modal.Header closeButton>
                    <Modal.Title>Review</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          {msg?<Message variant='danger'>{msg}</Message>:<></>}
          <Form onSubmit={submitHandler}>
                                          <Form.Group controlId='rating'>
                                            <Form.Label>Rating</Form.Label>
                                            <Form.Control
                                              as='select'
                                              value={rating}
                                              onChange={(e) => setRating(e.target.value)}
                                            >
                                              <option value='0'>Select...</option>
                                              <option value='1'>1 - Poor</option>
                                              <option value='2'>2 - Fair</option>
                                              <option value='3'>3 - Good</option>
                                              <option value='4'>4 - Very Good</option>
                                              <option value='5'>5 - Excellent</option>
                                            </Form.Control>
                                          </Form.Group>
                                          <Form.Group controlId='comment'>
                                            <Form.Label>Comment</Form.Label>
                                            <Form.Control
                                              as='textarea'
                                              row='3'
                                              value={comment}
                                              onChange={(e) => setComment(e.target.value)}
                                            ></Form.Control>
                                          </Form.Group>

                                          <Form.Group controlId="formFile">
                                            <Form.Label>Product Images</Form.Label>
                                            <Form.Control className='form-control' type='file' 
                                             onChange={(e)=>{
                                               if(e.target.files){
                                                 setImages(e.target.files)
                                               }
                                             }}
                                            multiple={true}/>
                                          </Form.Group>

                                          <Button
                                            type='submit'
                                            variant='primary'
                                          >
                                            Submit
                                          </Button>
                                        </Form>
          </Modal.Body>
          </Modal>
               </>)
}

export default ReviewProduct