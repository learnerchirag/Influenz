import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import "assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/scss/argon-dashboard-react.scss";
import AdminLayout from "layouts/Admin.js";
import AuthLayout from "layouts/Auth.js";
import thunk from "redux-thunk";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import reducer from "./_reducers";
import { transitions, positions, Provider as AlertProvider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";
// optional cofiguration
const options = {
  // you can also just use 'bottom center'
  position: positions.BOTTOM_CENTER,
  timeout: 5000,
  offset: "30px",
  // you can also just use 'scale'
  transition: transitions.SCALE
};

const store = createStore(reducer, applyMiddleware(thunk));

// export default store;

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Switch>
        <AlertProvider template={AlertTemplate} {...options}>
          <Route path="/admin" render={props => <AdminLayout {...props} />} />
          <Route path="/" render={props => <AuthLayout {...props} />} />
          {/* <Redirect from="/" to="/admin/index" /> */}
          <Redirect from="/" to="/login" />
        </AlertProvider>
      </Switch>
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);
