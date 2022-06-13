import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";
import User from "../models/userModel.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import Stripe from "stripe";
import fetch from "node-fetch";
import ContactInfo from '../models/contactInfoModel.js'
import { OAuth2Client } from 'google-auth-library'
import Notifications from "../models/Notifications.js"
import jwt from 'jsonwebtoken'
import Shippo from 'shippo'

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SK);
let shippo = new Shippo(process.env.SHIPPO_SK)
// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      lastName: user.lastName,
      dob: user.dob,
      addresses: user.addresses,
      stripeId: user.stripeId,
      email: user.email,
      userType: user.userType,
      isVerified: user.isVerified ? user.isVerified : false,
      profilePic: user.profilePic ? user.profilePic : '/assets/img/logo.png',
      token: generateToken(user._id),
    });
  } else {
        res.status(401);
    throw new Error("Invalid email or password");
  }
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, userType, lastName, dob, signinType } =
    req.body;

  const userExists = await User.findOne({ email });

  let companyName = req.body.companyName ? req.body.companyName : "";
  let companyRegNo = req.body.companyRegNo ? req.body.companyRegNo : "";
  let companyEmail = req.body.companyEmail ? req.body.companyEmail : "";
  let companyAddress = req.body.companyAddress ? req.body.companyAddress : {};

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  //creating customer account on stripe

  const customer = await stripe.customers.create({
    email: email,
  });

  let stripeId = customer.id;

  // creating vendor account on stripe
  //  const connectAccount = await stripe.accounts.create({
  //   //type: 'express',
  //   type:'standard',
  //   country: companyAddress.country,
  //   business_type:'company',
  //   company:{
  //     'name':companyName,
  //    // 'phone':'',
  //   // 'registration_number':companyRegNo,
  //     'address':{
  //       'line1':companyAddress.street1,
  //       'line2':companyAddress.street1,
  //       'state':companyAddress.comp_state,
  //       'city':companyAddress.city,
  //       'country':companyAddress.country
  //     }
  //   },
  //   'email':email
  // });

  //complete vendor account creation on stripe
  //const stripeCompanyAccountId=connectAccount.id;

 let buff = await ContactInfo.find({})
 let information = buff[0]


  const user = await User.create({
    name,
    lastName,
    dob,
    email,
    password,
    userType,
    companyName,
    companyRegNo,
    companyEmail,
    companyAddress,
    stripeId,
    // stripeCompanyAccountId,
    signinType,
  });

  if (user) {
    // const accountLink = await stripe.accountLinks.create({
    //   account: connectAccount.id,
    //   refresh_url: 'http://localhost:3000/StripeAccount/failure',
    //   return_url: 'http://localhost:3000/StripeAccount/success',
    //   type: 'account_onboarding',
    // });
    // console.log(accountLink)

    //Create Notification For user and Admin Both

    let adminNoti = {
      forAdmin: true,
      notification: `${name} ${lastName?lastName:' '} Registered as new user`
    }

    let userNoti = {
      user: user._id,
      notification: `welcome to istudio, Kindly verify your email to fully use the website.`
    }

    let noti1 = await Notifications.create(adminNoti)
    let noti2 = await Notifications.create(userNoti)

    var transporter = nodemailer.createTransport({
      host: "mail.istudio.com",
      port: 465,
      name: 'istudio',
      auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.EMAIL_PSWD,
      },
    });

    var mailOptions = {
      from: process.env.EMAIL_ID, // sender address
      to: email, // list of receivers
      subject: "Account Confirmation", // Subject line
      html: `<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
      <html xmlns="http://www.w3.org/1999/xhtml" 
       xmlns:v="urn:schemas-microsoft-com:vml"
       xmlns:o="urn:schemas-microsoft-com:office:office">
      <head>
        <!--[if gte mso 9]><xml>
         <o:OfficeDocumentSettings>
          <o:AllowPNG/>
          <o:PixelsPerInch>96</o:PixelsPerInch>
         </o:OfficeDocumentSettings>
        </xml><![endif]-->
        <!-- fix outlook zooming on 120 DPI windows devices -->
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1"> <!-- So that mobile will display zoomed in -->
        <meta http-equiv="X-UA-Compatible" content="IE=edge"> <!-- enable media queries for windows phone 8 -->
        <meta name="format-detection" content="date=no"> <!-- disable auto date linking in iOS 7-9 -->
      
        <title>Welcome</title>
        <link href="https://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet"> 
        
      <style type="text/css">
          
      body {
        margin: 0;
        padding: 0;
        color:#4a4a4a;
        font-size: 14px;
        -ms-text-size-adjust: 100%;
        -webkit-text-size-adjust: 100%;
        background-color: #ece9e2;
        -webkit-text-size-adjust: none;
          -webkit-font-smoothing: aliased;
          -moz-osx-font-smoothing: grayscale;
      }
      a, a:link { color: #2AA8F2; text-decoration: none; }
      table {	border-spacing: 0; }
      
      table td { border-collapse: collapse; }
          
      table {
        mso-table-lspace: 0pt;
        mso-table-rspace: 0pt;
      }
      
      @media screen and (max-width: 799px) {
        .container {
          width: 100% !important;
          max-width: 100% !important;
          margin: 0px !important;
        }
      }
      @media screen and (max-width: 400px) {
        table.header h1 {
          font-size: 28px !important
        }
        table.address {
          padding-bottom: 0px !important;
        }
        table.address td {
          width: 100%;
          display: block;
          text-align: center;
          padding-bottom: 20px;
        }
        table.order-info td {
          width: 100%;
          display: block;
          text-align: center;
        }
        table.prod-info,
        table.total {
          padding: 10px 20px !important;
        }
        table.prod-info li {
          line-height: 1.3em;
        }
        table.order-details {
          font-size: 11px;
          padding-left: 10px !important;
          padding-right: 10px !important;
        }
        table.order-details table tfoot tr:first-child td {
          padding-top: 10px !important;
        }
        table.order-details table tfoot tr:last-child td {
          padding-bottom: 10px !important;
        }
        table.order-details table tfoot td {
          padding: 5px 10px !important;
        }
        .amount { width: 50px !important; }
        .total-amount { width: 70px !important; }
      }
      
      a[href^="x-apple-data-detectors:"],
      a[x-apple-data-detectors] {
        color: inherit !important;
        text-decoration: none !important;
        font-size: inherit !important;
        font-family: inherit !important;
        font-weight: inherit !important;
        line-height: inherit !important;
      }
      </style>
      
      </head>
      
      <body style="margin:0; padding:0;" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0">
      
      <!-- Visually Hidden Preheader Text : BEGIN -->
      <div style="display: none; font-size: 1px; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; mso-hide: all">
        Welcome to istudio
      </div>
      <!-- Visually Hidden Preheader Text : END -->
      
      <table bgcolor="white" border="0" width="800" cellpadding="0" cellspacing="0" className="container" style="margin: 15px auto;width:800px;max-width:800px; box-shadow: 0 0 10px rgba(0, 0, 0, .2); background-color: #fff;">
        <tr>
          <td>
            <table className="header" border="0" width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td align="left" className="logo" style="padding: 20px">
                  <a href="https://istudio.com/">
                    <img src="https://istudio.com/uploads/logo-1.png" alt="istudio" />
                  </a>
                </td>
                <td align="right" style="padding: 20px; vertical-align: middle;">
                  <a target="_blank" href="https://www.facebook.com/istudio-112915663809273/" style="display: inline-block;padding-left: 5px;">
                    <img src="https://istudio.com/uploads/facebook-icon.png" alt="Facebook" />
                  </a>
                </td>
              </tr>
            </table>
            <table className="header" border="0" width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td align="center" style="padding: 20px 20px 0px 20px;">
                  <h1 style="color:#4a4a4a; font-size: 36px; margin-bottom: 30px;padding: 20px 20px 0px 20px;">Welcome to <a href="#" style="color:#4a4a4a; text-decoration: none;">istudio.</a></h1>
                  <p><strong>We're excited to have get started. First, you need to confirm your account. <br />Just press the button below.</strong></p>
                  <div>
                    <a href='${process.env.BASE_URL}/verify-account/${user._id}' style="display: inline-block;border: 10px solid #2AA8F2;background: #2AA8F2;color: #ffffff;">Confirm Account</a>
                  </div>
                </td>
              </tr>
            </table>
            
            <table className="header" border="0" width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td align="center" style="padding: 20px 20px 0px 20px;">
                  <p>To sign in to our site, use these credentials during checkout or on the <strong><a href="#">My Account</a></strong> page:</p>
                </td>
              </tr>
            </table>
            <table className="header" border="0" width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td align="center" style="padding: 20px 20px 0px 20px;">
                  <p style="text-align: left;font-size: 18px;font-weight: 800;">When you sign in to your account, you will be able to:</p>
                  <ul style="text-align: left;">
                    <li>Proceed through checkout faster</li>
                    <li>Check the status of orders</li>
                    <li>View past orders</li>
                    <li>Store alternative addresses (for shipping to multiple family members and friends)</li>
                  </ul>
                </td>
              </tr>
            </table>     
            <table border="0" width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td valign="top" style="padding: 10px 20px;">
                  <p>If you have any questions, just reply to this email-we're always happy to help out.</p>
      
                  <p>Sincerely,<br>
                  <strong style="color:#2AA8F2">The istudio Team</strong><br>
                  ${information?information.phone?information.phone:'':''}<br>
                  <a href="#" style="color: #2AA8F2; text-decoration: none;">istudio</a></p>
                </td>
              </tr>
            </table>
            
          </td>
        </tr>
      </table>    
      </body>
      </html>
      `,
    };

    try {
      let response = await transporter.sendMail(mailOptions);
      console.log(response);
    } catch (err) {
      console.log(err);
    }

    res.status(201).json({
      _id: user._id,
      name: user.name,
      lastName: user.lastName,
      dob: user.dob,
      email: user.email,
      userType: user.userType,
      stripeId: user.stripeId,
      companyName: user.companyName ? user.companyName : "",
      companyEmail: user.companyEmail ? user.companyEmail : "",
      companyRegNo: user.companyRegNo ? user.companyRegNo : "",
      token: generateToken(user._id),
     // accountLinkData: accountLink,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      lastName: user.lastName,
      dob: user.dob,
      addresses: user.addresses,
      email: user.email,
      stripeId: user.stripeId,
      userType: user.userType,
      companyName: user.userCompanyName,
      companyEmail: user.companyEmail,
      companyRegNo: user.companyRegNo,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.lastName = req.body.lastName || user.lastName;
    user.email = req.body.email || user.email;
    user.dob = req.body.dob || user.dob;
    if (req.body.password) {
      user.password = req.body.password;
    }
    user.companyName = req.body.companyName
      ? req.body.companyName
      : user.companyName;
    user.companyRegNo = req.body.companyRegNo
      ? req.body.companyRegNo
      : user.companyRegNo;
    user.companyEmail = req.body.companyEmail
      ? req.body.companyEmail
      : user.companyEmail;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      lastName: updatedUser.lastName,
      dob: updatedUser.dob,
      addresses: updatedUser.addresses,
      email: updatedUser.email,
      userType: updatedUser.userType,
      stripeId: updatedUser.stripeId,
      companyName: updatedUser.userCompanyName,
      companyEmail: updatedUser.companyEmail,
      companyRegNo: updatedUser.companyRegNo,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    await user.remove();
    res.json({ message: "User removed" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.lastName = req.body.lastName || user.lastName;
    user.dob = req.body.dob || user.dob;
    user.email = req.body.email || user.email;
    user.userType = req.body.userType;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      lastName: updatedUser.lastName,
      dob: updatedUser.dob,
      email: updatedUser.email,
      userType: updatedUser.userType,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const updateUserAddress = asyncHandler(async (req, res) => {
  const user = req.user;
  if (user.addresses.id(req.params.id)) {
    user.addresses.id(req.params.id).remove();
  }

  if(!req.body.FirstName || !req.body.Email || !req.body.PhoneNo || !req.body.Address1 || !req.body.City || !req.body.Country || !req.body.State || !req.body.Zip){
    res.statusCode = 400
    res.json({msg: 'Incomplete Data'})
    return
  }
  let obj = {
    "name": req.body.FirstName,
    "street1":req.body.Address1,
    "city":req.body.City,
    "state":req.body.State,
    "zip":req.body.Zip,
    "country":req.body.Country,
    "email":req.body.Email,
    "validate": true
  }
  
  shippo.address.create(obj, (err, address)=>{
    if(err){
         console.log(err)
         res.status(400).json(err)
    }else{
      user.addresses.push(req.body);
      user.save();
      res.json(user);
    }
  })
 
});
const deleteUserAddress = asyncHandler(async (req, res) => {
  const user = req.user;
  user.addresses.id(req.params.id).remove();
  user.save();
  res.json(user);
});

const resetPassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.password = req.body.password;
    const newuser = await user.save();
    res.json({message: "Successfully Changed"});
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const getUserByEmail = asyncHandler(async (req, res)=>{

  const user = await User.findOne({email: req.params.email})


  if(user){

    let buff = await ContactInfo.find({})
    let information = buff[0]
    var transporter = nodemailer.createTransport({
      host: "mail.istudio.com",
      name: 'istudio.com',
      port: 465,
      auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.EMAIL_PSWD,
      },
    });

    var mailOptions = {
      from: process.env.EMAIL_ID, // sender address
      to: req.params.email, // list of receivers
      subject: "Reset Password", // Subject line
      // html: `Please <a href='/istudio-reset-password/${user._id}'>Click here</a> to Reset Your password!!`
      html: `<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
      <html xmlns="http://www.w3.org/1999/xhtml" 
       xmlns:v="urn:schemas-microsoft-com:vml"
       xmlns:o="urn:schemas-microsoft-com:office:office">
      <head>
        <!--[if gte mso 9]><xml>
         <o:OfficeDocumentSettings>
          <o:AllowPNG/>
          <o:PixelsPerInch>96</o:PixelsPerInch>
         </o:OfficeDocumentSettings>
        </xml><![endif]-->
        <!-- fix outlook zooming on 120 DPI windows devices -->
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1"> <!-- So that mobile will display zoomed in -->
        <meta http-equiv="X-UA-Compatible" content="IE=edge"> <!-- enable media queries for windows phone 8 -->
        <meta name="format-detection" content="date=no"> <!-- disable auto date linking in iOS 7-9 -->
      
        <title>Welcome</title>
        <link href="https://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet"> 
        
      <style type="text/css">
          
      body {
        margin: 0;
        padding: 0;
        color:#4a4a4a;
        font-size: 14px;
        -ms-text-size-adjust: 100%;
        -webkit-text-size-adjust: 100%;
        background-color: #ece9e2;
        -webkit-text-size-adjust: none;
          -webkit-font-smoothing: aliased;
          -moz-osx-font-smoothing: grayscale;
      }
      a, a:link { color: #2AA8F2; text-decoration: none; }
      table {	border-spacing: 0; }
      
      table td { border-collapse: collapse; }
          
      table {
        mso-table-lspace: 0pt;
        mso-table-rspace: 0pt;
      }
      
      @media screen and (max-width: 799px) {
        .container {
          width: 100% !important;
          max-width: 100% !important;
          margin: 0px !important;
        }
      }
      @media screen and (max-width: 400px) {
        table.header h1 {
          font-size: 28px !important
        }
        table.address {
          padding-bottom: 0px !important;
        }
        table.address td {
          width: 100%;
          display: block;
          text-align: center;
          padding-bottom: 20px;
        }
        table.order-info td {
          width: 100%;
          display: block;
          text-align: center;
        }
        table.prod-info,
        table.total {
          padding: 10px 20px !important;
        }
        table.prod-info li {
          line-height: 1.3em;
        }
        table.order-details {
          font-size: 11px;
          padding-left: 10px !important;
          padding-right: 10px !important;
        }
        table.order-details table tfoot tr:first-child td {
          padding-top: 10px !important;
        }
        table.order-details table tfoot tr:last-child td {
          padding-bottom: 10px !important;
        }
        table.order-details table tfoot td {
          padding: 5px 10px !important;
        }
        .amount { width: 50px !important; }
        .total-amount { width: 70px !important; }
      }
      
      a[href^="x-apple-data-detectors:"],
      a[x-apple-data-detectors] {
        color: inherit !important;
        text-decoration: none !important;
        font-size: inherit !important;
        font-family: inherit !important;
        font-weight: inherit !important;
        line-height: inherit !important;
      }
      </style>
      
      </head>
      
      <body style="margin:0; padding:0;" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0">
      
        <!-- Visually Hidden Preheader Text : BEGIN -->
        <div style="display: none; font-size: 1px; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; mso-hide: all">
          Forgot Password
        </div>
        <!-- Visually Hidden Preheader Text : END -->
        
        <table bgcolor="white" border="0" width="800" cellpadding="0" cellspacing="0" className="container" style="margin: 15px auto;width:800px;max-width:800px; box-shadow: 0 0 10px rgba(0, 0, 0, .2); background-color: #fff;">
          <tbody><tr>
            <td>
              <table className="header" border="0" width="100%" cellpadding="0" cellspacing="0">
                <tbody><tr>
                  <td align="left" className="logo" style="padding: 20px">
                    <a href="https://istudio.com/">
                      <img src="https://istudio.com/uploads/logo-1.png" alt="istudio">
                    </a>
                  </td>
                  <td align="right" style="padding: 20px; vertical-align: middle;">
                    <a target="_blank" href="https://www.facebook.com/istudio-112915663809273/" style="display: inline-block;padding-left: 5px;">
                      <img src="https://istudio.com/uploads/facebook-icon.png" alt="Facebook">
                    </a>
                  </td>
                </tr>
              </tbody></table>
              
              <table className="header" border="0" width="100%" cellpadding="0" cellspacing="0">
                <tbody><tr>
                  <td align="left" style="padding: 20px 20px 0px 20px;">
                    <p>${user.name},</p>
                    <p>There was recently a request to change the password for your account.</p>
                    <p>If you requested this change, set a new password here:</p>
                    <div style="text-align: center;">
                      <a href='${process.env.BASE_URL}/istudio-reset-password/${user._id}' style="display: inline-block;border: 10px solid #2AA8F2;background: #2AA8F2;color: #ffffff;">Set a New Password</a>
                    </div>
                  </td>
                </tr>
              </tbody></table>
              
              <table className="header" border="0" width="100%" cellpadding="0" cellspacing="0">
                <tbody><tr>
                  <td align="center" style="padding: 20px 20px 0px 20px;">
                    <p>If you did not make this request, you can ignore this email and your password will remain the same.</p>
                  </td>
                </tr>
              </tbody></table>           
              <table border="0" width="100%" cellpadding="0" cellspacing="0">
                <tbody><tr>
                  <td valign="top" style="padding: 10px 20px;">
                    <p>If you have any questions, just reply to this email-we're always happy to help out.</p>        
                    <p>Sincerely,<br>
                    <strong style="color:#2AA8F2">The istudio Team</strong><br>
                    ${information?information.phone?information.phone:'':''}<br>
                    <a href="#" style="color: #2AA8F2; text-decoration: none;">istudio</a></p>
                  </td>
                </tr>
              </tbody></table>            
            </td>
          </tr>
        </tbody></table>     
        </body>
      </html>
      `,
    };

    try {
      let response = await transporter.sendMail(mailOptions);
      console.log(response);
    } catch (err) {
      console.log(err);
    }

    res.json({
      id: user._id,
      userType: user.userType,
      email: user.email,
    });
  } else {
    res.status(404);
    throw new Error("User Not Found");
  }
});

//Payment methods

const addCard = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    //generating token....
    if(user.stripeId){
      let param = {};

      param.card = {
        number: req.body.cardNumber,
        exp_month: parseInt(req.body.expiryMonth),
        exp_year: parseInt(req.body.expiryYear),
        cvc: req.body.cvv,
        name: req.body.name,
      };
      try{
      let response = await stripe.tokens.create(param); 
        const card = await stripe.customers.createSource(user.stripeId, {
          source: response.id,
        });
    
        res.json(card);
      }catch(err){
        console.log('Error')
        throw new Error(err.message)
      }
    }else{
      res.status(500);
      res.json({code: 1, message: "cannot add card"})
    }
    
  } else {
    res.status(404);
    throw new Error("User Not Found");
  }
});

const getCardById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  const methodId = req.params.methodId;

  if (user) {
    const card = await stripe.customers.retrieveSource(user.stripeId, methodId);
    res.json(data);
  } else {
    res.status(404);
    throw new Error("User Not Found");
  }
});

const deleteCard = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  const methodId = req.params.methodId;

  if (user) {
    const deleted = await stripe.customers.deleteSource(
      user.stripeId,
      methodId
    );
    res.json(deleted);
  } else {
    res.status(404);
    throw new Error("User Not Found");
  }
});

const updateCard = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  const methodId = req.params.methodId;

  if (user) {
    const card = await stripe.customers.updateSource(user.stripeId, methodId, {
      name: req.body.name,
      exp_month: req.body.expiryMonth,
      exp_year: req.body.expiryYear,
    });

    res.json(card);
  } else {
    res.status(404);
    throw new Error("User Not Found");
  }
});

const getAllCard = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    if(user.stripeId){
      const cards = await stripe.customers.listSources(user.stripeId, {
        object: "card",
        limit: 10,
      });
      res.json(cards.data);
    }else{
      res.json([])
    }
  
  } else {
    res.status(404);
    throw new Error("User Not Found");
  }
});

const googleSignIn = asyncHandler(async (req, res) => {
  
  const user = await User.findOne({ email: req.body.email });

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        lastName: user.lastName,
        dob: user.dob,
        addresses: user.addresses,
        stripeId: user.stripeId,
        email: user.email,
        userType: user.userType,
        isVerified: user.isVerified ? user.isVerified : false,
        token: generateToken(user._id),
      });
    } else {
      googleSignUp(req, res);
    }

});

const googleSignUp = asyncHandler(async (req, res) => {
  const tokenId = req.body.tokenId

  const client = new OAuth2Client(process.env.GOOGLE_APP_ID)
  let googleResponse = await client.verifyIdToken({idToken: tokenId, audience: process.env.GOOGLE_APP_ID})
  // .then((res)=>{
    const {email_verified, name, email} = googleResponse.payload

    if(email_verified){
    const user = await User.findOne({email: email})

    if(user){
      console.log("user exists");
      req.body.email = email
      googleSignIn(req, res)
    }else{
      let buffName = name.split(' ')
      let req = {
        body: {
          name: buffName[0],
          lastName: buffName[1]?buffName[1]: ' ',
          email: email,
          signinType: "google",
          password: googleResponse.payload.sub,
        },
      };
      registerUser(req, res);
    }
    }else{
      res.status(500);
      throw new Error("Failed");
    }
  // })
});

const facebookSignIn = asyncHandler(async (req, res) => {
  let url = `https://graph.facebook.com/v2.11/${req.body.userId}/?fields=id,name,email&access_token=${req.body.accessToken}`;
  let response = await fetch(url, {
    method: "GET",
  });
  let json = await response.json();
  console.log(json);

  let user = await User.findOne({ email: json.email });
  if (!user) {
    facebookSignUp(req, res);
  } else {
    const user = await User.findOne({ email: json.email });

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        lastName: user.lastName,
        dob: user.dob,
        addresses: user.addresses,
        stripeId: user.stripeId,
        email: user.email,
        userType: user.userType,
        isVerified: user.isVerified ? user.isVerified : false,
        token: generateToken(user._id),
      });
    } else {
      facebookSignUp(req, res);
    }
  }
});

const facebookSignUp = asyncHandler(async (req, res) => {
  let url = `https://graph.facebook.com/v2.11/${req.body.userId}/?fields=id,name,email&access_token=${req.body.accessToken}`;
  let response = await fetch(url, {
    method: "GET",
  });
  let json = await response.json();
  console.log(json);

  let user = await User.findOne({ email: json.email });
  if (user) {
    console.log("user exists");
    facebookSignIn(req, res);
  } else {
    let name = json.name.split(" ");
    let req = {
      body: {
        name: name[0],
        lastName: name[1],
        email: json.email,
        signinType: "facebook",
        password: "facebook",
      },
    };
    registerUser(req, res);
    //  let newUser = await User.create()
  }
});

const verifyEmail = asyncHandler(async (req, res) => {
  let id = req.params.id;
  let user = await User.findById(id);
  user.isVerified = true;
  let newUser = await user.save();
  res.json(newUser);
});

const getVendor = asyncHandler(async (req, res) => {
  let vendors = await User.find({
    $or: [
      {
        userType: "vendor",
      },
      {
        userType: "admin",
      },
    ],
  });
  res.json(vendors);
});

const StripeAccountLink = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const accountLink = await stripe.accountLinks.create({
    account: user.stripeCompanyAccountId,
    refresh_url: "https://istudio.com/StripeAccount/failure",
    return_url: "https://istudio.com/StripeAccount/success",
    type: "account_onboarding",
  });
  res.json(accountLink);
});

const vendorRegis = asyncHandler(async (req, res) => {
  
  const user1 = await User.findById(req.user._id);
  const updatedUser = await User.updateOne({'_id':req.user._id},
  {$set:{'companyName': req.body.companyName?req.body.companyName:user1.companyName,
         'companyRegNo': req.body.companyRegNo?req.body.companyRegNo:user1.companyRegNo,
         'companyEmail': req.body.companyEmail?req.body.companyEmail:user1.companyEmail,
         'companyAddress': req.body.companyAddress?req.body.companyAddress:user1.companyAddress,
         'userType': user1.userType === 'admin'?'admin':'vendor'}})

       
  // user.companyName = req.body.companyName
  //   ? req.body.companyName
  //   : user.companyName;
  // user.companyRegNo = req.body.companyRegNo
  //   ? req.body.companyRegNo
  //   : user.companyRegNo;
  // user.companyEmail = req.body.companyEmail
  //   ? req.body.companyEmail
  //   : user.companyEmail;
  // user.companyAddress = req.body.companyAddress
  //   ? req.body.companyAddress
  //   : user.companyAddress;
  // user.userType = 'vendor'
  const user = await User.findById(req.user._id);

  // const updatedUser = await user.save();
  var stripeCompanyAccountId = user.stripeCompanyAccountId;
  console.log(stripeCompanyAccountId)
  // creating vendor account on stripe
  if(!user.stripeCompanyAccountId){
    const connectAccount = await stripe.accounts.create({
      // type: 'express',
      type: "standard",
      country: user.companyAddress.country,
      business_type: "company",
      company: {
        name: user.companyName,
        // 'phone':'',
        // 'registration_number':companyRegNo,
        address: {
          line1: user.companyAddress.street1,
          line2: user.companyAddress.street2,
          state: user.companyAddress.state,
          city: user.companyAddress.city,
          country: user.companyAddress.country,  
        },
      },
      email: user.email,
    });
     stripeCompanyAccountId = connectAccount.id;
  }
  

  //complete vendor account creation on stripe
  
  // updatedUser.stripeCompanyAccountId = stripeCompanyAccountId;
  // await user.save();

  const updatedUser1 = await User.updateOne({'_id':user._id},
  {$set:{'stripeCompanyAccountId': stripeCompanyAccountId}})

  const accountLink = await stripe.accountLinks.create({
    account: stripeCompanyAccountId,
    refresh_url: "https://istudio.com/StripeAccount/failure",
    return_url: "https://istudio.com/StripeAccount/success",
    type: "account_onboarding",
  });
  res.json(accountLink);
});

const vendorDetails = asyncHandler(async(req, res)=>{

  let id = req.params.id
 const user = await User.findById(id)
 if(user){
  console.log(user)
  let data = {
    companyAddress: user.companyAddress?user.companyAddress:{},
    companyName: user.companyName?user.companyName: '',
    companyEmail: user.companyEmail?user.companyEmail: '',
    companyRegNo: user.companyRegNo?user.companyRegNo: ''
  }
  res.json(data)

 }else{
   res.status(400)
   throw new Error('User Not Found')
 }

})

const stripeConnect = asyncHandler(async(req, res)=>{

  let id = req.params.id
  let user = await User.findById(id)
  
  // stripe.charges.retrieve('ch_1JEzonDKCNlndB1nF8n9yjYV', {
  //   stripeAccount: 'acct_1IsYv9DKCNlndB1n'
  // })

})

const resendVerification = asyncHandler(async(req, res)=>{

  let token = req.headers.authorization.split(' ')[1]
  let userid = jwt.verify(token, process.env.JWT_SECRET)

  const user = await User.findById(userid.id)
  
 let buff = await ContactInfo.find({})
 let information = buff[0]

  var transporter = nodemailer.createTransport({
    host: "mail.istudio.com",
    name: 'istudio.com',
    port: 465,
    auth: {
      user: process.env.EMAIL_ID,
      pass: process.env.EMAIL_PSWD,
    },
  });

  var mailOptions = {
    from: process.env.EMAIL_ID, // sender address
    to: user.email, // list of receivers
    subject: "Account Confirmation", // Subject line
    html: `<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml" 
     xmlns:v="urn:schemas-microsoft-com:vml"
     xmlns:o="urn:schemas-microsoft-com:office:office">
    <head>
      <!--[if gte mso 9]><xml>
       <o:OfficeDocumentSettings>
        <o:AllowPNG/>
        <o:PixelsPerInch>96</o:PixelsPerInch>
       </o:OfficeDocumentSettings>
      </xml><![endif]-->
      <!-- fix outlook zooming on 120 DPI windows devices -->
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1"> <!-- So that mobile will display zoomed in -->
      <meta http-equiv="X-UA-Compatible" content="IE=edge"> <!-- enable media queries for windows phone 8 -->
      <meta name="format-detection" content="date=no"> <!-- disable auto date linking in iOS 7-9 -->
    
      <title>Welcome</title>
      <link href="https://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet"> 
      
    <style type="text/css">
        
    body {
      margin: 0;
      padding: 0;
      color:#4a4a4a;
      font-size: 14px;
      -ms-text-size-adjust: 100%;
      -webkit-text-size-adjust: 100%;
      background-color: #ece9e2;
      -webkit-text-size-adjust: none;
        -webkit-font-smoothing: aliased;
        -moz-osx-font-smoothing: grayscale;
    }
    a, a:link { color: #2AA8F2; text-decoration: none; }
    table {	border-spacing: 0; }
    
    table td { border-collapse: collapse; }
        
    table {
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }
    
    @media screen and (max-width: 799px) {
      .container {
        width: 100% !important;
        max-width: 100% !important;
        margin: 0px !important;
      }
    }
    @media screen and (max-width: 400px) {
      table.header h1 {
        font-size: 28px !important
      }
      table.address {
        padding-bottom: 0px !important;
      }
      table.address td {
        width: 100%;
        display: block;
        text-align: center;
        padding-bottom: 20px;
      }
      table.order-info td {
        width: 100%;
        display: block;
        text-align: center;
      }
      table.prod-info,
      table.total {
        padding: 10px 20px !important;
      }
      table.prod-info li {
        line-height: 1.3em;
      }
      table.order-details {
        font-size: 11px;
        padding-left: 10px !important;
        padding-right: 10px !important;
      }
      table.order-details table tfoot tr:first-child td {
        padding-top: 10px !important;
      }
      table.order-details table tfoot tr:last-child td {
        padding-bottom: 10px !important;
      }
      table.order-details table tfoot td {
        padding: 5px 10px !important;
      }
      .amount { width: 50px !important; }
      .total-amount { width: 70px !important; }
    }
    
    a[href^="x-apple-data-detectors:"],
    a[x-apple-data-detectors] {
      color: inherit !important;
      text-decoration: none !important;
      font-size: inherit !important;
      font-family: inherit !important;
      font-weight: inherit !important;
      line-height: inherit !important;
    }
    </style>
    
    </head>
    
    <body style="margin:0; padding:0;" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0">
    
    <!-- Visually Hidden Preheader Text : BEGIN -->
    <div style="display: none; font-size: 1px; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; mso-hide: all">
      Welcome to istudio
    </div>
    <!-- Visually Hidden Preheader Text : END -->
    
    <table bgcolor="white" border="0" width="800" cellpadding="0" cellspacing="0" className="container" style="margin: 15px auto;width:800px;max-width:800px; box-shadow: 0 0 10px rgba(0, 0, 0, .2); background-color: #fff;">
      <tr>
        <td>
          <table className="header" border="0" width="100%" cellpadding="0" cellspacing="0">
            <tr>
            <td align="left" className="logo" style="padding: 20px">
            <a href="https://istudio.com/">
              <img src="https://istudio.com/uploads/logo-1.png" alt="istudio">
            </a>
          </td>
          <td align="right" style="padding: 20px; vertical-align: middle;">
            <a target="_blank" href="https://www.facebook.com/istudio-112915663809273/" style="display: inline-block;padding-left: 5px;">
              <img src="https://istudio.com/uploads/facebook-icon.png" alt="Facebook">
            </a>
          </td>
            </tr>
          </table>
          <table className="header" border="0" width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td align="center" style="padding: 20px 20px 0px 20px;">
                <h1 style="color:#4a4a4a; font-size: 36px; margin-bottom: 30px;padding: 20px 20px 0px 20px;">Welcome to <a href="#" style="color:#4a4a4a; text-decoration: none;">istudio.</a></h1>
                <p><strong>We're excited to have get started. First, you need to confirm your account. <br />Just press the button below.</strong></p>
                <div>
                  <a href='${process.env.BASE_URL}/verify-account/${user._id}' style="display: inline-block;border: 10px solid #2AA8F2;background: #2AA8F2;color: #ffffff;">Confirm Account</a>
                </div>
              </td>
            </tr>
          </table>
          
          <table className="header" border="0" width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td align="center" style="padding: 20px 20px 0px 20px;">
                <p>To sign in to our site, use these credentials during checkout or on the <strong><a href="#">My Account</a></strong> page:</p>
              </td>
            </tr>
          </table>
          <table className="header" border="0" width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td align="center" style="padding: 20px 20px 0px 20px;">
                <p style="text-align: left;font-size: 18px;font-weight: 800;">When you sign in to your account, you will be able to:</p>
                <ul style="text-align: left;">
                  <li>Proceed through checkout faster</li>
                  <li>Check the status of orders</li>
                  <li>View past orders</li>
                  <li>Store alternative addresses (for shipping to multiple family members and friends)</li>
                </ul>
              </td>
            </tr>
          </table>     
          <table border="0" width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td valign="top" style="padding: 10px 20px;">
                <p>If you have any questions, just reply to this email-we're always happy to help out.</p>
    
                <p>Sincerely,<br>
                <strong style="color:#2AA8F2">The istudio Team</strong><br>
                ${information?information.phone?information.phone:'':''}<br>
                <a href="#" style="color: #2AA8F2; text-decoration: none;">istudio</a></p>
              </td>
            </tr>
          </table>
          
        </td>
      </tr>
    </table>    
    </body>
    </html>
    `}
    try {
      let response = await transporter.sendMail(mailOptions);     
    } catch (err) {
      res.json({
        message : 'Error'
      })
      console.log(err);
    }
    res.json({
      message : 'Success'
    })

})

const updateProfileImage = asyncHandler(async(req, res)=>{

  let id = req.params.id
  console.log(req.body)
  let user = await User.updateOne({_id: id}, {$set:{profilePic:req.body.url}})
  res.json({url: req.body.url})
})

const getStoreName = asyncHandler(async(req, res)=>{
  
  let user = await User.findById(req.params.vendorId)
  let store = user.name+"'s Store"
  res.json({storeName: store})
})

export {
  authUser,
  registerUser,
  StripeAccountLink,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  updateUserAddress,
  deleteUserAddress,
  resetPassword,
  getUserByEmail,
  addCard,
  getCardById,
  deleteCard,
  updateCard,
  getAllCard,
  googleSignIn,
  googleSignUp,
  facebookSignIn,
  facebookSignUp,
  verifyEmail,
  getVendor,
  vendorRegis,
  vendorDetails,
  stripeConnect,
  resendVerification,
  updateProfileImage,
  getStoreName
};
