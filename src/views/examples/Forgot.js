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

class Forgot extends React.Component {
  state = {
    email: "",
    errors: {}
  };

  handleInputChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  handleResetClick = e => {
    this.setState({
      errors: {}
    });
    let errors = {};
    e.preventDefault();
    if (
      // this.state.name === null ||
      this.state.email === ""
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

    if (!validator.isEmail(this.state.email)) {
      console.log("in email");
      errors["Email"] = "Please type a valid email";
      this.setState({
        ...this.state,
        errors
      });
      cogoToast.error("Please type a valid email");
    } else if (this.state.errors) {
      e.preventDefault();
      const { myProp } = this.props;
      myProp(true);
      Axios.post(
        `${api.protocol}${api.baseUrl}${api.forgotPassword}`,
        this.state
      )
        .then(result => {
          console.log(result);
          myProp(false);
          if (result.status === 200) {
            if (result.data.status === true) {
              cogoToast.success(result.data.message);
              this.props.history.push("/login");
            }
            if (result.data.status === false) {
              cogoToast.error(result.data.message);
            }
          }
        })
        .catch(error => {
          console.log(error);
          myProp(false);
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
  };

  render() {
    return (
      <>
        <Col lg="6" md="8">
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
                  Enter your email to reset password
                </small>
              </div>
              <Form role="form">
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

                <div className="text-center">
                  <Button
                    className="mt-4"
                    color="primary"
                    onClick={this.handleResetClick}
                    type="submit"
                  >
                    Reset Password
                  </Button>
                </div>
              </Form>
            </CardBody>
          </Card>
          <Row className="mt-3">
            <Col className="text-right" xs="12">
              <NavLink className="text-light" to="/login" tag={Link}>
                <small>Sign in</small>
              </NavLink>
            </Col>
          </Row>
        </Col>
      </>
    );
  }
}

export default Forgot;
