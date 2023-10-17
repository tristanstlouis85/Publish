import React, { useState, useEffect } from "react";
import { isEmpty } from "lodash";
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'

import {
  Container,
  Row,
  Col,
  Card,
  Alert,
  CardBody,
  Button,
  Label,
  Input,
  FormFeedback,
  Form,
} from "reactstrap";

// Formik Validation
import * as Yup from "yup";
import { useFormik } from "formik";

//redux
import { useSelector, useDispatch } from "react-redux";

import avatar from "../../assets/images/users/avatar-1.jpg";
// actions
import { editProfile, resetProfileFlag } from "../../slices/thunks";

const UserProfile = () => {
  const dispatch = useDispatch();

  const [displayName, setDisplayName] = useState("");
  const [email, setemail] = useState("");
  const [idx, setidx] = useState("1");
  const [photoUrl, setPhotoUrl] = useState();
  const [phoneNumber, setPhoneNumber] = useState("")

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [userName, setUserName] = useState("Admin");

  const [editProfileModal, setEditProfileModal] = useState(false);
  const [resetPasswordModal, setResetPasswordModal] = useState(false);

  const { user, success, error } = useSelector(state => ({
    user: state.Profile.user,
    success: state.Profile.success,
    error: state.Profile.error
  }));

  useEffect(() => {
    if (localStorage.getItem("authUser")) {
      const obj = JSON.parse(localStorage.getItem("authUser"));

      if (!isEmpty(user)) {
        obj.first_name = user.first_name;
        localStorage.removeItem("authUser");
        localStorage.setItem("authUser", JSON.stringify(obj));
      }

      setUserName(obj.first_name);
      setDisplayName(obj.displayName);
      setemail(obj.email);
      setidx(obj._id || "1");
      setPhotoUrl(obj.photoURL);
      setPhoneNumber(obj.providerData[0].phoneNumber ?? "");

      setTimeout(() => {
        dispatch(resetProfileFlag());
      }, 3000);
    }
  }, [dispatch, user]);

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      displayName: displayName || 'Admin',
      email: email || '',
      phoneNumber: phoneNumber || '',
      idx: idx || '',
    },
    validationSchema: Yup.object({
      displayName: Yup.string().required("Please Enter Your Display Name"),
    }),
    onSubmit: (values) => {
      dispatch(editProfile(values));
    }
  });

  const validatePasswordReset = () => {}

  function toggleProfileEditModal() {
    setEditProfileModal(!editProfileModal);
  }

  function toggleResetPasswordModal() {
    setResetPasswordModal(!resetPasswordModal);
  }
  

  document.title = "Profile | SalesPulse";
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Row>
            <Col lg="12">
              {error && error ? <Alert color="danger">{error}</Alert> : null}
              {success ? <Alert color="success">Username Updated To {userName}</Alert> : null}

              <Card>
                <CardBody>
                  <div className="d-flex">
                    <div className="mx-3">
                      <img
                        src={photoUrl || avatar}
                        alt=""
                        className="avatar-md rounded-circle img-thumbnail"
                      />
                    </div>
                    <div className="flex-grow-1 align-self-center">
                      <div className="text-muted">
                        <h5>{displayName}</h5>
                        <p className="mb-1">{email}</p>
                        <p className="mb-1">{phoneNumber}</p>
                        <Button color="primary" onClick={toggleProfileEditModal} name="Edit profile">Edit Profile</Button>
                        {/* <p className="mb-0">Id No : #{idx}</p> */}
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
              <Card>
                <CardBody>
                  <div className="d-flex">
                    <div className="flex-grow-1 align-self-center">
                      <div className="text-muted">
                        <Button color="primary" name="resetPassword" onClick={toggleResetPasswordModal}>Reset Account Password</Button>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Modal id="editProfileModal" isOpen={editProfileModal} toggle={toggleProfileEditModal}>
            <ModalHeader>
              <h5 className="modal-title" id="editProfileModal">Edit Profile</h5>
              <Button type="button" className="btn-close" onClick={() => {setEditProfileModal(false);}} aria-label="Close"></Button>
            </ModalHeader>
            <ModalBody>
                <Form  
                      id="editProfileForm" 
                      className="form-horizontal"
                      onSubmit={(e) => {
                      e.preventDefault();
                      // validation.handleSubmit();
                      toggleProfileEditModal();
                      return false;
                    }}
                  >
                    <div className="mb-3">
                      <Label htmlFor="displayName" className="form-label">Display Name</Label>
                      <Input
                        name="display-name"
                        className="form-control"
                        placeholder="Enter Display Name"
                        type="text"
                        // onChange={validation.handleChange}
                        // onBlur={validation.handleBlur}
                        value={validation.values.displayName || ""}
                        // invalid={
                        //   validation.touched.displayName && validation.errors.displayName ? true : false
                        // }
                      />
                    </div>
                    <div className="mb-3">
                      <Label htmlFor="email" className="form-label">Email</Label>
                      <Input
                        name="email"
                        className="form-control"
                        placeholder="Enter Email"
                        type="text"
                        // onChange={validation.handleChange}
                        // onBlur={validation.handleBlur}
                        value={validation.values.email || ""}
                        // invalid={
                        //   validation.touched.email && validation.errors.email ? true : false
                        // }
                      />
                      {/* {validation.touched.email && validation.errors.email ? (
                        <FormFeedback type="invalid">{validation.errors.email}</FormFeedback>
                      ) : null} */}
                    </div>
                    <div className="mb-3">
                      <Label htmlFor="phoneNumber" className="form-label">Phone Number</Label>
                      <Input
                        name="phoneNumber"
                        className="form-control"
                        placeholder="Enter Phone Number"
                        type="text"
                        // onChange={validation.handleChange}
                        // onBlur={validation.handleBlur}
                        value={validation.values.phoneNumber || ""}
                        // invalid={
                        //   validation.touched.phoneNumber && validation.errors.phoneNumber ? true : false
                        // }
                      />
                      {/* {validation.touched.phoneNumber && validation.errors.phoneNumber ? (
                        <FormFeedback type="invalid">{validation.errors.phoneNumber}</FormFeedback>
                      ) : null} */}
                    </div>
                      <Input name="idx" value={idx} type="hidden" />
                  </Form>
        </ModalBody>
        <ModalFooter>
            <Button color="light" onClick={toggleProfileEditModal}>Cancel</Button>
            <Button type="submit" form="editProfileForm" color="primary">Save changes</Button>
        </ModalFooter>
    </Modal>

    <Modal id="resetPasswordModal" isOpen={resetPasswordModal} toggle={toggleResetPasswordModal}>
            <ModalHeader>
              <h5 className="modal-title" id="resetpasswordModal">Reset Password</h5>
              <Button type="button" className="btn-close" onClick={() => {setResetPasswordModal(false);}} aria-label="Close"></Button>
            </ModalHeader>
            <ModalBody>
                <Form  
                      id="resetPasswordForm" 
                      className="form-horizontal"
                      onSubmit={(e) => {
                      e.preventDefault();
                      // validatePasswordReset.handleSubmit();
                      toggleResetPasswordModal();
                      return false;
                    }}
                  >
                    <div className="mb-3">
                      <Label htmlFor="newPassword" className="form-label">New Password</Label>
                      <Input
                        name="newPassword"
                        className="form-control"
                        placeholder="Enter New Password"
                        type="text"
                        // onChange={validatePasswordReset.handleChange}
                        // onBlur={validatePasswordReset.handleBlur}
                        // value={validatePasswordReset.values.newPassword || ""}
                        // invalid={
                        //   validavalidatePasswordReset.touched.newPassword && validatePasswordReset.errors.newPassword ? true : false
                        // }
                      />
                      {/* {validatePasswordReset.touched.newPassword && validatePasswordReset.errors.newPassword ? (
                        <FormFeedback type="invalid">{validatePasswordReset.errors.newPassword}</FormFeedback>
                      ) : null} */}
                    </div>
                    <div className="mb-3">
                      <Label htmlFor="confirmPassword" className="form-label">Confirm Password</Label>
                      <Input
                        name="confirmPassword"
                        className="form-control"
                        placeholder="Confirm Password"
                        type="text"
                        // onChange={validatePasswordReset.handleChange}
                        // onBlur={validatePasswordReset.handleBlur}
                        // value={validatePasswordReset.values.confirmPassword || ""}
                        // invalid={
                        //   validatePasswordReset.touched.confirmPassword && validatePasswordReset.errors.confirmPassword ? true : false
                        // }
                      />
                      {/* {validatePasswordReset.touched.confirmPassword && validatePasswordReset.errors.confirmPassword ? (
                        <FormFeedback type="invalid">{validatePasswordReset.errors.confirmPassword}</FormFeedback>
                      ) : null} */}
                    </div>
                  </Form>
        </ModalBody>
        <ModalFooter>
            <Button color="light" onClick={toggleResetPasswordModal}>Cancel</Button>
            <Button type="submit" form="resetPasswordForm" color="primary">Save changes</Button>
        </ModalFooter>
    </Modal>

        </Container>
      </div>
    </React.Fragment>
  );
};

export default UserProfile;
