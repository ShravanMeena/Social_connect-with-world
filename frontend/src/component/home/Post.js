import React, { Component } from "react";
import {
  Card,
  Avatar,
  Comment,
  Tooltip,
  Divider,
  Modal,
  Button,
  Form,
  Input,
} from "antd";
import moment from "moment";
import {
  DislikeOutlined,
  LikeOutlined,
  DislikeFilled,
  LikeFilled,
} from "@ant-design/icons";

import "../../style/component/_post.scss";
import PostLogo from "../../assets/postImg.jpg";
import Create from "./post/Create";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { connect } from "react-redux";

const { Meta } = Card;
const { TextArea } = Input;

class Post extends Component {
  constructor() {
    super();
    this.state = {
      likes: 0,
      dislikes: 0,
      action: null,
      create_post_modal: false,
      data: [],
      loading: false,
      visible: false,

      // ppst data
      title: "",
      category: "",
      description: "",
      url: "",
      location: "",
      tags: "",
      activity: "",
      file: null,

      comment: "",
      showComment: false,
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

  like = () => {
    this.setState({
      likes: 1,
      dislikes: 0,
      action: "liked",
    });
  };

  dislike = () => {
    this.setState({
      likes: 0,
      dislikes: 1,
      action: "disliked",
    });
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  createPost = () => {
    if (!this.state.description) {
      toast.error("Please write down your thoughts!");
      return;
    }

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
          loading: true,
        });

        if (response.data.success) {
          const data = {
            description: this.state.description,
            url: this.state.url,
          };
          axios
            .post(`/api/post`, data, {
              headers: {
                Authorization: `Bearer ${this.props.getUserData.data.token}`,
              },
            })
            .then((response) => {
              this.setState({
                loading: false,
                visible: false,
              });
              this.getAllPost();
            })
            .catch((error) => {
              toast.warning("Something went wrong!!");
              this.setState({
                loading: false,
              });
            });
        }
      })
      .catch((error) => {});
    this.setState({ loading: true });
  };

  onChange = (e) => {
    this.setState({ file: e.target.files[0] });
  };

  getAllPost = () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    axios
      .get(`/api/post`, config)
      .then((response) => {
        this.setState({
          loading: false,
          data: response.data.posts,
        });
      })
      .catch((error) => {
        toast.warning("Slow intenet please reload!!");
        this.setState({
          loading: false,
        });
      });
  };

  componentDidMount() {
    this.getAllPost();
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
        this.getAllPost();
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
        this.getAllPost();
      })
      .catch((error) => {
        toast.error("you are not allow to follow himself");
        this.setState({
          loading: false,
        });
      });
  };

  like = (id) => {
    const data = {
      postId: id,
    };

    axios
      .put(`/api/post/like`, data, {
        headers: {
          Authorization: `Bearer ${this.props.getUserData.data.token}`,
        },
      })
      .then((response) => {
        this.getAllPost();
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
      });
  };

  unlike = (id) => {
    const data = {
      postId: id,
    };

    axios
      .put(`/api/post/dislike`, data, {
        headers: {
          Authorization: `Bearer ${this.props.getUserData.data.token}`,
        },
      })
      .then((response) => {
        this.getAllPost();
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
      });
  };

  addComment = (id) => {
    if (!this.state.comment) {
      toast.error("Please comment something");
      return;
    }
    const data = {
      comment: this.state.comment,
      postId: id,
    };

    axios
      .put(`/api/post/comment`, data, {
        headers: {
          Authorization: `Bearer ${this.props.getUserData.data.token}`,
        },
      })
      .then((response) => {
        this.getAllPost();
        this.setState({
          comment: "",
        });
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
      });
  };
  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  profile = (id) => {
    this.props.history.push(`/user/${id}`);
  };

  render() {
    return (
      <div className='postContainer'>
        <ToastContainer />
        <Card className='form'>
          <Input
            size='large'
            onClick={this.showModal}
            placeholder='Create new post'
          />
          <Modal
            className='model'
            visible={this.state.visible}
            title='Create new post'
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            footer={[
              // <Button key='back' onClick={this.handleCancel}>
              //   Return
              // </Button>,
              <Button
                key='submit'
                type='primary'
                loading={this.state.loading}
                onClick={this.createPost}>
                Create Post
              </Button>,
            ]}>
            <TextArea
              value={this.state.description}
              name='description'
              onChange={(event) => this.handleChange(event)}
              rows={2}
              onClick={this.showModal}
              placeholder='Type your thoughts'
            />

            {/* <Button style={{ marginTop: 10 }}>Feelings</Button>
            <Button style={{ marginTop: 10 }} type='danger'>
              Attachment
            </Button> */}
            <Input type='file' name='myImage' onChange={this.onChange} />
          </Modal>
        </Card>

        {this.state.data.reverse().map((post, index) => {
          return (
            <div className='post'>
              <Card className='singlePost'>
                <div className='headerCard'>
                  <h4
                    onClick={() => this.profile(post.creator._id)}
                    style={{ cursor: "pointer", fontWeight: "bold" }}
                    className='title'>
                    {post.creator.name}
                  </h4>
                  {post.creator.followers.includes(
                    this.props.getUserData.data.user._id
                  ) ? (
                    <Button onClick={() => this.unfollow(post.creator._id)}>
                      Unfollow
                    </Button>
                  ) : (
                    <Button
                      type='primary'
                      onClick={() => this.follow(post.creator._id)}>
                      Follow
                    </Button>
                  )}
                </div>

                <div className='imgConainer'>
                  <img
                    onDoubleClick={() => alert("I m working on it")}
                    alt='example'
                    src={post.url}
                  />
                </div>

                {post.likers.includes(this.props.getUserData.data.user._id) ? (
                  <h6 onClick={() => this.unlike(post._id)}>
                    <LikeFilled /> {post.likers.length} Likes
                  </h6>
                ) : (
                  <h6 onClick={() => this.like(post._id)}>
                    <LikeOutlined /> {post.likers.length}
                    Likes
                  </h6>
                )}

                <p className='description'>{post.description}</p>

                <div className='commntForm'>
                  <TextArea
                    rows={4}
                    name='comment'
                    onChange={this.handleChange}
                  />
                  {!(this.state.comment.length === 0) ? (
                    <Button onClick={() => this.addComment(post._id)}>
                      Comment
                    </Button>
                  ) : (
                    <Button ghost disabled>
                      Comment
                    </Button>
                  )}
                </div>

                {/* comments */}
                {post.comments.length === 0 ? null : (
                  <h4
                    className='viewCommnetTitle'
                    onClick={() => this.setState({ showComment: post._id })}>
                    View all {post.comments.length} comments
                  </h4>
                )}

                {this.state.showComment == post._id ? (
                  <>
                    {post.comments.reverse().map((comment, c) => {
                      return (
                        <Comment
                          className='comment'
                          author={<a>{comment.commentedBy}</a>}
                          avatar={<Avatar src={PostLogo} alt='Han Solo' />}
                          content={<p>{comment.comment}</p>}
                          datetime={
                            <Tooltip
                              title={moment().format("YYYY-MM-DD HH:mm:ss")}>
                              <span>{moment().fromNow()}</span>
                            </Tooltip>
                          }
                        />
                      );
                    })}
                  </>
                ) : null}
              </Card>
            </div>
          );
        })}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    getUserData: state.userReducer,
  };
};

export default connect(mapStateToProps, null)(Post);
