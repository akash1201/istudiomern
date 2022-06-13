import React from 'react'
import { Nav } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { useSelector } from 'react-redux'

const ReceivedOrderSteps = () => {

          const userLogin = useSelector((state) => state.userLogin)
          const { userInfo } = userLogin
  return (
  <>
    <nav className="order-tabs">
        <LinkContainer to='/ordersReceived'>
          <Nav.Link>
              <span>Received Orders</span>
          </Nav.Link>
        </LinkContainer>
        <LinkContainer to='/admin/approve-return-orders'>
          <Nav.Link>
              <span>Return Requests</span>
          </Nav.Link>
        </LinkContainer>
       {userInfo.userType == 'admin'? <LinkContainer to='/admin/all-orders'>
          <Nav.Link>
              <span>All Orders</span>
          </Nav.Link>
        </LinkContainer>
        :
        <></>
        }
    </nav>
  </>
  )
}

export default ReceivedOrderSteps
