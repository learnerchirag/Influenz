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
  Spinner,
  TabContent,
  Table,
  TabPane,
} from "reactstrap";
// import FileUploadProgress from "react-fileupload-progress";
import Progress from "react-progressbar";
import validator from "validator";

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
import Select from "react-select";
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import AdminFooter from "components/Footers/AdminFooter.js";
// import Razorpay from "razorpay";

const cookies = new Cookies();
const token = cookies.get("Auth-token");
// mapTypeId={google.maps.MapTypeId.ROADMAP}

var progress = 0;
class Edit extends React.Component {
  state = {
    name: "",
    company_name: "",
    company_logo: "",
    content: "",
    cta_url: "",
    facebook_url: "",
    instagram_url: "",
    twitter_url: "",
    linkedin_url: "",
    payment_per_click: "",
    image_url: "",
    selected_image: "",
    progress: 0,
    upload: false,
    activeTab: "1",
    age_max: null,
    age_min: null,
    gender: null,
    current_balance: 0,
    uuid: null,
    transaction_value: 0,
    transaction_id: null,
    transaction_mode: "upi",
    tab_preference: false,
    tab_recharge: false,
    tab_transaction: false,
    options: [],
    selectedOption: null,
    transaction_list: [],
  };
  componentDidMount = () => {
    this.props.location.state.editing &&
      // var users= this.props.location.state.users
      // console.log(this.props.location.state.editing);
      this.setState({
        name: this.props.location.state.users.name,
        company_name: this.props.location.state.users.company_name,
        company_logo: this.props.location.state.users.company_logo,
        content: this.props.location.state.users.content,
        cta_url: this.props.location.state.users.cta_url,
        facebook_url: this.props.location.state.users.facebook_url,
        instagram_url: this.props.location.state.users.instagram_url,
        twitter_url: this.props.location.state.users.twitter_url,
        linkedin_url: this.props.location.state.users.linkedin_url,
        payment_per_click: this.props.location.state.users.payment_per_click,
        image_url: this.props.location.state.users.image_url,
        upload: true,
        activeTab: "1",
        age_max: this.props.location.state.users.age_max,
        age_min: this.props.location.state.users.age_min,
        gender: this.props.location.state.users.gender,
        current_balance: this.props.location.state.users.balance,
        uuid: this.props.location.state.users.uuid,

        tab_preference: true,
        tab_recharge: true,
        tab_transaction: true,
      });
    var config = {
      apiKey: "AIzaSyDaH6y6-TmOgugETzqMuKgoj3HxTkDmGV0",
      authDomain: "influenz-7d329.web.app",
      projectNumber: "253623607816",
      databaseUrl: "https://influenz-7d329.firebaseio.com/",
      projectId: "influenz-7d329",
      storageBucket: "influenz-7d329.appspot.com",
    };
    if (!firebase.apps.length) {
      firebase.initializeApp(config);
    }
    Axios.get(`${api.protocol}${api.baseUrl}${api.campaignList}`, {
      headers: { Authorization: "Bearer " + token },
    }).then((result) => {
      const options = [];
      result.data.payload.map((users) => {
        options.push({
          value: users.uuid,
          label: users.name,
        });
      });
      this.setState({
        options,
      });
    });
    Axios.get(`${api.protocol}${api.baseUrl}${api.transactionList}`, {
      headers: { Authorization: "Bearer " + token },
    }).then((result) => {
      this.setState({
        transaction_list: result.data.payload,
      });
    });
  };
  handleInputChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };
  handleSelect = (selectedOption) => {
    this.setState({
      selectedOption,
    });
  };
  handleFile = (event) => {
    this.setState({
      selected_image: event.target.files[0],
    });
  };
  handleUpload = async (event, index) => {
    // firebase.app()
    this.setState(
      {
        selected_image: event.target.files[0],
      },
      async () => {
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
                  image_url: url,
                });
            console.log("downloaded url image_url", url);
          });
      }
    );
  };
  handleToggle = (index) => {
    if (this.state.activeTab !== index) {
      this.setState({ activeTab: index });
    }
  };
  handleSave = () => {
    var isNull = false;
    Object.values(this.state).map((item, index) => {
      if (index !== 15 && index !== 16 && index !== 17 && index !== 11) {
        if (item === "") {
          isNull = true;
          console.log(index);
        }
      }
    });
    if (isNull === false) {
      // if (!validator.isEmail(this.state.facebook_url)) {
      //   cogoToast.error("Please type a valid facebook id");
      // } else if (!validator.isEmail(this.state.instagram_url)) {
      //   cogoToast.error("Please type a valid instagram id");
      // } else if (!validator.isEmail(this.state.twitter_url)) {
      //   cogoToast.error("Please type a valid twitter id");
      // } else if (!validator.isEmail(this.state.linkedin_url)) {
      //   cogoToast.error("Please type a valid linkedin id");
      // } else {
      this.setState({
        activeTab: "2",
        tab_preference: true,
      });
      // }
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
                this.props.location.state.editing
                  ? Axios.put(
                      `${api.protocol}${api.baseUrl}${api.campaign}`,
                      this.state,
                      {
                        headers: { Authorization: "Bearer " + token },
                      }
                    ).then((result) => {
                      this.setState({
                        activeTab: "3",
                        current_balance: result.data.payload.balance,
                        uuid: result.data.payload.uuid,
                      });
                      console.log(result);
                    })
                  : Axios.post(
                      `${api.protocol}${api.baseUrl}${api.campaign}`,
                      this.state,
                      {
                        headers: { Authorization: "Bearer " + token },
                      }
                    ).then((result) => {
                      this.setState({
                        activeTab: "3",
                        current_balance: result.data.payload.balance,
                        uuid: result.data.payload.uuid,
                        tab_recharge: true,
                        tab_transaction: true,
                      });
                      console.log(result);
                    });
              },
            },
            {
              label: "Later",
              onClick: () => {
                this.props.location.state.editing
                  ? Axios.put(
                      `${api.protocol}${api.baseUrl}${api.campaign}`,
                      this.state,
                      {
                        headers: { Authorization: "Bearer " + token },
                      }
                    ).then((result) => {
                      this.props.history.push("/dashboard");
                      console.log(result);
                    })
                  : Axios.post(
                      `${api.protocol}${api.baseUrl}${api.campaign}`,
                      this.state,
                      {
                        headers: { Authorization: "Bearer " + token },
                      }
                    ).then((result) => {
                      this.props.history.push("/dashboard");
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
        this.setState(
          {
            transaction_id: response.razorpay_payment_id,
          },
          () => {
            Axios.post(
              `${api.protocol}${api.baseUrl}${api.campaignRecharge}`,
              {
                uuid: this.state.uuid,
                transaction_id: this.state.transaction_id,
                transaction_mode: this.state.transaction_mode,
                transaction_value: this.state.transaction_value * 100,
              },
              {
                headers: { Authorization: "Bearer " + token },
              }
            ).then((result) => {
              this.setState({
                current_balance: this.state.transaction_value,
              });
              cogoToast.success("recharge done");
              console.log(result);
            });
          }
        );
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
  handleMoveCharge = () => {
    Axios.post(
      `${api.protocol}${api.baseUrl}${api.campaignMoveCharge}`,
      {
        old_uuid: this.state.uuid,
        neew_uuid: this.state.selectedOption.value,
      },
      {
        headers: { Authorization: "Bearer " + token },
      }
    );
  };
  handleCookieRedirect = () => {
    cogoToast.error("You need to Sign in first");
    console.log("function");
  };
  getBrandText = (path) => {
    return "Campaign Name";
  };
  render() {
    // const { selectedOption } = this.state;
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
              />
              <Header />

              <Container className="mt--7" fluid>
                <Row>
                  <Col className="order-xl-1">
                    <Card className="bg-secondary shadow border-0">
                      <CardHeader className="bg-white border-0 p-0">
                        <Row className="align-items-center">
                          <Col>
                            <Nav tabs className="active">
                              <NavItem className="w-25 text-center">
                                <NavLink
                                  className={classnames("py-3 px-3 border-0", {
                                    active: this.state.activeTab === "1",
                                    // disable: this.state.activeTab != "1",
                                  })}
                                  onClick={() => this.handleToggle("1")}
                                >
                                  Campaign Details
                                </NavLink>
                              </NavItem>
                              <NavItem className="w-25 text-center">
                                <NavLink
                                  className={classnames("py-3 px-3 border-0", {
                                    active: this.state.activeTab === "2",
                                    // disable: this.state.activeTab != "2",
                                  })}
                                  style={
                                    this.state.tab_preference
                                      ? undefined
                                      : { pointerEvents: "none" }
                                  }
                                  onClick={() => this.handleToggle("2")}
                                >
                                  Preferences
                                </NavLink>
                              </NavItem>
                              <NavItem className="w-25 text-center">
                                <NavLink
                                  className={classnames("py-3 px-3 border-0", {
                                    active: this.state.activeTab === "3",
                                  })}
                                  style={
                                    this.state.tab_recharge
                                      ? undefined
                                      : { pointerEvents: "none" }
                                  }
                                  onClick={() => this.handleToggle("3")}
                                >
                                  Recharge
                                </NavLink>
                              </NavItem>
                              <NavItem className="w-25 text-center">
                                <NavLink
                                  className={classnames("py-3 px-3 border-0", {
                                    active: this.state.activeTab === "4",
                                  })}
                                  style={
                                    this.state.tab_transaction
                                      ? undefined
                                      : { pointerEvents: "none" }
                                  }
                                  onClick={() => this.handleToggle("4")}
                                >
                                  Transactions
                                </NavLink>
                              </NavItem>
                            </Nav>
                          </Col>
                        </Row>
                      </CardHeader>
                      <CardBody>
                        <TabContent activeTab={this.state.activeTab}>
                          <TabPane tabId="1">
                            <Form>
                              <Row>
                                <Col>
                                  <FormGroup>
                                    <label
                                      className="form-control-label"
                                      htmlFor="input-city"
                                    >
                                      <div>
                                        <h3>Campaign Name</h3>
                                        <div>
                                          <small>
                                            * to be displayed as share title in
                                            every post
                                          </small>
                                        </div>
                                      </div>
                                    </label>

                                    <Input
                                      className="form-control-alternative "
                                      // style={{ height: "100px" }}
                                      value={this.state.name}
                                      // id="input-city"
                                      onChange={this.handleInputChange}
                                      name="name"
                                      placeholder="content"
                                      type="text"
                                    />
                                  </FormGroup>
                                </Col>
                              </Row>
                              <hr className="my-4" />
                              <Row>
                                <Col>
                                  <Card>
                                    <CardHeader>
                                      <h3>Share Content</h3>
                                    </CardHeader>
                                    <CardBody>
                                      <Col>
                                        <Row>
                                          <Col lg="8">
                                            <FormGroup>
                                              <label
                                                className="form-control-label"
                                                htmlFor="input-city"
                                              >
                                                <h3>Campaign content</h3>
                                                <div>
                                                  <small>
                                                    * to be displayed as share
                                                    content
                                                  </small>
                                                </div>
                                              </label>
                                              <Input
                                                className="form-control-alternative "
                                                // style={{ height: "100px" }}
                                                value={this.state.content}
                                                // id="input-city"
                                                onChange={
                                                  this.handleInputChange
                                                }
                                                name="content"
                                                placeholder="content"
                                                type="textarea"
                                                rows="4"
                                              />
                                            </FormGroup>
                                          </Col>
                                        </Row>
                                        <Row>
                                          <Col lg="8">
                                            <FormGroup>
                                              <label
                                                className="form-control-label"
                                                htmlFor="input-city"
                                              >
                                                <h3>Campaign link</h3>
                                                <div>
                                                  <small>
                                                    * redirect to this landing
                                                    URL
                                                  </small>
                                                </div>
                                              </label>
                                              <Input
                                                className="form-control-alternative "
                                                // style={{ height: "100px" }}
                                                value={this.state.cta_url}
                                                // id="input-city"
                                                onChange={
                                                  this.handleInputChange
                                                }
                                                name="cta_url"
                                                placeholder="link"
                                                type="text"
                                              />
                                            </FormGroup>
                                          </Col>
                                        </Row>
                                      </Col>
                                    </CardBody>
                                  </Card>
                                </Col>
                                <Col>
                                  <Card>
                                    <CardHeader>
                                      <h3>Sponsorship Details</h3>
                                    </CardHeader>
                                    <CardBody>
                                      <Col>
                                        <div className="pl-lg-4">
                                          <Row>
                                            <Col lg="8">
                                              <FormGroup>
                                                <label
                                                  className="form-control-label"
                                                  htmlFor="input-first-name"
                                                >
                                                  <h3>Sponsor name</h3>
                                                  <div>
                                                    <small>
                                                      * company Name displayed
                                                      to Influencer
                                                    </small>
                                                  </div>
                                                </label>
                                                <Input
                                                  className="form-control-alternative"
                                                  value={
                                                    this.state.company_name
                                                  }
                                                  name="company_name"
                                                  onChange={
                                                    this.handleInputChange
                                                  }
                                                  type="text"
                                                />
                                              </FormGroup>
                                            </Col>
                                          </Row>
                                          <Row>
                                            <Col lg="8">
                                              <FormGroup>
                                                <label
                                                  className="form-control-label"
                                                  htmlFor="input-city"
                                                >
                                                  <h3>Payment per click</h3>
                                                  <div>
                                                    <small>
                                                      * INR paid to Influencer
                                                      for every click.<br></br>{" "}
                                                      * 1 INR will be deducted
                                                      by Influenz for every
                                                      click.
                                                    </small>
                                                  </div>
                                                </label>
                                                <InputGroup className="form-control-alternative">
                                                  <InputGroupAddon addonType="prepend">
                                                    ₹
                                                  </InputGroupAddon>

                                                  <Input
                                                    className="form-control-alternative "
                                                    // style={{ height: "100px" }}
                                                    value={
                                                      this.state
                                                        .payment_per_click
                                                    }
                                                    onChange={
                                                      this.handleInputChange
                                                    }
                                                    // id="input-city"
                                                    // placeholder="link"
                                                    name="payment_per_click"
                                                    type="number"
                                                  />
                                                </InputGroup>
                                              </FormGroup>
                                            </Col>
                                          </Row>
                                        </div>
                                      </Col>
                                    </CardBody>
                                  </Card>
                                </Col>
                              </Row>
                              <hr className="my-4" />
                              <Row>
                                {/* <Col>
                                  <Card>
                                    <CardHeader>
                                      <h3>Upload images</h3>
                                    </CardHeader>
                                    <CardBody>
                                      <Row> */}
                                <Col>
                                  <Card>
                                    <CardHeader>
                                      <h3>Sponsor logo</h3>
                                      <div>
                                        <small>
                                          * sponsor logo displayed to Influencer
                                        </small>
                                      </div>
                                    </CardHeader>
                                    <CardBody>
                                      <Row>
                                        <Col lg="7">
                                          <FormGroup>
                                            <label
                                              className="btn btn-primary size-sm"
                                              for="image-1"
                                            >
                                              Upload image
                                            </label>
                                            <Input
                                              style={{ visibility: "hidden" }}
                                              id="image-1"
                                              color="primary"
                                              name="selected_company_logo"
                                              onChange={(event) =>
                                                this.handleUpload(event, 1)
                                              }
                                              type="file"
                                            />
                                            <div className="mt--4">
                                              <small>
                                                * max 250*250<br></br>* shown to
                                                Influencers
                                              </small>
                                            </div>
                                          </FormGroup>
                                        </Col>
                                        <Col
                                          lg="5"
                                          className="text-center my-auto"
                                        >
                                          {this.state.upload === true && (
                                            <img
                                              className="img-responsive"
                                              src={this.state.company_logo}
                                              height="200px"
                                              width="200px"
                                            ></img>
                                          )}
                                          {this.state.upload === false && (
                                            <div>
                                              {/* <h3>Uploading...</h3> */}
                                              <Progress
                                                completed={this.state.progress}
                                              />
                                            </div>
                                          )}
                                          {/* <Progress completed={this.state.progress} /> */}
                                        </Col>
                                      </Row>
                                    </CardBody>
                                  </Card>
                                </Col>
                                <Col>
                                  <Card>
                                    <CardHeader>
                                      <h3>Campaign image</h3>
                                      <div>
                                        <small>
                                          * display image shared in every post
                                          by Influencer
                                        </small>
                                      </div>
                                    </CardHeader>
                                    <CardBody>
                                      <Row>
                                        <Col lg="7">
                                          <FormGroup>
                                            <label
                                              className="btn btn-primary size-sm"
                                              for="image"
                                            >
                                              Upload image
                                            </label>
                                            <Input
                                              style={{ visibility: "hidden" }}
                                              id="image"
                                              color="primary"
                                              name="selected_image"
                                              onChange={(event) =>
                                                this.handleUpload(event, 2)
                                              }
                                              type="file"
                                            />
                                            <div className="mt--4">
                                              <small>
                                                * max 1280*800 <br></br>* mobile
                                                screen resolution works best
                                              </small>
                                            </div>
                                          </FormGroup>
                                        </Col>
                                        <Col
                                          lg="5"
                                          className="text-center my-auto"
                                        >
                                          {this.state.upload === true && (
                                            <img
                                              className="img-responsive"
                                              src={this.state.image_url}
                                              height="200px"
                                              style={{
                                                maxWidth:
                                                  "-webkit-fill-available",
                                              }}
                                            ></img>
                                          )}
                                        </Col>
                                      </Row>
                                      {/* <Row>
                                        <Col className="my-auto">
                                          <div>
                                            {/* <h4>Uploading...</h4> */}
                                      {/* <Progress
                                              completed={this.state.progress}
                                            />
                                          </div>
                                        </Col>
                                      </Row> */}
                                    </CardBody>
                                  </Card>
                                </Col>
                                {/* </Row>
                                    </CardBody>
                                  </Card>
                                </Col> */}
                              </Row>
                              {/* Address */}
                              <hr className="my-4" />
                              <Row>
                                <Col>
                                  <Card>
                                    <CardHeader>
                                      <h3>Social media</h3>
                                    </CardHeader>
                                    <CardBody>
                                      <Row>
                                        <Col>
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
                                        <Col>
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
                                        <Col>
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
                                        <Col>
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
                                    </CardBody>
                                  </Card>
                                </Col>
                              </Row>

                              <hr className="my-4" />
                              {/* Description */}

                              <div className="text-center">
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
                          </TabPane>
                          <TabPane tabId="2">
                            <CardBody>
                              <Form>
                                <Row>
                                  <Col>
                                    <Card>
                                      <CardHeader>
                                        <h3>Age preferences</h3>
                                      </CardHeader>
                                      <CardBody>
                                        <Row>
                                          <Col>
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
                                                onChange={
                                                  this.handleInputChange
                                                }
                                                type="number"
                                              />
                                            </FormGroup>
                                          </Col>
                                          <Col>
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
                                                onChange={
                                                  this.handleInputChange
                                                }
                                                type="number"
                                              />
                                            </FormGroup>
                                          </Col>
                                        </Row>
                                      </CardBody>
                                    </Card>
                                  </Col>
                                </Row>

                                <hr className="my-4" />
                                {/* Address */}
                                <Row>
                                  <Col>
                                    <Card>
                                      <CardHeader>
                                        <h3>Gender preferences</h3>
                                      </CardHeader>
                                      <CardBody>
                                        <Row>
                                          <Col>
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
                                                onChange={
                                                  this.handleInputChange
                                                }
                                                type="text"
                                              />
                                            </FormGroup>
                                          </Col>
                                        </Row>
                                      </CardBody>
                                    </Card>
                                  </Col>
                                </Row>

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
                                        {this.props.location.state.editing
                                          ? "Update Campaign"
                                          : "Create Campaign"}
                                      </Button>
                                    </Col>
                                  </Row>
                                </div>
                              </Form>
                            </CardBody>
                          </TabPane>
                          <TabPane tabId="3">
                            <CardBody>
                              <Form>
                                {/* <CardHeader>
                                  <h3 className="heading-small text-muted mb-4">
                                    Current Credits
                                  </h3>
                                </CardHeader> */}
                                <div className="pl-lg-4">
                                  <Row>
                                    <Col lg="8">
                                      <FormGroup>
                                        <label
                                          className="form-control-label"
                                          htmlFor="input-age"
                                        >
                                          <h3> Current Credit</h3>
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
                                <Card>
                                  <CardHeader>
                                    <h3>Add Credit</h3>
                                  </CardHeader>
                                  <CardBody>
                                    <div className="pl-lg-4">
                                      <Row>
                                        <Col lg="8">
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
                                                value={
                                                  this.state.transaction_value
                                                }
                                                name="transaction_value"
                                                onChange={
                                                  this.handleInputChange
                                                }
                                                type="number"
                                              />
                                            </InputGroup>
                                          </FormGroup>
                                        </Col>
                                      </Row>
                                    </div>
                                  </CardBody>
                                </Card>
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
                          <TabPane tabId="4">
                            <CardBody>
                              <Form>
                                <div className="pl-lg-4">
                                  <Row>
                                    <Col lg="8">
                                      <FormGroup>
                                        <label
                                          className="form-control-label"
                                          htmlFor="input-age"
                                        >
                                          <h3>Current Credit</h3>
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
                                <Card>
                                  {/* Address */}
                                  <CardHeader>
                                    <h3>Move Credit</h3>
                                  </CardHeader>
                                  <CardBody>
                                    <div className="pl-lg-0">
                                      <Row>
                                        <Col lg="8">
                                          <FormGroup>
                                            <label
                                              className="form-control-label"
                                              htmlFor="input-gender"
                                            >
                                              Move to
                                            </label>
                                            <Select
                                              value={this.state.selectedOption}
                                              onChange={this.handleSelect}
                                              options={this.state.options}
                                              name="selectedOption"
                                            />
                                          </FormGroup>
                                        </Col>
                                        <Col className="text-right">
                                          <Button
                                            className="my-4"
                                            color="primary"
                                            type="button"
                                            onClick={this.handleMoveCharge}
                                          >
                                            Confirm
                                          </Button>
                                        </Col>
                                      </Row>
                                    </div>
                                  </CardBody>
                                </Card>
                                <hr className="my-4" />
                                <div className="pl-lg-4">
                                  <Row>
                                    <Col lg="8" className="mb-5 mb-xl-0">
                                      <Card
                                        className="shadow "
                                        style={{ height: "510px" }}
                                      >
                                        <CardHeader className="border-0">
                                          <Row className="align-items-center">
                                            <div className="col">
                                              <h3 className="mb-0">
                                                Transaction History
                                              </h3>
                                            </div>
                                          </Row>
                                        </CardHeader>
                                        <Table
                                          className="align-items-center table-flush"
                                          responsive
                                        >
                                          <thead
                                            className="thead-light"
                                            style={{
                                              position: "relative",
                                              overflow: "scroll",
                                            }}
                                          >
                                            <tr>
                                              <th scope="col">Campaign</th>

                                              <th scope="col">Id</th>
                                              <th scope="col">Amount</th>
                                              {/* <th scope="col">Bounce rate</th> */}
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {this.state.transaction_list.map(
                                              (transactions) => (
                                                <tr>
                                                  <th>
                                                    {transactions.campaign.name}
                                                  </th>

                                                  <td scope="row">
                                                    {
                                                      transactions.transaction_id
                                                    }
                                                  </td>
                                                  <td>
                                                    {"₹ " +
                                                      transactions.transaction_value}
                                                  </td>
                                                </tr>
                                              )
                                            )}
                                          </tbody>
                                        </Table>
                                      </Card>
                                    </Col>
                                  </Row>
                                </div>
                              </Form>
                            </CardBody>
                          </TabPane>
                        </TabContent>
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

export default Edit;
