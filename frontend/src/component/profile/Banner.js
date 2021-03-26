import React, { Component } from "react";
import Cover from "../../assets/aadmi.jpg";
import ProfileLogo from "../../assets/postImg.jpg";
import "../../style/component/profile/_banner.scss";
import { Modal, Button, Card, Input, Spin } from "antd";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { connect } from "react-redux";

const { Meta } = Card;
const { TextArea } = Input;

class Banner extends Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      visible: false,
      visible_follow_data: false,
      profile_data: null,
      name: "",
      bio: "",
      picUrl: "",
      gitHubUrl: "",
      instaUrl: "",
      file: null,
      linkedInUrl: "",
      url: "",
      data: null,
      value_f: null,
    };
  }

  handleOk = () => {
    this.setState({ loading: true });
    setTimeout(() => {
      this.setState({ loading: false, visible: false });
    }, 3000);
  };
  handleCancel = () => {
    this.setState({ visible: false });
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  showFollowData = (f) => {
    this.setState({
      visible_follow_data: !this.state.visible_follow_data,
      value_f: f,
    });
  };

  updateProfile = () => {
    this.getPicUrl();
    setTimeout(() => {
      const data = {
        picUrl: this.state.url || this.state.picUrl,
        name: this.state.name,
        bio: this.state.bio,
        picUrl: this.state.picUrl,
        gitHubUrl: this.state.gitHubUrl,
        instaUrl: this.state.instaUrl,
        linkedInUrl: this.state.linkedInUrl,
      };
      axios
        .put(`/api/update/${this.props.getUserData.data.user._id}`, data, {
          headers: {
            Authorization: `Bearer ${this.props.getUserData.data.token}`,
          },
        })
        .then((response) => {
          this.setState({
            loading: false,
            visible: false,
          });
          this.getUserAllData();
        })
        .catch((error) => {
          toast.warning("Something went wrong!!");
          this.setState({
            loading: false,
          });
        });
    }, 500);
  };

  getPicUrl = () => {
    const formData = new FormData();
    formData.append("url", this.state.file);
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };

    axios
      .post(`/api/upload`, formData, config)
      .then((response) => {
        this.setState({
          url: response.data.url,
          picUrl: response.data.url,
          loading: true,
        });
      })
      .catch((error) => {});
    this.setState({ loading: true });
  };

  handleOk = () => {
    this.setState({ loading: true });
    setTimeout(() => {
      this.setState({ loading: false, visible: false });
    }, 3000);
  };
  handleCancel = () => {
    this.setState({ visible: false });
  };

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  onChange = (e) => {
    this.setState({ file: e.target.files[0] });
  };

  getUserAllData = () => {
    axios
      .get(`/api/user/${this.props.profile_data._id}`, {
        headers: {
          Authorization: `Bearer ${this.props.getUserData.data.token}`,
        },
      })
      .then((response) => {
        this.setState({
          email: response.data.user.email,
          name: response.data.user.name,
          bio: response.data.user.bio,
          picUrl: response.data.user.picUrl,
          gitHubUrl: response.data.user.gitHubUrl,
          instaUrl: response.data.user.instaUrl,
          linkedInUrl: response.data.user.linkedInUrl,
          data: response.data,
        });
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
      });
  };
  componentDidMount() {
    this.setState({
      profile_data: this.props.profile_data,
    });

    this.getUserAllData();
  }
  render() {
    if (this.state.data === null) {
      return (
        <div className='loader'>
          <Spin />
        </div>
      );
    }
    const { user, posts } = this.state.data;
    return (
      <div style={{ background: "#fff", padding: 40, width: "100%" }}>
        <div
          style={{
            display: "flex",
            lexDirection: "row",
            justifyContent: "center",
            flex: 1,
          }}>
          <div style={{ flex: 0.5, marginRight: 80 }}>
            <div style={{ border: "1px solid #bbb", borderRadius: 10 }}>
              <img
                src={`http://127.0.0.1:5000/${user.picUrl}`}
                alt={user.picUrl}
                style={{ width: "100%", height: 300, objectFit: "contain" }}
              />
            </div>
          </div>
        </div>

        <Modal
          className='model'
          visible={this.state.visible}
          title='Update profile'
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={[
            <Button
              key='submit'
              type='primary'
              loading={this.state.loading}
              onClick={this.updateProfile}>
              Update
            </Button>,
          ]}>
          <h3>Name</h3>
          <Input
            style={{ marginBottom: 10, padding: 10 }}
            value={this.state.name}
            value={this.state.name}
            name='name'
            onChange={(event) => this.handleChange(event)}
            placeholder='Enter your name'
          />

          <h3>Email</h3>
          <Input
            style={{ marginBottom: 10, padding: 10 }}
            value={this.state.email}
            value={this.state.email}
            name='email'
            onChange={(event) => this.handleChange(event)}
            placeholder='Email can not change!!!'
            disabled
          />
          {/* <Input
            style={{ marginBottom: 10, padding: 10 }}
            value={this.state.picUrl}
            value={this.state.picUrl}
            name='picUrl'
            onChange={(event) => this.handleChange(event)}
            placeholder='Enter your name'
          /> */}
          <h3>Github link</h3>
          <Input
            style={{ marginBottom: 10, padding: 10 }}
            value={this.state.gitHubUrl}
            value={this.state.gitHubUrl}
            name='gitHubUrl'
            onChange={(event) => this.handleChange(event)}
            placeholder='Enter your gitHubUrl'
          />

          <h3>Instagram link</h3>
          <Input
            style={{ marginBottom: 10, padding: 10 }}
            value={this.state.instaUrl}
            value={this.state.instaUrl}
            name='instaUrl'
            onChange={(event) => this.handleChange(event)}
            placeholder='Enter your name'
          />

          <h3>Linkedin link</h3>
          <Input
            style={{ marginBottom: 10, padding: 10 }}
            value={this.state.linkedInUrl}
            value={this.state.linkedInUrl}
            name='linkedInUrl'
            onChange={(event) => this.handleChange(event)}
            placeholder='Enter your linkedin'
          />

          <h3>Bio</h3>
          <TextArea
            style={{ marginBottom: 10, padding: 10 }}
            value={this.state.bio}
            value={this.state.bio}
            name='name'
            row={3}
            onChange={(event) => this.handleChange(event)}
            placeholder='Enter your bio'
          />

          <h3>Update profile picture</h3>
          <Input
            style={{ marginBottom: 10, padding: 10 }}
            value={this.state.picUrl}
            value={this.state.picUrl}
            disabled
            name='linkedInUrl'
            onChange={(event) => this.handleChange(event)}
          />
          <Input type='file' name='myImage' onChange={this.onChange} />
        </Modal>

        <Modal
          className='model'
          visible={this.state.visible_follow_data}
          title='Followers'
          onOk={this.showFollowData}
          onCancel={this.showFollowData}
          footer={[
            <Button key='submit' type='primary' onClick={this.showFollowData}>
              Go Back
            </Button>,
          ]}>
          {this.state.value_f === 2 ? (
            <>
              {user.following.map((f, index) => {
                return <p>{f}</p>;
              })}
            </>
          ) : (
            <>
              {user.followers.map((f, index) => {
                return <p>{f}</p>;
              })}
            </>
          )}
        </Modal>
        <div
          style={{
            display: "flex",
            lexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 50,
          }}>
          <div style={{ display: "flex", lexDirection: "row" }}>
            <div className='follow'>
              <h1>{user.name}</h1>
            </div>

            <div className='follow' style={{ marginLeft: 50 }}>
              {this.props.getUserData.data.user._id === user._id && (
                <h4 style={{ cursor: "pointer" }} onClick={this.showModal}>
                  Edit profile
                </h4>
              )}
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            lexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 50,
          }}>
          <div style={{ marginRight: 80 }}>
            <h4>Posts</h4>
            <p>{posts.length}</p>
          </div>

          <div style={{ marginRight: 80 }}>
            <h4 onClick={() => this.showFollowData(1)}>Followers</h4>
            <p>{user.followers.length}</p>
          </div>

          <div style={{ marginRight: 80 }}>
            <h4 onClick={() => this.showFollowData(2)}>Following</h4>
            <p>{user.following.length}</p>
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

export default connect(mapStateToProps, null)(Banner);
