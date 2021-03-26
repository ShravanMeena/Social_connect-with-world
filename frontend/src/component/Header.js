import React, { Component } from "react";
import "../style/component/_header.scss";
import axios from "axios";
import { userAction } from "../redux/action/userAction";
import { connect } from "react-redux";

class Header extends Component {
  render() {
    return (
      <div className='header'>
        <div className='innerHeader'>
          <div className='left'>
            <a href='/home' style={{ fontSize: 30 }}>
              Social
            </a>{" "}
            <span style={{ fontSize: 10, letterSpacing: 1 }}>
              {" "}
              connect with world
            </span>
          </div>
          {this.props.getUserData.data === null ? null : (
            <div className='right'>
              <div
                onClick={() =>
                  this.props.history.push(
                    `/user/${this.props.getUserData.data.user._id}`
                  )
                }>
                <h4>Profile</h4>
              </div>
              <div onClick={() => this.props.history.push(`/find-friends`)}>
                <h4>Friends</h4>
              </div>
              <div>
                <h4 style={{ color: "#bbb", cursor: "default" }}>Messages</h4>
              </div>

              <div onClick={() => this.props.sendUserData(null)}>
                <h4>Logout</h4>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    getUserData: state.userReducer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    sendUserData: (data) => dispatch(userAction(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
