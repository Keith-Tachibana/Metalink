import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

class CreatePost extends Component {
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
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-10">
              <form className="post-form">
                <div className="input-group justify-content-center mb-2 pr-4">
                  <input type="text"
                    name="subject"
                    id="subject"
                    placeholder="Post Subject"
                    className="form-control" />
                </div>
                <div className="input-group justify-content-center">
                  <textarea name="content"
                    rows="16"
                    placeholder="Post Body"
                    className="form-control mr-4 mb-4 form-textarea">
                  </textarea>
                </div>
                <button
                  name="post"
                  type="submit"
                  className="btn btn-success form-buttons mb-4">
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
