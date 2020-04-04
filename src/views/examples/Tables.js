import React from "react";
import api from "../constants/api";
import Cookies from "universal-cookie";

// reactstrap components
import {
  Badge,
  Card,
  CardHeader,
  CardFooter,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Media,
  Pagination,
  PaginationItem,
  PaginationLink,
  Progress,
  Table,
  Container,
  Row,
  UncontrolledTooltip,
  Col
} from "reactstrap";
// core components
import Header from "components/Headers/Header.js";
import Axios from "axios";
import { Redirect } from "react-router-dom";
const cookies = new Cookies();

class Tables extends React.Component {
  state = {
    tableList: [],
    influencersList: [],
    uuid: null,
    name: null,
    image_url: null,
    content: null,
    cta_url: null,
    company_logo: null,
    company_name: null,
    facebook_url: null,
    instagram_url: null,
    twitter_url: null,
    linkedin_url: null,
    payment_per_click: null,
    age_max: null,
    age_min: null,
    gender: null,
    locations: []
  };
  componentDidMount = () => {
    const token = cookies.get("Auth-token");
    Axios.get(`${api.protocol}${api.baseUrl}${api.campaignList}`, {
      headers: { Authorization: "Bearer " + token }
    }).then(result => {
      console.log(result);
      this.setState({ tableList: result.data.payload });
      console.log(this.state.tableList);
    });
  };
  handleAnalytics = () => {};
  render() {
    return (
      <>
        <Header />
        {/* Page content */}
        <Container className="mt--7" fluid>
          {/* Table */}
          <Row>
            <div className="col">
              <Card className="shadow">
                <CardHeader className="border-0" float="right">
                  <Row>
                    <Col>
                      <h3 className="mb-0">Campaigns</h3>
                    </Col>
                    <Col xs="auto">
                      <h4>
                        <a href="/admin/maps">
                          <img
                            alt="..."
                            src={require("../../assets/img/icons/002-plus-1.png")}
                          />
                        </a>
                        {" Create Campaign"}
                      </h4>
                    </Col>
                  </Row>
                </CardHeader>
                {this.state.tableList.length !== 0 ? (
                  <Table className="align-items-center table-flush" responsive>
                    <thead className="thead-light">
                      <tr>
                        <th scope="col">Campaigns</th>
                        <th scope="col">Total Budget</th>
                        <th scope="col">Rate</th>
                        <th scope="col">Status</th>
                        <th scope="col">Influencers</th>
                        <th scope="col">Balance</th>
                        <th scope="col" />
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.tableList.map((user, index) => (
                        <tr>
                          <th scope="row">
                            <Media className="align-items-center">
                              <a
                                className="avatar rounded-circle mr-3"
                                href="#pablo"
                                onClick={e => e.preventDefault()}
                              >
                                <img alt="..." src={user.company_logo} />
                              </a>
                              <Media>
                                <span className="mb-0 text-sm">
                                  {user.company_name}
                                </span>
                              </Media>
                            </Media>
                          </th>
                          <td>{"₹ " + user.total_balance}</td>
                          <td>{"₹ " + user.payment_per_click}</td>

                          <td>
                            <Badge color="" className="badge-dot mr-4">
                              <i
                                className={
                                  user.status === "active"
                                    ? "bg-success"
                                    : "bg-warning"
                                }
                              />
                              {user.status}
                            </Badge>
                          </td>
                          <td>
                            <div className="avatar-group">
                              {user.influencers.map((influencer, index) => (
                                <React.Fragment>
                                  <a
                                    className="avatar avatar-sm"
                                    href="#pablo"
                                    id="tooltip742438047"
                                    onClick={e => e.preventDefault()}
                                  >
                                    <img
                                      alt="..."
                                      className="rounded-circle"
                                      src={influencer.profile_url}
                                    />
                                  </a>
                                  <UncontrolledTooltip
                                    delay={0}
                                    target="tooltip742438047"
                                  >
                                    {influencer.first_name}
                                  </UncontrolledTooltip>
                                </React.Fragment>
                              ))}
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <span className="mr-2">
                                {"₹ " + user.balance}
                              </span>
                              <div>
                                <Progress
                                  max={user.total_balance}
                                  value={user.total_balance - user.balance}
                                  barClassName="bg-danger"
                                />
                              </div>
                            </div>
                          </td>
                          <td className="text-right">
                            <UncontrolledDropdown>
                              <DropdownToggle
                                className="btn-icon-only text-light"
                                href="#pablo"
                                role="button"
                                size="sm"
                                color=""
                                onClick={e => e.preventDefault()}
                              >
                                <i className="fas fa-ellipsis-v" />
                              </DropdownToggle>
                              <DropdownMenu
                                className="dropdown-menu-arrow"
                                right
                              >
                                <DropdownItem onClick={e => e.preventDefault()}>
                                  {user.status === "active"
                                    ? "Deactivate"
                                    : "Activate"}
                                </DropdownItem>
                                <DropdownItem
                                  href="/admin/index"
                                  // onClick={e => e.preventDefault()}
                                >
                                  View Analytics
                                </DropdownItem>
                                <DropdownItem
                                  href="#pablo"
                                  onClick={e => e.preventDefault()}
                                >
                                  Edit Campaign
                                </DropdownItem>
                              </DropdownMenu>
                            </UncontrolledDropdown>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <Card>
                    <div className="card align-middle text-center pt-8 pb-8 bg-lavender">
                      <h4>No campaigns. Click on Create Campaign to add.</h4>
                    </div>
                  </Card>
                )}

                <CardFooter className="py-4">
                  <nav aria-label="...">
                    <Pagination
                      className="pagination justify-content-end mb-0"
                      listClassName="justify-content-end mb-0"
                    >
                      <PaginationItem className="disabled">
                        <PaginationLink
                          href="#pablo"
                          onClick={e => e.preventDefault()}
                          tabIndex="-1"
                        >
                          <i className="fas fa-angle-left" />
                          <span className="sr-only">Previous</span>
                        </PaginationLink>
                      </PaginationItem>
                      <PaginationItem className="active">
                        <PaginationLink
                          href="#pablo"
                          onClick={e => e.preventDefault()}
                        >
                          1
                        </PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink
                          href="#pablo"
                          onClick={e => e.preventDefault()}
                        >
                          2 <span className="sr-only">(current)</span>
                        </PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink
                          href="#pablo"
                          onClick={e => e.preventDefault()}
                        >
                          3
                        </PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink
                          href="#pablo"
                          onClick={e => e.preventDefault()}
                        >
                          <i className="fas fa-angle-right" />
                          <span className="sr-only">Next</span>
                        </PaginationLink>
                      </PaginationItem>
                    </Pagination>
                  </nav>
                </CardFooter>
              </Card>
            </div>
          </Row>
        </Container>
      </>
    );
  }
}

export default Tables;
