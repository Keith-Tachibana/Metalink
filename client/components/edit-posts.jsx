import React, { Component } from 'react';

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
    this.handleReset = this.handleReset.bind(this);
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

  handleReset(event) {
    event.preventDefault();
    this.clearFields();
  }

  clearFields() {
    const clearFields = {
      subject: '',
      content: ''
    };
    this.setState(clearFields);
  }

  render() {
    const { posts, updatePost } = this.props;
    const postCard = posts.map(post => {
      return (
        <EditPostCard
          key={post.postId}
          subject={post.subject}
          datePosted={post.datePosted}
          content={post.content}
          postId={post.postId}
          updatePost={updatePost}
        />
      );
    });
    return (
      <React.Fragment>
        <nav className="nav-bg">
          <i className="fas fa-bars mt-4 ml-4"></i>
        </nav>
        <header className="container-fluid mb-4">
          <div className="row">
            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <h1 className="text-center mt-4">Edit Posts</h1>
            </div>
          </div>
        </header>
        <main className="container-fluid mb-4">
          <div className="row justify-content-center">
            <div className="col-10 col-sm-10 col-md-10 col-lg-10 col-xl-10" style={{ height: '300px', overflow: 'auto' }}>
              <div className="list-group">
                {postCard}
              </div>
            </div>
          </div>
          <div className="row justify-content-center mt-4">
            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <form onClick={this.handleSubmit} className="post-form">
                <div className="input-group mb-4 pr-3">
                  <div className="input-group-prepend">
                    <i className="input-group-text fas fa-bookmark pt-2 ml-4"></i>
                  </div>
                  <input
                    type="text"
                    name="subject"
                    value={this.state.subject}
                    placeholder="New Post Subject"
                    onChange={this.handleChange}
                    className="form-control mr-4"/>
                </div>
                <div className="input-group mb-4 pr-3">
                  <div className="input-group-prepend">
                    <i className="input-group-text fas fa-paragraph pt-2 ml-4"></i>
                  </div>
                  <textarea
                    name="content"
                    value={this.state.content}
                    placeholder="New Post Content"
                    onChange={this.handleChange}
                    className="form-control mr-4"
                    cols="30"
                    rows="5">
                  </textarea>
                </div>
                <button
                  name="update"
                  type="submit"
                  className="btn btn-success ml-4 form-buttons">
                    Update
                </button>
                <button
                  name="cancel"
                  onClick={this.handleReset}
                  className="btn btn-danger ml-4 form-buttons">
                    Cancel
                </button>
              </form>
            </div>
          </div>
        </main>
        <footer className="d-flex justify-content-around">
          <div><i className="fas fa-plus-circle text-success"></i> Create Post</div>
          <div><i className="fas fa-edit text-primary"></i> Edit Posts</div>
          <div><i className="fas fa-sign-out-alt text-danger"></i> Exit</div>
        </footer>
      </React.Fragment>
    );
  }
}

export default EditPosts;