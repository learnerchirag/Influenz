import React from "react";
// react plugin used to create google maps

import classnames from "classnames";
// reactstrap components
import {
  Badge,
  Card,
  Container,
  Row,
  Button,
  CardHeader,
  CardBody,
  FormGroup,
  DropdownMenu,
  DropdownToggle,
  DropdownItem,
  Form,
  Input,
  InputGroupAddon,
  InputGroup,
  Col,
  Media,
  Nav,
  NavItem,
  NavLink,
  Spinner,
  TabContent,
  Table,
  TabPane,
  UncontrolledDropdown,
  UncontrolledTooltip,
} from "reactstrap";

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
import Select from "react-select";

import AdminNavbar from "components/Navbars/AdminNavbar.js";
import AdminFooter from "components/Footers/AdminFooter.js";
// import Razorpay from "razorpay";
import GooglePlacesAutocomplete, {
  geocodeByPlaceId,
  getLatLng,
} from "react-google-places-autocomplete";
import "react-google-places-autocomplete/dist/index.min.css";

const cookies = new Cookies();
var locations = [];

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
    activeTab: "1",
    age_max: null,
    age_min: null,
    gender: null,
    locations: [],
    current_balance: 0,
    total_balance: 0,
    uuid: null,
    influencers: [],
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
    is_admin: null,
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
        this.props.match.params.uuid
      }`,
      {
        headers: { Authorization: "Bearer " + token },
      }
    ).then((result) => {
      this.setState({
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
        influencers: result.data.payload.influencers,
        status: result.data.payload.status,
        tab_preference: true,
        tab_recharge: true,
        tab_transaction: true,
        is_admin: cookies.get("Auth-token"),
      });
      locations = result.data.payload.locations;
    });
    Axios.get(`${api.protocol}${api.baseUrl}${api.campaignFullList}`, {
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
    Axios.get(
      `${api.protocol}${api.baseUrl}${api.campaignRechargeList}${"?uuid="}${
        this.props.match.params.uuid
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
  handleAnalytics = () => {
    this.props.history.push({
      pathname: "/campaign/" + this.state.uuid + "/analytics",
    });
  };
  handleStatus = (status, uuid, activating) => {
    const token = cookies.get("Auth-token");
    var modelOpen = true;
    modelOpen &&
      confirmAlert({
        title:
          "Click confirm to " +
          (activating
            ? "activate"
            : status === "active"
            ? "deacivate"
            : status === "inactive"
            ? "submit for review"
            : "decativate"),
        // message: "Click recharge to Confirm campaign and recharge",
        buttons: [
          {
            label: "Confirm",
            onClick: () => {
              Axios.put(
                `${api.protocol}${api.baseUrl}${api.campaignStatus}`,

                {
                  uuid: uuid,
                  status: activating
                    ? "active"
                    : status === "active"
                    ? "inactive"
                    : status === "inactive"
                    ? "processing"
                    : "inactive",
                },
                {
                  headers: { Authorization: "Bearer " + token },
                }
              ).then((result) => {
                this.setState({
                  status: result.data.payload.status,
                });
                result.data.status
                  ? cogoToast.success(result.data.message)
                  : cogoToast.error(result.data.message);
                // window.location.reload(true);
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
                .ref(`${"/"}${this.state.uuid}${"/"}${files[0]}`)
                .put(this.state.selected_image)
                .then(this.setState({ progress: 1 }));

              storage
                .ref(`${"/"}${this.state.uuid}${"/"}${files[0]}`)
                .getDownloadURL()
                .then((url) => {
                  this.setState(
                    {
                      image_url: url,
                    },
                    () => {
                      this.setState({
                        progress: 0,
                      });
                    }
                  );
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
              .then(
                this.setState({
                  progress: 2,
                })
              );

            storage
              .ref(files[0])
              .getDownloadURL()
              .then((url) => {
                this.setState(
                  {
                    company_logo: url,
                  },
                  () => {
                    this.setState({
                      progress: 0,
                    });
                  }
                );
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
        if (item === "" || item === null) {
          isNull = true;
        }
      }
    });
    if (isNull === false) {
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
                    tab_preference: true,
                  });
                  result.data.status
                    ? cogoToast.success(result.data.message)
                    : cogoToast.error(result.data.message);
                });
              },
            },

            {
              label: "Cancel",
              onClick: () => (modelOpen = false),
            },
          ],
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
                    current_balance: result.data.payload.balance,
                  });
                  result.data.status
                    ? cogoToast.success(result.data.message)
                    : cogoToast.error(result.data.message);
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
            });
          }
        );
      },
      prefill: {
        name: this.state.name,
      },
      notes: {
        address: "Hello World",
      },
      theme: {
        color: "#5e72e4",
      },
    });

    instance.open();
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
              onClick: () => {
                Axios.post(
                  `${api.protocol}${api.baseUrl}${api.campaignMoveCharge}`,
                  {
                    old_uuid: this.state.uuid,
                    new_uuid: this.state.selectedOption.value,
                  },
                  {
                    headers: { Authorization: "Bearer " + token },
                  }
                ).then((result) => {
                  result.data.status
                    ? cogoToast.success(result.data.message)
                    : cogoToast.error(result.data.message);
                });
              },
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

    return <Redirect to="/signin"></Redirect>;
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
          <React.Fragment>{this.handleCookieRedirect()}</React.Fragment>
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
                  <div className="col">
                    <Card className="shadow">
                      <CardHeader className="border-0" float="right">
                        <Row>
                          <div className="col">
                            <h2 className="mb-0">{this.state.name}</h2>
                          </div>
                          <div className="col text-right">
                            <Button
                              color="primary"
                              // href="/dashboard"
                              onClick={() =>
                                this.props.history.push("/dashboard")
                              }
                              size="md"
                            >
                              My Campaigns
                            </Button>
                          </div>
                        </Row>
                      </CardHeader>
                      <Table
                        className="align-items-center table-flush"
                        responsive
                      >
                        <thead className="thead-light">
                          <tr>
                            <th scope="col">My Campaigns</th>
                            <th scope="col">Total Spending</th>
                            <th scope="col">Balance left</th>
                            <th scope="col">Payment per click</th>
                            <th scope="col">Top Influencers</th>
                            <th scope="col">Status</th>
                            <th scope="col" />
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <th scope="row">
                              <Media className="align-items-center">
                                <a
                                  className="avatar rounded-circle mr-3"
                                  href="#pablo"
                                  onClick={(e) => e.preventDefault()}
                                >
                                  <img
                                    alt="..."
                                    src={this.state.company_logo}
                                  />
                                </a>
                                <Media>
                                  <span className="mb-0 text-sm">
                                    {this.state.name}
                                  </span>
                                </Media>
                              </Media>
                            </th>
                            <td>{"₹ " + this.state.total_balance}</td>
                            <td>
                              <div className="d-flex align-items-center">
                                <span className="mr-2">
                                  {"₹ " + this.state.current_balance}
                                </span>
                                <div>
                                  <Progress
                                    max={this.state.total_balance}
                                    value={
                                      this.state.total_balance -
                                      this.state.current_balance
                                    }
                                    barClassName="bg-danger"
                                  />
                                </div>
                              </div>
                            </td>

                            <td>{"₹ " + this.state.payment_per_click}</td>
                            <td>
                              <div className="avatar-group">
                                {this.state.influencers.map(
                                  (influencer, index) => (
                                    <React.Fragment>
                                      <a
                                        className="avatar avatar-sm"
                                        href="#pablo"
                                        id={influencer.first_name}
                                        onClick={(e) => e.preventDefault()}
                                      >
                                        <img
                                          alt="..."
                                          className="rounded-circle"
                                          src={influencer.profile_url}
                                        />
                                      </a>
                                      <UncontrolledTooltip
                                        delay={0}
                                        target={influencer.first_name}
                                      >
                                        {influencer.first_name}
                                      </UncontrolledTooltip>
                                    </React.Fragment>
                                  )
                                )}
                              </div>
                            </td>

                            <td>
                              <Badge color="" className="badge-dot mr-4">
                                <i
                                  className={
                                    this.state.status === "active"
                                      ? "bg-success"
                                      : this.state.status === "processing"
                                      ? "bg-yellow"
                                      : "bg-warning"
                                  }
                                />
                                {this.state.status}
                              </Badge>
                            </td>

                            <td className="">
                              <UncontrolledDropdown>
                                <DropdownToggle
                                  className="btn-icon-only text-light"
                                  href="#pablo"
                                  role="button"
                                  size="sm"
                                  color=""
                                  onClick={(e) => e.preventDefault()}
                                >
                                  <i className="fas fa-ellipsis-v" />
                                </DropdownToggle>
                                <DropdownMenu
                                  className="dropdown-menu-arrow"
                                  right
                                >
                                  {this.state.is_admin &&
                                    this.state.status === "processing" && (
                                      <DropdownItem
                                        onClick={() =>
                                          this.handleStatus(
                                            this.state.status,
                                            this.state.uuid,
                                            true
                                          )
                                        }
                                      >
                                        Activate
                                      </DropdownItem>
                                    )}
                                  <DropdownItem
                                    onClick={() =>
                                      this.handleStatus(
                                        this.state.status,
                                        this.state.uuid
                                      )
                                    }
                                  >
                                    {this.state.status === "active"
                                      ? "Deactivate"
                                      : this.state.status === "inactive"
                                      ? "Submit for review"
                                      : "Cancel review"}
                                  </DropdownItem>

                                  <DropdownItem onClick={this.handleAnalytics}>
                                    View performance
                                  </DropdownItem>
                                </DropdownMenu>
                              </UncontrolledDropdown>
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                    </Card>
                  </div>
                </Row>

                <Row className="mt-5">
                  <Col className="order-xl-1">
                    <Card className="bg-secondary shadow border-0">
                      <CardHeader className="bg-white border-0 p-0">
                        <Row className="align-items-center">
                          <Col>
                            <Nav tabs responsive className="triangle active">
                              <NavItem
                                className=" text-center"
                                style={{ width: "33%" }}
                              >
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
                              <NavItem
                                className="text-center"
                                style={{ width: "33%" }}
                              >
                                <NavLink
                                  className={classnames("py-3 px-3 border-0", {
                                    active: this.state.activeTab === "2",
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

                              <NavItem
                                className=" text-center"
                                style={{ width: "33%" }}
                              >
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
                                  Campaign Balance
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
                                                    placeholder="Minimum ₹3"
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
                                              {this.state.progress === 1 && (
                                                <Spinner
                                                  className="ml-2"
                                                  as="span"
                                                  animation="grow"
                                                  size="sm"
                                                  role="status"
                                                  aria-hidden="true"
                                                />
                                              )}
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
                                          <img
                                            className="img-responsive"
                                            src={this.state.image_url}
                                            height="200px"
                                            style={{
                                              maxWidth:
                                                "-webkit-fill-available",
                                            }}
                                          ></img>
                                        </Col>
                                      </Row>
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
                                              {this.state.progress === 2 && (
                                                <Spinner
                                                  className="ml-2"
                                                  as="span"
                                                  animation="grow"
                                                  size="sm"
                                                  role="status"
                                                  aria-hidden="true"
                                                />
                                              )}
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
                                          <img
                                            className="img-responsive"
                                            src={this.state.company_logo}
                                            height="200px"
                                            width="200px"
                                          ></img>
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
                                                {ageCount.map(
                                                  (age, index) =>
                                                    index <=
                                                      this.state.age_max -
                                                        13 && (
                                                      <option>{age}</option>
                                                    )
                                                )}
                                              </Input>
                                            </FormGroup>
                                          </Col>

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
                                                {ageCount.map(
                                                  (age, index) =>
                                                    index >=
                                                      this.state.age_min -
                                                        13 && (
                                                      <option>{age}</option>
                                                    )
                                                )}
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
                                                  city = event.description;
                                                  geocodeByPlaceId(
                                                    event.place_id
                                                  ).then((result) => {
                                                    getLatLng(result[0]).then(
                                                      (result) => {
                                                        locations.push({
                                                          city: city,
                                                          latitude: result.lat,
                                                          longitude: result.lng,
                                                        });
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
                                          * save and proceed to campaign balance
                                        </small>
                                      </div>
                                    </Col>
                                  </Row>
                                </div>
                              </Form>
                            </CardBody>
                          </TabPane>
                          <TabPane tabId="4">
                            <Form>
                              <Row>
                                <Col>
                                  <Row>
                                    <Col>
                                      <Card className="shadow">
                                        <CardHeader>
                                          <h3>Recharge campaign</h3>
                                        </CardHeader>
                                        <CardBody>
                                          <Row>
                                            <Col>
                                              <FormGroup>
                                                <label
                                                  className="form-control-label"
                                                  htmlFor="input-gender"
                                                >
                                                  Amount
                                                </label>
                                                <Row>
                                                  <Col>
                                                    <InputGroup>
                                                      <InputGroupAddon addonType="prepend">
                                                        ₹
                                                      </InputGroupAddon>
                                                      <Input
                                                        className="form-control-alternative"
                                                        value={
                                                          this.state
                                                            .transaction_value
                                                        }
                                                        name="transaction_value"
                                                        onChange={
                                                          this.handleInputChange
                                                        }
                                                        type="number"
                                                      />
                                                    </InputGroup>
                                                  </Col>
                                                  <Col lg="auto">
                                                    <Button
                                                      className=""
                                                      color="primary"
                                                      type="button"
                                                      onClick={
                                                        this.handleTransaction
                                                      }
                                                    >
                                                      Recharge
                                                    </Button>
                                                  </Col>
                                                </Row>
                                              </FormGroup>
                                            </Col>
                                          </Row>
                                        </CardBody>
                                      </Card>
                                    </Col>
                                  </Row>
                                  <Row className="mt-4">
                                    <Col>
                                      <Card className="shadow">
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
                                                    this.state.selectedOption
                                                  }
                                                  onChange={this.handleSelect}
                                                  options={this.state.options}
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
                                                onClick={this.handleMoveCharge}
                                              >
                                                Confirm
                                              </Button>
                                            </Col>
                                          </Row>
                                        </CardBody>
                                      </Card>
                                    </Col>
                                  </Row>
                                </Col>
                                <Col>
                                  <Card>
                                    <Row>
                                      <Col className="mb-5 mb-xl-0">
                                        <Card
                                          className="shadow "
                                          style={{ height: "576px" }}
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
