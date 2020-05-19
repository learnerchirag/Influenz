import React from "react";
import { Link } from "react-router-dom";
// import PropTypes from 'prop-types';
import Axios from "axios";
import api from "../constants/api";
import cogoToast from "cogo-toast";
import Cookies from "universal-cookie";
import { ReCaptcha } from "react-recaptcha-google";
import { loadReCaptcha } from "react-recaptcha-google";
import classnames from "classnames";

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
    captchaVerified: false,
    isLoaded: false,
  };
  componentDidMount = () => {
    loadReCaptcha();
  };
  onLoadRecaptcha = () => {
    if (this.captchaDemo) {
      this.captchaDemo.reset();
    }
  };
  verifyCallback = (response) => {
    if (response) {
      this.setState({
        captchaVerified: true,
        isLoaded: true,
      });
    }
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

    if (this.state.email === "" || this.state.password === "") {
      errors["Required"] = "Fill all the fields required";
      this.setState({
        ...this.state,
        errors,
      });
      cogoToast.error(errors.Required);
      // (this.state);
      return;
    } else if (this.state.captchaVerified) {
      if (this.state.errors) {
        event.preventDefault();

        const { myProp } = this.props;
        const cookies = new Cookies();
        myProp(true);
        // 'https://devapi.influenz.club/v1/client/signin '
        Axios.post(`${api.protocol}${api.baseUrl}${api.userLogin}`, this.state)
          .then((result) => {
            myProp(false);

            if (result.status === 200) {
              const user = result.data.payload;

              cookies.set("Auth-token", result.data.payload.access_token, {
                path: "/",
                maxAge: "43200",
              });
              cookies.set("User", result.data.payload.name, {
                path: "/",
              });
              cookies.set("Is-admin", result.data.payload.is_admin, {
                path: "/",
              });
              this.props.history.push({
                pathname: "/dashboard",
                state: { is_admin: result.data.payload.is_admin },
              });
            }
          })
          .catch((error) => {
            myProp(false);

            if (error.message === "Network Error") {
              cogoToast.error("Network error");
              return;
            } else if (error.response.status === 401) {
              cogoToast.error("Email or Password is incorrect.");
            } else if (error.response.status === 400) {
              cogoToast.error(
                "Status " + error.response.status + ". Request failed."
              );
            } else {
              cogoToast.error(
                "Status " + error.response.status + ". Request failed."
              );
            }
          });
      }
    } else {
      cogoToast.error("ReCAPTCHA required");
    }
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
                        Influenz Marketing Platform
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
                <div style={{ minHeight: "78px" }}>
                  <ReCaptcha
                    ref={(el) => {
                      this.captchaDemo = el;
                    }}
                    size="normal"
                    render="explicit"
                    sitekey="6LfD4uQUAAAAAJ2RHILlTL46VaPVaAsriI-IgefG"
                    onloadCallback={this.onLoadRecaptcha}
                    verifyCallback={this.verifyCallback}
                  />
                </div>
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
                    className={classnames("my-4", {
                      disabled: this.state.isLoaded === false,
                    })}
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
              <NavLink className="text-light" to="/signup" tag={Link}>
                <small>Create new account</small>
              </NavLink>
            </Col>
          </Row>
        </Col>
      </>
    );
  }
}

export default Login;
