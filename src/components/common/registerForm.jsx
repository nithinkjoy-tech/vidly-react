import React from "react";
import Joi from "joi-browser";
import Form from "./form";
import auth from "../../services/authService"
import { register } from "../../services/userService";

class RegisterForm extends Form {
  state = {
    data: {
      username: "",
      password: "",
      name: "",
    },
    errors: {},
  };

  doSubmit = async () => {
    try {
      const response= await register(this.state.data);
      auth.loginWithJwt("token",response.headers["x-auth-token"])
      window.location="/"
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        const errors = { ...this.state.errors };
        errors.username = ex.response.data;
        this.setState({ errors });
      }
    }
  };

  schema = {
    username: Joi.string().required().email().label("Email"),
    password: Joi.string().required().min(3).label("Password"),
    name: Joi.string().required().min(3).label("Name"),
  };

  render() {
    return (
      <React.Fragment>
        <h1>Register</h1>
        <div>
          <form onSubmit={this.handleSubmit}>
            {this.renderInput("username", "Username")}
            {this.renderInput("password", "Password", "password")}
            {this.renderInput("name", "Name")}
            {this.renderButton("Register")}
          </form>
        </div>
      </React.Fragment>
    );
  }
}

export default RegisterForm;
