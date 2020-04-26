import React from "react";
// node.js library that concatenates classes (strings)
import { Route, Switch, Redirect } from "react-router-dom";

import classnames from "classnames";
// javascipt plugin for creating charts
import Chart from "chart.js";
// react plugin used to create charts
import { Line, Bar, Pie } from "react-chartjs-2";
import Cookies from "universal-cookie";
import api from "./constants/api";
import { Spinner } from "reactstrap";
import cogoToast from "cogo-toast";

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
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
  DropdownToggle,
} from "reactstrap";

// core components
import {
  chartOptions,
  parseOptions,
  chartExample1,
  chartExample2,
} from "variables/charts.js";

import Header from "components/Headers/Header.js";
import Axios from "axios";
import moment, { weekdays, weekdaysMin, weekdaysShort } from "moment";
import { thatReturnsThis } from "react-recaptcha-google";
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import AdminFooter from "components/Footers/AdminFooter.js";
import { confirmAlert } from "react-confirm-alert";

const cookies = new Cookies();
var today = moment(new Date()).format("YYYY-MM-DD");
const weekStart = moment(today).subtract(6, "days").format("YYYY-MM-DD");
const monthStart = moment(today).subtract(1, "month").format("YYYY-MM-DD");
const yearStart = moment(today).subtract(1, "year").format("YYYY-MM-DD");
const token = cookies.get("Auth-token");

const pie_chart2 = [];
const pie_chart3 = [];
let chartref1 = null;
let chartref2 = null;
let chartref3 = null;

class Index extends React.Component {
  state = {
    current_user: this.props.history.location.state.users,
    activeNav: 1,
    dates: [],
    cities: [],
    cities_count: [],
    dates_count: [],
    platforms: [],
    platforms_count: [],
    datasets1_updated: [],
    datasets2_updated: [],
    datasets3_updated: [],
    transactionList: [],
    isLoading: false,
    editing: false,
  };

  componentDidMount = () => {
    if (window.Chart) {
      parseOptions(Chart, chartOptions());
    }
    const token = cookies.get("Auth-token");

    // const { myProp } = this.props;
    this.handleLoader(true);
    console.log("mounted");
    console.log(this.props, "props users");
    this.setState({
      current_user: this.props.history.location.state.users,
    });
    Axios.get(
      `${api.protocol}${api.baseUrl}${api.campaignAnalytics}${"?uuid="}${
        this.state.current_user.uuid
      }${"&from_date="}${weekStart}${"&to_date="}${today}`,
      { headers: { Authorization: "Bearer " + token } }
    ).then((result) => {
      this.handleLoader(false);
      var dates = [];
      var dates_count = [];
      var cities = [];
      var cities_count = [];
      var platforms = [];
      var platforms_count = [];
      var datasets2_updated = [];
      var datasets3_updated = [];
      console.log(result, "result");
      result.data.payload.click_data.map((object, index) => {
        dates.push(object.date);
        dates_count.push(object.count);
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
        datasets2_updated: datasets2_updated,
        datasets3_updated: datasets3_updated,
      });
      // chartref1.chartInstance.update();
      // chartref2.chartInstance.update();
      // chartref3.chartInstance.update();
      console.log(this.state.datasets3_updated);
      console.log(this.state.dates, "array of dates");
      console.log(
        chartExample1.data1(this.state.dates, this.state.datasets1_updated),
        "data"
      );
    });

    Axios.get(
      `${api.protocol}${api.baseUrl}${api.campaignRechargeList}${"?uuid="}${
        this.state.current_user.uuid
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
            users: this.state.current_user,
            editing: this.state.editing,
          },
        });
      }
    );
  };
  handleStatus = (status, uuid) => {
    const token = cookies.get("Auth-token");
    var modelOpen = true;
    console.log(status, uuid);
    modelOpen &&
      confirmAlert({
        title:
          "Click confirm to " +
          (status === "active" ? "deactivate" : "activate"),
        // message: "Click recharge to Confirm campaign and recharge",
        buttons: [
          {
            label: "Confirm",
            onClick: () => {
              Axios.put(
                `${api.protocol}${api.baseUrl}${api.campaignStatus}`,

                {
                  uuid: uuid,
                  status: status === "active" ? "inactive" : "active",
                },
                {
                  headers: { Authorization: "Bearer " + token },
                }
              ).then((result) => {
                this.setState({
                  current_user: result.data.payload,
                });
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
    console.log(chart, "color array");
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
    // const { myProp } = this.props;
    // this.handleLoader(true);
    index === 3
      ? Axios.get(
          `${api.protocol}${api.baseUrl}${api.campaignAnalytics}${"?uuid="}${
            this.state.current_user.uuid
          }${"&from_date="}${yearStart}${"&to_date="}${today}`,
          { headers: { Authorization: "Bearer " + token } }
        ).then((result) => {
          this.handleLoader(false);
          console.log(result, "year");
          var sorting = [];
          var final = [];
          result.data.payload.click_data.map((object, index) => {
            var a = new Date(object.month);
            var month = a.getMonth();

            const months = [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
            ];
            sorting[index] = {
              key: months[month],
              value: object.count,
            };
          });

          sorting.forEach(function (a) {
            if (!this[a.key]) {
              this[a.key] = { key: a.key, value: 0 };
              final.push(this[a.key]);
            }
            this[a.key].value += a.value;
          }, Object.create(null));

          console.log(final, "final");
          final.map((object) => {
            dates.push(object.key);

            dates_count.push(object.value);
          });
          this.state.datasets1_updated[0] = {
            label: "Performance",
            data: dates_count,
          };
          this.setState({
            dates: dates,
            dates_count: dates_count,
          });
        })
      : Axios.get(
          index === 2
            ? `${api.protocol}${api.baseUrl}${
                api.campaignAnalytics
              }${"?uuid="}${
                this.state.current_user.uuid
              }${"&from_date="}${monthStart}${"&to_date="}${today}`
            : `${api.protocol}${api.baseUrl}${
                api.campaignAnalytics
              }${"?uuid="}${
                this.state.current_user.uuid
              }${"&from_date="}${weekStart}${"&to_date="}${today}`,
          { headers: { Authorization: "Bearer " + token } }
        ).then((result) => {
          this.handleLoader(false);
          console.log(result, "month result");
          index === 1
            ? result.data.payload.click_data.map((object, index) => {
                dates.push(object.date);
                dates_count.push(object.count);
              })
            : result.data.payload.click_data.map((object, index) => {
                dates.push(object.date);
                dates_count.push(object.count);
              });
          this.state.datasets1_updated[0] = {
            label: "Performance",
            data: dates_count,
          };
          this.setState({
            dates: dates,
            dates_count: dates_count,
          });
          console.log(this.state.dates, "array of dates");
          console.log(result);
          console.log(
            chartExample1.data1(this.state.dates, this.state.datasets1_updated),
            "data"
          );
        });
    // myProp(false);
  };
  handleChartData = (labels, datasets) => {
    chartExample1.data1(labels, datasets);
    console.log(labels, datasets, "handlechartdata");
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
    console.log("function");
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
                title="Campiagn Performance"
              />
              <Header />

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
                                  href="/dashboard"
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
                                <th scope="col">Click Rate</th>
                                {/* <th scope="col">Top Influencers</th> */}
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
                                          this.state.current_user.company_logo
                                        }
                                      />
                                    </a>
                                    <Media>
                                      <span className="mb-0 text-sm">
                                        {this.state.current_user.company_name}
                                      </span>
                                    </Media>
                                  </Media>
                                </th>
                                <td>
                                  {"₹ " + this.state.current_user.total_balance}
                                </td>
                                <td>
                                  <div className="d-flex align-items-center">
                                    <span className="mr-2">
                                      {"₹ " + this.state.current_user.balance}
                                    </span>
                                    <div>
                                      <Progress
                                        max={
                                          this.state.current_user.total_balance
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
                                    this.state.current_user.payment_per_click}
                                </td>

                                <td>
                                  <Badge color="" className="badge-dot mr-4">
                                    <i
                                      className={
                                        this.state.current_user.status ===
                                        "active"
                                          ? "bg-success"
                                          : "bg-warning"
                                      }
                                    />
                                    {this.state.current_user.status}
                                  </Badge>
                                </td>

                                <td className="text-left">
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
                                          : "Activate"}
                                      </DropdownItem>

                                      <DropdownItem onClick={this.handleEdit}>
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
                                  Click History
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
                          </CardHeader>
                          <CardBody>
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
                                  getDatasetAtEvent={(e) => console.log(e)}
                                />
                              )}
                            </div>
                          </CardBody>
                        </Card>
                      </Col>
                      <Col
                        className="mb-5 mb-xl-0"
                        xl="4"
                        // style={{ height: "100%" }}
                      >
                        <Card className="shadow" style={{ height: "100%" }}>
                          <CardHeader className="border-0">
                            <Row className="align-items-center">
                              <div className="col">
                                <h3 className="mb-0">Transaction History</h3>
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
                                <th scope="col">Id</th>
                                <th scope="col">Mode</th>
                                <th scope="col">Amount</th>
                                {/* <th scope="col">Bounce rate</th> */}
                              </tr>
                            </thead>
                            <tbody>
                              {this.state.transactionList.map(
                                (transactions, index) => (
                                  <tr>
                                    <th scope="row">
                                      {transactions.transaction_id}
                                    </th>
                                    <td>{transactions.transaction_mode}</td>
                                    <td>
                                      {"₹ " + transactions.transaction_value}
                                    </td>
                                    {/* <td>
                  <i className="fas fa-arrow-up text-success mr-3" />{" "}
                  46,53%
                </td> */}
                                  </tr>
                                )
                              )}
                            </tbody>
                          </Table>
                        </Card>
                      </Col>
                    </Row>
                    <Row className="mt-5">
                      <Col xl="6">
                        <Card className="shadow">
                          <CardHeader className="bg-transparent">
                            <Row className="align-items-center">
                              <div className="col">
                                {/* <h6 className="text-uppercase text-muted ls-1 mb-1">
                Performance
              </h6> */}
                                <h2 className="mb-0">
                                  City-wise Data{" "}
                                  <small>
                                    {"(total clicks= " + sumCity + ")"}
                                  </small>
                                </h2>
                                <h6>
                                  From {weekStart} to {today}
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
                      <Col xl="6">
                        <Card className="shadow">
                          <CardHeader className="bg-transparent">
                            <Row className="align-items-center">
                              <div className="col">
                                {/* <h6 className="text-uppercase text-muted ls-1 mb-1">
                Performance
              </h6> */}
                                <h2 className="mb-0">
                                  Platform-wise Data{" "}
                                  <small>
                                    {"(total clicks= " + sumPlatform + ")"}
                                  </small>
                                </h2>
                                <h6>
                                  From {weekStart} to {today}
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
      </>
    );
  }
}

export default Index;
