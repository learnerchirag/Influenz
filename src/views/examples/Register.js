import React from "react";
import { Link } from "react-router-dom";
import Axios from "axios";
import validator from "validator";
import api from "../constants/api";
import cogoToast from "cogo-toast";
import { ReCaptcha } from "react-recaptcha-google";
import { loadReCaptcha } from "react-recaptcha-google";

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
  Col,
  NavLink,
} from "reactstrap";

class Register extends React.Component {
  state = {
    name: "",
    email: "",
    // password: "",
    phone_number: "",
    errors: {},
    captchaVerified: false,
  };
  componentDidMount = () => {
    loadReCaptcha();
  };
  onLoadRecaptcha = () => {
    if (this.captchaDemo) {
      this.captchaDemo.reset();
      // this.captchaDemo.getValue();
      // this.captchaDemo.getWidgetId();
      console.log("hello captcha");
      // this.captchaDemo.execute();
    }
  };
  verifyCallback = (response) => {
    if (response) {
      console.log("hello verified", response);
      this.setState({
        captchaVerified: true,
      });
    }
  };

  handleInputChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };
  handleSignupClick = (e) => {
    this.setState({
      errors: {},
    });
    let errors = {};
    e.preventDefault();

    if (this.state.name === "" || this.state.email === "") {
      errors["Required"] = "Fill all the fields required";
      this.setState({
        ...this.state,
        errors,
      });
      cogoToast.error("Fill all the fields required");
      console.log(this.state);
      return;
    }
    if (this.state.name.length > 50) {
      errors["Name"] = "Name should be less than 50 characters";
      this.setState({
        ...this.state,
        errors,
      });
      cogoToast.error("Name should be less than 50 characters");
    }
    if (this.state.phone_number.length !== 10) {
      errors["Phone"] = "Enter a valid phone number";
      this.setState({
        ...this.state,
        errors,
      });
      cogoToast.error("Enter a valid phone number");
    } else if (!validator.isEmail(this.state.email)) {
      console.log("in email");
      errors["Email"] = "Please type a valid email";
      this.setState({
        ...this.state,
        errors,
      });
      cogoToast.error("Please type a valid email");
    } else if (this.state.captchaVerified) {
      if (this.state.errors) {
        e.preventDefault();
        const { myProp } = this.props;
        myProp(true);
        Axios.post(`${api.protocol}${api.baseUrl}${api.userSignup}`, this.state)
          .then((result) => {
            myProp(false);
            console.log(result);
            if (result.status === 200) {
              if (result.data.status === true) {
                cogoToast.success(result.data.message);
                this.props.history.push("/signin");
              }
              if (result.data.status === false) {
                cogoToast.error(result.data.message);
              }
            }
          })
          .catch((error) => {
            myProp(false);
            console.log(error);
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
    } else {
      cogoToast.error("ReCAPTCHA required");
    }

    console.log(this.state.errors);
    console.log(this.state);
  };

  render() {
    return (
      <>
        <Col lg="6" md="8">
          <Card className="bg-secondary shadow border-0">
            <CardHeader className="bg-transparent py-lg-4">
              <Container>
                <div className="header-body text-center">
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
                  Fill your details to register
                </small>
              </div>
              {/* <div className="text-center text-muted mb-4">
                <small>Or sign up with credentials</small>
              </div> */}
              <Form role="form" onSubmit={this.handleSignupClick}>
                <FormGroup>
                  <InputGroup className="input-group-alternative mb-3">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-hat-3" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      name="name"
                      value={this.state.name}
                      onChange={this.handleInputChange}
                      placeholder="Name"
                      type="text"
                    />
                  </InputGroup>
                </FormGroup>
                <FormGroup>
                  <InputGroup className="input-group-alternative mb-3">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-hat-3" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      name="phone_number"
                      value={this.state.phone_number}
                      onChange={this.handleInputChange}
                      placeholder="Phone"
                      type="number"
                    />
                  </InputGroup>
                </FormGroup>
                <FormGroup>
                  <InputGroup className="input-group-alternative mb-3">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-email-83" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      name="email"
                      onChange={this.handleInputChange}
                      value={this.state.email}
                      placeholder="Email"
                      type="email"
                      autoComplete="new-email"
                    />
                  </InputGroup>
                </FormGroup>

                <Row className="my-4">
                  <Col xs="12">
                    <div className="custom-control custom-control-alternative custom-checkbox">
                      <input
                        className="custom-control-input"
                        id="customCheckRegister"
                        type="checkbox"
                      />
                      <label
                        className="custom-control-label"
                        htmlFor="customCheckRegister"
                      >
                        <span className="text-muted">
                          I agree with the{" "}
                          <a
                            href="https://influenz.club/privacy"
                            target="_blank"
                          >
                            Privacy Policy
                          </a>
                        </span>
                      </label>
                    </div>
                  </Col>
                </Row>
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
                <div className="text-center">
                  <Button
                    className="mt-4"
                    color="primary"
                    onClick={this.handleSignupClick}
                    type="submit"
                  >
                    Create account
                  </Button>
                </div>
              </Form>
            </CardBody>
          </Card>
          <Row className="mt-3">
            <Col className="text-right" xs="12">
              <NavLink className="text-light" to="/signin" tag={Link}>
                <small>Sign in</small>
              </NavLink>
            </Col>
          </Row>
        </Col>
      </>
    );
  }
}

export default Register;
