/*!

=========================================================
* Argon Dashboard React - v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
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

import AdminNavbar from "../../components/Navbars/AdminNavbar.js";
import AdminFooter from "../../components/Footers/AdminFooter.js";
const cookies = new Cookies();

class Profile extends React.Component {
  state = {
    isLoading: false,
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
                title="User Profile"
              />
              <UserHeader />
              {/* Page content */}
              <Container className="mt--7" fluid>
                <Row>
                  {/* <Col className="order-xl-2 mb-5 mb-xl-0" xl="4">
                    <Card className="card-profile shadow">
                      <Row className="justify-content-center">
                        <Col className="order-lg-2" lg="3">
                          <div className="card-profile-image">
                            <a
                              href="#pablo"
                              onClick={(e) => e.preventDefault()}
                            >
                              <img
                                alt="..."
                                className="rounded-circle"
                                src={require("assets/img/theme/team-4-800x800.jpg")}
                              />
                            </a>
                          </div>
                        </Col>
                      </Row>
                      <CardHeader className="text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4">
                        <div className="d-flex justify-content-between">
                          <Button
                            className="mr-4"
                            color="info"
                            href="#pablo"
                            onClick={(e) => e.preventDefault()}
                            size="sm"
                          >
                            Connect
                          </Button>
                          <Button
                            className="float-right"
                            color="default"
                            href="#pablo"
                            onClick={(e) => e.preventDefault()}
                            size="sm"
                          >
                            Message
                          </Button>
                        </div>
                      </CardHeader>
                      <CardBody className="pt-0 pt-md-4">
                        <Row>
                          <div className="col">
                            <div className="card-profile-stats d-flex justify-content-center mt-md-5">
                              <div>
                                <span className="heading">22</span>
                                <span className="description">Friends</span>
                              </div>
                              <div>
                                <span className="heading">10</span>
                                <span className="description">Photos</span>
                              </div>
                              <div>
                                <span className="heading">89</span>
                                <span className="description">Comments</span>
                              </div>
                            </div>
                          </div>
                        </Row>
                        <div className="text-center">
                          <h3>
                            Jessica Jones
                            <span className="font-weight-light">, 27</span>
                          </h3>
                          <div className="h5 font-weight-300">
                            <i className="ni location_pin mr-2" />
                            Bucharest, Romania
                          </div>
                          <div className="h5 mt-4">
                            <i className="ni business_briefcase-24 mr-2" />
                            Solution Manager - Creative Tim Officer
                          </div>
                          <div>
                            <i className="ni education_hat mr-2" />
                            University of Computer Science
                          </div>
                          <hr className="my-4" />
                          <p>
                            Ryan — the name taken by Melbourne-raised,
                            Brooklyn-based Nick Murphy — writes, performs and
                            records all of his own music.
                          </p>
                          <a href="#pablo" onClick={(e) => e.preventDefault()}>
                            Show more
                          </a>
                        </div>
                      </CardBody>
                    </Card>
                  </Col>
                  */}
                  <Col className="order-xl-1 mx-auto" xs="8">
                    <Card className="bg-secondary shadow">
                      <CardHeader className="bg-white border-0">
                        <Row className="align-items-center">
                          <Col xs="8">
                            <h3 className="mb-0">My account</h3>
                          </Col>
                          <Col className="text-right" xs="4">
                            <Button
                              color="primary"
                              href="#pablo"
                              onClick={(e) => e.preventDefault()}
                              size="sm"
                            >
                              Settings
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
                                    First name
                                  </label>
                                  <Input
                                    className="form-control-alternative"
                                    id="input-first-name"
                                    placeholder="First name"
                                    type="text"
                                  />
                                </FormGroup>
                              </Col>
                              <Col lg="6">
                                <FormGroup>
                                  <label
                                    className="form-control-label"
                                    htmlFor="input-last-name"
                                  >
                                    Last name
                                  </label>
                                  <Input
                                    className="form-control-alternative"
                                    id="input-last-name"
                                    placeholder="Last name"
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
                                    type="number"
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
                                    placeholder="A few words about you ..."
                                    // rows="4"

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
