import React, { useState, useEffect } from 'react'
import { Container, Row, Col } from 'react-bootstrap'


const HowDoesItWorks = () => {
    
    useEffect(() => {
        window.scrollTo(0, 0)
      }, [])

 return(<>
        <section className="policy-sec bg-gray section-padding">
            <Container>
                <Row>
                    <Col md={12}>
                        <div className="full-size">
                            <div className="main-heading">
                                <h3>How Does It Work?</h3>
                            </div>
                        </div>
                        <div className="inner-sec full-size">
                            <div className="policy-detail box-shadow">
                                
                                <p>Welcome new vendor and thank you for using istudio merch. We are excited to offer you your own online store platform so you can start selling your amazing products to the world of dance and beyond. Our system is easy to use with forward thinking technology and is geared towards the dance world and beyond. </p>
                               
                               <ul>
                                         <li><a href='#easy-store-setup'>Easy Store Set up</a></li>
                                         <li>Integrated online shipping and tracking info provided to you and your customer</li>
                                         <li>Refunds made easy</li>
                                         <li>Coupon Codes are easy to create</li>
                                         <li>Customer can buy from multiples vendors</li>
                                         <li>Forward thinking technology </li>
                                         <li>And Much Much More</li>
                               </ul>

                               <p>
                               We take a simple 20% service fee from each transaction that is purchased from your store. This fee covers our service fee and merchant fees. Shipping fees will be additional and will be added to the final sale to the customers total.
                               </p>

                               <p>
                               Below is an example:<br/>
                              Vendor BreakDown:<br/>
                              Product Costs: $100<br/>
                              istudio Takes: $20 ( 20% )<br/>
                              ________________<br/>
                              You Keep:        $80<br/>

                               </p>

                               <p>The customer will not see the percentage split. The customer will only see the final price + shipping costs.Example:</p>
                                <p>
                                Customer BreakDown<br/>

                              Product Costs: $100<br/>
                              Shipping:             $5<br/>
                              ________________<br/>
                              Total:              $105<br/>

                              <strong>It's that easy.</strong> <br/>

                                </p>
                              </div>
                        </div>
                    </Col>
                </Row>
                
                <Row id='easy-store-setup'>
                    <Col md={12}>
                         <h3>How to setup a store on istudio?</h3>

                         <div className="inner-sec full-size">
                            <div className="policy-detail box-shadow">
                                
                                <p>Follow the following steps to setup a store on istudio. </p>
                               
                               <ul>
                                         <li>Login/Create a account on istudio first.</li>
                                         <li>If a user wants to sell on istudio, he has to register as a seller to setup a store on istudio.</li>
                                         <li>To do that, look for "Want to sell on istudio?" in the Sell on istudio section, which is in the footer. 
                                             <br/>
                                             <img src={`/images/form-button.PNG`} style={{width: '80%'}}/>
                                         </li>
                                         <li>Click on the link, and it will open a registration form. <br/> <img src={'/images/form.PNG'} style={{width: '80%'}}/></li>
                                         <li>Fill the form with correct details, and press submit.</li>
                                         <li>
                                             Once the details are validated, then you'll be redirected to stripe where you'll have to enter some more information.
                                             <br/>
                                             <img src={`/images/stripe-login.PNG`} style={{width: '80%'}}/>
                                         </li>
                                         <li>Once you've added the necessary information in stripe, you'll be registered as vendor. <br/><span style={{color: 'red'}}>Note: Please make sure that the information that you've entered is correct as there you'll be receiving your payouts. And if you enter wrong information there, istudio is not responsible for your losses.</span></li>
                                         <li>After completing the above steps, You'll be registered as vendor. Start adding products from Product Management section.</li>
                               </ul>

                            
                              </div>
                        </div>
                    </Col>
                </Row>
                
            </Container>
        </section>
 
 </>);

}

export default HowDoesItWorks;