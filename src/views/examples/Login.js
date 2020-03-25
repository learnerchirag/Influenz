import React from "react";
import { Link } from "react-router-dom";
import { userActions } from "../../_actions/user.actions";
// import PropTypes from 'prop-types';
<<<<<<< HEAD
import { connect } from 'react-redux';
import { useAlert } from 'react-alert'
import axios from 'axios';
import config from '../../config/config';
=======
import { connect } from "react-redux";
import Axios from "axios";
import api from "../constants/api";

>>>>>>> new_branch
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
    debugger;
    super(props);
    this.state = {
      isRemember: true,
      email: "",
<<<<<<< HEAD
      psw:"",
      user:{}
      // alert:useAlert()
=======
      psw: "",
      user: {}
>>>>>>> new_branch
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange(event) {
    debugger;
    const target = event.target;
    const value = target.name === "isRemember" ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }
  handleSubmit(event) {
    debugger;
    event.preventDefault();
    const { history } = this.props;
    const serverport = {
      email: this.state.email,
      password: this.state.psw
<<<<<<< HEAD
  }
  // 'https://devapi.influenz.club/v1/client/signin ' 
  const apiEndpoint="signin";
  // const alert=useAlert();
    axios.post(config.loginUrl+apiEndpoint, serverport)
        .then(res => {
          if(res.data.status){
            
            this.setState({
              user: res.data.payload,
          });
          
          localStorage.setItem('access_token', res.data.payload.access_token);
          // alert.show(<div style={{ color: 'blue' }}>Some Message</div>);
          history.push('/admin/index');
          }
          else{
            alert("Unautorised");
          }
=======
    };
    // 'https://devapi.influenz.club/v1/client/signin '
    Axios.post(
      `${api.protocol}${api.baseUrl}${api.userLogin}`,
      this.state
    ).then(res => {
      if (res.data.status) {
        history.push("/admin/index");
        this.setState({
          user: res.data.payload
>>>>>>> new_branch
        });
      }
    });
  }
  render() {
    // const alert = useAlert();
    return (
      <>
        <Col lg="5" md="7">
          <Card className="bg-secondary shadow border-0">
<<<<<<< HEAD
            <CardHeader className="bg-transparent pb-4">
              <div className="text-muted text-center mt-1 mb-2">
                <small>Enter your credential to log in</small>
              </div>
=======
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
>>>>>>> new_branch
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
<<<<<<< HEAD
                    <Input placeholder="name@example.com" type="email" autoComplete="new-email" name="email" onChange={this.handleInputChange} value={this.state.email}/>
=======
                    <Input
                      placeholder="Email"
                      type="email"
                      autoComplete="new-email"
                      name="email"
                      onChange={this.handleInputChange}
                      value={this.state.email}
                    />
>>>>>>> new_branch
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
                      name="psw"
                      value={this.state.psw}
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
            <NavLink
                    className="text-light"
                    to="/auth/forget"
                    tag={Link}
                  >
                <small>Forgot password?</small>
              </NavLink>
            </Col>
            <Col className="text-right" xs="6">
              <NavLink className="text-light" to="/auth/register" tag={Link}>
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
