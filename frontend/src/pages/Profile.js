import { Spin } from "antd";
import React, { Component } from "react";
import Post from "../component/profile/Post";
import Banner from "../component/profile/Banner";
import ProfileDetails from "../component/profile/ProfileDetails";
import RecentActivity from "../component/profile/RecentActivity";
import "../style/pages/_profile.scss";
import axios from "axios";
import { connect } from "react-redux";
import { Redirect } from "react-router";

class Profile extends Component {
  constructor() {
    super();
    this.state = {
      profile_data: [],
      post_data: [],
    };
  }
  getMyPost = () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.props.getUserData.data.token}`,
      },
    };
    axios
      .get(`/api/user/${this.props.match.params.id}`, config)
      .then((response) => {
        this.setState({
          profile_data: response.data.user,
          post_data: response.data.posts,
        });
      })
      .catch((err) => {
        this.setState({
          loading: false,
        });
      });
  };

  componentDidMount() {
    this.getMyPost();
  }
  render() {
    if (this.props.getUserData.data === null) {
      return <Redirect to='/' />;
    }
    if (this.state.profile_data.length === 0) {
      return (
        <div className='loader'>
          <Spin />
        </div>
      );
    }
    return (
      <div className='mainProfile'>
        <Banner profile_data={this.state.profile_data} />
        <div className='innerMainProfile'>
          <div className='left'>
            <ProfileDetails profile_data={this.state.profile_data} />
          </div>

          <div className='middle'>
            <Post post_data={this.state.post_data} />
          </div>
          <div className='right'>
            <RecentActivity />
          </div>
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

export default connect(mapStateToProps, null)(Profile);
