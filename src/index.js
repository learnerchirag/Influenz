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
import Cookies from "universal-cookie";
import Index from "views/Index";
import Tables from "views/examples/Tables";
import Edit from "views/examples/Edit";
import cogoToast from "cogo-toast";
import Profile from "views/examples/Profile";
const cookies = new Cookies();
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
function handleCookiesRedirect() {
  console.log("i am here");
  cogoToast.error("You need to sign in first");
  return <Redirect to="/login" />;
}
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
          {/* {cookies.get("Auth-token") ? ( */}
          {/* <React.Fragment> */}
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
          {/* </React.Fragment> */}
          {/* // ) : (
          //   handleCookiesRedirect()
          // )} */}
        </AlertProvider>
      </Switch>
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);
