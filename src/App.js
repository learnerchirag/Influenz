import React, { Component } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import "assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/scss/argon-dashboard-react.scss";
import Auth from "layouts/Auth.js";

import { transitions, positions, Provider as AlertProvider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";
import Index from "views/Index";
import Tables from "views/examples/Tables";
import Edit from "views/examples/Edit";
import Profile from "views/examples/Profile";
import Cookies from "universal-cookie";
import { loadReCaptcha } from "react-recaptcha-google";
import cogoToast from "cogo-toast";
const options = {
  position: positions.BOTTOM_CENTER,
  timeout: 5000,
  offset: "30px",
  transition: transitions.SCALE,
};
const cookies = new Cookies();
export default class App extends Component {
  componentDidMount() {
    loadReCaptcha();
  }
  cookieRedirectDashboard = () => {
    cogoToast.error("You need to Sign in first");
  };
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <AlertProvider template={AlertTemplate} {...options}>
            {cookies.get("Auth-token") ? (
              <React.Fragment>
                <Route
                  path="/dashboard"
                  render={(props) => <Tables {...props} />}
                />
                <Route
                  path="/campaign/:uuid/edit"
                  render={(props) => <Edit {...props} />}
                />
                <Route
                  path="/campaign/:uuid/analytics"
                  render={(props) => <Index {...props} />}
                />
                <Route
                  path="/profile"
                  render={(props) => <Profile {...props} />}
                />
                <Redirect to="/dashboard"></Redirect>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Route exact path="/" render={(props) => <Auth {...props} />} />
                <Route path="/signin" render={(props) => <Auth {...props} />} />
                <Route path="/signup" render={(props) => <Auth {...props} />} />
                <Route path="/forgot" render={(props) => <Auth {...props} />} />
                <Redirect to="/signin"></Redirect>
                {this.cookieRedirectDashboard()}
              </React.Fragment>
            )}
          </AlertProvider>
        </Switch>
      </BrowserRouter>
    );
  }
}