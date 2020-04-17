import React from "react";
import api from "../constants/api";
import Cookies from "universal-cookie";
import { Link } from "react-router-dom";

// reactstrap components
import {
  Badge,
  Button,
  Card,
  CardHeader,
  CardFooter,
  DropdownMenu,
  DropdownItem,
  Form,
  FormGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  InputGroup,
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
  Col,
} from "reactstrap";
// core components
import Header from "components/Headers/Header.js";
import Axios from "axios";
import { Redirect } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";

const cookies = new Cookies();
// const token = cookies.get("Auth-token");

class Tables extends React.Component {
  state = {
    tableList: [],
    influencersList: [],
    users: [],
    search: null,
    tableListFiltered: [],
    editing: false,
  };
  componentDidMount = () => {
    const { myProp } = this.props;
    // myProp(true);
    const token = cookies.get("Auth-token");
    Axios.get(`${api.protocol}${api.baseUrl}${api.campaignList}`, {
      headers: { Authorization: "Bearer " + token },
    }).then((result) => {
      myProp(false);
      console.log(result);
      this.setState({
        tableListFiltered: result.data.payload,
        tableList: result.data.payload,
      });
      console.log(this.state.tableList);
      console.log(this.state.tableListFiltered, "before");
    });
  };
  handleAnalytics = (user) => {
    this.setState(
      {
        users: user,
      },
      () => {
        this.props.history.push({
          pathname: "/admin/index",
          state: { users: this.state.users },
        });
      }
    );

    console.log("handling analytics");
    console.log(user, "this is the user");
  };
  handleSearch = (event) => {
    this.setState(
      {
        search: event.target.value.toLowerCase(),
        tableListFiltered: [],
      },
      () => {
        console.log(this.state.search);
        let temp = [];
        for (let i = 0; i < this.state.tableList.length; i++) {
          if (
            this.state.tableList[i].company_name
              .toLowerCase()
              .includes(this.state.search)
          ) {
            console.log(this.state.tableListFiltered, "afterfiltering");
            temp = [...temp, this.state.tableList[i]];
            this.setState({
              tableListFiltered: temp,
            });
          }
          console.log(
            this.state.search,
            this.state.tableList[i].company_name,
            this.state.tableList[i].company_name.includes(this.state.search),
            "out ofloop"
          );
        }
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
  handleEdit = (user) => {
    this.setState(
      {
        users: user,
        editing: true,
      },
      () => {
        this.props.history.push({
          pathname: "/admin/maps",
          state: { users: this.state.users, editing: this.state.editing },
        });
      }
    );
  };
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
                    <div className="col-auto my-auto">
                      <h2 className="mb-0">Campaigns</h2>
                    </div>
                    <div className="col offset-1 text-right">
                      <Form className=" form-inline  d-none d-md-flex ">
                        <FormGroup className="w-100 mb-0">
                          <InputGroup className="w-75 input-group-alternative">
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText>
                                <i className="fas fa-search" />
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input
                              placeholder="Search Campaign"
                              type="text"
                              onChange={this.handleSearch}
                            />
                          </InputGroup>
                        </FormGroup>
                      </Form>
                    </div>
                    <div className="col-auto text-right">
                      <Link
                        to={{
                          pathname: "/admin/maps",
                          state: { editing: this.state.editing },
                        }}
                      >
                        <Button color="primary" size="md">
                          {/* <h5 className="text-white">Create Campaign</h5> */}
                          Create Campaign
                        </Button>
                      </Link>
                    </div>
                  </Row>
                </CardHeader>
                {this.state.tableListFiltered.length !== 0 ? (
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
                      {this.state.tableListFiltered.map((user, index) => (
                        <tr>
                          <th scope="row">
                            <Media className="align-items-center">
                              <a
                                className="avatar rounded-circle mr-3"
                                href="#pablo"
                                onClick={(e) => e.preventDefault()}
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
                                    this.handleStatus(user.status, user.uuid)
                                  }
                                >
                                  {user.status === "active"
                                    ? "Deactivate"
                                    : "Activate"}
                                </DropdownItem>
                                <DropdownItem
                                  // href="/admin/index"
                                  onClick={() => this.handleAnalytics(user)}
                                >
                                  View Analytics
                                </DropdownItem>
                                <DropdownItem
                                  onClick={() => this.handleEdit(user)}
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
                  <nav aria-label="..."></nav>
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
