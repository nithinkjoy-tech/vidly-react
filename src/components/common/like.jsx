import React, { Component } from "react";

class Like extends Component {
  state = {};

  isLiked() {
    let classes = "fa fa-heart";
    return (classes += this.props.liked ? "" : "-o");
  }

  render() {
    return (
      <React.Fragment>
        <i
          onClick={this.props.onLike}
          style={{ cursor: "pointer" }}
          className={this.isLiked()}
        ></i>
      </React.Fragment>
    );
  }
}

export default Like;
