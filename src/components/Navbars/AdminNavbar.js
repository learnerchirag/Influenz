import React from "react";
import { Link, Router, BrowserRouter } from "react-router-dom";
import Cookies from "universal-cookie";
// reactstrap components
import {
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Form,
  FormGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  InputGroup,
  Navbar,
  Nav,
  Container,
  Media,
} from "reactstrap";
const cookies = new Cookies();
class AdminNavbar extends React.Component {
  constructor(props) {
    // debugger;
    super(props);
    this.state = {};
    this.handleLogout = this.handleLogout.bind(this);
  }
  handleLogout(event) {
    event.preventDefault();
    // const { history } = this.props;
    console.log("logout", this.props);
    // cookies.set("Auth-token", null);
    cookies.remove("Auth-token", { path: "/" });
    cookies.remove("Auth-token", { path: "/admin" });
    console.log(cookies.get("Auth-token"));
    // setTimeout(() => {
    //   this.props.history.push("/login");
    // }, 1000);

    setTimeout(() => {
      window.location = "/login";
    }, 1000);
  }
  render() {
    return (
      <>
        <Navbar className="navbar-top navbar-dark" expand="md" id="navbar-main">
          <Container fluid>
            <div className="h3 mb-0 text-white text-center text-uppercase d-none d-lg-inline-block">
              {this.props.title !== "My Campaigns" && (
                <img
                  src={require("../../assets/img/icons/left.png")}
                  height="28px"
                  textColor="white"
                  style={{ fontWeight: "bold" }}
                  onClick={() => this.props.history.goBack()}
                  style={{ cursor: "pointer" }}
                ></img>
              )}
              <h3 className="ml-1 text-white text-center text-uppercase d-none d-lg-inline-block my-auto">
                {this.props.title}
              </h3>
            </div>

            <Nav className="align-items-center d-none d-md-flex" navbar>
              <UncontrolledDropdown nav>
                <DropdownToggle className="pr-0" nav>
                  <Media className="align-items-center">
                    <span className="avatar avatar-sm rounded-circle">
                      <img
                        alt="..."
                        src={require("../../assets/img/icons/WhatsApp Image 2020-04-25 at 6.49.24 PM.jpeg")}
                      />
                    </span>
                    <Media className="ml-2 d-none d-lg-block">
                      <span className="mb-0 text-sm font-weight-bold">
                        {cookies.get("User")}
                      </span>
                    </Media>
                  </Media>
                </DropdownToggle>
                <DropdownMenu className="dropdown-menu-arrow" right>
                  <DropdownItem className="noti-title" header tag="div">
                    <h6 className="text-overflow m-0">Welcome!</h6>
                  </DropdownItem>
                  <DropdownItem to="/admin/user-profile" tag={Link}>
                    <i className="ni ni-single-02" />
                    <span>My profile</span>
                  </DropdownItem>
                  <DropdownItem to="/dashboard" tag={Link}>
                    <i className="ni ni-settings-gear-65" />
                    <span>My Campaigns</span>
                  </DropdownItem>
                  <DropdownItem
                    to="https://influenz.club/#gettouch"
                    target="_blank"
                    tag={Link}
                  >
                    <i className="ni ni-calendar-grid-58" />
                    <span>Contact us</span>
                  </DropdownItem>
                  {/* <DropdownItem to="/admin/user-profile" tag={Link}>
                    <i className="ni ni-support-16" />
                    <span>Support</span>
                  </DropdownItem> */}
                  <DropdownItem divider />
                  <DropdownItem onClick={(e) => this.handleLogout(e)}>
                    <i className="ni ni-user-run" />
                    <span>Logout</span>
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </Nav>
          </Container>
        </Navbar>
      </>
    );
  }
}

export default AdminNavbar;
