import React, { Component } from 'react';

class EditPostCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expand: false
    };
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.expand = this.expand.bind(this);
  }

  handleUpdate() {
    const { updatePost, postId } = this.props;
    updatePost(postId);
  }

  handleDelete() {
    const { deletePost, postId } = this.props;
    deletePost(postId);
  }

  expand() {
    this.setState({
      expand: !this.state.expand
    });
  }

  renderDate() {
    const { datePosted } = this.props;
    const split = datePosted.split('-');
    const splitLast = split[2].split('T');
    const splitTime = splitLast[1].split(':');
    const hour = splitTime[0] < 10 ? splitTime[0].slice(1) : splitTime[0];
    const amPM = hour < 12 ? 'AM' : 'PM';
    const time = `${hour}:${splitTime[1]} ${amPM}`;
    const month = split[1] < 10 ? split[1].slice(1) : split[1];
    const postDate = `${month}/${splitLast[0]}/${split[0]} @ ${time}`;
    return postDate;
  }

  render() {
    const { subject, content } = this.props;
    const postCSS = this.state.expand ? 'mb-1' : 'mb-1 post-content';
    return (
      <React.Fragment>
        <div className="list-group-item list-group-item-action post-item">
          <div className="d-flex justify-content-between">
            <div>
              <small>{this.renderDate()}</small>
              <h6 className="mb-1"><ins><strong><em>{subject}</em></strong></ins></h6>
            </div>
            <button onClick={this.handleUpdate} className="btn btn-sm btn-primary post-buttons">Edit</button>
            <button onClick={this.handleDelete} className="btn btn-sm btn-danger post-buttons">Delete</button>
          </div>
          <p onMouseEnter={this.expand} onMouseLeave={this.expand} className={postCSS}>{content}</p>
        </div>
      </React.Fragment>
    );
  }
}

export default EditPostCard;
