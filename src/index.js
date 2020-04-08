import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import "assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/scss/argon-dashboard-react.scss";
import Admin from "layouts/Admin.js";
import Auth from "layouts/Auth.js";
import thunk from "redux-thunk";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import reducer from "./_reducers";
import { transitions, positions, Provider as AlertProvider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";
import { loadReCaptcha } from "react-recaptcha-google";
// optional cofiguration
const options = {
  // you can also just use 'bottom center'
  position: positions.BOTTOM_CENTER,
  timeout: 5000,
  offset: "30px",
  // you can also just use 'scale'
  transition: transitions.SCALE,
};

const store = createStore(reducer, applyMiddleware(thunk));

// export default store;

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Switch>
        <AlertProvider template={AlertTemplate} {...options}>
          <Route exact path="/" render={(props) => <Auth {...props} />} />
          <Route path="/login" render={(props) => <Auth {...props} />} />
          <Route path="/register" render={(props) => <Auth {...props} />} />
          <Route path="/forgot" render={(props) => <Auth {...props} />} />

          {/* <Route
            path="/login"
            render={() => <Login />}
            // key={key}
            // handleLoader={this.handleLoader}
          /> */}
          <Route exact path="/admin" render={(props) => <Admin {...props} />} />
          <Route
            path="/admin/campaigns"
            render={(props) => <Admin {...props} />}
          />
          <Route path="/admin/maps" render={(props) => <Admin {...props} />} />
          <Route path="/admin/index" render={(props) => <Admin {...props} />} />
          <Route
            path="/admin/user-profile"
            render={(props) => <Admin {...props} />}
          />

          {/* <Redirect from="/" to="/admin/index" /> */}
          {/* <Redirect exact from="/" to="/login" /> */}
        </AlertProvider>
      </Switch>
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);
