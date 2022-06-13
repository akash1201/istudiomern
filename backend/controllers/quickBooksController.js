import asyncHandler from "express-async-handler";
import express from "express";
import { createRequire } from "module";
import  QuickbooksAuth from '../models/QuickbooksAuthModel.js'
const require = createRequire(import.meta.url);
const OAuthClient = require("intuit-oauth");
const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({ extended: false });

//import bodyParser from 'body-parser';
import dotenv from "dotenv";
dotenv.config();

let oauthClient = null;
let oauth2_token_json = null;
const authUri = (req, res) => {
  oauthClient = new OAuthClient({
    clientId: process.env.QUICKBOOK_CLIENT_ID,
    clientSecret: process.env.QUICKBOOK_CLIENT_SECERET,
    environment: process.env.QUICKBOOK_ENV,
    redirectUri: process.env.quik_redirectUri,
  });

  const authUri = oauthClient.authorizeUri({
    scope: [OAuthClient.scopes.Accounting],
    state: "intuit-test",
  });
  res.send(authUri);
};

const callback = asyncHandler(async (req, res) => {
  oauthClient
    .createToken(req.url)
    .then(function (authResponse) {
      oauth2_token_json = JSON.stringify(authResponse.getJson(), null, 2);

      saveOuth(oauthClient)
      // console.log(oauth2_token_json);
    })
    .catch(function (e) {
      console.error(e);
    });

  res.send("");
});

const saveOuth = asyncHandler (async (obj)=>{
  const outhNew = await QuickbooksAuth.findOne({clientId: process.env.QUICKBOOK_CLIENT_ID})

  if(outhNew){
  const buff = await QuickbooksAuth.updateOne({"clientId" : process.env.QUICKBOOK_CLIENT_ID},
                                              {$set: { "token" : obj.token}})
  }else{   
    const outhBuff = await QuickbooksAuth.create(obj)
  }
})

const refreshAccessToken = asyncHandler(async (req, res) => {
  oauthClient
    .refresh()
    .then(function (authResponse) {
      console.log(
        `The Refresh Token is  ${JSON.stringify(authResponse.getJson())}`
      );
      oauth2_token_json = JSON.stringify(authResponse.getJson(), null, 2);
      res.send(oauth2_token_json);
    })
    .catch(function (e) {
      console.error(e);
    });
});

const disconnect = asyncHandler(async (req, res) => {
  console.log("The disconnect called ");
  const authUri = oauthClient.authorizeUri({
    scope: [OAuthClient.scopes.OpenId, OAuthClient.scopes.Email],
    state: "intuit-test",
  });
  res.redirect(authUri);
});
const retrieveToken = asyncHandler(async (req, res) => {
  res.send(oauth2_token_json);
});

const CompanyInfo=asyncHandler(async (req, res) => {
  {
    const companyID = oauthClient.getToken().realmId;
  
    const url =
      oauthClient.environment == 'sandbox'
        ? OAuthClient.environment.sandbox
        : OAuthClient.environment.production;
  
    oauthClient
      .makeApiCall({ url: `${url}v3/company/${companyID}/companyinfo/${companyID}` })
      .then(function (authResponse) {
        console.log(`The response for API call is :${JSON.stringify(authResponse)}`);
        res.send(JSON.parse(authResponse.text()));
      })
      .catch(function (e) {
        console.error(e);
      });
  }
});

const journal=asyncHandler(async (req, res) => {
  const companyID = oauthClient.getToken().realmId;

  const url =
    oauthClient.environment == 'sandbox'
      ? OAuthClient.environment.sandbox
      : OAuthClient.environment.production;


  oauthClient
    .makeApiCall({ url: `${url}v3/company/${companyID}/query?minorversion=14`,'method':'POST','body':`select * from journalentry startposition 1 maxresults 5`,'headers':{'Content-Type':'application/text'} })
    .then(function (authResponse) {
      console.log(`The response for API call is :${JSON.stringify(authResponse)}`);
      res.send(JSON.parse(authResponse.text()));
    })
    .catch(function (e) {
      console.error(e);
    });
});


const createJournalEntry = asyncHandler(async(body)=>{

  //Authorization

  let authObj = await QuickbooksAuth.findOne({clientId: process.env.QUICKBOOK_CLIENT_ID})

  let newAuthObj =await checkTokenExpiry(authObj)

  oauthClient = new OAuthClient(newAuthObj);

  const url =
  authObj.environment == 'sandbox'
    ? OAuthClient.environment.sandbox
    : OAuthClient.environment.production;

    oauthClient
    .makeApiCall({ url: `${url}v3/company/${authObj.token.realmId}/journalentry?minorversion=14`,'method':'POST','body':body,'headers':{'Content-Type':'application/json', 'Aothorization': `Bearer ${authObj.token.access_token}`} })
    .then(function (authResponse) {
      console.log(`The response for API call is :${JSON.stringify(authResponse.data)}`);
      return;
      // res.send(JSON.parse(authResponse.text()));
    })
    .catch(function (e) {
      console.log("error")
    });



})

const checkTokenExpiry = asyncHandler(async(authObj)=>{
  
  // let authObj = await QuickbooksAuth.findOne({clientId: process.env.QUICKBOOK_CLIENT_ID})

  // let oauthClient = new OAuthClient(authObj);
  let tokenDate = new Date(authObj.updatedAt)
  let tokendateInSec = parseInt(tokenDate.getTime()/1000)
  
  let todayDate = new Date()
  let todayDateInSec = parseInt(todayDate.getTime()/1000)
  
  
 if((todayDateInSec-tokendateInSec)>3400){

 try{
  console.log("Token Expired generating new")
  let response = await oauthClient.refresh()
 
  let json = response.getJson()
  console.log(json)

  let newObj = await QuickbooksAuth.updateOne({clientId: process.env.QUICKBOOK_CLIENT_ID},
                     {$set: {"token.access_token": json.access_token, "token.refresh_token":json.access_token}})

                      return(newObj)
 }catch(err){
   console.log(err)
 }
 }
 else{
  console.log("Token Not Expired Not generating new")
  return(authObj)
 }
  
})

export { authUri, callback, refreshAccessToken, disconnect,retrieveToken,CompanyInfo,journal, createJournalEntry, checkTokenExpiry };
