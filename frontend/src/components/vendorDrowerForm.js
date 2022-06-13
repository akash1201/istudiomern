import React, { useState, useEffect } from "react";
import { Drawer, Form, Button, Col, Row, Input,} from "antd";
import axios from 'axios'
import { useSelector, useDispatch } from "react-redux";
import Loader from "./Loader";
import {Alert} from 'react-bootstrap'
import { Select,  } from 'antd';
import { Link } from 'react-router-dom'

const { Option } = Select
const VendorDrawerForm = () => {
  const userInfo = useSelector((state) => state.userLogin.userInfo);
  let dispatch = useDispatch()
  
  const [visible, setVisible] = useState(false);
  const [companyName, setCompanyName] = useState(()=>'');
  const [companyRegNo, setCompanyRegNo] = useState(()=>'');
  const [companyEmail, setCompanyEmail] = useState(()=>'');
  const [street1, setStreet1] = useState(()=>'');
  const [street2, setStreet2] = useState(()=>'');
  const [comp_country, setcompCountry] = useState(()=>'');
  const [comp_state, setcompState] = useState(()=>'');
  const [city, setCity] = useState(()=>'');
  const [zip, setZip] = useState(()=>'');

  const [loading, setLoading] = useState(()=>false)
  const [error, setError] = useState(()=>false)
  const [msg, setMsg] = useState(()=>'')

  const [countryList, setCountryList] = useState(()=>[])

  const showDrawer = () => {
    setVisible(true);
  };

  useEffect(()=>{
    let config ={
      headers: {
        'Authorization': `Bearer ${userInfo.token}`
      }
    }
   
    axios.get(`/api/users/vendorDetails/${userInfo._id}`, config)
    .then((res)=>{
         let data = res.data;
         setCompanyName(data.companyName?data.companyName:'')
         setCompanyEmail(data.companyEmail?data.companyEmail:'')
         setCompanyRegNo(data.companyRegNo?data.companyRegNo:'')
         setStreet1(data.companyAddress?data.companyAddress.street1?data.companyAddress.street1:'':'')
         setStreet2(data.companyAddress?data.companyAddress.street2?data.companyAddress.street2:'':'')
         setcompCountry(data.companyAddress?data.companyAddress.country?data.companyAddress.country:'':'')
         setcompState(data.companyAddress?data.companyAddress.state?data.companyAddress.state:'':'')
         setCity(data.companyAddress?data.companyAddress.city?data.companyAddress.city:'':'')
         setZip(data.companyAddress?data.companyAddress.zip?data.companyAddress.zip:'':'')
         

         axios.get(`/api/miscellaneous/country-codes`)
         .then((res)=>{
          //  console.log(res.data.supported_transfer_countries)
           setCountryList(res.data)
          setLoading(false)
         })
         .catch((err)=>{
          setLoading(false)
         })
    })
    .catch((err)=>{
       setError(true)
       setTimeout(()=>{setError(false)}, 3000)
       setLoading(false)
    })

  },[])

  const onClose = () => {
    setVisible(false);
  };
  const SubmitForm=()=>{
    
    setLoading(true)
    const companyAddress={
      'street1':street1,
      'street2':street2,
      'city':city,
      'state':comp_state,
      'country':comp_country,
      'zip': zip
      //'zip':street1
    }
    // const {
    //   userLogin: { userInfo },
    // } = getState()
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    }
    axios
      .put("/api/users/vendorRegis",{companyName,companyRegNo,companyEmail,companyAddress},config)
      .then((res)=>{
        setLoading(false)
        window.location.href=res.data.url
      } )
      .catch(err => {
        setMsg(err.response.data.message)
        setLoading(false)
        setError(true)
        setTimeout(()=>{setError(false); setMsg('')}, 6000)
      });
  }
  return (
    <>
      <a href='#' onClick={showDrawer}>
       {userInfo? userInfo.userType == 'admin' || userInfo.userType =='vendor'?'Update Seller Information':' Want to Sell on istudio?' :''}
      </a>
      <Drawer
        title="Create a Seller account"
        width={720}
        onClose={onClose}
        visible={visible}
        bodyStyle={{ paddingBottom: 80 }}
        footer={
          <div
            style={{
              textAlign: "right",
            }}
          >
            <Button onClick={onClose} style={{ marginRight: 8 }}>
              Cancel
            </Button>
            <Button form="vendor_form" type="primary" htmlType="submit">
              Submit
            </Button>
          </div>
        }
      >
         <div style={{display: loading?'initial':'none'}}>
          <Loader />
        </div>
      <div style={{display: loading?'none':'initial'}}>
        <Form layout="vertical" onFinish={SubmitForm} id="vendor_form" hideRequiredMark>
          {error&&<Alert variant='danger'>{msg}</Alert>}
          {/* <Row>
            <Col>
              <input value={companyName}/>
            </Col>
          </Row> */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="CompanyName"
                label="Company Name"
                initialValue={companyName}
                rules={[
                  { required: true, message: "Please enter Company Name" },
                ]}
              >
                <Input placeholder="Please enter Company Name" value={companyName} onChange={(e) => {setCompanyName(e.target.value)}} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="companyEmail"
                label="company Email"
                initialValue={companyEmail}
                rules={[
                  { required: true, message: "Please enter Cpmpany Email" },
                ]}
              >
                <Input placeholder="Please enter company Email" value={companyEmail} onChange={(e) => {setCompanyEmail(e.target.value)}} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
            <Form.Item
                name="street1"
                label="Company Address 1"
                initialValue={street1}
                rules={[
                  { required: true, message: "Please enter Company Address 1" },
                ]}
              >
                <Input value={street1}
                            onChange={(e) => {setStreet1(e.target.value)}} placeholder="Please enter Company Address 1" />
              </Form.Item>
            </Col>
            <Col span={12}>
            <Form.Item
                name="street2"
                label="Company Address 2"
                initialValue={street2}
                rules={[{ required: false }]}
              >
                <Input placeholder="Please enter Company Address 2" value={street2}
                            onChange={(e) => {setStreet2(e.target.value)}} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
            <Form.Item
                name="city"
                label="City"
                initialValue={city}
                rules={[{ required: true, message: "Please enter City" }]}
              >
                <Input placeholder="Please enter city" value={city}
                            onChange={(e) => {setCity(e.target.value)}} />
              </Form.Item>
            </Col>
            <Col span={12}>
            <Form.Item
                name="comp_state"
                label="State"
                initialValue={comp_state}
                rules={[{ required: true, message: "Please enter State" }]}
              >
                <Input placeholder="Please enter State" value={comp_state}
                            onChange={(e) => {setcompState(e.target.value)}} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
            <Form.Item
                name="comp_country"
                label="Country"
                initialValue={comp_country}
                rules={[{ required: true, message: "Please enter Country" }]}
              >
                <Select
                  showSearch
                  placeholder="Please select Country"
                  value={comp_country}
                  optionFilterProp="children"
                  onChange={(e)=>{setcompCountry(e)}}
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  filterSort={(optionA, optionB) =>
                    optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                  }
                >
                 {
                   countryList.length != 0 ?
                   countryList.map((e, i)=>(
                     <Option key={i} value={e.code}>{`${e.name}(${e.code})`}</Option>
                   ))
                   :
                   <></>
                 }
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
            <Form.Item
                name="zip"
                label="Zip Code"
                initialValue={zip}
                rules={[{ required: true, message: "Please enter zip code" }]}
              >
                <Input placeholder="Please enter zip code" value={zip}
                            onChange={(e) => {setZip(e.target.value)}} />
              </Form.Item>
            </Col>
          </Row>
        
        </Form>
        </div>
      </Drawer>
    </>
  );
};
export default VendorDrawerForm;
