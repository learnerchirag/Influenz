import React from "react";
// node.js library that concatenates classes (strings)
import { Redirect } from "react-router-dom";

import classnames from "classnames";
// javascipt plugin for creating charts
import Chart from "chart.js";
// react plugin used to create charts
import { Bar, Pie } from "react-chartjs-2";
import Cookies from "universal-cookie";
import api from "./constants/api";
import { Spinner } from "reactstrap";
import cogoToast from "cogo-toast";
import Switch from "@material/react-switch";
import "@material/react-switch/dist/switch.css";
// import "@material/react-switch/index.scss";

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  DropdownMenu,
  DropdownItem,
  NavItem,
  NavLink,
  Nav,
  Progress,
  Table,
  Media,
  Badge,
  Container,
  Row,
  Col,
  UncontrolledDropdown,
  UncontrolledTooltip,
  DropdownToggle,
} from "reactstrap";

// core components
import {
  chartOptions,
  parseOptions,
  chartExample1,
  chartExample2,
} from "variables/charts.js";

import Axios from "axios";
import moment from "moment";
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import AdminFooter from "components/Footers/AdminFooter.js";
import { confirmAlert } from "react-confirm-alert";

const cookies = new Cookies();
var today = moment(new Date()).format("YYYY-MM-DD");
const weekStart = moment(today).subtract(6, "days").format("YYYY-MM-DD");
const monthStart = moment(today).subtract(1, "month").format("YYYY-MM-DD");
const yearStart = moment(today).subtract(1, "year").format("YYYY-MM-DD");

const pie_chart2 = [];
const pie_chart3 = [];
let chartref1 = null;
let chartref2 = null;
let chartref3 = null;

class Index extends React.Component {
  state = {
    current_user: null,
    current_uuid: null,
    whatsapp_share: null,
    twitter_share: null,
    facebook_share: null,
    instagram_share: null,
    linkedin_share: null,
    other_share: null,
    whatsapp_click: null,
    twitter_click: null,
    instagram_click: null,
    facebook_click: null,
    linkedin_click: null,
    other_click: null,
    activeNav: 1,
    dates: [],
    cities: [],
    cities_count: [],
    dates_count: [],
    platforms: [],
    platforms_count: [],
    shareDates: [],
    share_count: [],
    datasets1_updated: [],
    datasets2_updated: [],
    datasets3_updated: [],
    datasets4_updated: [],
    transactionList: [],
    isLoading: false,
    editing: false,
    is_admin: null,
    unique: true,
  };

  componentDidMount = () => {
    if (window.Chart) {
      parseOptions(Chart, chartOptions());
    }
    const token = cookies.get("Auth-token");
    this.setState({
      is_admin: cookies.get("Is-admin"),
    });
    this.handleLoader(true);
    this.setState({
      current_uuid: this.props.match.params.uuid,
    });
    Axios.get(
      `${api.protocol}${api.baseUrl}${api.campaign}${"?uuid="}${
        this.props.match.params.uuid
      }`,
      { headers: { Authorization: "Bearer " + token } }
    ).then((result) => {
      this.setState({
        current_user: result.data.payload,
      });
    });
    Axios.get(
      `${api.protocol}${api.baseUrl}${api.campaignAnalytics}${"?uuid="}${
        this.props.match.params.uuid
      }${"&from_date="}${weekStart}${"&to_date="}${today}${"&is_unique="}${
        this.state.unique
      }`,
      // { is_unique: false },
      { headers: { Authorization: "Bearer " + token } }
    ).then((result) => {
      this.handleLoader(false);

      var dates = [];
      var dates_count = [];
      var shareDates = [];
      var share_count = [];
      var cities = [];
      var cities_count = [];
      var platforms = [];
      var platforms_count = [];
      var datasets2_updated = [];
      var datasets3_updated = [];
      var datasets4_updated = [];
      result.data.payload.click_data.map((object, index) => {
        dates.push(object.date);
        dates_count.push(object.count);
      });
      result.data.payload.share_data.map((object, index) => {
        shareDates.push(object.date);
        share_count.push(object.count);
      });
      result.data.payload.city_data.map((object, index) => {
        cities.push(object.city);
        cities_count.push(object.click_count);
      });
      result.data.payload.platform_data.map((object, index) => {
        platforms.push(object.platform);
        platforms_count.push(object.click_count);
      });
      this.state.datasets1_updated[0] = {
        label: "Performance",
        data: dates_count,
      };
      datasets4_updated[0] = {
        label: "Performance",
        data: share_count,
      };
      datasets2_updated[0] = {
        label: "Performance",
        data: cities_count,
        backgroundColor: this.handleColor(pie_chart2, cities_count.length),
      };
      datasets3_updated[0] = {
        label: "Performance",
        data: platforms_count,
        backgroundColor: this.handleColor(pie_chart3, platforms_count.length),
      };
      this.setState({
        dates: dates,
        dates_count: dates_count,
        cities: cities,
        cities_count: cities_count,
        platforms: platforms,
        platforms_count: platforms_count,
        shareDates: shareDates,
        share_count: share_count,
        datasets2_updated: datasets2_updated,
        datasets3_updated: datasets3_updated,
        datasets4_updated: datasets4_updated,
        whatsapp_click: result.data.payload.total_data.whatsapp_click,
        twitter_click: result.data.payload.total_data.twitter_click,
        facebook_click: result.data.payload.total_data.facebook_click,
        instagram_click: result.data.payload.total_data.instagram_click,
        linkedin_click: result.data.payload.total_data.linkedin_click,
        other_click: result.data.payload.total_data.other_click,
        whatsapp_share: result.data.payload.total_data.whatsapp_share,
        twitter_share: result.data.payload.total_data.twitter_share,
        facebook_share: result.data.payload.total_data.facebook_share,
        instagram_share: result.data.payload.total_data.instagram_share,
        linkedin_share: result.data.payload.total_data.linkedin_share,
        other_share: result.data.payload.total_data.other_share,
      });
    });

    Axios.get(
      `${api.protocol}${api.baseUrl}${api.campaignRechargeList}${"?uuid="}${
        this.props.match.params.uuid
      }`,
      { headers: { Authorization: "Bearer " + token } }
    ).then((result) => {
      this.setState({
        transactionList: result.data.payload,
      });
    });
  };
  handleEdit = () => {
    this.setState(
      {
        editing: true,
      },
      () => {
        this.props.history.push({
          pathname: "/campaign/" + this.state.current_user.uuid + "/edit",
          state: {
            users: this.state.current_user.uuid,
            editing: this.state.editing,
          },
        });
      }
    );
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
                  current_user: result.data.payload,
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
  handleColor = (chart, index) => {
    for (let i = 0; i < index; i++) {
      var r = Math.floor(Math.random() * 255);
      var g = Math.floor(Math.random() * 255);
      var b = Math.floor(Math.random() * 255);
      chart[i] = "rgb(" + r + "," + g + "," + b + ")";
    }
    return chart;
  };
  handleRequest = (index) => {
    this.setState({
      dates: [],
      dates_count: [],
      datasets1_updated: [],
    });
    const token = cookies.get("Auth-token");

    var dates = [];
    var dates_count = [];
    var cities = [];
    var cities_count = [];
    var platforms = [];
    var platforms_count = [];
    var shareDates = [];
    var share_count = [];
    var datasets4_updated = [];
    var datasets3_updated = [];
    var datasets2_updated = [];
    const months = [
      "Jan-",
      "Feb-",
      "Mar-",
      "Apr-",
      "May-",
      "Jun-",
      "Jul-",
      "Aug-",
      "Sep-",
      "Oct-",
      "Nov-",
      "Dec-",
    ];

    index === 3
      ? Axios.get(
          `${api.protocol}${api.baseUrl}${api.campaignAnalytics}${"?uuid="}${
            this.state.current_user.uuid
          }${"&from_date="}${yearStart}${"&to_date="}${today}${"&is_unique="}${
            this.state.unique
          }`,
          { headers: { Authorization: "Bearer " + token } }
        ).then((result) => {
          this.handleLoader(false);
          var sortingClicks = [];
          var finalClicks = [];
          var sortingShares = [];
          var finalShares = [];
          result.data.payload.city_data.map((object, index) => {
            cities.push(object.city);
            cities_count.push(object.click_count);
          });
          result.data.payload.platform_data.map((object, index) => {
            platforms.push(object.platform);
            platforms_count.push(object.click_count);
          });

          result.data.payload.click_data.map((object, index) => {
            var a = new Date(object.month);
            var month = a.getMonth();

            sortingClicks[index] = {
              key: months[month] + a.getFullYear(),
              value: object.count,
            };
          });
          result.data.payload.share_data.map((object, index) => {
            var a = new Date(object.month);
            var month = a.getMonth();

            sortingShares[index] = {
              key: months[month] + a.getFullYear(),
              value: object.count,
            };
          });

          sortingClicks.forEach(function (a) {
            if (!this[a.key]) {
              this[a.key] = { key: a.key, value: 0 };
              finalClicks.push(this[a.key]);
            }
            this[a.key].value += a.value;
          }, Object.create(null));
          sortingShares.forEach(function (a) {
            if (!this[a.key]) {
              this[a.key] = { key: a.key, value: 0 };
              finalShares.push(this[a.key]);
            }
            this[a.key].value += a.value;
          }, Object.create(null));

          finalClicks.map((object) => {
            dates.push(object.key);

            dates_count.push(object.value);
          });
          finalShares.map((object) => {
            shareDates.push(object.key);

            share_count.push(object.value);
          });
          this.state.datasets1_updated[0] = {
            label: "Performance",
            data: dates_count,
          };
          datasets4_updated[0] = {
            label: "Performance",
            data: share_count,
          };
          datasets2_updated[0] = {
            label: "Performance",
            data: cities_count,
            backgroundColor: this.handleColor(pie_chart2, cities_count.length),
          };
          datasets3_updated[0] = {
            label: "Performance",
            data: platforms_count,
            backgroundColor: this.handleColor(
              pie_chart3,
              platforms_count.length
            ),
          };
          this.setState({
            dates: dates,
            dates_count: dates_count,
            cities,
            cities_count,
            platforms,
            platforms_count,
            shareDates,
            share_count,
            datasets4_updated,
            datasets2_updated,
            datasets3_updated,
          });
        })
      : Axios.get(
          index === 2
            ? `${api.protocol}${api.baseUrl}${
                api.campaignAnalytics
              }${"?uuid="}${
                this.state.current_user.uuid
              }${"&from_date="}${monthStart}${"&to_date="}${today}${"&is_unique="}${
                this.state.unique
              }`
            : `${api.protocol}${api.baseUrl}${
                api.campaignAnalytics
              }${"?uuid="}${
                this.state.current_user.uuid
              }${"&from_date="}${weekStart}${"&to_date="}${today}${"&is_unique="}${
                this.state.unique
              }`,
          { headers: { Authorization: "Bearer " + token } }
        ).then((result) => {
          this.handleLoader(false);
          result.data.payload.click_data.map((object, index) => {
            dates.push(object.date);
            dates_count.push(object.count);
          });
          result.data.payload.share_data.map((object, index) => {
            shareDates.push(object.date);
            share_count.push(object.count);
          });
          result.data.payload.city_data.map((object, index) => {
            cities.push(object.city);
            cities_count.push(object.click_count);
          });
          result.data.payload.platform_data.map((object, index) => {
            platforms.push(object.platform);
            platforms_count.push(object.click_count);
          });
          this.state.datasets1_updated[0] = {
            label: "Performance",
            data: dates_count,
          };
          datasets4_updated[0] = {
            label: "Performance",
            data: share_count,
          };
          datasets2_updated[0] = {
            label: "Performance",
            data: cities_count,
            backgroundColor: this.handleColor(pie_chart2, cities_count.length),
          };
          datasets3_updated[0] = {
            label: "Performance",
            data: platforms_count,
            backgroundColor: this.handleColor(
              pie_chart3,
              platforms_count.length
            ),
          };
          this.setState({
            dates: dates,
            dates_count: dates_count,
            cities,
            cities_count,
            platforms,
            platforms_count,
            shareDates,
            share_count,
            datasets4_updated,
            datasets2_updated,
            datasets3_updated,
          });
        });
    // myProp(false);
  };
  handleChartData = (labels, datasets) => {
    chartExample1.data1(labels, datasets);
  };
  handleUniqueData = (event) => {
    this.setState(
      {
        unique: event.target.checked,
      },
      () => {
        this.handleRequest(this.state.activeNav);
      }
    );
  };
  toggleNavs = (e, index) => {
    e.preventDefault();
    this.setState({
      activeNav: index,
    });
    this.handleRequest(index);
  };
  handleLoader = (status) => {
    this.setState({
      isLoading: status,
    });
  };
  handleCookieRedirect = () => {
    cogoToast.error("You need to Sign in first");
  };
  getBrandText = (path) => {
    return "Campaign performance";
  };
  render() {
    var sumCity = this.state.cities_count.reduce(function (a, b) {
      return a + b;
    }, 0);
    var sumPlatform = this.state.platforms_count.reduce(function (a, b) {
      return a + b;
    }, 0);
    var sumDates = this.state.dates_count.reduce(function (a, b) {
      return a + b;
    }, 0);
    var sumShares = this.state.share_count.reduce(function (a, b) {
      return a + b;
    }, 0);
    return (
      <>
        {this.state.current_user === null ? (
          cookies.get("Auth-token") ? (
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
              <Redirect to="/signin"></Redirect>
              {this.handleCookieRedirect()}
              {/* {cogoToast.error("You need to Signin first")} */}
            </React.Fragment>
          )
        ) : (
          <React.Fragment>
            {!cookies.get("Auth-token") && (
              <React.Fragment>
                <Redirect to="/signin"></Redirect>
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
                    title={this.state.current_user.name}
                  />
                  <div className="header bg-gradient-info pb-8 pt-5 pt-md-8">
                    <Container fluid>
                      <div className="header-body">
                        {/* Card stats */}
                        <Row>
                          <Col lg="4" xl="2">
                            <Card className="card-stats mb-4 mb-xl-0 border-0">
                              <CardBody style={{ width: "110%" }}>
                                <Row>
                                  <div className="col">
                                    <CardTitle
                                      tag="h5"
                                      className="text-uppercase text-muted mb-0"
                                    >
                                      Whatsapp <br />
                                      Total Clicks
                                    </CardTitle>
                                    <span className="h2 font-weight-bold mb-0">
                                      {this.state.whatsapp_click}
                                    </span>
                                  </div>
                                  <Col className="col-auto">
                                    <div className="icon icon-shape text-white rounded-circle ">
                                      {/* <i className="fas fa-chart-bar" /> */}
                                      <img
                                        src={require("assets/img/icons/whatsapp.png.png")}
                                        style={{ width: "40px" }}
                                      ></img>
                                    </div>
                                  </Col>
                                </Row>
                                <p className="mt-3 mb-0 text-muted text-sm">
                                  {/* <span className="text-success mr-2">
                                    <i className="fa fa-arrow-up" /> 3.48%
                                  </span>{" "} */}
                                  <span className="text-nowrap">
                                    <h5>
                                      Total Shares: {this.state.whatsapp_share}
                                    </h5>
                                  </span>
                                </p>
                              </CardBody>
                            </Card>
                          </Col>
                          <Col lg="4" xl="2">
                            <Card className="card-stats mb-4 mb-xl-0">
                              <CardBody style={{ width: "110%" }}>
                                <Row>
                                  <div className="col">
                                    <CardTitle
                                      tag="h5"
                                      className="text-uppercase text-muted mb-0"
                                    >
                                      Twitter
                                      <br />
                                      Total Clicks
                                    </CardTitle>
                                    <span className="h2 font-weight-bold mb-0">
                                      {this.state.twitter_click}
                                    </span>
                                  </div>
                                  <Col className="col-auto">
                                    <div className="icon icon-shape  text-white rounded-circle ">
                                      <img
                                        src={require("assets/img/icons/twitter.png")}
                                        style={{ width: "40px" }}
                                      ></img>
                                    </div>
                                  </Col>
                                </Row>
                                <p className="mt-3 mb-0 text-muted text-sm">
                                  {/* <span className="text-danger mr-2">
                                    <i className="fas fa-arrow-down" /> 3.48%
                                  </span>{" "} */}
                                  <span className="text-nowrap">
                                    <h5>
                                      Total Shares: {this.state.twitter_share}
                                    </h5>
                                  </span>
                                </p>
                              </CardBody>
                            </Card>
                          </Col>
                          <Col lg="4" xl="2">
                            <Card className="card-stats mb-4 mb-xl-0">
                              <CardBody style={{ width: "110%" }}>
                                <Row>
                                  <div className="col">
                                    <CardTitle
                                      tag="h5"
                                      className="text-uppercase text-muted mb-0"
                                    >
                                      Facebook
                                      <br />
                                      Total Clicks
                                    </CardTitle>
                                    <span className="h2 font-weight-bold mb-0">
                                      {this.state.facebook_click}
                                    </span>
                                  </div>
                                  <Col className="col-auto">
                                    <div className="icon icon-shape text-white rounded-circle ">
                                      <img
                                        src={require("assets/img/icons/facebook.png")}
                                        style={{ width: "40px" }}
                                      ></img>
                                    </div>
                                  </Col>
                                </Row>
                                <p className="mt-3 mb-0 text-muted text-sm">
                                  {/* <span className="text-warning mr-2">
                                    <i className="fas fa-arrow-down" /> 1.10%
                                  </span>{" "} */}
                                  <span className="text-nowrap">
                                    <h5>
                                      Total Shares: {this.state.facebook_share}
                                    </h5>
                                  </span>
                                </p>
                              </CardBody>
                            </Card>
                          </Col>
                          <Col lg="4" xl="2">
                            <Card className="card-stats mb-4 mb-xl-0">
                              <CardBody style={{ width: "110%" }}>
                                <Row>
                                  <div className="col">
                                    <CardTitle
                                      tag="h5"
                                      className="text-uppercase text-muted mb-0"
                                    >
                                      Instagram
                                      <br />
                                      Total Clicks
                                    </CardTitle>
                                    <span className="h2 font-weight-bold mb-0">
                                      {this.state.instagram_click}
                                    </span>
                                  </div>
                                  <Col className="col-auto">
                                    <div className="icon icon-shape text-white rounded-circle ">
                                      <img
                                        src={require("assets/img/icons/instagram.png")}
                                        style={{ width: "40px" }}
                                      ></img>
                                    </div>
                                  </Col>
                                </Row>
                                <p className="mt-3 mb-0 text-muted text-sm">
                                  {/* <span className="text-success mr-2">
                                    <i className="fas fa-arrow-up" /> 12%
                                  </span>{" "} */}
                                  <span className="text-nowrap">
                                    <h5>
                                      Total Shares: {this.state.instagram_share}
                                    </h5>
                                  </span>
                                </p>
                              </CardBody>
                            </Card>
                          </Col>
                          <Col lg="4" xl="2">
                            <Card className="card-stats mb-4 mb-xl-0">
                              <CardBody style={{ width: "110%" }}>
                                <Row>
                                  <div className="col">
                                    <CardTitle
                                      tag="h5"
                                      className="text-uppercase text-muted mb-0"
                                    >
                                      LinkedIn
                                      <br />
                                      Total Clicks
                                    </CardTitle>
                                    <span className="h2 font-weight-bold mb-0">
                                      {this.state.linkedin_click}
                                    </span>
                                  </div>
                                  <Col className="col-auto">
                                    <div className="icon icon-shape text-white rounded-circle ">
                                      <img
                                        src={require("assets/img/icons/linkedin.png")}
                                        style={{ width: "40px" }}
                                      ></img>
                                    </div>
                                  </Col>
                                </Row>
                                <p className="mt-3 mb-0 text-muted text-sm">
                                  {/* <span className="text-success mr-2">
                                    <i className="fas fa-arrow-up" /> 12%
                                  </span>{" "} */}
                                  <span className="text-nowrap">
                                    <h5>
                                      Total Shares: {this.state.linkedin_share}
                                    </h5>
                                  </span>
                                </p>
                              </CardBody>
                            </Card>
                          </Col>
                          <Col lg="4" xl="2">
                            <Card className="card-stats mb-4 mb-xl-0">
                              <CardBody style={{ width: "110%" }}>
                                <Row>
                                  <div className="col">
                                    <CardTitle
                                      tag="h5"
                                      className="text-uppercase text-muted mb-0"
                                    >
                                      Other
                                      <br />
                                      Total Clicks
                                    </CardTitle>
                                    <span className="h2 font-weight-bold mb-0">
                                      {this.state.other_click}
                                    </span>
                                  </div>
                                  <Col className="col-auto">
                                    <div className="icon icon-shape text-white rounded-circle ">
                                      <img
                                        src={require("assets/img/icons/others.png")}
                                        style={{ width: "40px" }}
                                      ></img>
                                    </div>
                                  </Col>
                                </Row>
                                <p className="mt-3 mb-0 text-muted text-sm">
                                  <span className="text-nowrap">
                                    <h5>
                                      Total Shares: {this.state.other_share}
                                    </h5>
                                  </span>
                                </p>
                              </CardBody>
                            </Card>
                          </Col>
                        </Row>
                      </div>
                    </Container>
                  </div>
                  <Container className="mt--7" fluid>
                    {this.state.isLoading === true ? (
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
                        <Row>
                          <div className="col">
                            <Card className="shadow">
                              <CardHeader className="border-0" float="right">
                                <Row>
                                  <div className="col">
                                    <h2 className="mb-0">
                                      {this.state.current_user.name}
                                    </h2>
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
                                            src={
                                              this.state.current_user
                                                .company_logo
                                            }
                                          />
                                        </a>
                                        <Media>
                                          <span className="mb-0 text-sm">
                                            {this.state.current_user.name}
                                          </span>
                                        </Media>
                                      </Media>
                                    </th>
                                    <td>
                                      {"₹ " +
                                        this.state.current_user.total_balance}
                                    </td>
                                    <td>
                                      <div className="d-flex align-items-center">
                                        <span className="mr-2">
                                          {"₹ " +
                                            this.state.current_user.balance}
                                        </span>
                                        <div>
                                          <Progress
                                            max={
                                              this.state.current_user
                                                .total_balance
                                            }
                                            value={
                                              this.state.current_user
                                                .total_balance -
                                              this.state.current_user.balance
                                            }
                                            barClassName="bg-danger"
                                          />
                                        </div>
                                      </div>
                                    </td>

                                    <td>
                                      {"₹ " +
                                        this.state.current_user
                                          .payment_per_click}
                                    </td>
                                    <td>
                                      <div className="avatar-group">
                                        {this.state.current_user.influencers.map(
                                          (influencer, index) => (
                                            <React.Fragment>
                                              <a
                                                className="avatar avatar-sm"
                                                href="#pablo"
                                                id={influencer.first_name}
                                                onClick={(e) =>
                                                  e.preventDefault()
                                                }
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
                                      <Badge
                                        color=""
                                        className="badge-dot mr-4"
                                      >
                                        <i
                                          className={
                                            this.state.current_user.status ===
                                            "active"
                                              ? "bg-success"
                                              : this.state.current_user
                                                  .status === "processing"
                                              ? "bg-yellow"
                                              : "bg-warning"
                                          }
                                        />
                                        {this.state.current_user.status}
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
                                            this.state.current_user.status ===
                                              "processing" && (
                                              <DropdownItem
                                                onClick={() =>
                                                  this.handleStatus(
                                                    this.state.current_user
                                                      .status,
                                                    this.state.current_user
                                                      .uuid,
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
                                                this.state.current_user.status,
                                                this.state.current_user.uuid
                                              )
                                            }
                                          >
                                            {this.state.current_user.status ===
                                            "active"
                                              ? "Deactivate"
                                              : this.state.current_user
                                                  .status === "inactive"
                                              ? "Submit for review"
                                              : "Cancel review"}
                                          </DropdownItem>

                                          <DropdownItem
                                            onClick={this.handleEdit}
                                          >
                                            Edit Configuration
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
                          <Col className="mb-5 mb-xl-0" xl="8">
                            <Card className="bg-gradient-default shadow">
                              <CardHeader className="bg-transparent">
                                <Row className="align-items-center">
                                  <div className="col">
                                    <h2 className="text-white mb-0">
                                      Click History{" "}
                                      <small>
                                        {"(total clicks= " + sumDates + ")"}
                                      </small>
                                    </h2>
                                    <h6 className="text-white">
                                      From{" "}
                                      {this.state.activeNav === 1
                                        ? weekStart
                                        : this.state.activeNav === 2
                                        ? monthStart
                                        : yearStart}{" "}
                                      to {today}{" "}
                                    </h6>
                                  </div>
                                  <div className="col">
                                    <Nav className="justify-content-end" pills>
                                      <NavItem>
                                        <NavLink
                                          className={classnames("py-2 px-3", {
                                            active: this.state.activeNav === 1,
                                          })}
                                          data-toggle="tab"
                                          href="#pablo"
                                          onClick={(e) => this.toggleNavs(e, 1)}
                                        >
                                          <span className="d-none d-md-block">
                                            Week
                                          </span>
                                          <span className="d-md-none">W</span>
                                        </NavLink>
                                      </NavItem>
                                      <NavItem>
                                        <NavLink
                                          className={classnames("py-2 px-3", {
                                            active: this.state.activeNav === 2,
                                          })}
                                          href="#pablo"
                                          onClick={(e) => this.toggleNavs(e, 2)}
                                        >
                                          <span className="d-none d-md-block">
                                            Month
                                          </span>
                                          <span className="d-md-none">M</span>
                                        </NavLink>
                                      </NavItem>
                                      <NavItem>
                                        <NavLink
                                          className={classnames("py-2 px-3", {
                                            active: this.state.activeNav === 3,
                                          })}
                                          href="#pablo"
                                          onClick={(e) => this.toggleNavs(e, 3)}
                                        >
                                          <span className="d-none d-md-block">
                                            Year
                                          </span>
                                          <span className="d-md-none">Y</span>
                                        </NavLink>
                                      </NavItem>
                                    </Nav>
                                  </div>
                                </Row>
                                <Row>
                                  <Col>
                                    <Switch
                                      nativeControlId="my-switch"
                                      checked={this.state.unique}
                                      onChange={this.handleUniqueData}
                                    />
                                    <label
                                      htmlFor="my-switch"
                                      className="pl-2"
                                      style={{ color: "white" }}
                                    >
                                      {"  "}
                                      Unique users
                                    </label>
                                  </Col>
                                </Row>
                              </CardHeader>
                              <CardBody className="pt-0">
                                {/* Chart */}
                                <div className="chart">
                                  {sumDates === 0 ? (
                                    <h4 className="text-white">No Data.</h4>
                                  ) : (
                                    <Bar
                                      ref={(refrence) => {
                                        chartref1 = refrence;
                                      }}
                                      data={chartExample1.data1(
                                        this.state.dates,
                                        this.state.datasets1_updated
                                      )}
                                      options={chartExample1.options}
                                      getDatasetAtEvent={(e) => e}
                                    />
                                  )}
                                </div>
                              </CardBody>
                            </Card>
                          </Col>
                          <Col xl="4">
                            <Card className="shadow">
                              <CardHeader className="bg-transparent">
                                <Row className="align-items-center">
                                  <div className="col">
                                    {/* <h6 className="text-uppercase text-muted ls-1 mb-1">
                Performance
              </h6> */}
                                    <h2 className="mb-0">
                                      City-wise Clicks{" "}
                                      <small>
                                        {"(total clicks= " + sumCity + ")"}
                                      </small>
                                    </h2>
                                    <h6>
                                      From{" "}
                                      {this.state.activeNav === 1
                                        ? weekStart
                                        : this.state.activeNav === 2
                                        ? monthStart
                                        : yearStart}{" "}
                                      to {today}
                                    </h6>
                                  </div>
                                </Row>
                              </CardHeader>
                              <CardBody>
                                {/* Chart */}
                                <div className="chart">
                                  {sumCity === 0 ? (
                                    <div>
                                      <h4>No Data.</h4>
                                    </div>
                                  ) : (
                                    <Pie
                                      // onChange={() => this.handleChart(chartref2)}
                                      ref={(refrence) => {
                                        chartref2 = refrence;
                                      }}
                                      data={chartExample2.data2(
                                        this.state.cities,
                                        this.state.datasets2_updated
                                      )}
                                      options={chartExample2.options}
                                    />
                                  )}
                                </div>
                              </CardBody>
                            </Card>
                          </Col>
                        </Row>
                        <Row className="mt-5">
                          <Col className="order-1 mb-5 mb-xl-0" xl="8">
                            <Card className="bg-gradient-default shadow">
                              <CardHeader className="bg-transparent">
                                <Row className="align-items-center">
                                  <div className="col">
                                    <h2 className="text-white mb-0">
                                      Share History{" "}
                                      <small>
                                        {"(total shares= " + sumShares + ")"}
                                      </small>
                                    </h2>
                                    <h6 className="text-white">
                                      From{" "}
                                      {this.state.activeNav === 1
                                        ? weekStart
                                        : this.state.activeNav === 2
                                        ? monthStart
                                        : yearStart}{" "}
                                      to {today}{" "}
                                    </h6>
                                  </div>
                                </Row>
                              </CardHeader>
                              <CardBody>
                                {/* Chart */}
                                <div className="chart">
                                  {sumShares === 0 ? (
                                    <h4 className="text-white">No Data.</h4>
                                  ) : (
                                    <Bar
                                      ref={(refrence) => {
                                        chartref1 = refrence;
                                      }}
                                      data={chartExample1.data1(
                                        this.state.shareDates,
                                        this.state.datasets4_updated
                                      )}
                                      options={chartExample1.options}
                                      getDatasetAtEvent={(e) => e}
                                    />
                                  )}
                                </div>
                              </CardBody>
                            </Card>
                          </Col>

                          <Col className="order-2" xl="4">
                            <Card className="shadow">
                              <CardHeader className="bg-transparent">
                                <Row className="align-items-center">
                                  <div className="col">
                                    {/* <h6 className="text-uppercase text-muted ls-1 mb-1">
                Performance
              </h6> */}
                                    <h2 className="mb-0">
                                      Platform-wise Clicks{" "}
                                      <small>
                                        {"(total clicks= " + sumPlatform + ")"}
                                      </small>
                                    </h2>
                                    <h6>
                                      From{" "}
                                      {this.state.activeNav === 1
                                        ? weekStart
                                        : this.state.activeNav === 2
                                        ? monthStart
                                        : yearStart}{" "}
                                      to {today}
                                    </h6>
                                  </div>
                                </Row>
                              </CardHeader>
                              <CardBody>
                                {/* Chart */}
                                <div className="chart">
                                  {sumPlatform === 0 ? (
                                    <div>
                                      <h4>No Data.</h4>
                                    </div>
                                  ) : (
                                    <Pie
                                      ref={(refrence) => {
                                        chartref3 = refrence;
                                      }}
                                      data={chartExample2.data2(
                                        this.state.platforms,
                                        this.state.datasets3_updated
                                      )}
                                      options={chartExample2.options}
                                    />
                                  )}
                                </div>
                              </CardBody>
                            </Card>
                          </Col>
                        </Row>
                      </React.Fragment>
                    )}
                  </Container>

                  <Container fluid>
                    <AdminFooter />
                  </Container>
                </div>
              </React.Fragment>
            )}
          </React.Fragment>
        )}
      </>
    );
  }
}

export default Index;
