import React from 'react'
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import Header from './components/Header'
import Footer from './components/Footer'
import HomeScreen from './screens/HomeScreen'
import ProductScreen from './screens/ProductScreen'
import CartScreen from './screens/CartScreen'
import LoginScreen from './screens/LoginScreen'
import ForgotPasswordScreen from './screens/ForgotPasswordScreen'
import RegisterScreen from './screens/RegisterScreen'
import ProfileScreen from './screens/ProfileScreen'
import ShippingScreen from './screens/ShippingScreen'
import DeliveryScreen from './screens/DeliveryScreen'
import PaymentScreen from './screens/PaymentScreen'
import PlaceOrderScreen from './screens/PlaceOrderScreen'
import OrderScreen from './screens/OrderScreen'
import UserListScreen from './screens/UserListScreen'
import UserEditScreen from './screens/UserEditScreen'
import ProductListScreen from './screens/ProductListScreen'
import ProductEditScreen from './screens/ProductEditScreen'
import OrderListScreen from './screens/OrderListScreen'
import OpenOrderScreen from './screens/OpenOrderScreen'
import CancelledOrdersScreen from './screens/CancelledOrdersScreen'
import DeliveredOrdersScreen from './screens/DeliveredOrdersScreen'
import CategoryListScreen from './screens/CategoryListScreen'
import Account from './screens/Account/Account'
import PaymentMethods from "./screens/PaymentMethods"
import Notifications from './screens/Notifications'
import Wishlist from "./screens/Wishlist"
import AccountSetting from "./screens/AccountSettings"
import VariantScreen from './screens/VariantScreen'
import AddProduct from "./screens/AddProduct"
import PrivacyPolicy from "./screens/PrivacyPolicy"
import TermsConditions from "./screens/TermsConditions"
import PromoCode from "./screens/PromoCode"
import ResetPassword from './screens/ResetPassword'
import CategoryScreen from './screens/CategoryScreen'
import OrderPlaced from './screens/OrderPlaced'
import OrderReceived from './screens/OrderReceived'
import VerifyScreen from './screens/VerifyScreen'
import QuicckBooksCallback from "./components/QuickBooksCallBack"
import StripeConnectSuccess from "./screens/StripeConnectSuccess"
import StripeConnectFailure from "./screens/StripeConnectFailure"
// import istudioMerch from './screens/istudioMerch'
import PrintfulProductScreen from './screens/PrintfulProductScreen'
import ContachInfo from './screens/ContacInfo'
import NotFound from './components/404Page'
import AccountFee from './screens/AccountFee'
import CookiePolicy from "./screens/CookiePolicy"
import HowDoesItWorks from "./screens/HowDoesItWorks"
import VendorProductList from './screens/VendorProductList'
import VendorCancelledOrders from './screens/VendorCancelledOrders'
import AllOrdersAdmin from './screens/AllOrdersAdmin'
import VendorProfile from './screens/VendorProfile'
import BannerManagement from './screens/BannerManagement'


const App = () => {

  
  return (
    <Router>  
     
      <Header />  
  
      <main>

        <Container>
          <Route path='/order/:id' component={OrderScreen} exact/>
          <Route path='/StripeAccount/success' component={StripeConnectSuccess} exact/>
          <Route path='/StripeAccount/failure' component={StripeConnectFailure} exact/>
          <Route path='/account' component={Account} exact/>
          
          <Route path='/admin/userlist' component={UserListScreen} exact/>
          <Route path='/admin/user/:id/edit' component={UserEditScreen} exact/>
          <Route
            path='/admin/productlist'
            component={ProductListScreen}
            exact
          />
          <Route
            path='/admin/categorylist'
            component={CategoryListScreen}
            exact
          />
          <Route 
                 path='/admin/promocode'
                 component={PromoCode}
                 exact 
                 />

           <Route
            path='/admin/variants'
            component={VariantScreen}
            exact
          />

          <Route
            path='/admin/productlist/:pageNumber'
            component={ProductListScreen}
            exact
          />
          <Route path='/admin/product/:id/edit' component={ProductEditScreen} exact/>
          <Route path='/admin/orderlist' component={OrderListScreen} exact/>
          <Route path='/admin/banner-management' component={BannerManagement} exact/>
          <Route path='/search/:keyword' component={HomeScreen} exact />
          <Route path='/category/:name/:id' component={CategoryScreen} exact />
          <Route path='/page/:pageNumber' component={HomeScreen} exact />
          <Route path='/:name/store/:vendorId/:pageNumber?' component={VendorProfile} exact/>
          <Route path='/vendor/profile' component={VendorProfile} exact/>
          <Route
            path='/search/:keyword/page/:pageNumber'
            component={HomeScreen}
            exact
          />
        </Container>
        <Route path='/QuicckBooksCallback' component={QuicckBooksCallback} exact/>
        <Route path='/login' component={LoginScreen} exact/>
        <Route path='/register' component={RegisterScreen} exact/>
        <Route path='/forgot-password' component={ForgotPasswordScreen} exact/>
        <Route path='/istudio-reset-password/:id?' component={ResetPassword} exact/>
        <Route path='/profile' component={ProfileScreen} exact/>
        <Route path='/contact-info' component={ContachInfo} exact/>

        <Route path='/paymentMethods' component={PaymentMethods} exact/>
        <Route path='/notifications' component={Notifications} exact/>
        <Route path='/orders/:pageNo?' component={OrderListScreen} exact/>
        <Route path='/open-orders/:pageNo?' component={OpenOrderScreen} exact/>
        <Route path='/cancelled-orders/:pageNo?' component={CancelledOrdersScreen} exact/>
        <Route path='/delivered-orders/:pageNo?' component={DeliveredOrdersScreen} exact/>
        <Route path='/wishlist' component={Wishlist} exact/>
        <Route path='/accountSetting' component={AccountSetting} exact/>
        <Route path='/addProduct' component={AddProduct} exact/>
        <Route path='/editProduct' component={AddProduct} exact/>

        <Route path='/orderPlaced' component={OrderPlaced} exact/>
        <Route path='/ordersReceived/:pageNo?' component={OrderReceived} exact/>
        <Route path='/admin/all-orders/:pageNo?' component={AllOrdersAdmin} exact/>
        <Route path='/admin/approve-return-orders/:pageNo?' component={VendorCancelledOrders} exact/>

        <Route path='/' component={HomeScreen} exact/>
        <Route path='/product/:id' component={ProductScreen} exact/>
        <Route path='/cart/:id?' component={CartScreen} exact/>
        <Route path='/shipping' component={ShippingScreen} exact/>
        <Route path='/delivery' component={DeliveryScreen} exact/>
        <Route path='/payment' component={PaymentScreen} exact/>
        <Route path='/placeorder' component={PlaceOrderScreen} exact/>
          
        <Route path='/privacy-policy' component={PrivacyPolicy} exact/>
        <Route path='/terms-conditions' component={TermsConditions} exact/>  
        <Route path='/verify-account/:userId?' component={VerifyScreen} exact/> 

        {/* <Route path='/istudio-merch/:pageNumber?' component={istudioMerch} exact /> */}
        <Route path='/istudio-merch/product/:id' component={PrintfulProductScreen} exact />
        <Route path='/platform-fee' component={AccountFee}/>
        <Route path='/cookie-policy' component={CookiePolicy}/>
        <Route path='/how-does-it-work' component={HowDoesItWorks} />
        <Route path="/404" component={NotFound} />
        {/* <Redirect to="/404" /> */}
      </main>
     
     
      <Footer />
      
    </Router>
  )
}

export default App
