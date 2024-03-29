import React from "react";
import api from "../constants/api";
import Cookies from "universal-cookie";

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
import { Spinner } from "reactstrap";
import AdminNavbar from "../../components/Navbars/AdminNavbar.js";
import AdminFooter from "../../components/Footers/AdminFooter.js";
import cogoToast from "cogo-toast";
import Popup from "reactjs-popup";
import ReactPaginate from "react-paginate";
const cookies = new Cookies();
// const token = cookies.get("Auth-token");

class Tables extends React.Component {
  state = {
    tableList: [],
    influencersList: [],
    users: [],
    search: "",
    tableListFiltered: [],
    editing: false,
    isLoading: false,
    name: "",
    open: false,
    is_admin: null,
    pageCount: null,
    pageSelected: 0,
  };
  componentDidMount = () => {
    this.setState({
      is_admin: cookies.get("Is-admin"),
    });
    const token = cookies.get("Auth-token");
    this.handleLoader(true);
    Axios.get(
      `${api.protocol}${api.baseUrl}${api.campaignList}${"?page="}${
        this.state.pageSelected + 1
      }${"&limit=10"}`,
      {
        headers: { Authorization: "Bearer " + token },
      }
    ).then((result) => {
      this.handleLoader(false);
      this.setState({
        tableListFiltered: result.data.payload.campaigns,
        tableList: result.data.payload.campaigns,
        pageCount: result.data.payload.page_count,
      });
    });
  };
  handleAnalytics = (user) => {
    this.setState(
      {
        users: user,
      },
      () => {
        this.props.history.push({
          pathname: "/campaign/" + this.state.users.uuid + "/analytics",
          state: {
            users: this.state.users,
            is_admin: this.state.is_admin,
            // handleStatus: this.handleStatus,
            // edit: this.handleEdit,
          },
        });
      }
    );
  };
  handleSearch = (event) => {
    event.preventDefault();
    const token = cookies.get("Auth-token");
    this.setState(
      {
        search: event.target.value.toLowerCase(),
      },
      () => {
        Axios.get(
          `${api.protocol}${api.baseUrl}${api.campaignList}${"?search="}${
            this.state.search
          }`,
          {
            headers: { Authorization: "Bearer " + token },
          }
        ).then((result) => {
          this.setState({
            tableListFiltered: result.data.payload.campaigns,
            pageCount: result.data.payload.page_count,
          });
        });
      }
    );
  };
  handleStatus = (status, uuid, index, activating) => {
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
                var tableListFilteredUpdating = this.state.tableListFiltered;
                tableListFilteredUpdating.splice(index, 1, result.data.payload);
                this.setState(
                  {
                    tableListFiltered: tableListFilteredUpdating,
                  },
                  () => {
                    result.data.status
                      ? cogoToast.success(result.data.message)
                      : cogoToast.error(result.data.message);
                  }
                );
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
          pathname: "/campaign/" + this.state.users.uuid + "/edit",
          state: {
            users: user.uuid,
            editing: this.state.editing,
          },
        });
      }
    );
  };
  handleCreate = (e) => {
    e.preventDefault();
    const token = cookies.get("Auth-token");
    if (this.state.name.length > 4) {
      Axios.post(
        `${api.protocol}${api.baseUrl}${api.campaign}`,
        { name: this.state.name },
        {
          headers: { Authorization: "Bearer " + token },
        }
      ).then((result) => {
        this.handleEdit(result.data.payload);
      });
    } else {
      cogoToast.error("Campaign name should contain 5 or more leters");
    }
  };
  handleLoader = (status) => {
    this.setState({
      isLoading: status,
    });
  };
  handleModal = () => {
    this.setState({
      open: true,
    });
  };
  handleInputChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };
  handleCookieRedirect = () => {
    cogoToast.error("You need to Sign in first");
    return <Redirect to="/signin"></Redirect>;
  };
  handlePagination = (event) => {
    const token = cookies.get("Auth-token");
    this.setState(
      {
        pageSelected: event.selected,
      },
      () => {
        Axios.get(
          `${api.protocol}${api.baseUrl}${api.campaignList}${"?page="}${
            this.state.pageSelected + 1
          }${"&limit=10&search="}${this.state.search}`,
          {
            headers: { Authorization: "Bearer " + token },
          }
        ).then((result) => {
          this.setState({
            tableListFiltered: result.data.payload.campaigns,
            tableList: result.data.payload.campaigns,
            pageCount: result.data.payload.page_count,
          });
        });
      }
    );
  };
  getBrandText = (path) => {
    return "My Campaigns";
  };
  render() {
    return (
      <>
        {this.state.isLoading ? (
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
                title="My Campaigns"
              />
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
                            <h2 className="mb-0">My Campaigns</h2>
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
                                    placeholder="Search my campaigns"
                                    type="text"
                                    onChange={this.handleSearch}
                                    // onKeyDown={this.handleSearch}
                                  />
                                </InputGroup>
                              </FormGroup>
                            </Form>
                          </div>
                          <div className="col-auto text-right">
                            {/* <Link
                         s     to={{
                                state: { editing: this.state.editing },
                              }}
                            > */}
                            <Button
                              color="primary"
                              size="md"
                              onClick={this.handleModal}
                            >
                              Create Campaign
                              {/* <h5 className="text-white">Create Campaign</h5> */}
                            </Button>
                            {/* </Link> */}
                            <Popup
                              open={this.state.open}
                              modal
                              closeOnDocumentClick
                              onClose={() =>
                                this.setState({
                                  open: false,
                                })
                              }
                            >
                              <div>
                                {/* <a className="close" onClick={this.closeModal}>
                                  &times;
                                </a> */}
                                <Form role="form" onSubmit={this.handleCreate}>
                                  <div className="p-lg-4">
                                    <Row>
                                      <Col>
                                        <FormGroup className="text-left">
                                          <label className="form-control-label">
                                            New Campaign Name
                                            <div>
                                              <small>
                                                * to be displayed as share title
                                                in every post
                                              </small>
                                            </div>
                                          </label>
                                          <Input
                                            className="form-control-alternative"
                                            value={this.state.name}
                                            name="name"
                                            onChange={this.handleInputChange}
                                            placeholder="Campaign name"
                                            type="text"
                                          ></Input>
                                        </FormGroup>
                                      </Col>
                                    </Row>
                                  </div>
                                  <div className="text-right">
                                    {/* <Row>
                                      <Col> */}
                                    <Button
                                      className="mr-4 mb-2"
                                      color="primary"
                                      onClick={this.handleCreate}
                                      type="submit"
                                    >
                                      Start new campaign
                                    </Button>
                                    {/* </Col>
                                    </Row> */}
                                  </div>
                                </Form>
                              </div>
                            </Popup>
                          </div>
                        </Row>
                      </CardHeader>
                      {this.state.tableListFiltered.length !== 0 ? (
                        <Table
                          className="align-items-center table-flush"
                          style={{ minHeight: "200px" }}
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
                            {this.state.tableListFiltered.map((user, index) => (
                              <tr>
                                <th scope="row">
                                  <Media className="align-items-center">
                                    <a
                                      className="avatar rounded-circle mr-3 bg-dark"
                                      href="#pablo"
                                      onClick={(e) => e.preventDefault()}
                                    >
                                      <img
                                        alt="..."
                                        src={
                                          user.company_logo === null
                                            ? "https://influenz.club/img/logo.png"
                                            : user.company_logo
                                        }
                                      />
                                    </a>
                                    <Media>
                                      <span className="mb-0 text-sm">
                                        {user.name}
                                      </span>
                                    </Media>
                                  </Media>
                                </th>
                                <td>{"₹ " + user.total_balance}</td>
                                <td>
                                  <div className="d-flex align-items-center">
                                    <span className="mr-2">
                                      {"₹ " + user.balance}
                                    </span>
                                    <div>
                                      <Progress
                                        max={user.total_balance}
                                        value={
                                          user.total_balance - user.balance
                                        }
                                        barClassName="bg-danger"
                                      />
                                    </div>
                                  </div>
                                </td>

                                <td>{"₹ " + user.payment_per_click}</td>

                                <td>
                                  <div className="avatar-group">
                                    {user.influencers.map(
                                      (influencer, index) => (
                                        <React.Fragment>
                                          <a
                                            className="avatar avatar-sm"
                                            href="#pablo"
                                            id={influencer.first_name
                                              .split(" ")
                                              .join("")}
                                            onClick={(e) => e.preventDefault()}
                                          >
                                            <img
                                              alt="..."
                                              className="rounded-circle"
                                              src={
                                                influencer.profile_url === null
                                                  ? require("../../assets/img/icons/WhatsApp Image 2020-04-25 at 6.49.24 PM.jpeg")
                                                  : influencer.profile_url
                                              }
                                            />
                                          </a>
                                          <UncontrolledTooltip
                                            delay={0}
                                            target={influencer.first_name
                                              .split(" ")
                                              .join("")}
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
                                        user.status === "active"
                                          ? "bg-success"
                                          : user.status === "processing"
                                          ? "bg-yellow"
                                          : "bg-warning"
                                      }
                                    />
                                    {user.status}
                                  </Badge>
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
                                      {this.state.is_admin === "true" &&
                                      user.status === "processing" ? (
                                        <DropdownItem
                                          onClick={() =>
                                            this.handleStatus(
                                              user.status,
                                              user.uuid,
                                              index,
                                              true
                                            )
                                          }
                                        >
                                          Activate
                                        </DropdownItem>
                                      ) : null}
                                      <DropdownItem
                                        onClick={() =>
                                          this.handleStatus(
                                            user.status,
                                            user.uuid,
                                            index
                                          )
                                        }
                                      >
                                        {user.status === "active"
                                          ? "Deactivate"
                                          : user.status === "inactive"
                                          ? "Submit for review"
                                          : "Cancel review"}
                                      </DropdownItem>

                                      <DropdownItem
                                        // href="/admin/index"
                                        onClick={() =>
                                          this.handleAnalytics(user)
                                        }
                                      >
                                        View Performance
                                      </DropdownItem>
                                      <DropdownItem
                                        onClick={() => this.handleEdit(user)}
                                      >
                                        Edit Configuration
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
                            <h4>
                              No campaigns. Click on Create Campaign to add.
                            </h4>
                          </div>
                        </Card>
                      )}

                      <CardFooter className="py-4 text-right">
                        <div className="pagination justify-content-end ">
                          {" "}
                          <ReactPaginate
                            pageCount={this.state.pageCount}
                            pageRangeDisplayed={2}
                            marginPagesDisplayed={2}
                            initialPage={0}
                            forcePage={this.state.pageSelected}
                            breakLabel="..."
                            nextLabel={<i className="fas fa-angle-right" />}
                            previousLabel={<i className="fas fa-angle-left" />}
                            onPageChange={this.handlePagination}
                            containerClassName="pagination justify-content-end "
                            previousClassName="page-item"
                            previousLinkClassName="page-link"
                            nextClassName="page-item"
                            nextLinkClassName="page-link"
                            pageClassName="page-item"
                            pageLinkClassName="page-link"
                            activeClassName="active"
                          ></ReactPaginate>
                        </div>
                      </CardFooter>
                    </Card>
                  </div>
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

export default Tables;
