import React, { Component } from "react";

export default class Footer extends Component {
  render() {
    return (
      <div
        style={{
          background: "#fff",
          padding: 30,
          marginTop: 15,
          flexDirection: "column",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
        <a href='https://www.pakkamarwadi.tk/' target='_blank'>
          &forall; with &#9829; Pakkamarwadi
        </a>
      </div>
    );
  }
}
