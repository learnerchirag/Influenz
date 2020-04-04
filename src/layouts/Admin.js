import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
// reactstrap components
import { Container } from "reactstrap";
// core components
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import AdminFooter from "components/Footers/AdminFooter.js";
import Sidebar from "components/Sidebar/Sidebar.js";

import routes from "routes.js";
import Tables from "views/examples/Tables";
import Maps from "views/examples/Maps";
import Index from "views/Index";
import Profile from "views/examples/Profile";

class Admin extends React.Component {
  componentDidUpdate(e) {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    this.refs.mainContent.scrollTop = 0;
  }
  handleComponent(props) {
    if (props.location.pathname === "/admin/tables") {
      console.log("i'm in /tables");
      return <Tables {...props} />;
    } else if (props.location.pathname === "/admin/maps") {
      console.log("i'm in /maps");
      return <Maps {...props} />;
    } else if (props.location.pathname === "/admin/index") {
      console.log("i'm in /index");
      return <Index {...props} />;
    } else if (props.location.pathname === "/admin/user-profile") {
      console.log("i'm in /porfile");
      return <Profile {...props} />;
    } else {
      console.log("i'm in /admin");
      return <Redirect from="/admin" to="/admin/tables" />;
    }
  }
  // getRoutes = routes => {
  //   return routes.map((prop, key) => {
  //     if (prop.component === Tables) {
  //       return (
  //         <Route
  //           path={prop.layout + prop.path}
  //           render={() => <Tables />}
  //           key={key}
  //         />
  //       );
  //     } else {
  //       return null;
  //     }
  //   });
  // };
  getBrandText = path => {
    for (let i = 0; i < routes.length; i++) {
      if (
        this.props.location.pathname.indexOf(
          routes[i].layout + routes[i].path
        ) !== -1
      ) {
        return routes[i].name;
      }
    }
    return "Brand";
  };
  render() {
    return (
      <>
        <Sidebar
          {...this.props}
          routes={routes}
          logo={{
            innerLink: "/admin/index",
            imgSrc: require("assets/img/brand/argon-react.png"),
            imgAlt: "..."
          }}
        />

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
      </>
    );
  }
}

export default Admin;
