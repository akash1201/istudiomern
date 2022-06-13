import React, { useState } from 'react'
import { Form, Button } from 'react-bootstrap'

const SearchBox = ({ history }) => {
  const [keyword, setKeyword] = useState('')

  const submitHandler = (e) => {
    e.preventDefault()
    if (keyword.trim()) {
      history.push(`/search/${keyword}`)
    } else {
      history.push('/')
    }
  }

  return (
    <>
      <Form onSubmit={submitHandler}>
        <div className="search-wraper">
          <Form.Control
            type='text'
            name='q'
            onChange={(e) => setKeyword(e.target.value)}
            placeholder='Search Products...'
            className='search_query form-control'
          ></Form.Control>
          <Button type='submit'>
            <i className="las la-search"></i>
          </Button>
          </div>
      </Form>
    </> 
  )
}

export default SearchBox
