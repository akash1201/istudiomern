import React from "react";
import { Col } from "react-bootstrap";
import { Popconfirm } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
const Address = (props) => {
  let Address = props.Address;
  const DeleteAddressModal = (addId) => {
    props.deleteHandler(addId);
  };
  const OpenAddressModal = (Address) => {
    props.ModalCaller(Address);
  };
  const DeliveryAddress=(Address)=>{
    props.updDelivery(Address)
  }
  return (
    <Col sm={12} md={6} xl={4}>
      <figure className="full-size single-address">
        <h5>{Address.FirstName }{ Address.LastName? " "+Address.LastName : ''}</h5>
        <p>
          {Address.Address1 +
            " " +
                `${Address.Address2?Address.Address2: ''}`+
            " " +
            Address.City +
            " " +
            Address.Country +
            " " +
            Address.State +
            " " +
            Address.Zip}
        </p>
        <div className="button">
          {!props.isProfilepage && <a className="deliver"  onClick={()=>{ DeliveryAddress(Address) }} >Deliver to this address</a>}
          <div className="bttn">
            <a
              className="edit" 
              onClick={() => OpenAddressModal(Address)}
            >
              <i className="las la-edit"></i> {!props.isProfilepage && 'Edit'}</a>
            <Popconfirm
              title="Are you sure？"
              icon={<QuestionCircleOutlined style={{ color: "red" }} />}
              onConfirm={() => DeleteAddressModal(Address._id)}
            >
              <a className="delete" >
                <i className="las la-trash-alt"></i> {!props.isProfilepage && 'Delete'}
              </a>
            </Popconfirm>
          </div>
        </div>
      </figure>
    </Col>
  );
};
export default Address;
