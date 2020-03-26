import React from "react";
import { Link } from "react-router-dom";
import { userActions } from "../../_actions/user.actions";
// import PropTypes from 'prop-types';
import { connect } from "react-redux";
import Axios from "axios";
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
  NavLink,
  Col
} from "reactstrap";
// const alert = useAlert();
class Login extends React.Component {
  constructor(props) {
    // debugger;
    super(props);
    this.state = {
      isRemember: true,
      email: "",
      password: "",
      user: {},
      errors: {}
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange(event) {
    // debugger;
    const target = event.target;
    const value = target.name === "isRemember" ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }
  handleSubmit(event) {
    // debugger;
    let errors = {};
    this.setState({
      ...this.state,
      errors
    });
    event.preventDefault();
    const { history } = this.props;
    const serverport = {
      email: this.state.email,
      password: this.state.password
    };
    if (this.state.email === "" || this.state.password === "") {
      errors["Required"] = "Fill all the fields required";
      this.setState({
        ...this.state,
        errors
      });
      cogoToast.error(errors.Required);
      console.log(this.state);
      return;
    }
    if (Object.keys(this.state.errors).length === 0) {
      event.preventDefault();
      // 'https://devapi.influenz.club/v1/client/signin '
      Axios.post(`${api.protocol}${api.baseUrl}${api.userLogin}`, this.state)
        .then(result => {
          console.log(result);
          console.log("hello");
          if (result.status === 200) {
            history.push("/admin/index");
            this.setState({
              user: result.data.payload
            });
            console.log(this.state.user);
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
    console.log("This is user" + this.state.user);
  }
  render() {
    // const alert = useAlert();
    return (
      <>
        <Col lg="5" md="7">
          <Card className="bg-secondary shadow border-0">
            <CardHeader className="bg-transparent ">
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
              {/* <div className="text-muted text-center mt-2 mb-3">
                <small>Sign in with</small>
              </div> */}
              {/* <div className="btn-wrapper text-center">
                <Button
                  className="btn-neutral btn-icon"
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
                <small>Or sign in with credentials</small>
              </div> */}
              <Form role="form">
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
                    type="button"
                    onClick={this.handleSubmit}
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
const mapStateToProps = state => {
  return {
    isLoginPending: state.isLoginPending,
    isLoginSuccess: state.isLoginSuccess,
    loginError: state.loginError
  };
};

const mapDispatchToProps = dispatch => {
  return {
    login: (email, password) => dispatch(userActions.login(email, password))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
