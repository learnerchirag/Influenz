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
import { Spinner } from "reactstrap";
import AdminNavbar from "../../components/Navbars/AdminNavbar.js";
import AdminFooter from "../../components/Footers/AdminFooter.js";
import cogoToast from "cogo-toast";
import Popup from "reactjs-popup";

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
    isLoading: false,
    name: "",
    open: false,
  };
  componentDidMount = () => {
    // const { myProp } = this.props;
    // myProp(true);
    const token = cookies.get("Auth-token");
    this.handleLoader(true);
    Axios.get(`${api.protocol}${api.baseUrl}${api.campaignList}`, {
      headers: { Authorization: "Bearer " + token },
    }).then((result) => {
      // myProp(false);
      this.handleLoader(false);
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
          pathname: "/campaign/" + this.state.users.uuid + "/analytics",
          state: {
            users: this.state.users,
            is_admin: this.props.location.state.is_admin,
            // handleStatus: this.handleStatus,
            // edit: this.handleEdit,
          },
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
  handleStatus = (status, uuid, activating) => {
    const token = cookies.get("Auth-token");
    var modelOpen = true;
    console.log(status, uuid, activating);
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
                window.location.reload(true);
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
          state: { users: this.state.users, editing: this.state.editing },
        });
      }
    );
  };
  handleCreate = (e) => {
    e.preventDefault();
    const token = cookies.get("Auth-token");
    console.log("creating");
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
    console.log("function");
  };
  getBrandText = (path) => {
    return "My Campaigns";
  };
  render() {
    console.log(this.props.location);
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
                                  />
                                </InputGroup>
                              </FormGroup>
                            </Form>
                          </div>
                          <div className="col-auto text-right">
                            {/* <Link
                              to={{
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
                                        user.status === "active"
                                          ? "bg-success"
                                          : user.status === "processing"
                                          ? "bg-info"
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
                                      {this.props.history.location.state
                                        .is_admin &&
                                        user.status === "processing" && (
                                          <DropdownItem
                                            onClick={() =>
                                              this.handleStatus(
                                                user.status,
                                                user.uuid,
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
                                            user.status,
                                            user.uuid
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

                      <CardFooter className="py-4">
                        <nav aria-label="..."></nav>
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
