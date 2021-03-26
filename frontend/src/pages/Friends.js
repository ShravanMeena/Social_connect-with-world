import React, { Component } from "react";
import { Card, Avatar, Comment, Tooltip, Divider } from "antd";
import "../style/pages/_friends.scss";
import ProfileLogo from "../assets/aadmi.jpg";
import axios from "axios";
import { Redirect } from "react-router";
import { connect } from "react-redux";

class Friends extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
    };
  }
  getAllUsers = () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    axios
      .get(`/api/user`, config)
      .then((response) => {
        this.setState({
          data: response.data.user,
        });
      })
      .catch((err) => {
        this.setState({
          loading: false,
        });
      });
  };

  componentDidMount() {
    this.getAllUsers();
  }

  profile = (id) => {
    this.props.history.push(`/user/${id}`);
  };
  render() {
    if (this.props.getUserData.data === null) {
      return <Redirect to='/' />;
    }
    return (
      <div className='friendsContainer'>
        <h1>Find Friends</h1>

        <div className='profile'>
          {this.state.data.map((profile, index) => {
            return (
              <Card className='card'>
                <div className='innerCard'>
                  <img src={profile.picUrl} />
                  <h4 onClick={() => this.profile(profile._id)}>
                    {profile.name}
                  </h4>
                  <p>active a few seconds ago</p>

                  <div className='followContainer'>
                    <div className='follow'>
                      <h4>{profile.followers.length}</h4>
                      <h6>Followers</h6>
                    </div>

                    <div className='follow'>
                      <h4>{profile.following.length}</h4>
                      <h6>Following</h6>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
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

// const mapDispatchToProps = (dispatch) => {
//   return {
//     sendCurrentNetworkDetailsData: (data) =>
//       dispatch(currentNetworkDetailsAction(data)),
//   };
// };
export default connect(mapStateToProps, null)(Friends);
