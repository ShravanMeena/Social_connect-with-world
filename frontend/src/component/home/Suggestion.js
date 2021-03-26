import React, { Component } from "react";
import { Card, Avatar, Comment, Button, Divider } from "antd";
import "../../style/component/_suggestion.scss";
import ProfileLogo from "../../assets/aadmi.jpg";
import axios from "axios";
import { connect } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
const { Meta } = Card;

class Suggestion extends Component {
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
        const result = response.data.user.filter(
          (u) => u._id !== this.props.getUserData.data.user._id
        );

        this.setState({
          data: result,
        });
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
      });
  };

  componentDidMount() {
    this.getAllUsers();
  }

  follow = (id) => {
    const data = {
      followId: id,
    };

    axios
      .put(`/api/user/follow`, data, {
        headers: {
          Authorization: `Bearer ${this.props.getUserData.data.token}`,
        },
      })
      .then((response) => {
        this.getAllUsers();
      })
      .catch((error) => {
        toast.error("you are not allow to follow himself");
        this.setState({
          loading: false,
        });
      });
  };

  unfollow = (id) => {
    const data = {
      followId: id,
    };

    axios
      .put(`/api/user/unfollow`, data, {
        headers: {
          Authorization: `Bearer ${this.props.getUserData.data.token}`,
        },
      })
      .then((response) => {
        this.getAllUsers();
      })
      .catch((error) => {
        toast.error("you are not allow to follow himself");
        this.setState({
          loading: false,
        });
      });
  };

  profile = (id) => {
    this.props.history.push(`/user/${id}`);
  };
  render() {
    return (
      <div className='suggestions'>
        <ToastContainer />

        <Card className='card'>
          <h1>Suggestions</h1>
          {this.state.data.map((profile, index) => {
            return (
              <div key={index} className='innerCard'>
                <img src={profile.picUrl} />
                <div className='bio'>
                  <h4 onClick={() => this.profile(profile._id)}>
                    {profile.name}
                  </h4>
                  <p style={{ fontSize: 10 }}>India</p>
                </div>
                {profile.followers.includes(
                  this.props.getUserData.data.user._id
                ) ? (
                  <Button onClick={() => this.unfollow(profile._id)}>
                    Unfollow
                  </Button>
                ) : (
                  <Button
                    type='primary'
                    onClick={() => this.follow(profile._id)}>
                    Follow
                  </Button>
                )}
              </div>
            );
          })}
        </Card>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    getUserData: state.userReducer,
  };
};

export default connect(mapStateToProps, null)(Suggestion);
