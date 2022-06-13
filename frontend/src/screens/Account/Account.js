
import React from 'react'
import Sidebar from '../../components/Sidebar'
import PaymentMethods from '../../components/Account/payment-methods'




const Account = () => {

    
    
    return (
    <>
    
        <section className="accountMain-wraper">
                <div className="row">
                    <div className="col-md-12">
                        <h1 className="main-heading">My Account</h1>
                    </div>
                </div>
                <div className="row">
                    <Sidebar/>
                    <div className="col-md-12 col-lg-9 col-xl-9">
                        <PaymentMethods/>
                    </div>
                </div>
            
        </section>
        
        
    </>
    )
}
export default Account