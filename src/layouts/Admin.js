import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
// reactstrap components
import { Container } from "reactstrap";
// core components
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import AdminFooter from "components/Footers/AdminFooter.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import { Spinner } from "reactstrap";
import routes from "routes.js";
import Tables from "views/examples/Tables";
import Maps from "views/examples/Maps";
import Index from "views/Index";
import Profile from "views/examples/Profile";

class Admin extends React.Component {
  state = {
    isLoading: false,
  };
  // componentDidUpdate(e) {
  //   document.documentElement.scrollTop = 0;
  //   document.scrollingElement.scrollTop = 0;
  //   this.refs.mainContent.scrollTop = 0;
  // }
  handleComponent = (props) => {
    if (props.location.pathname === "/admin/campaigns") {
      console.log("i'm in /campaigns");
      return <Tables myProp={this.handleLoader} {...props} />;
    } else if (props.location.pathname === "/admin/maps") {
      console.log("i'm in /maps");
      return <Maps myProp={this.handleLoader} {...props} />;
    } else if (props.location.pathname === "/admin/index") {
      console.log("i'm in /index");
      return <Index myProp={this.handleLoader} {...props} />;
    } else if (props.location.pathname === "/admin/user-profile") {
      console.log("i'm in /porfile");
      return <Profile myProp={this.handleLoader} {...props} />;
    } else {
      console.log("i'm in /admin");
      return (
        <Redirect
          myProp={this.handleLoader}
          from="/admin"
          to="/admin/campaigns"
        />
      );
    }
  };

  getBrandText = (path) => {
    return path.slice(7);
  };
  handleLoader = (status) => {
    this.setState({
      isLoading: status,
    });
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
            {/* <Sidebar
              {...this.props}
              routes={routes}
              logo={{
                innerLink: "/admin/index",
                imgSrc: require("assets/img/brand/argon-react.png"),
                imgAlt: "...",
              }}
            /> */}

            <div className="main-content" ref="mainContent">
              <AdminNavbar
                {...this.props}
                brandText={this.getBrandText(this.props.location.pathname)}
              />
              <Switch>{this.handleComponent(this.props)}</Switch>
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

export default Admin;
