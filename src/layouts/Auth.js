import React from "react";
import { Redirect } from "react-router-dom";
// reactstrap components
import { Container, Row } from "reactstrap";
// core components
import AuthNavbar from "components/Navbars/AuthNavbar.js";
import AuthFooter from "components/Footers/AuthFooter.js";
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
    // document.body.classList.remove("bg-default");
    return <Redirect from="/" to="/signin" />;
  }
  handleComponent(props) {
    if (props.location.pathname === "/signin") {
      console.log("i'm in sigin");
      return <Login myProp={this.handleLoader} {...props} />;
    } else if (props.location.pathname === "/signup") {
      console.log("i'm in sigup");
      return <Register myProp={this.handleLoader} {...props} />;
    } else if (props.location.pathname === "/forgot") {
      console.log("i'm in forgot");
      return <Forgot myProp={this.handleLoader} {...props} />;
    } else {
      console.log("i'm in /");
      return <Redirect from="/" to="/signin" />;
    }
  }

  handleLoader = (status) => {
    this.setState({
      isLoading: status,
    });
  };
  render() {
    const props = this.props;
    console.log(this.props);
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
          <div className="main-content">
            <AuthNavbar />
            <div className="header bg-gradient-info py-7 py-lg-8">
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
                {/* {props.location.pathname === "/signin" && (
                  <Login myProp={this.handleLoader} {...props} />
                )} */}
                {console.log("rendering component")}
              </Row>
            </Container>
            <AuthFooter />
          </div>
        )}
      </>
    );
  }
}

export default Auth;
