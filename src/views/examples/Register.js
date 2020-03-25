import React from "react";
import { Link } from "react-router-dom";
import Axios from "axios";
import validator from "validator";
import api from "../constants/api";
import cogoToast from "cogo-toast";

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
  NavLink
} from "reactstrap";

class Register extends React.Component {
  state = {
    name: "",
    email: "",
    password: "",
    phone_number: "",
    errors: {}
  };

  handleInputChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  handleSignupClick = e => {
    let errors = {};
    e.preventDefault();
    if (
      // this.state.name === null ||
      this.state.name === "" ||
      // this.state.email === null ||
      this.state.email === "" ||
      // this.state.password === null ||
      this.state.password === ""
    ) {
      errors["Required"] = "Fill all the fields required";
      this.setState({
        ...this.state,
        errors
      });
      cogoToast.error("Fill all the fields required");
      console.log(this.state);
      return;
    }
    if (this.state.name.length > 50) {
      errors["Name"] = "Name should be less than 50 characters";
      this.setState({
        ...this.state,
        errors
      });
      cogoToast.error("Name should be less than 50 characters");
    }
    if (this.state.phone_number.length !== 10) {
      errors["Phone"] = "Enter a valid phone number";
      this.setState({
        ...this.state,
        errors
      });
      cogoToast.error("Enter a valid phone number");
    }
    if (!validator.isEmail(this.state.email)) {
      console.log("in email");
      errors["Email"] = "Please type a valid email";
      this.setState({
        ...this.state,
        errors
      });
      cogoToast.error("Please type a valid email");
    }

    if (this.state.password.length < 6) {
      console.log("in password");
      errors["Password"] = "Password should be more than 6 characaters";
      this.setState({
        ...this.state,
        errors
      });
      cogoToast.error("Password should be more than 6 characaters");
    }
    if (Object.keys(this.state.errors).length === 0) {
      e.preventDefault();
      Axios.post(`${api.protocol}${api.baseUrl}${api.userSignup}`, "")
        .then(result => {
          console.log(result);
          if (result.status === 200) {
            if (result.data.status === true) {
              cogoToast.success(result.data.message);
              this.props.history.push("/auth/login");
            }
            if (result.data.status === false) {
              cogoToast.error(result.data.message);
            }
          }
        })
        .catch(error => {
          console.log(error);
          if (error.status === 400) {
            cogoToast.error("Status " + error.status + ". Request failed.");
          }
          if (error.status === 500) {
            cogoToast.error("Status " + error.status + ". Request failed.");
          }
        });
    }

    console.log(this.state.errors);
    console.log(this.state);
  };

  render() {
    return (
      <>
        <Col lg="6" md="8">
          <Card className="bg-secondary shadow border-0">
            <CardHeader className="bg-transparent">
              <Container>
                <div className="header-body text-center mb-7">
                  <Row className="justify-content-center">
                    <Col lg="9" md="6">
                      <h1 className="#5e72e4">Welcome!</h1>
                      <p className="text-lead #8898aa">
                        Let Influencers Spread The Word.
                      </p>
                    </Col>
                  </Row>
                </div>
              </Container>
              {/* <div className="text-muted text-center mt-2 mb-4">
                <small>Sign up with</small>
              </div> */}
              {/* <div className="text-center">
                <Button
                  className="btn-neutral btn-icon mr-4"
                  color="default"
                  href="#pablo"
                  onClick={e => e.preventDefault()}
                >
                  <span className="btn-inner--icon">
                    <img
                      alt="..."
                      src={require("assets/img/icons/common/github.svg")}
                    />
                  </span>
                  <span className="btn-inner--text">Github</span>
                </Button>
                <Button
                  className="btn-neutral btn-icon"
                  color="default"
                  href="#pablo"
                  onClick={e => e.preventDefault()}
                >
                  <span className="btn-inner--icon">
                    <img
                      alt="..."
                      src={require("assets/img/icons/common/google.svg")}
                    />
                  </span>
                  <span className="btn-inner--text">Google</span>
                </Button>
              </div> */}
            </CardHeader>
            <CardBody className="px-lg-5 py-lg-5">
              {/* <div className="text-center text-muted mb-4">
                <small>Or sign up with credentials</small>
              </div> */}
              <Form role="form">
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
                <FormGroup>
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-mobile-button" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      name="password"
                      onChange={this.handleInputChange}
                      value={this.state.password}
                      placeholder="Password"
                      type="password"
                      autoComplete="new-password"
                    />
                  </InputGroup>
                </FormGroup>
                {/* <div className="text-muted font-italic">
                  <small>
                    password strength:{" "}
                    <span className="text-success font-weight-700">strong</span>
                  </small>
                </div> */}
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
                          <a href="#pablo" onClick={e => e.preventDefault()}>
                            Privacy Policy
                          </a>
                        </span>
                      </label>
                    </div>
                  </Col>
                </Row>
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
              <NavLink className="text-light" to="/auth/login" tag={Link}>
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
