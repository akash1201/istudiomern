import React from 'react'
import { Button, Pagination } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import {useHistory} from 'react-router-dom'

const Paginate = ({ isVendor=false,pages, page, isAdmin = false, keyword = '' , istudio=false, url}) => {
  let history = useHistory()

  const prev = () => {
  let pushLink =   url?
  `${url}/${page-1}`
  :
    isVendor?
    `/vendor/all/${page-1}`:
       keyword
      ? `/search/${keyword}/page/${page - 1}`
      : istudio?`/istudio-merch/${page - 1}`:isAdmin? `/admin/productlist/${page - 1}`:`/page/${page - 1}`
      history.push(pushLink)
  }

  const nxt = () => {
    let pushLink =   url?
    `${url}/${parseInt(page)+1}`
    :
      isVendor?
      `/vendor/all/${parseInt(page)+1}`:
         keyword
        ? `/search/${keyword}/page/${parseInt(page) + 1}`
        : istudio?`/istudio-merch/${parseInt(page) + 1}`:isAdmin? `/admin/productlist/${parseInt(page) + 1}`:`/page/${parseInt(page) + 1}`
    
        history.push(pushLink)
  }

  return (
    pages > 1 && (
      <Pagination style={{display: 'flex', justifyContent: 'center'}}>
         <Pagination.Item disabled={page ==1?true:false} onClick={prev}>{'Prev'}</Pagination.Item>
        {pages<=5?
           
            [...Array(pages).keys()].map((x) => (
             <LinkContainer
               key={x + 1}
               to={
                 url?
                 `${url}/${x+1}`
                 :
                   isVendor?
                   `/vendor/all/${x+1}`:
                      keyword
                     ? `/search/${keyword}/page/${x + 1}`
                     : istudio?`/istudio-merch/${x + 1}`:isAdmin? `/admin/productlist/${x + 1}`:`/page/${x + 1}`
               }
             >
               <Pagination.Item active={x + 1 === page}>{x + 1}</Pagination.Item>
             </LinkContainer>
           ))
           :
           <>
              <LinkContainer
               key={1}
               to={
                 url?
                 `${url}/${1}`
                 :
                   isVendor?
                   `/vendor/all/${1}`:
                      keyword
                     ? `/search/${keyword}/page/${1}`
                     : istudio?`/istudio-merch/${1}`:isAdmin? `/admin/productlist/${1}`:`/page/${1}`
               }
             >
               <Pagination.Item active={1 === page}>{1}</Pagination.Item>
             </LinkContainer>

             <LinkContainer
               key={2}
               to={
                 url?
                 `${url}/${2}`
                 :
                   isVendor?
                   `/vendor/all/${2}`:
                      keyword
                     ? `/search/${keyword}/page/${2}`
                     : istudio?`/istudio-merch/${2}`:isAdmin? `/admin/productlist/${2}`:`/page/${2}`
               }
             >
               <Pagination.Item active={2 === page}>{2}</Pagination.Item>
             </LinkContainer>

             <LinkContainer
               key={2}
               to={'#'}
             >
               <Pagination.Item >{'...........'}</Pagination.Item>
             </LinkContainer>

             <LinkContainer
               key={pages}
               to={
                 url?
                 `${url}/${pages}`
                 :
                   isVendor?
                   `/vendor/all/${pages}`:
                      keyword
                     ? `/search/${keyword}/page/${pages}`
                     : istudio?`/istudio-merch/${pages}`:isAdmin? `/admin/productlist/${pages}`:`/page/${pages}`
               }
             >
               <Pagination.Item active={pages === page}>{pages}</Pagination.Item>
             </LinkContainer>
           </>
      }
         <Pagination.Item onClick={nxt} disabled={page ==pages?true:false}>{'Next'}</Pagination.Item>
      </Pagination>
    )
  )
}

export default Paginate
