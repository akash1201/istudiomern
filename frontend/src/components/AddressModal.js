import React from "react";
import { Modal } from "react-bootstrap";
import AddressForm from "./AddressForm";
const AddressModal = (props) => {
  const show = props.show;
  const handleClose = () => {
    props.CloseModal();
  };

  const FormSubmit = (res) => {
    props.CloseModal("Address successfully updated");
    // let userInfo = JSON.parse(localStorage.getItem("userInfo"));

    // const config = {
    //   headers: {
    //     Authorization: `Bearer ${userInfo.token}`,
    //   },
    // };

    // console.log(props.Address._id);
    // console.log(formData);
    // Axios.put(
    //   "/api/users/" + props.Address._id + "/addresses",
    //   formData,
    //   config
    // )
    //   .then((res) => {
    //     props.CloseModal("Address successfully updated");
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
  };

  return (
    <Modal className="addressEdit" show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <h5 className="modal-title">Edit Address</h5>
      </Modal.Header>
      <Modal.Body>
        <div className="editFormAdress">
          <AddressForm Address={props.Address} formHandler={FormSubmit} />
        </div>
      </Modal.Body>
    </Modal>
  );
};
export default AddressModal;
