import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

class CreatePost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      subject: '',
      content: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { createPost } = this.props;
    const newPost = {
      subject: this.state.subject,
      content: this.state.content
    };
    createPost(newPost);
  }

  render() {
    return (
      <React.Fragment>
        <div className="container mb-4">
          <div className="row justify-content-center">
            <div className="col-10">
              <h1 className="text-center mt-4 mb-4">What would you like to post?</h1>
            </div>
          </div>
        </div>
        <div className="container" style={{ height: '399px', overflow: 'auto' }}>
          <div className="row justify-content-center">
            <div className="col-10">
              <form className="post-form">
                <div className="input-group justify-content-center mb-2 pr-4">
                  <input type="text"
                    name="subject"
                    id="subject"
                    placeholder="Post Subject"
                    className="form-control"
                    onChange={ this.handleChange }
                    value={ this.state.subject } />
                </div>
                <div className="input-group justify-content-center">
                  <textarea name="content"
                    rows="16"
                    placeholder="Post Body"
                    className="form-control mr-4 mb-4 form-textarea"
                    onChange={ this.handleChange }
                    value={ this.state.content } >
                  </textarea>
                </div>
                <button
                  name="post"
                  type="submit"
                  className="btn btn-success form-buttons mb-4"
                  onClick={ this.handleSubmit }>
                            Post
                </button>
              </form>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(CreatePost);
