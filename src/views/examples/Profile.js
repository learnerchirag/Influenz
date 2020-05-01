import React from "react";

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  Container,
  Row,
  Col,
} from "reactstrap";
// core components
import UserHeader from "components/Headers/UserHeader.js";
import { Redirect } from "react-router-dom";
import { Spinner } from "reactstrap";
import Cookies from "universal-cookie";
import cogoToast from "cogo-toast";
import api from "../constants/api";
import AdminNavbar from "../../components/Navbars/AdminNavbar.js";
import AdminFooter from "../../components/Footers/AdminFooter.js";
import Axios from "axios";
import { confirmAlert } from "react-confirm-alert";
const cookies = new Cookies();

class Profile extends React.Component {
  state = {
    isLoading: false,
    name: "",
    email: "",
    designation: "",
    company_name: "",
    company_logo: "",
    country_code: "",
    phone_number: "",
    pancard: "",
    address: "",
    city: "",
    country: "",
    pincode: "",
    uuid: "",
    original_password: "",
    new_password: "",
    new_password_confirm: "",
    hidden: true,
  };
  componentDidMount = () => {
    const token = cookies.get("Auth-token");
    Axios.get(`${api.protocol}${api.baseUrl}${api.profile}`, {
      headers: { Authorization: "Bearer " + token },
    }).then((result) => {
      console.log(result);
      this.setState({
        uuid: result.data.payload.uuid,
        name: result.data.payload.name,
        email: result.data.payload.email,
        company_name: result.data.payload.company_name,
        designation: result.data.payload.designation,
        country_code: result.data.payload.country_code,
        phone_number: result.data.payload.phone_number,
        pancard: result.data.payload.pancard,
        address: result.data.payload.address,
        city: result.data.payload.city,
        country: result.data.payload.country,
        pincode: result.data.payload.pincode,
      });
    });
  };
  handleInputChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };
  handleProfile = () => {
    const token = cookies.get("Auth-token");
    var modelOpen = true;
    modelOpen &&
      confirmAlert({
        title: "Cofirm to save changes",
        message: "Click confirm to save changes to profile",
        buttons: [
          {
            label: "Confirm",
            onClick: () => {
              Axios.put(
                `${api.protocol}${api.baseUrl}${api.profile}`,
                this.state,
                {
                  headers: { Authorization: "Bearer " + token },
                }
              ).then((result) => {
                result.data.status
                  ? cogoToast.success(result.data.message)
                  : cogoToast.error(result.data.message);
                window.location.reload(true);
              });
            },
          },
          {
            label: "Cancel",
            onClick: () => (modelOpen = false),
          },
        ],
      });
  };
  handlePassword = () => {
    const token = cookies.get("Auth-token");
    if (
      this.state.original_password === "" ||
      this.state.new_password === "" ||
      this.state.new_password_confirm === ""
    ) {
      cogoToast.error("All the fields are required");
    } else if (this.state.new_password_confirm !== this.state.new_password) {
      cogoToast.error("New password did not match");
    } else {
      var modelOpen = true;
      modelOpen &&
        confirmAlert({
          title: "Cofirm to change password",
          message: "Click confirm to change password",
          buttons: [
            {
              label: "Confirm",
              onClick: () => {
                Axios.put(
                  `${api.protocol}${api.baseUrl}${api.password}`,
                  {
                    original_password: this.state.original_password,
                    new_password: this.state.new_password,
                    new_password_confirm: this.state.new_password_confirm,
                  },
                  {
                    headers: { Authorization: "Bearer " + token },
                  }
                ).then((result) => {
                  result.data.status &&
                    cogoToast.success("Password changed successfully");
                  !result.data.status &&
                    cogoToast.error("Password entered is incorrect");

                  modelOpen = false;
                });
              },
            },
            {
              label: "Cancel",
              onClick: () => (modelOpen = false),
            },
          ],
        });
    }
  };
  handleCookieRedirect = () => {
    cogoToast.error("You need to Sign in first");
    console.log("function");
  };
  getBrandText = (path) => {
    return "My Campaigns";
  };
  handleLoader = (status) => {
    this.setState({
      isLoading: status,
    });
  };
  render() {
    return (
      <>
        {!cookies.get("Auth-token") && (
          <React.Fragment>
            <Redirect to="/login"></Redirect>
            {this.handleCookieRedirect()}
            {/* {cogoToast.error("You need to Signin first")} */}
          </React.Fragment>
        )}
        {cookies.get("Auth-token") && this.state.isLoading ? (
          <Spinner
            style={{
              width: "3rem",
              height: "3rem",
              position: "absolute",
              top: "50%",
              color: "black",
              display: "block",
              right: "50%",
            }}
          />
        ) : (
          <React.Fragment>
            <div className="main-content" ref="mainContent">
              <AdminNavbar
                {...this.props}
                brandText={this.getBrandText(this.props.location.pathname)}
                title="My Profile"
              />
              <UserHeader />
              {/* Page content */}
              <Container className="mt--7" fluid>
                <Row>
                  <Col className="order-2  mb-xl-0" xl="4">
                    <Card className="card-profile shadow">
                      <CardHeader className="text-center border-0 ">
                        <Row>
                          <Col>
                            <h2>Change password</h2>
                          </Col>
                          <Col>
                            <Button
                              // className="float-right"
                              color="primary"
                              onClick={this.handlePassword}
                              size="md"
                            >
                              Confirm password
                            </Button>
                          </Col>
                        </Row>
                      </CardHeader>
                      <CardBody className="pt-0 pt-md-4">
                        <Form>
                          <h6 className="heading-small text-muted mb-4">
                            Change password
                          </h6>
                          <div className="pl-lg-4">
                            <Row>
                              <Col>
                                <FormGroup>
                                  <label
                                    className="form-control-label"
                                    htmlFor="input-password"
                                  >
                                    Old-password
                                  </label>
                                  <Input
                                    className="form-control-alternative"
                                    id="input-password"
                                    placeholder="old password"
                                    onChange={this.handleInputChange}
                                    value={this.state.original_password}
                                    name="original_password"
                                    type={
                                      this.state.hidden ? "password" : "text"
                                    }
                                  />
                                </FormGroup>
                              </Col>
                            </Row>

                            <Row>
                              <Col>
                                <FormGroup>
                                  <label
                                    className="form-control-label"
                                    htmlFor="input-new-password"
                                  >
                                    New-password
                                  </label>
                                  <Input
                                    className="form-control-alternative"
                                    id="input-new-password"
                                    placeholder="new password"
                                    onChange={this.handleInputChange}
                                    value={this.state.new_password}
                                    name="new_password"
                                    type={
                                      this.state.hidden ? "password" : "text"
                                    }
                                  />
                                </FormGroup>
                              </Col>
                            </Row>
                            <Row>
                              <Col>
                                <FormGroup>
                                  <label
                                    className="form-control-label"
                                    htmlFor="input-confirm-password"
                                  >
                                    Confirm-password
                                  </label>
                                  <Input
                                    invalid={
                                      this.state.new_password_confirm !==
                                      this.state.new_password
                                        ? true
                                        : false
                                    }
                                    className="form-control-alternative"
                                    id="input-confirm-password"
                                    placeholder="rewrite new password"
                                    onChange={this.handleInputChange}
                                    value={this.state.new_password_confirm}
                                    name="new_password_confirm"
                                    type={
                                      this.state.hidden ? "password" : "text"
                                    }
                                  />
                                </FormGroup>
                              </Col>
                            </Row>
                            <Row>
                              <Col>
                                <FormGroup>
                                  <label
                                    className="form-control-label"
                                    style={{ marginLeft: "1.5rem" }}
                                  >
                                    <Input
                                      // className="form-control-alternative"
                                      type="checkbox"
                                      size="md"
                                      onClick={() => {
                                        this.setState({
                                          hidden: this.state.hidden
                                            ? false
                                            : true,
                                        });
                                      }}
                                    ></Input>
                                    Show password
                                  </label>
                                </FormGroup>
                              </Col>
                            </Row>
                          </div>
                        </Form>
                      </CardBody>
                    </Card>
                  </Col>

                  <Col className="order-1 mb-5 mb-xl-0" xl="8">
                    <Card className=" shadow">
                      <CardHeader className="bg-white border-0">
                        <Row className="align-items-center">
                          <Col xs="8">
                            <h2 className="mb-0">My Account</h2>
                          </Col>
                          <Col className="text-right" xs="4">
                            <Button
                              color="primary"
                              // href="#pablo"
                              onClick={this.handleProfile}
                              size="md"
                            >
                              Save profile
                            </Button>
                          </Col>
                        </Row>
                      </CardHeader>
                      <CardBody>
                        <Form>
                          <h6 className="heading-small text-muted mb-4">
                            User information
                          </h6>
                          <div className="pl-lg-4">
                            <Row>
                              <Col lg="6">
                                <FormGroup>
                                  <label
                                    className="form-control-label"
                                    htmlFor="input-first-name"
                                  >
                                    Name
                                  </label>
                                  <Input
                                    className="form-control-alternative"
                                    id="input-first-name"
                                    placeholder="First name"
                                    onChange={this.handleInputChange}
                                    value={this.state.name}
                                    name="name"
                                    type="text"
                                  />
                                </FormGroup>
                              </Col>
                              <Col lg="6">
                                <FormGroup>
                                  <label
                                    className="form-control-label"
                                    htmlFor="input-email"
                                  >
                                    Email
                                  </label>
                                  <Input
                                    className="form-control-alternative"
                                    id="input-email"
                                    placeholder="Email"
                                    value={this.state.email}
                                    readOnly="readonly"
                                    type="text"
                                  />
                                </FormGroup>
                              </Col>
                            </Row>

                            <Row>
                              <Col lg="6">
                                <FormGroup>
                                  <label
                                    className="form-control-label"
                                    htmlFor="input-phone-number"
                                  >
                                    Phone number
                                  </label>
                                  <Input
                                    className="form-control-alternative"
                                    id="input-phone-number"
                                    placeholder="phone"
                                    onChange={this.handleInputChange}
                                    value={this.state.phone_number}
                                    name="phone_number"
                                    type="number"
                                  />
                                </FormGroup>
                              </Col>
                              <Col>
                                <FormGroup>
                                  <label
                                    className="form-control-label"
                                    htmlFor="input-designation"
                                  >
                                    Designation
                                  </label>
                                  <Input
                                    className="form-control-alternative"
                                    id="input-designation"
                                    placeholder="Designation"
                                    onChange={this.handleInputChange}
                                    value={this.state.designation}
                                    name="designation"
                                    type="text"
                                  />
                                </FormGroup>
                              </Col>
                            </Row>
                          </div>
                          <hr className="my-4" />
                          {/* Address */}
                          <h6 className="heading-small text-muted mb-4">
                            Contact information
                          </h6>
                          <div className="pl-lg-4">
                            <Row>
                              <Col md="12">
                                <FormGroup>
                                  <label
                                    className="form-control-label"
                                    htmlFor="input-address"
                                  >
                                    Address
                                  </label>
                                  <Input
                                    className="form-control-alternative"
                                    id="input-address"
                                    placeholder="Home Address"
                                    name="address"
                                    onChange={this.handleInputChange}
                                    value={this.state.address}
                                    type="text"
                                  />
                                </FormGroup>
                              </Col>
                            </Row>
                            <Row>
                              <Col lg="4">
                                <FormGroup>
                                  <label
                                    className="form-control-label"
                                    htmlFor="input-city"
                                  >
                                    City
                                  </label>
                                  <Input
                                    className="form-control-alternative"
                                    id="input-city"
                                    placeholder="City"
                                    name="city"
                                    onChange={this.handleInputChange}
                                    value={this.state.city}
                                    type="text"
                                  />
                                </FormGroup>
                              </Col>
                              <Col lg="4">
                                <FormGroup>
                                  <label
                                    className="form-control-label"
                                    htmlFor="input-country"
                                  >
                                    Country
                                  </label>
                                  <Input
                                    className="form-control-alternative"
                                    id="input-country"
                                    placeholder="Country"
                                    name="country"
                                    onChange={this.handleInputChange}
                                    value={this.state.country}
                                    type="text"
                                  />
                                </FormGroup>
                              </Col>
                              <Col lg="4">
                                <FormGroup>
                                  <label
                                    className="form-control-label"
                                    htmlFor="input-country"
                                  >
                                    Postal code
                                  </label>
                                  <Input
                                    className="form-control-alternative"
                                    id="input-postal-code"
                                    placeholder="Postal code"
                                    name="pincode"
                                    onChange={this.handleInputChange}
                                    value={this.state.pincode}
                                    type="number"
                                  />
                                </FormGroup>
                              </Col>
                            </Row>
                          </div>
                          <hr className="my-4" />
                          {/* Description */}
                          <h6 className="heading-small text-muted mb-4">
                            Company information
                          </h6>
                          <div className="pl-lg-4">
                            <Row>
                              <Col>
                                <FormGroup>
                                  <label>Company name</label>
                                  <Input
                                    className="form-control-alternative"
                                    placeholder="Company name"
                                    // rows="4"
                                    name="company_name"
                                    onChange={this.handleInputChange}
                                    value={this.state.company_name}
                                    type="text"
                                  />
                                </FormGroup>
                              </Col>
                              <Col>
                                <FormGroup>
                                  <label>PAN card</label>
                                  <Input
                                    className="form-control-alternative"
                                    placeholder="Pan Card"
                                    // rows="4"
                                    name="pincode"
                                    vlaue={this.state.pincode}
                                    type="text"
                                  />
                                </FormGroup>
                              </Col>
                            </Row>
                          </div>
                        </Form>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
              </Container>
              <Container fluid>
                <AdminFooter />
              </Container>
            </div>
          </React.Fragment>
        )}
      </>
    );
  }
}

export default Profile;
