import React from "react";
// node.js library that concatenates classes (strings)
import classnames from "classnames";
// javascipt plugin for creating charts
import Chart from "chart.js";
// react plugin used to create charts
import { Line, Bar, Pie } from "react-chartjs-2";
import Cookies from "universal-cookie";
import api from "./constants/api";

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
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
  constructor(props) {
    super(props);
    this.state = {
      current_user: this.props.location.state.users,
      activeNav: 1,
      chartExample1Data: "data1",
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
      // chartref1: {},
      // chartref2: {},
      // chartref3: {},
    };
    if (window.Chart) {
      parseOptions(Chart, chartOptions());
    }
  }

  componentDidMount = () => {
    const { myProp } = this.props;
    // myProp(true);
    console.log("mounted");
    console.log(monthStart);
    console.log(weekStart);
    console.log(today);
    console.log(this.props.location.state.users);
    this.setState({
      current_user: this.props.location.state.users,
    });
    Axios.get(
      `${api.protocol}${api.baseUrl}${api.campaignAnalytics}${"?uuid="}${
        this.state.current_user.uuid
      }${"&from_date="}${"2020-03-03"}${"&to_date="}${"2020-03-08"}`,
      { headers: { Authorization: "Bearer " + token } }
    ).then((result) => {
      myProp(false);
      console.log(this.state.chartref1, "chartref");
      result.data.payload.click_data.map((object, index) => {
        this.state.dates.push(object.date);
        this.state.dates_count.push(object.click_count);
      });
      result.data.payload.city_data.map((object, index) => {
        this.state.cities.push(object.city);
        this.state.cities_count.push(object.click_count);
      });
      result.data.payload.platform_data.map((object, index) => {
        this.state.platforms.push(object.platform);
        this.state.platforms_count.push(object.click_count);
      });

      this.state.datasets1_updated[0] = {
        label: "Performance",
        data: this.state.dates_count,
      };
      this.state.datasets2_updated[0] = {
        label: "Performance",
        data: this.state.cities_count,
        backgroundColor: this.handleColor(
          pie_chart2,
          this.state.cities_count.length
        ),
      };
      this.state.datasets3_updated[0] = {
        label: "Performance",
        data: this.state.platforms_count,
        backgroundColor: this.handleColor(
          pie_chart3,
          this.state.platforms_count.length
        ),
      };
      chartref1.chartInstance.update();
      chartref2.chartInstance.update();
      chartref3.chartInstance.update();
      console.log(this.state.datasets3_updated);
      console.log(this.state.dates, "array of dates");
      console.log(result);
      console.log(
        chartExample1.data1(this.state.dates, this.state.datasets1_updated),
        "data"
      );
    });

    Axios.get(
      `${api.protocol}${api.baseUrl}${api.campaignTransaction}${"?uuid="}${
        this.state.current_user.uuid
      }`,
      { headers: { Authorization: "Bearer " + token } }
    ).then((result) => {
      this.setState({
        transactionList: result.data.payload,
      });
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
    const { myProp } = this.props;
    // myProp(true);
    index === 3
      ? Axios.get(
          `${api.protocol}${api.baseUrl}${api.campaignAnalytics}${"?uuid="}${
            this.state.current_user.uuid
          }${"&from_date="}${yearStart}${"&to_date="}${today}`,
          { headers: { Authorization: "Bearer " + token } }
        ).then((result) => {
          var sorting = [];
          var final = [];
          result.data.payload.click_data.map((object, index) => {
            var a = new Date(object.date);
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
              value: object.click_count,
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
            this.state.dates.push(object.key);

            this.state.dates_count.push(object.value);
          });
          this.setState({
            datasets1_updated: [
              ...this.state.datasets1_updated,
              { label: "Performance", data: this.state.dates_count },
            ],
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
              }${"&from_date="}${"2020-03-03"}${"&to_date="}${"2020-03-08"}`,
          { headers: { Authorization: "Bearer " + token } }
        ).then((result) => {
          result.data.payload.click_data.map((object, index) => {
            this.state.dates.push(object.date);
            this.state.dates_count.push(object.click_count);
          });
          this.setState({
            datasets1_updated: [
              ...this.state.datasets1_updated,
              { label: "Performance", data: this.state.dates_count },
            ],
          });
          chartref1.chartInstance.update();
          console.log(this.state.dates, "array of dates");
          console.log(result);
          console.log(
            chartExample1.data1(this.state.dates, this.state.datasets1_updated),
            "data"
          );
        });
    myProp(false);
  };
  toggleNavs = (e, index) => {
    e.preventDefault();
    this.setState({
      activeNav: index,
      chartExample1Data: index === 1 ? "data1" : "data2",
    });
    this.handleRequest(index);
  };

  render() {
    return (
      <>
        <Header />
        {/* Page content */}
        <Container className="mt--7" fluid>
          <Row>
            <div className="col">
              <Card className="shadow">
                <CardHeader className="border-0" float="right">
                  <Row>
                    <div className="col">
                      <h3 className="mb-0">Campaign</h3>
                    </div>
                    <div className="col text-right">
                      <Button color="primary" href="/admin/campaigns" size="sm">
                        Campaigns List
                      </Button>
                    </div>
                  </Row>
                </CardHeader>
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">Campaign</th>
                      <th scope="col">Total Budget</th>
                      <th scope="col">Rate</th>
                      <th scope="col">Status</th>
                      {/* <th scope="col">Influencers</th> */}
                      <th scope="col">Balance</th>
                      {/* <th scope="col" /> */}
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
                              src={this.state.current_user.company_logo}
                            />
                          </a>
                          <Media>
                            <span className="mb-0 text-sm">
                              {this.state.current_user.company_name}
                            </span>
                          </Media>
                        </Media>
                      </th>
                      <td>{"₹ " + this.state.current_user.total_balance}</td>
                      <td>
                        {"₹ " + this.state.current_user.payment_per_click}
                      </td>

                      <td>
                        <Badge color="" className="badge-dot mr-4">
                          <i
                            className={
                              this.state.current_user.status === "active"
                                ? "bg-success"
                                : "bg-warning"
                            }
                          />
                          {this.state.current_user.status}
                        </Badge>
                      </td>

                      <td>
                        <div className="d-flex align-items-center">
                          <span className="mr-2">
                            {"₹ " + this.state.current_user.balance}
                          </span>
                          <div>
                            <Progress
                              max={this.state.current_user.total_balance}
                              value={
                                this.state.current_user.total_balance -
                                this.state.current_user.balance
                              }
                              barClassName="bg-danger"
                            />
                          </div>
                        </div>
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
                      {/* <h6 className="text-uppercase text-light ls-1 mb-1">
                        Overview
                      </h6> */}
                      <h2 className="text-white mb-0">Click History</h2>
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
                            <span className="d-none d-md-block">Week</span>
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
                            <span className="d-none d-md-block">Month</span>
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
                            <span className="d-none d-md-block">Year</span>
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
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col className="mb-5 mb-xl-0" xl="4">
              <Card className="shadow " style={{ height: "510px" }}>
                <CardHeader className="border-0">
                  <Row className="align-items-center">
                    <div className="col">
                      <h3 className="mb-0">Transaction History</h3>
                    </div>
                    {/* <div className="col text-right">
                      <Button
                        color="primary"
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                        size="sm"
                      >
                        See all
                      </Button>
                    </div> */}
                  </Row>
                </CardHeader>
                <Table className="align-items-center table-flush" responsive>
                  <thead
                    className="thead-light"
                    style={{ position: "relative", overflow: "scroll" }}
                  >
                    <tr>
                      <th scope="col">Id</th>
                      <th scope="col">Mode</th>
                      <th scope="col">Amount</th>
                      {/* <th scope="col">Bounce rate</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.transactionList.map((transactions, index) => (
                      <tr>
                        <th scope="row">{transactions.transaction_id}</th>
                        <td>{transactions.transaction_mode}</td>
                        <td>{"₹ " + transactions.transaction_value}</td>
                        {/* <td>
                          <i className="fas fa-arrow-up text-success mr-3" />{" "}
                          46,53%
                        </td> */}
                      </tr>
                    ))}
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
                      <h2 className="mb-0">City-wise Data</h2>
                    </div>
                  </Row>
                </CardHeader>
                <CardBody>
                  {/* Chart */}
                  <div className="chart">
                    <Pie
                      ref={(refrence) => {
                        chartref2 = refrence;
                      }}
                      data={chartExample2.data2(
                        this.state.cities,
                        this.state.datasets2_updated
                      )}
                      options={chartExample2.options}
                    />
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
                      <h2 className="mb-0">Platform-wise Data</h2>
                    </div>
                  </Row>
                </CardHeader>
                <CardBody>
                  {/* Chart */}
                  <div className="chart">
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
                  </div>
                </CardBody>
              </Card>
            </Col>

            {/* <Col xl="4">
              <Card className="shadow">
                <CardHeader className="border-0">
                  <Row className="align-items-center">
                    <div className="col">
                      <h3 className="mb-0">Social traffic</h3>
                    </div>
                    <div className="col text-right">
                      <Button
                        color="primary"
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                        size="sm"
                      >
                        See all
                      </Button>
                    </div>
                  </Row>
                </CardHeader>
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">Referral</th>
                      <th scope="col">Visitors</th>
                      <th scope="col" />
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th scope="row">Facebook</th>
                      <td>1,480</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <span className="mr-2">60%</span>
                          <div>
                            <Progress
                              max="100"
                              value="60"
                              barClassName="bg-gradient-danger"
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">Facebook</th>
                      <td>5,480</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <span className="mr-2">70%</span>
                          <div>
                            <Progress
                              max="100"
                              value="70"
                              barClassName="bg-gradient-success"
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">Google</th>
                      <td>4,807</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <span className="mr-2">80%</span>
                          <div>
                            <Progress max="100" value="80" />
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">Instagram</th>
                      <td>3,678</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <span className="mr-2">75%</span>
                          <div>
                            <Progress
                              max="100"
                              value="75"
                              barClassName="bg-gradient-info"
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">twitter</th>
                      <td>2,645</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <span className="mr-2">30%</span>
                          <div>
                            <Progress
                              max="100"
                              value="30"
                              barClassName="bg-gradient-warning"
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </Card>
            </Col> */}
          </Row>
        </Container>
      </>
    );
  }
}

export default Index;
