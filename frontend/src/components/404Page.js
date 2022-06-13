import React from 'react'
import { Container } from 'react-bootstrap'
import { Empty } from 'antd'

const NotFound = () => {
 

  return (
    <>
    <section className="merch-product-listing">
        <Container>
                    <Empty
                              image="/assets/img/logo.png"
                              description={
                              <span style={{fontWeight: 'bold'}}>
                              Sorry, the page you visited does not exist.
                              </span>
                              }
                              ></Empty>
        </Container>
      </section>
    </>
  )
}

export default NotFound
