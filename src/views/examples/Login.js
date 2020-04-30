import React from "react";
import { Link, Redirect } from "react-router-dom";
import { userActions } from "../../_actions/user.actions";
// import PropTypes from 'prop-types';
import { connect } from "react-redux";
import Axios from "axios";
import api from "../constants/api";
import cogoToast from "cogo-toast";
import Cookies from "universal-cookie";
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Container,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  NavLink,
  Col,
} from "reactstrap";
// const alert = useAlert();
class Login extends React.Component {
  // debugger;
  state = {
    isRemember: true,
    email: "",
    password: "",
    user: null,
    errors: {},
  };

  handleInputChange = (event) => {
    // debugger;
    const target = event.target;
    const value = target.name === "isRemember" ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  };
  handleSubmit = (event) => {
    // debugger;
    this.setState({
      errors: {},
    });
    let errors = {};

    event.preventDefault();
    const { history } = this.props;
    const serverport = {
      email: this.state.email,
      password: this.state.password,
    };
    if (this.state.email === "" || this.state.password === "") {
      errors["Required"] = "Fill all the fields required";
      this.setState({
        ...this.state,
        errors,
      });
      cogoToast.error(errors.Required);
      // console.log(this.state);
      return;
    }
    if (this.state.errors) {
      event.preventDefault();

      const { myProp } = this.props;
      const cookies = new Cookies();
      // console.log(myProp);
      myProp(true);
      // 'https://devapi.influenz.club/v1/client/signin '
      Axios.post(`${api.protocol}${api.baseUrl}${api.userLogin}`, this.state)
        .then((result) => {
          myProp(false);

          console.log(result);
          console.log("hello");
          if (result.status === 200) {
            console.log("chalja bhai");
            const user = result.data.payload;
            console.log(user);

            cookies.set("Auth-token", result.data.payload.access_token, {
              path: "/",
              maxAge: "3600",
            });
            cookies.set("User", result.data.payload.name, {
              path: "/",
            });
            cookies.set("Is-admin", result.data.payload.is_admin, {
              path: "/",
            });
            console.log("running");
            this.props.history.push({
              pathname: "/dashboard",
              state: { is_admin: result.data.payload.is_admin },
            });
            console.log(cookies.get("Auth-token"), this.props.history);

            // return <Redirect to="/admin" />;
          }
        })
        .catch((error) => {
          myProp(false);
          // this.props.location.handleLoader(false);
          console.log(error);
          if (error.message === "Network Error") {
            cogoToast.error("Network error");
            return;
          }
          if (error.response.status === 401) {
            cogoToast.error("Email or Password is incorrect.");
          }
          if (error.response.status === 400) {
            cogoToast.error(
              "Status " + error.response.status + ". Request failed."
            );
          }
          if (error.response.status === 500) {
            cogoToast.error(
              "Status " + error.response.status + ". Request failed."
            );
          }
        });
    }
    console.log(this.state.errors);
    console.log(this.state);
    console.log("This is user", this.state.user);
    console.log(this.props);
  };
  render() {
    // const alert = useAlert();
    return (
      <>
        <Col lg="5" md="7">
          <Card className="bg-secondary shadow border-0">
            <CardHeader className="bg-transparent py-lg-4">
              <Container>
                <div className="header-body text-center ">
                  <Row className="justify-content-center">
                    <Col lg="9" md="6">
                      <h1 className="#5e72e4">Welcome!</h1>
                      <p className="text-lead #8898aa">
                        Influenz Campaign Management
                      </p>
                    </Col>
                  </Row>
                </div>
              </Container>
            </CardHeader>
            <CardBody className="px-lg-5 py-lg-5">
              <div class="text-center py-lg-3">
                <small style={{ color: "#8898aa" }}>
                  Sign in with your credentials
                </small>
              </div>

              <Form role="form" onSubmit={this.handleSubmit}>
                <FormGroup className="mb-3">
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-email-83" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="Email"
                      type="email"
                      autoComplete="new-email"
                      name="email"
                      onChange={this.handleInputChange}
                      value={this.state.email}
                    />
                  </InputGroup>
                </FormGroup>
                <FormGroup>
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-lock-circle-open" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="Password"
                      type="password"
                      autoComplete="new-password"
                      name="password"
                      value={this.state.password}
                      onChange={this.handleInputChange}
                    />
                  </InputGroup>
                </FormGroup>
                <div className="custom-control custom-control-alternative custom-checkbox">
                  <input
                    className="custom-control-input"
                    id=" customCheckLogin"
                    type="checkbox"
                    name="isRemember"
                    checked={this.state.isRemember}
                    onChange={this.handleInputChange}
                  />
                  <label
                    className="custom-control-label"
                    htmlFor=" customCheckLogin"
                  >
                    <span className="text-muted">Remember me</span>
                  </label>
                </div>
                <div className="text-center">
                  <Button
                    className="my-4"
                    color="primary"
                    type="submit"
                    onSubmit={this.handleSubmit}
                  >
                    Sign in
                  </Button>
                </div>
              </Form>
            </CardBody>
          </Card>
          <Row className="mt-3">
            <Col xs="6">
              <NavLink className="text-light" to="/forgot" tag={Link}>
                <small>Forgot password?</small>
              </NavLink>
            </Col>
            <Col className="text-right" xs="6">
              <NavLink className="text-light" to="/register" tag={Link}>
                <small>Create new account</small>
              </NavLink>
            </Col>
          </Row>
        </Col>
      </>
    );
  }
}

//export default Login;
const mapStateToProps = (state) => {
  return {
    isLoginPending: state.isLoginPending,
    isLoginSuccess: state.isLoginSuccess,
    loginError: state.loginError,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    login: (email, password) => dispatch(userActions.login(email, password)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
