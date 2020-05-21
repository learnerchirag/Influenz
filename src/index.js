import React from "react";
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
import App from "App";

const options = {
  position: positions.BOTTOM_CENTER,
  timeout: 5000,
  offset: "30px",
  transition: transitions.SCALE,
};
const cookies = new Cookies();

ReactDOM.render(<App />, document.getElementById("root"));
