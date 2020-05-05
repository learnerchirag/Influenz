import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch } from "react-router-dom";
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
const options = {
  position: positions.BOTTOM_CENTER,
  timeout: 5000,
  offset: "30px",
  transition: transitions.SCALE,
};

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <AlertProvider template={AlertTemplate} {...options}>
        <Route exact path="/" render={(props) => <Auth {...props} />} />
        <Route path="/signin" render={(props) => <Auth {...props} />} />
        <Route path="/signup" render={(props) => <Auth {...props} />} />
        <Route path="/forgot" render={(props) => <Auth {...props} />} />

        <Route path="/dashboard" render={(props) => <Tables {...props} />} />
        <Route
          path="/campaign/:uuid/edit"
          render={(props) => <Edit {...props} />}
        />
        <Route
          path="/campaign/:uuid/analytics"
          render={(props) => <Index {...props} />}
        />
        <Route path="/profile" render={(props) => <Profile {...props} />} />
      </AlertProvider>
    </Switch>
  </BrowserRouter>,
  document.getElementById("root")
);
