import React from "react";
// react plugin used to create google maps
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} from "react-google-maps";
import classnames from "classnames";
// reactstrap components
import {
  Card,
  Container,
  Row,
  Button,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroup,
  Col,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from "reactstrap";
// import FileUploadProgress from "react-fileupload-progress";
import Progress from "react-progressbar";

// core components
import Header from "components/Headers/Header.js";
import firebase from "@firebase/app";
import "@firebase/firestore";
import "@firebase/auth";
import "@firebase/storage";
import "@firebase/functions";
import Axios from "axios";
import api from "../constants/api";
import Cookies from "universal-cookie";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { Redirect } from "react-router-dom";
import cogoToast from "cogo-toast";
// import Razorpay from "razorpay";

const cookies = new Cookies();
const token = cookies.get("Auth-token");

// mapTypeId={google.maps.MapTypeId.ROADMAP}

var progress = 0;
class Maps extends React.Component {
  state = {
    name: null,
    company_name: null,
    company_logo: null,
    content: null,
    cta_url: null,
    facebook_url: null,
    instagram_url: null,
    twitter_url: null,
    linkedin_url: null,
    payment_per_click: null,
    image: null,
    selected_image: null,
    progress: 0,
    upload: false,
    activeTab: "1",
    age_max: null,
    age_min: null,
    gender: null,
    current_balance: 0,
    uuid: "",
    transaction_value: 0,
    transaction_id: "",
    transaction_mode: "",
    tab_preference: false,
    tab_recharge: false,
    tab_transaction: false,
  };
  componentDidMount = () => {
    var config = {
      apiKey: "AIzaSyDaH6y6-TmOgugETzqMuKgoj3HxTkDmGV0",
      authDomain: "influenz-7d329.web.app",
      projectNumber: "253623607816",
      databaseUrl: "https://influenz-7d329.firebaseio.com/",
      projectId: "influenz-7d329",
      storageBucket: "influenz-7d329.appspot.com",
    };
    firebase.initializeApp(config);
  };
  handleInputChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };
  handleFile = (event) => {
    this.setState({
      selected_image: event.target.files[0],
    });
  };
  handleUpload = async (index) => {
    // firebase.app()
    const storage = firebase.storage();
    const files = [this.state.selected_image.name];

    await storage
      .ref(files[0])
      .put(this.state.selected_image)
      .then((snap) => {
        progress = (snap.bytesTransferred / snap.totalBytes) * 100;
        this.setState(
          {
            progress: progress,
          },
          () => {
            console.log(this.state.progress);
            progress === 100
              ? this.setState({
                  upload: true,
                })
              : this.setState({
                  upload: false,
                });
          }
        );
        // console.log(this.state.progress, "progress");
      });

    console.log("posting");
    console.log(this.state.selected_image);
    storage
      .ref(files[0])
      .getDownloadURL()
      .then((url) => {
        index === 1
          ? this.setState({
              company_logo: url,
            })
          : this.setState({
              image: url,
            });
        console.log("downloaded url image", url);
      });
  };
  handleToggle = (index) => {
    if (this.state.activeTab !== index) {
      this.setState({ activeTab: index });
    }
  };
  handleSave = () => {
    var isNull = false;
    Object.values(this.state).map((item, index) => {
      if (index !== 15 && index !== 16 && index !== 17) {
        if (item === null) {
          isNull = true;
          console.log(index);
        }
      }
    });
    if (isNull === false) {
      this.setState({
        activeTab: "2",
        tab_preference: true,
      });
    } else {
      cogoToast.error("All the fields are required");
    }
  };
  handleCreate = () => {
    var isNull = false;
    Object.values(this.state).map((item, index) => {
      if (index === 15 || index === 16 || index === 17) {
        if (item === null) {
          isNull = true;
          console.log(index);
        }
      }
    });
    if (isNull === false) {
      console.log(this.state);
      var modelOpen = true;
      modelOpen &&
        confirmAlert({
          title: "Confirm to create campaign",
          message: "Click recharge to Confirm campaign and recharge",
          buttons: [
            {
              label: "Recharge",
              onClick: () => {
                Axios.post(
                  `${api.protocol}${api.baseUrl}${api.campaign}`,
                  this.state,
                  {
                    headers: { Authorization: "Bearer " + token },
                  }
                ).then((result) => {
                  this.setState({
                    activeTab: "3",
                    current_balance: result.data.payload.balance,
                  });
                  console.log(result);
                });
              },
            },
            {
              label: "Later",
              onClick: () => {
                Axios.post(
                  `${api.protocol}${api.baseUrl}${api.campaign}`,
                  this.state,
                  {
                    headers: { Authorization: "Bearer " + token },
                  }
                ).then((result) => {
                  this.props.history.push("/admin/dashboard");
                  console.log(result);
                });
              },
            },
            {
              label: "Cancel",
              onClick: () => (modelOpen = false),
            },
          ],
        });
    } else {
      cogoToast.error("All the fields are required");
    }
  };
  handleTransaction = () => {
    let instance = new window.Razorpay({
      key: "rzp_test_Rwji71ovjqAObr",
      key_secret: "jxKNEN2gyH2uxbZqLjt4tYeN",
      amount: this.state.transaction_value,
      name: "Influenz",
      description: "Adding credit",
      image: "",
      handler: (response) => {
        console.log(response);
        this.setState({
          transaction_id: response.razorpay_payment_id,
        });
      },
      prefill: {
        name: this.state.name,
        // email: "harshil@razorpay.com",
      },
      notes: {
        address: "Hello World",
      },
      theme: {
        color: "#5e72e4",
      },
    });

    // let rzp = new window.Razorpay(options);
    // let instance = new Razorpay(options);
    instance.open();

    // instance.open();
  };
  render() {
    return (
      <>
        <Header />

        <Container className="mt--7" fluid>
          <Row>
            <Col className="order-xl-1" xl="8">
              <Card className="bg-secondary shadow">
                <Nav tabs className="active">
                  <NavItem>
                    <NavLink
                      className={classnames("py-2 px-3", {
                        active: this.state.activeTab === "1",
                        // disable: this.state.activeTab != "1",
                      })}
                      onClick={() => this.handleToggle("1")}
                    >
                      Details
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames("py-2 px-3", {
                        active: this.state.activeTab === "2",
                        // disable: this.state.activeTab != "2",
                      })}
                      style={
                        !this.state.tab_preference && { pointerEvents: "none" }
                      }
                      onClick={() => this.handleToggle("2")}
                    >
                      Preferences
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames("py-2 px-3", {
                        active: this.state.activeTab === "3",
                      })}
                      onClick={() => this.handleToggle("3")}
                    >
                      Recharge
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames("py-2 px-3", {
                        active: this.state.activeTab === "4",
                      })}
                      onClick={() => this.handleToggle("4")}
                    >
                      Transactions
                    </NavLink>
                  </NavItem>
                </Nav>
                <TabContent activeTab={this.state.activeTab}>
                  <TabPane tabId="1">
                    <CardHeader className="bg-white border-0">
                      <Row className="align-items-center">
                        <Col xs="8">
                          <h3 className="mb-0">New Campaign</h3>
                        </Col>
                        {/* <Col className="text-right" xs="4">
                          <Button
                            color="primary"
                            href="#pablo"
                            onClick={(e) => e.preventDefault()}
                            size="sm"
                          >
                            Settings
                          </Button>
                        </Col> */}
                      </Row>
                    </CardHeader>
                    <CardBody>
                      <Form>
                        <h6 className="heading-small text-muted mb-4">
                          Campaign Details
                        </h6>
                        <div className="pl-lg-4">
                          <Row>
                            <Col lg="6">
                              <FormGroup>
                                <label
                                  className="form-control-label"
                                  htmlFor="input-username"
                                >
                                  Campaign name
                                </label>
                                <Input
                                  className="form-control-alternative"
                                  value={this.state.name}
                                  name="name"
                                  onChange={this.handleInputChange}
                                  // placeholder="Username"
                                  type="text"
                                />
                              </FormGroup>
                            </Col>
                            <Col lg="6">
                              <FormGroup>
                                <label
                                  className="form-control-label"
                                  htmlFor="input-first-name"
                                >
                                  Company name
                                </label>
                                <Input
                                  className="form-control-alternative"
                                  value={this.state.company_name}
                                  name="company_name"
                                  onChange={this.handleInputChange}
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
                                  htmlFor="input-last-name"
                                >
                                  Company logo
                                </label>
                                <Input
                                  color="primary"
                                  name="selected_company_logo"
                                  onChange={this.handleFile}
                                  type="file"
                                />
                              </FormGroup>
                            </Col>
                            <Col className="text-right my-auto">
                              {this.state.upload === true && (
                                <img
                                  src={this.state.company_logo}
                                  height="100px"
                                ></img>
                              )}
                              {this.state.upload === false && (
                                <div>
                                  {/* <h4>Uploading...</h4> */}
                                  <Progress completed={this.state.progress} />
                                </div>
                              )}
                              {/* <Progress completed={this.state.progress} /> */}
                            </Col>
                            <Col lg="auto">
                              <Button
                                className="my-4"
                                color="primary"
                                type="button"
                                onClick={() => this.handleUpload(1)}
                              >
                                Upload
                              </Button>
                            </Col>
                          </Row>
                        </div>
                        <hr className="my-4" />
                        {/* Address */}
                        <h6 className="heading-small text-muted mb-4">
                          Social media
                        </h6>
                        <div className="pl-lg-4">
                          <Row>
                            <Col lg="6">
                              <FormGroup>
                                <label
                                  className="form-control-label"
                                  htmlFor="input-address"
                                >
                                  Facebook
                                </label>
                                <Input
                                  className="form-control-alternative"
                                  value={this.state.facebook_url}
                                  name="facebook_url"
                                  onChange={this.handleInputChange}
                                  placeholder="Facebook"
                                  type="text"
                                />
                              </FormGroup>
                            </Col>
                            <Col lg="6">
                              <FormGroup>
                                <label
                                  className="form-control-label"
                                  htmlFor="input-city"
                                >
                                  Instagram
                                </label>
                                <Input
                                  className="form-control-alternative"
                                  value={this.state.instagram_url}
                                  // id="input-city"
                                  name="instagram_url"
                                  onChange={this.handleInputChange}
                                  placeholder="Instagram"
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
                                  // htmlFor="input-country"
                                >
                                  Twitter
                                </label>
                                <Input
                                  className="form-control-alternative"
                                  value={this.state.twitter_url}
                                  // id="input-country"
                                  name="twitter_url"
                                  onChange={this.handleInputChange}
                                  placeholder="Twitter"
                                  type="text"
                                />
                              </FormGroup>
                            </Col>
                            <Col lg="6">
                              <FormGroup>
                                <label
                                  className="form-control-label"
                                  htmlFor="input-country"
                                >
                                  LinkedIn
                                </label>
                                <Input
                                  className="form-control-alternative"
                                  // id="input-postal-code"
                                  value={this.state.linkedin_url}
                                  name="linkedin_url"
                                  onChange={this.handleInputChange}
                                  placeholder="Linkedin"
                                  type="text"
                                />
                              </FormGroup>
                            </Col>
                          </Row>
                        </div>
                        <hr className="my-4" />
                        {/* Description */}
                        <h6 className="heading-small text-muted mb-4">
                          About me
                        </h6>
                        <div className="pl-lg-4">
                          <Row>
                            <Col lg="auto">
                              <FormGroup>
                                <label className="form-control-label">
                                  Campaign image
                                </label>
                                <Input
                                  // className="my-4"
                                  // value="Choose file"
                                  color="primary"
                                  // rows="4"
                                  // defaultValue="A beautiful Dashboard for Bootstrap 4. It is Free and
                                  // Open Source."
                                  name="selected_image"
                                  onChange={this.handleFile}
                                  type="file"
                                />
                              </FormGroup>
                            </Col>
                            <Col>
                              {this.state.upload === true && (
                                <img
                                  src={this.state.image}
                                  height="100px"
                                ></img>
                              )}
                              {this.state.upload === false && (
                                <div>
                                  {/* <h4>Uploading...</h4> */}
                                  <Progress completed={this.state.progress} />
                                </div>
                              )}
                            </Col>
                            <Col lg="auto">
                              <Button
                                className="my-4"
                                color="primary"
                                type="button"
                                onClick={() => this.handleUpload(2)}
                              >
                                Upload
                              </Button>
                            </Col>
                          </Row>
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-city"
                            >
                              Campaign content
                            </label>
                            <Input
                              className="form-control-alternative "
                              // style={{ height: "100px" }}
                              value={this.state.content}
                              // id="input-city"
                              onChange={this.handleInputChange}
                              name="content"
                              placeholder="content"
                              type="text"
                            />
                          </FormGroup>
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-city"
                            >
                              Campaign link
                            </label>
                            <Input
                              className="form-control-alternative "
                              // style={{ height: "100px" }}
                              value={this.state.cta_url}
                              // id="input-city"
                              onChange={this.handleInputChange}
                              name="cta_url"
                              placeholder="link"
                              type="text"
                            />
                          </FormGroup>
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-city"
                            >
                              Payment per click
                            </label>
                            <InputGroup>
                              <InputGroupAddon addonType="prepend">
                                ₹
                              </InputGroupAddon>

                              <Input
                                className="form-control-alternative "
                                // style={{ height: "100px" }}
                                value={this.state.payment_per_click}
                                onChange={this.handleInputChange}
                                // id="input-city"
                                // placeholder="link"
                                name="payment_per_click"
                                type="number"
                              />
                            </InputGroup>
                          </FormGroup>
                        </div>
                        <hr className="my-4" />
                        <div className="text-right">
                          <Row>
                            <Col>
                              <Button
                                className="my-4"
                                color="primary"
                                type="button"
                                onClick={this.handleSave}
                              >
                                Save
                              </Button>
                            </Col>
                          </Row>
                        </div>
                      </Form>
                    </CardBody>
                  </TabPane>
                  <TabPane tabId="2">
                    <CardHeader className="bg-white border-0">
                      <Row className="align-items-center">
                        <Col xs="8">
                          <h3 className="mb-0">Campaign {this.state.name}</h3>
                        </Col>
                        {/* <Col className="text-right" xs="4">
                          <Button
                            color="primary"
                            href="#pablo"
                            onClick={(e) => e.preventDefault()}
                            size="sm"
                          >
                            Settings
                          </Button>
                        </Col> */}
                      </Row>
                    </CardHeader>
                    <CardBody>
                      <Form>
                        <h6 className="heading-small text-muted mb-4">
                          Age preferences
                        </h6>
                        <div className="pl-lg-4">
                          <Row>
                            <Col lg="6">
                              <FormGroup>
                                <label
                                  className="form-control-label"
                                  htmlFor="input-age"
                                >
                                  Age Max
                                </label>
                                <Input
                                  className="form-control-alternative"
                                  value={this.state.age_max}
                                  name="age_max"
                                  onChange={this.handleInputChange}
                                  type="number"
                                />
                              </FormGroup>
                            </Col>
                            <Col lg="6">
                              <FormGroup>
                                <label
                                  className="form-control-label"
                                  htmlFor="input-age"
                                >
                                  Age Min
                                </label>
                                <Input
                                  className="form-control-alternative"
                                  value={this.state.age_min}
                                  name="age_min"
                                  onChange={this.handleInputChange}
                                  type="number"
                                />
                              </FormGroup>
                            </Col>
                          </Row>
                        </div>
                        <hr className="my-4" />
                        {/* Address */}
                        <h6 className="heading-small text-muted mb-4">
                          Gender preferences
                        </h6>
                        <div className="pl-lg-4">
                          <Row>
                            <Col lg="6">
                              <FormGroup>
                                <label
                                  className="form-control-label"
                                  htmlFor="input-gender"
                                >
                                  Gender
                                </label>
                                <Input
                                  className="form-control-alternative"
                                  value={this.state.gender}
                                  name="gender"
                                  onChange={this.handleInputChange}
                                  type="text"
                                />
                              </FormGroup>
                            </Col>
                          </Row>
                        </div>

                        <hr className="my-4" />
                        <div className="text-right">
                          <Row>
                            <Col>
                              <Button
                                className="my-4"
                                color="primary"
                                type="button"
                                onClick={this.handleCreate}
                              >
                                Create Campaign
                              </Button>
                            </Col>
                          </Row>
                        </div>
                      </Form>
                    </CardBody>
                  </TabPane>
                  <TabPane tabId="3">
                    <CardHeader className="bg-white border-0">
                      <Row className="align-items-center">
                        <Col xs="8">
                          <h3 className="mb-0">Campaign {this.state.name}</h3>
                        </Col>
                        {/* <Col className="text-right" xs="4">
                          <Button
                            color="primary"
                            href="#pablo"
                            onClick={(e) => e.preventDefault()}
                            size="sm"
                          >
                            Settings
                          </Button>
                        </Col> */}
                      </Row>
                    </CardHeader>
                    <CardBody>
                      <Form>
                        <h6 className="heading-small text-muted mb-4">
                          Current Credits
                        </h6>
                        <div className="pl-lg-4">
                          <Row>
                            <Col lg="6">
                              <FormGroup>
                                <label
                                  className="form-control-label"
                                  htmlFor="input-age"
                                >
                                  Current Credit
                                </label>
                                <InputGroup>
                                  <InputGroupAddon addonType="prepend">
                                    ₹
                                  </InputGroupAddon>
                                  <Input
                                    className="form-control-alternative"
                                    value={this.state.current_balance}
                                    name="cuurent_balance"
                                    readOnly="readonly"
                                    type="number"
                                  />
                                </InputGroup>
                              </FormGroup>
                            </Col>
                          </Row>
                        </div>
                        <hr className="my-4" />
                        {/* Address */}
                        <h6 className="heading-small text-muted mb-4">
                          Add Credit
                        </h6>
                        <div className="pl-lg-4">
                          <Row>
                            <Col lg="6">
                              <FormGroup>
                                <label
                                  className="form-control-label"
                                  htmlFor="input-gender"
                                >
                                  Amount
                                </label>
                                <InputGroup>
                                  <InputGroupAddon addonType="prepend">
                                    ₹
                                  </InputGroupAddon>
                                  <Input
                                    className="form-control-alternative"
                                    value={this.state.transaction_value}
                                    name="transaction_value"
                                    onChange={this.handleInputChange}
                                    type="number"
                                  />
                                </InputGroup>
                              </FormGroup>
                            </Col>
                          </Row>
                        </div>

                        <hr className="my-4" />
                        <div className="text-right">
                          <Row>
                            <Col>
                              <Button
                                className="my-4"
                                color="primary"
                                type="button"
                                onClick={this.handleTransaction}
                              >
                                Add credit
                              </Button>
                            </Col>
                          </Row>
                        </div>
                      </Form>
                    </CardBody>
                  </TabPane>
                </TabContent>
              </Card>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

export default Maps;
