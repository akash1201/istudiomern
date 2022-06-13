import React from 'react'
import { Nav } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'

const OrderSteps = () => {
  return (
  <>
    <nav className="order-tabs">
        <LinkContainer to='/orders'>
          <Nav.Link>
              <span>Orders</span>
          </Nav.Link>
        </LinkContainer>
        <LinkContainer to='/open-orders'>
          <Nav.Link>
              <span>Open Orders</span>
          </Nav.Link>
        </LinkContainer>
        <LinkContainer to='/cancelled-orders'>
          <Nav.Link>
              <span>Cancelled Orders</span>
          </Nav.Link>
        </LinkContainer>
        <LinkContainer to='/delivered-orders'>
          <Nav.Link>
              <span>Delivered Orders</span>
          </Nav.Link>
        </LinkContainer>
    </nav>
  </>
  )
}

export default OrderSteps
