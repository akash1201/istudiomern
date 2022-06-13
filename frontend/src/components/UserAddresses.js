import React, { useState } from "react";
import { Row } from "react-bootstrap";
import Address from "./Address";
import Axios from "axios";
import AddressModal from "./AddressModal";
import Message from "../components/Message";
const UserAddresses = (props) => {
  const addressClassName= props.profile?'save-address profileSaveAdd':'save-address'
  const [SelectedAddress, setSelectedAddress] = useState(null);
  const [AddressesData, setAddressesData] = useState(props.Addresses)
  //const [success,setSuccess]=useState(props.success)
  const [ModalStatus, setModalStatus] = useState(false);
  const CallModal = (SelAddress) => {
    if (SelAddress.FirstName) {
      setSelectedAddress(SelAddress);
    } else {
      setSelectedAddress({});
    }
    setModalStatus(true);
  };
  const CloseModalFunction = (status = false) => {
    setModalStatus(false);
    props.AddressUpdHandler(status);
  };
  const updDelivery=(AddressData)=>{
    props.updDelivery(AddressData)
  }
  const deleteHandler=(addId)=>{
    
    let userInfo = JSON.parse(localStorage.getItem("userInfo"));

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    Axios.delete(
      "/api/users/" + addId + "/addresses",
      config
    )
      .then((res) => {
        props.AddressUpdHandler("Address successfully deleted")
      })
      .catch((err) => {
        console.log(err);
      });
  }
  return (
    <div className="paymentMethod-main">
      {props.profile && <div className="row">
        <div className="col-sm-11">
          <h4 className="heading">Manage Addresses</h4>
        </div>
        <div className="col-sm-1">
          <i
            className="las la-plus-square fa-3x"
            style={{ float: "right", margin: "22px", cursor: "pointer", fontSize: "26px" }}
            onClick={CallModal}
          ></i>
        </div>
      </div>}

      <div className={addressClassName}>
        {props.success && (
          <Message variant="success">{props.success}</Message>
        )}
        <Row>
          {props.Addresses &&
            props.Addresses.map(function (UserAddress, Index) {
              return (
                <Address
                  key={Index}
                  ModalCaller={CallModal}
                  Address={UserAddress} deleteHandler={deleteHandler} updDelivery={updDelivery} isProfilepage={props.profile}
                />
              );
            })}
        </Row>
        <AddressModal
          Address={SelectedAddress}
          show={ModalStatus}
          CloseModal={CloseModalFunction}
        />
      </div>
    </div>
  );
};
export default UserAddresses;
