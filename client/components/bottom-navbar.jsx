import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';

import ExitContext from './exit-context';

class BottomNavbar extends Component {
  render() {
    const { match } = this.props;
    return (
      <React.Fragment>
        <footer className="d-flex justify-content-around">
          <Link to={`/create/${match.params.id}`}>
            <div>
              <i className="fas fa-plus-circle text-success"></i>
              <span> Create Post</span>
            </div>
          </Link>
          <Link to={`/posts/${match.params.id}`}>
            <div>
              <i className="fas fa-edit text-primary"></i>
              <span> Edit Posts</span>
            </div>
          </Link>
          <Link to="/">
            <div onClick={this.context.handleExit()}>
              <i className="fas fa-sign-out-alt text-danger"></i>
              <span> Exit</span>
            </div>
          </Link>
        </footer>
      </React.Fragment>
    );
  }
}

BottomNavbar.contextType = ExitContext;
export default withRouter(BottomNavbar);
