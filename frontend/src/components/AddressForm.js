import React, { useState,useEffect } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import Axios from "axios";
import Message from "./Message";
const AddressForm = (props) => {
  const [FirstName, setFirstName] = useState(props.Address.FirstName);
  const [LastName, setLastName] = useState(props.Address.LastName);
  const [PhoneNo, setPhoneNo] = useState(props.Address.PhoneNo);
  const [Email, setEmail] = useState(props.Address.Email);
  const [Address1, setAddress1] = useState(props.Address.Address1);
  const [Address2, setAddress2] = useState(props.Address.Address2);
  const [City, setCity] = useState(props.Address.City);
  const [State, setState] = useState(props.Address.State);
  const [Country, setCountry] = useState(props.Address.Country);
  const [Zip, setZip] = useState(props.Address.Zip);

  const [countryList, setCountryList] = useState(()=>[])
  const [err, setErr] = useState(()=>'')

  useEffect(()=>{
    Axios.get(`api/miscellaneous/country-codes`)
    .then((res)=>{
      setCountryList(res.data)
    })
    .catch((err)=>{
      console.log(err)
    })
  }, [])
  useEffect(() => {
    setFirstName(props.Address.FirstName);
    setLastName(props.Address.LastName);
    setPhoneNo(props.Address.PhoneNo);
    setEmail(props.Address.Email);
    setAddress1(props.Address.Address1);
    setAddress2(props.Address.Address2);
    setCity(props.Address.City);
    setState(props.Address.State);
    setCountry(props.Address.Country);
    setZip(props.Address.Zip);
  }, [props.Address])
  const submitHandler = (e) => {
    e.preventDefault();
    let formData = {
      FirstName: FirstName,
      LastName: LastName,
      Email: Email,
      PhoneNo: PhoneNo,
      Address1: Address1,
      Address2: Address2,
      Zip: Zip,
      City: City,
      State: State,
      Country: Country,
    };
    let userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    console.log(formData);
    Axios.put(
      "/api/users/" + props.Address._id + "/addresses",
      formData,
      config
    )
      .then((res) => {
        props.formHandler(res);
      })
      .catch((err) => {
        setErr(err.response.data.detail.__all__[0])
        setTimeout(()=>{setErr('')}, 4000)
      });
  };
  const FirstNameHandler = (e) => {
    console.warn(e);
    setFirstName(e.target.value);
  };
  const LastNameHandler = (e) => {
    setLastName(e.target.value);
  };
  const EmailHandler = (e) => {
    setEmail(e.target.value);
  };
  const PhoneNoHandler = (e) => {
    setPhoneNo(e.target.value);
  };
  const Address1Handler = (e) => {
    setAddress1(e.target.value);
  };
  const Address2Handler = (e) => {
    setAddress2(e.target.value);
  };
  const CityHandler = (e) => {
    setCity(e.target.value);
  };

  const StateHandler = (e) => {
    setState(e.target.value);
  };

  const CountryHandler = (e) => {
    setCountry(e.target.value);
  };

  const ZipHandler = (e) => {
    setZip(e.target.value);
  };
  
  return (
    <>
    <Form onSubmit={submitHandler}>
      <Row>
        <Col>
           {err && <Message variant='danger'>{err}</Message>}
        </Col>
      </Row>
      <Row>
        <Col md={6} className="input-feild">
          <Form.Group controlId="editAddressFullName">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              type="text"
              onChange={FirstNameHandler}
              defaultValue={FirstName}
              placeholder=""
            />
          </Form.Group>
        </Col>
        <Col md={6} className="input-feild">
          <Form.Group controlId="editAddressLastName">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              onChange={LastNameHandler}
              defaultValue={LastName}
              placeholder=""
            />
          </Form.Group>
        </Col>
        <Col md={6} className="input-feild">
          <Form.Group controlId="editAddressEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              onChange={EmailHandler}
              defaultValue={Email}
              placeholder=""
            />
          </Form.Group>
        </Col>
        <Col md={6} className="input-feild">
          <Form.Group controlId="editAddressPhone">
            <Form.Label>Phone</Form.Label>
            <Form.Control
              type="number"
              onChange={PhoneNoHandler}
              defaultValue={PhoneNo}
              placeholder=""
            />
          </Form.Group>
        </Col>
        <Col md={6} className="input-feild">
          <Form.Group controlId="editAddressAddress1">
            <Form.Label>Address-1</Form.Label>
            <Form.Control
              type="text"
              defaultValue={Address1}
              placeholder=""
              onChange={Address1Handler}
            />
          </Form.Group>
        </Col>
        <Col md={6} className="input-feild">
          <Form.Group controlId="editAddressAddress2">
            <Form.Label>Address-2</Form.Label>
            <Form.Control
              type="text"
              defaultValue={Address2}
              placeholder=""
              onChange={Address2Handler}
            />
          </Form.Group>
        </Col>
        <Col md={6} className="input-feild">
          <Form.Group controlId="editAddressSelectCity">
            <Form.Label>City</Form.Label>
            <Form.Control
              type="text"
              defaultValue={City}
              placeholder=""
              onChange={CityHandler}
            />
          </Form.Group>
        </Col>
        <Col md={6} className="input-feild">
          <Form.Group controlId="editCountrySelectCity">
            <Form.Label>Country</Form.Label>
            <Form.Control as="select"
              type="text"
              defaultValue={Country}
              value={Country}
              placeholder="Select Country"
              onChange={CountryHandler}
            >
              <option value="">{""}</option>
              {
                countryList.length != 0?
                countryList.map((e, i)=>(
                  <option value={e.code} key={i}>{`${e.name}(${e.code})`}</option>
                ))
                :
                <></>
              }
              </Form.Control>
          </Form.Group>
        </Col>
        <Col md={6} className="input-feild">
          <Form.Group controlId="editStateSelectState">
            <Form.Label>State</Form.Label>
            <Form.Control
              type="text"
              defaultValue={State}
              placeholder=""
              onChange={StateHandler}
            />
          </Form.Group>
        </Col>
        <Col md={6} className="input-feild">
          <Form.Group controlId="editAddressZipCode">
            <Form.Label>Zip Code</Form.Label>
            <Form.Control
              type="number"
              onChange={ZipHandler}
              defaultValue={Zip}
              placeholder=""
            />
          </Form.Group>
        </Col>
        <Col md={12} className="input-feild">
          <Button type="submit" className="btn">
            Save Address
          </Button>
        </Col>
      </Row>
    </Form>
    </>
  );
};
export default AddressForm;
