import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import EditPostCard from './edit-post-card';

class EditPosts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      subject: '',
      datePosted: '',
      content: '',
      postId: null
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { editing } = this.props;
    if (editing !== prevProps.editing) {
      this.setState({
        subject: editing.subject,
        datePosted: editing.datePosted,
        content: editing.content,
        postId: editing.postId
      });
    }
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { updatePostFetch } = this.props;
    const entry = {
      subject: this.state.subject,
      content: this.state.content,
      postId: parseInt(this.state.postId)
    };
    updatePostFetch(entry);
  }

  render() {
    const { posts, updatePost, deletePost, profile } = this.props;
    const userPosts = posts.filter(postobj => postobj.userId === profile.userId);
    const postCard = userPosts.length === 0
      ? <h3 className="text-center">You have no posts! Make some &#129304;</h3>
      : userPosts.map(post => {
        return (
          <EditPostCard
            key={post.postId}
            subject={post.subject}
            datePosted={post.datePosted}
            content={post.content}
            postId={post.postId}
            updatePost={updatePost}
            deletePost={deletePost}
          />
        );
      });
    return (
      <React.Fragment>
        <header className="container-fluid mb-4">
          <div className="row">
            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <h1 className="text-center mt-4">Edit Posts</h1>
            </div>
          </div>
        </header>
        <main className="container-fluid mb-4">
          <div className="row justify-content-center">
            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12" style={{ height: '224px', overflow: 'auto' }}>
              <div className="list-group">
                {postCard}
              </div>
            </div>
          </div>
          <div className="row justify-content-center mt-4">
            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <form onClick={this.handleSubmit}>
                <div className="input-group mb-2">
                  <input
                    type="text"
                    name="subject"
                    value={this.state.subject}
                    placeholder="Post Subject"
                    onChange={this.handleChange}
                    className="form-control" />
                </div>
                <div className="input-group mb-4">
                  <textarea
                    name="content"
                    value={this.state.content}
                    placeholder="Post Body"
                    onChange={this.handleChange}
                    className="form-control form-textarea"
                    cols="30"
                    rows="3">
                  </textarea>
                </div>
                <button
                  name="update"
                  type="submit"
                  className="btn btn-success mr-2 form-buttons">
                  Update
                </button>
              </form>
            </div>
          </div>
        </main>
      </React.Fragment>
    );
  }
}

export default withRouter(EditPosts);
