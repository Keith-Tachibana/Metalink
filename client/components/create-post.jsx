import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

class CreatePost extends Component {
  render() {
    return (
      <React.Fragment>
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h1 className="text-center">What would you like to post?</h1>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(CreatePost);
