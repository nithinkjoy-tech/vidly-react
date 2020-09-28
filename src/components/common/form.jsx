import React, { Component } from "react";
import Joi from "joi-browser";
import Input from "./input"
import Select from "./select"

class Form extends Component {
  state = {
    data: {},
    errors: {},
  };

  validate = () => {
    const options = { abortEarly: false };
    let { error } = Joi.validate(this.state.data, this.schema, options);

    if (!error) return "";

    const errors = {};
    for (let item of error.details) errors[item.path[0]] = item.message;
    return errors;
  };

  validateProperty = ({ name, value }) => {
    const obj = { [name]: value };
    const schema = { [name]: this.schema[name] };
    const { error } = Joi.validate(obj, schema);
    return error ? error.details[0].message : "";
  };

  handleSubmit = (e) => {
    e.preventDefault();
    let errors = this.validate();
    this.setState({ errors });
    if (errors) return;
    this.doSubmit();
  };

  handleChange = ({ currentTarget: input }) => {
    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(input);
    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];

    const data = { ...this.state.data };
    data[input.name] = input.value;
    this.setState({ data, errors: errors || {} });
  };

  renderButton(label) {
    return (
      <button  disabled={this.validate()} className="btn btn-primary">
        {label}
      </button>
    );
  }

  renderSelect(name,label,options){
    const {data,errors}=this.state

    return(
      <Select 
        name={name}
        value={data[name]}
        label={label}
        options={options}
        onChange={this.handleChange}
        error={errors[name]}
      />
    )

  }

  renderInput(name, label,type="text") {
    let { data, errors } = this.state;
    let autocomplete=false
    if(type==="password"){
      autocomplete=true
    }
    return (
      <Input
        type={type}
        name={name}
        onChange={this.handleChange}
        label={label}
        autoComplete={autocomplete.toString()}
        value={data[name]}
        autoFocus={name==="username"?true:false}
        error={errors[name]}
      />
    );
  }
}

export default Form;
