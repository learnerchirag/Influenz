import React from "react";
import { Route, Switch, Redirect, Router } from "react-router-dom";
// reactstrap components
import { Container, Row, Col } from "reactstrap";
import { UncontrolledAlert } from "reactstrap";
// core components
import AuthNavbar from "components/Navbars/AuthNavbar.js";
import AuthFooter from "components/Footers/AuthFooter.js";
import routes from "routes.js";
import { Spinner } from "reactstrap";
import Login from "../views/examples/Login.js";
import Register from "views/examples/Register.js";
import Forgot from "views/examples/Forgot.js";
import Cookies from "universal-cookie";
const cookies = new Cookies();
class Auth extends React.Component {
  state = {
    isLoading: false,
  };
  componentDidMount() {
    document.body.classList.add("bg-default");
  }
  componentWillUnmount() {
    document.body.classList.remove("bg-default");
  }
  handleComponent(props) {
    if (props.location.pathname === "/login") {
      return <Login myProp={this.handleLoader} {...props} />;
    } else if (props.location.pathname === "/register") {
      return <Register myProp={this.handleLoader} {...props} />;
    } else if (props.location.pathname === "/forgot") {
      return <Forgot myProp={this.handleLoader} {...props} />;
    } else return <Redirect from="/" to="/login" />;
  }

  handleLoader = (status) => {
    this.setState({
      isLoading: status,
    });
  };
  render() {
    const props = this.props;
    console.log(cookies.get("Auth-token") === null);
    console.log(
      cookies.get("Auth-token") === undefined,
      typeof cookies.get("Auth-token")
    );
    return (
      <>
        {/* {cookies.get("Auth-token") === "null" ||
        cookies.get("Auth-token") === undefined  */}
        {!cookies.get("Auth-token") &&
          (this.state.isLoading ? (
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
            <div className="main-content">
              <AuthNavbar />
              <div className="header bg-gradient-info py-7 py-lg-8">
                {/* <Container>
                <div className="header-body text-center mb-7">
                  <Row className="justify-content-center">
                    <Col lg="5" md="8">
                      <h1 className="text-white">Influenz Campaign Dashboard</h1>
                      <p className="text-lead text-light">
                      Let Influencers Spread The World.
                      </p>
                    </Col>
                  </Row>
                </div>
              </Container> */}
                <div className="separator separator-bottom separator-skew zindex-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="none"
                    version="1.1"
                    viewBox="0 0 2560 100"
                    x="0"
                    y="0"
                  >
                    <polygon
                      className="fill-default"
                      points="2560 0 2560 100 0 100"
                    />
                  </svg>
                </div>
              </div>
              {/* Page content */}
              <Container className="mt--9 pb-4">
                <Row className="justify-content-center">
                  {this.handleComponent(props)}
                  {/* <Redirect from="/" to="/login" /> */}
                  {/* <Switch>
                    {this.getRoutes(routes)}
                    <Redirect from="*" to="/login" />
                  </Switch> */}
                </Row>
              </Container>
              <AuthFooter />
            </div>
          ))}
        {cookies.get("Auth-token") && <Redirect to="/admin" />}
      </>
    );
  }
}

export default Auth;
