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
// import { Select } from "antd";
// import { Dropdown } from "semantic-ui-react";
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
import { Multiselect } from "multiselect-react-dropdown";

import AdminNavbar from "components/Navbars/AdminNavbar.js";
import AdminFooter from "components/Footers/AdminFooter.js";
// import Razorpay from "razorpay";
import GooglePlacesAutocomplete, {
  geocodeByAddress,
  geocodeByPlaceId,
  getLatLng,
} from "react-google-places-autocomplete";
import "react-google-places-autocomplete/dist/index.min.css";

const cookies = new Cookies();
const token = cookies.get("Auth-token");
// mapTypeId={google.maps.MapTypeId.ROADMAP}
var locations = [];

var progress = 0;
class Edit extends React.Component {
  state = {
    name: "",
    company_name: "",
    company_logo: "",
    content: "",
    cta_url: "",
    payment_per_click: "",
    image_url: "",
    facebook_url: "",
    instagram_url: "",
    twitter_url: "",
    linkedin_url: "",

    selected_image: "",
    progress: 0,
    upload: false,
    activeTab: "1",
    age_max: null,
    age_min: null,
    gender: null,
    locations: [],
    current_balance: 0,
    total_balance: 0,
    uuid: null,
    transaction_value: 0,
    transaction_id: null,
    transaction_mode: "upi",
    tab_preference: false,
    tab_recharge: false,
    tab_transaction: false,
    options: [],
    multiOptions: [],
    selectedOption: null,
    transaction_list: [],
    cityTable: "",
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
    const token = cookies.get("Auth-token");

    if (!firebase.apps.length) {
      firebase.initializeApp(config);
    }
    Axios.get(
      `${api.protocol}${api.baseUrl}${api.campaign}${"?uuid="}${
        this.props.history.location.state.users
      }`,
      {
        headers: { Authorization: "Bearer " + token },
      }
    ).then((result) => {
      this.setState(
        {
          name: result.data.payload.name,
          company_name: result.data.payload.company_name,
          company_logo: result.data.payload.company_logo,
          content: result.data.payload.content,
          cta_url: result.data.payload.cta_url,
          facebook_url: result.data.payload.facebook_url,
          instagram_url: result.data.payload.instagram_url,
          twitter_url: result.data.payload.twitter_url,
          linkedin_url: result.data.payload.linkedin_url,
          payment_per_click: result.data.payload.payment_per_click,
          image_url: result.data.payload.image_url,
          upload: true,
          activeTab: "1",
          age_max: result.data.payload.age_max,
          age_min: result.data.payload.age_min,
          gender: result.data.payload.gender,
          locations: result.data.payload.locations,
          current_balance: result.data.payload.balance,
          total_balance: result.data.payload.total_balance,
          uuid: result.data.payload.uuid,

          tab_preference: true,
          tab_recharge: true,
          tab_transaction: true,
        },
        () => {
          console.log(this.state, "debugging state");
        }
      );
      locations = result.data.payload.locations;
    });
    Axios.get(`${api.protocol}${api.baseUrl}${api.campaignList}`, {
      headers: { Authorization: "Bearer " + token },
    }).then((result) => {
      const options = [];
      result.data.payload.map((users) => {
        users.uuid !== this.state.uuid &&
          options.push({
            value: users.uuid,
            label: users.name,
          });
      });
      this.setState({
        options,
      });
    });
    console.log(this.props.location.state.users, this.props);
    Axios.get(
      `${api.protocol}${api.baseUrl}${api.campaignRechargeList}${"?uuid="}${
        this.props.location.state.users
      }`,
      {
        headers: { Authorization: "Bearer " + token },
      }
    ).then((result) => {
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
    console.log(event.target.files[0].size);
    // firebase.app()
    index === 2
      ? event.target.files[0].size <= 250000
        ? this.setState(
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
          )
        : cogoToast.error("File size exceeded")
      : event.target.files[0].size <= 50000
      ? this.setState(
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
        )
      : cogoToast.error("File size exceeded");
  };
  handleToggle = (index) => {
    if (this.state.activeTab !== index) {
      this.setState({ activeTab: index });
    }
  };
  handleSave = () => {
    const token = cookies.get("Auth-token");

    console.log(this.state);
    var isNull = false;
    Object.values(this.state).map((item, index) => {
      if (
        index === 0 ||
        index === 1 ||
        index === 2 ||
        index === 3 ||
        index === 4 ||
        index === 5 ||
        index === 6
      ) {
        console.log(index);
        console.log(item);
        if (item === "" || item === null) {
          isNull = true;
          console.log(index);
        }
      }
    });
    if (isNull === false) {
      Axios.put(`${api.protocol}${api.baseUrl}${api.campaign}`, this.state, {
        headers: { Authorization: "Bearer " + token },
      }).then((result) => {
        console.log(result);
        this.setState({
          activeTab: "2",
          tab_preference: true,
        });
      });
      // }
    } else {
      cogoToast.error("All the fields are required");
    }
  };
  handleCreate = () => {
    var isNull = false;
    const token = cookies.get("Auth-token");

    if (isNull === false) {
      console.log(this.state, this.props.location.state.users);
      var modelOpen = true;
      modelOpen &&
        confirmAlert({
          title: "Confirm to update campaign",
          message: "Click confirm to Update campaign",
          buttons: [
            {
              label: "Confirm",
              onClick: () => {
                Axios.put(
                  `${api.protocol}${api.baseUrl}${api.campaign}`,
                  this.state,
                  {
                    headers: { Authorization: "Bearer " + token },
                  }
                ).then((result) => {
                  this.setState({
                    // activeTab: "3",
                    current_balance: result.data.payload.balance,
                    // uuid: result.data.payload.uuid,
                  });
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
    const token = cookies.get("Auth-token");

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
    var modelOpen = true;
    const token = cookies.get("Auth-token");

    this.state.selectedOption
      ? modelOpen &&
        confirmAlert({
          title: "Confirm to Move balance",
          message: "Click confirm to Move balance",
          buttons: [
            {
              label: "Confirm",
              onClick: () =>
                Axios.post(
                  `${api.protocol}${api.baseUrl}${api.campaignMoveCharge}`,
                  {
                    old_uuid: this.state.uuid,
                    new_uuid: this.state.selectedOption.value,
                  },
                  {
                    headers: { Authorization: "Bearer " + token },
                  }
                ),
            },
            {
              label: "Cancel",
              onClick: () => (modelOpen = false),
            },
          ],
        })
      : cogoToast.error("Select a campaign to move balance");
  };
  handleCookieRedirect = () => {
    cogoToast.error("You need to Sign in first");
    console.log("function");

    return <Redirect to="/login"></Redirect>;
  };
  getBrandText = (path) => {
    return "Campaign Name";
  };

  render() {
    const ageCount = [];
    for (let index = 13; index < 61; index++) {
      ageCount.push(index);
    }

    // const { selectedOption } = this.state;
    return (
      <>
        {!cookies.get("Auth-token") && (
          <React.Fragment>
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
                title={this.state.name}
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
                                  Campaign Preferences
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
                                                      * company name displayed
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
                                                * max 1280*800 <br></br>* max
                                                file size 250KB<br></br>* mobile
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
                                                * max 250*250<br></br>* max file
                                                size 50KB<br></br> * shown to
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
                                      <h3>Sponsor Social Media Links</h3>
                                    </CardHeader>
                                    <CardBody>
                                      <Row>
                                        <Col>
                                          <FormGroup>
                                            <label
                                              className="form-control-label"
                                              htmlFor="input-address"
                                            >
                                              Facebook page
                                            </label>
                                            <Input
                                              className="form-control-alternative"
                                              value={this.state.facebook_url}
                                              name="facebook_url"
                                              onChange={this.handleInputChange}
                                              placeholder="https://facebook.com/influenz"
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
                                              LinkedIn page
                                            </label>
                                            <Input
                                              className="form-control-alternative"
                                              // id="input-postal-code"
                                              value={this.state.linkedin_url}
                                              name="linkedin_url"
                                              onChange={this.handleInputChange}
                                              placeholder="https://linkedin.com/influenz"
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
                                              Twitter handle
                                            </label>
                                            <Input
                                              className="form-control-alternative"
                                              value={this.state.twitter_url}
                                              // id="input-country"
                                              name="twitter_url"
                                              onChange={this.handleInputChange}
                                              placeholder="@influenz"
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
                                              Instagram handle
                                            </label>
                                            <Input
                                              className="form-control-alternative"
                                              value={this.state.instagram_url}
                                              // id="input-city"
                                              name="instagram_url"
                                              onChange={this.handleInputChange}
                                              placeholder="@influenz"
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

                              <div className="text-right">
                                <Row>
                                  <Col>
                                    <Button
                                      className="my-2"
                                      color="primary"
                                      type="button"
                                      onClick={this.handleSave}
                                    >
                                      Save Campaign Details
                                    </Button>
                                    <div>
                                      {" "}
                                      <small>
                                        Save and proceed to Preferences to
                                        select Influencer profile
                                      </small>
                                    </div>
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
                                        <h3>Age preference</h3>
                                        <div>
                                          <small>
                                            * we will show this campaign to
                                            Influencers within this age range
                                          </small>
                                        </div>
                                      </CardHeader>
                                      <CardBody>
                                        <Row>
                                          <Col>
                                            <FormGroup>
                                              <label
                                                className="form-control-label"
                                                htmlFor="input-age"
                                              >
                                                Maximum age
                                              </label>
                                              <Input
                                                className="form-control-alternative"
                                                value={
                                                  this.state.age_max
                                                    ? this.state.age_max
                                                    : 35
                                                }
                                                name="age_max"
                                                onChange={
                                                  this.handleInputChange
                                                }
                                                type="select"
                                              >
                                                {ageCount.map((age) => (
                                                  <option>{age}</option>
                                                ))}
                                              </Input>
                                            </FormGroup>
                                          </Col>
                                          <Col>
                                            <FormGroup>
                                              <label
                                                className="form-control-label"
                                                htmlFor="input-age"
                                              >
                                                Minimum age
                                              </label>
                                              <Input
                                                className="form-control-alternative"
                                                value={
                                                  this.state.age_min
                                                    ? this.state.age_min
                                                    : 25
                                                }
                                                name="age_min"
                                                onChange={
                                                  this.handleInputChange
                                                }
                                                type="select"
                                              >
                                                {ageCount.map((age) => (
                                                  <option>{age}</option>
                                                ))}
                                              </Input>
                                            </FormGroup>
                                          </Col>
                                        </Row>
                                      </CardBody>
                                    </Card>
                                  </Col>
                                  <Col>
                                    <Card>
                                      <CardHeader>
                                        <h3>Gender preference</h3>
                                        <div>
                                          <small>
                                            * we will try to promote the
                                            campaign to this gender.
                                          </small>
                                        </div>
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
                                                type="select"
                                              >
                                                <option>All</option>
                                                <option>Male</option>
                                                <option>Female</option>
                                              </Input>
                                            </FormGroup>
                                          </Col>
                                        </Row>
                                      </CardBody>
                                    </Card>
                                  </Col>
                                </Row>

                                <hr className="my-4" />
                                <Row>
                                  <Col>
                                    <Card>
                                      <CardHeader>
                                        <h3>Location preferences</h3>
                                        <div>
                                          <small>
                                            * we will try to push the campaign
                                            in these locations
                                          </small>
                                        </div>
                                      </CardHeader>
                                      <CardBody>
                                        <Row>
                                          <Col>
                                            <FormGroup>
                                              <label
                                                className="form-control-label"
                                                htmlFor="input-gender"
                                              >
                                                Location
                                              </label>
                                              <GooglePlacesAutocomplete
                                                apiKey="AIzaSyAdnAIUyM6mOwNCkO_lMeAdKFXHln9R1t4"
                                                autocompletionRequest={{
                                                  componentRestrictions: {
                                                    country: ["IN"],
                                                  },
                                                  types: ["(cities)"],
                                                }}
                                                onSelect={(event) => {
                                                  var city = "";
                                                  console.log(event);
                                                  city = event.description;
                                                  geocodeByPlaceId(
                                                    event.place_id
                                                  ).then((result) => {
                                                    getLatLng(result[0]).then(
                                                      (result) => {
                                                        console.log(result);
                                                        locations.push({
                                                          city: city,
                                                          latitude: result.lat,
                                                          longitude: result.lng,
                                                        });
                                                        console.log(locations);
                                                        this.setState(
                                                          {
                                                            locations,
                                                            cityTable: "",
                                                          },
                                                          () => {
                                                            document.getElementById(
                                                              "react-google-places-autocomplete-input"
                                                            ).value = "";
                                                          }
                                                        );
                                                      }
                                                    );
                                                  });
                                                }}
                                              />
                                            </FormGroup>
                                          </Col>

                                          <Col>
                                            {/* <Card> */}
                                            <h3>Selected locations</h3>
                                            {/* </Card> */}
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
                                                  <th scope="col">
                                                    Cities Selected
                                                  </th>

                                                  <th scope="col">Latitude</th>
                                                  <th scope="col">Longitude</th>
                                                  {/* <th scope="col">Bounce rate</th> */}
                                                </tr>
                                              </thead>
                                              <tbody>
                                                {this.state.locations.map(
                                                  (location, index) => (
                                                    <tr>
                                                      <th>{location.city}</th>

                                                      <td scope="row">
                                                        {location.latitude}
                                                      </td>
                                                      <td>
                                                        {location.longitude}
                                                      </td>
                                                      <td>
                                                        <img
                                                          src={require("../../assets/img/icons/x-mark.png")}
                                                          height="25px"
                                                          style={{
                                                            fontWeight: "bold",
                                                          }}
                                                          onClick={() => {
                                                            this.state.locations.splice(
                                                              index,
                                                              1
                                                            );
                                                            this.setState({
                                                              locations,
                                                            });
                                                          }}
                                                          style={{
                                                            cursor: "pointer",
                                                          }}
                                                        ></img>
                                                      </td>
                                                    </tr>
                                                  )
                                                )}
                                              </tbody>
                                            </Table>
                                          </Col>
                                        </Row>
                                      </CardBody>
                                    </Card>
                                  </Col>
                                </Row>

                                <div className="text-right">
                                  <Row>
                                    <Col>
                                      <Button
                                        className="my-2"
                                        color="primary"
                                        type="button"
                                        onClick={this.handleCreate}
                                      >
                                        Update Campaign Preferences
                                      </Button>
                                      <div className="mr-2">
                                        <small>
                                          * save and proceed to recharge
                                        </small>
                                      </div>
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
                                <Row>
                                  <Col>
                                    <Card className="shadow">
                                      <Row>
                                        <Col>
                                          <Card className="shadow">
                                            <CardHeader>
                                              <h3>Current balance</h3>
                                            </CardHeader>
                                            <CardBody className="shadow m-4">
                                              <Row>
                                                <Col>
                                                  <h5 class="text-uppercase text-muted mb-0 card-title">
                                                    Balance
                                                  </h5>
                                                  <span class="h2 font-weight-bold mb-0">
                                                    {"₹ " +
                                                      this.state
                                                        .current_balance}
                                                  </span>
                                                </Col>
                                                <Col
                                                  className="text-right"
                                                  xs="auto"
                                                >
                                                  <div class="icon icon-shape bg-danger text-white rounded-circle shadow">
                                                    <i class="fas fa-chart-bar"></i>
                                                  </div>
                                                </Col>
                                              </Row>
                                              <Row>
                                                <small className="mt-3 col-auto">
                                                  Total Budget={" "}
                                                  {this.state.total_balance}{" "}
                                                </small>
                                              </Row>
                                            </CardBody>
                                          </Card>
                                        </Col>
                                      </Row>
                                      <Row>
                                        <Col>
                                          <Card>
                                            <CardHeader>
                                              <h3>Move Balance</h3>
                                            </CardHeader>
                                            <CardBody>
                                              <Row>
                                                <Col>
                                                  <FormGroup>
                                                    <label
                                                      className="form-control-label"
                                                      htmlFor="input-gender"
                                                    >
                                                      Select campaign to credit
                                                      balance
                                                    </label>
                                                    <Select
                                                      value={
                                                        this.state
                                                          .selectedOption
                                                      }
                                                      onChange={
                                                        this.handleSelect
                                                      }
                                                      options={
                                                        this.state.options
                                                      }
                                                      name="selectedOption"
                                                    />
                                                  </FormGroup>
                                                </Col>
                                                <Col
                                                  className="text-right"
                                                  xs="auto"
                                                >
                                                  <Button
                                                    className="my-4"
                                                    color="primary"
                                                    type="button"
                                                    onClick={
                                                      this.handleMoveCharge
                                                    }
                                                  >
                                                    Confirm
                                                  </Button>
                                                </Col>
                                              </Row>
                                            </CardBody>
                                          </Card>
                                        </Col>
                                      </Row>
                                    </Card>
                                  </Col>
                                  <Col>
                                    <Card>
                                      <Row>
                                        <Col
                                          className="mb-5 mb-xl-0"
                                          // style={{ height: "100%" }}
                                        >
                                          <Card
                                            className="shadow "
                                            style={{ height: "600px" }}
                                          >
                                            <CardHeader className="border-0">
                                              <Row className="align-items-center">
                                                <div className="col">
                                                  <h3 className="">
                                                    Transaction History
                                                  </h3>
                                                </div>
                                              </Row>
                                            </CardHeader>
                                            <Table
                                              className="align-items-center table-flush"
                                              responsive
                                              // style={{ height: "100%" }}
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
                                                        {
                                                          transactions.campaign
                                                            .name
                                                        }
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
                                    </Card>
                                  </Col>
                                </Row>
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
