import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class BottomNavbar extends Component {
  render() {
    return (
      <React.Fragment>
        <footer className="d-flex justify-content-around">
          <Link to="/create">
            <div>
              <i className="fas fa-plus-circle text-success"></i>
              <span> Create Post</span>
            </div>
          </Link>
          <Link to="/posts">
            <div>
              <i className="fas fa-edit text-primary"></i>
              <span> Edit Posts</span>
            </div>
          </Link>
          <Link to="/login">
            <div>
              <i className="fas fa-sign-out-alt text-danger"></i>
              <span> Exit</span>
            </div>
          </Link>
        </footer>
      </React.Fragment>
    );
  }
}

export default BottomNavbar;
