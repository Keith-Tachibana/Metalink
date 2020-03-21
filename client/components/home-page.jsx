import React from 'react';
import PostsList from './posts-list';

class HomePage extends React.Component {
  render() {
    return (
      <div className="row">
        <h3 className="col-12 d-flex justify-content-center text-white mt-4">Good Evening, {this.props.profile.username}!</h3>
        <h5 className="col-12 d-flex justify-content-center font-weight-bold text-white">Here are the latest posts...</h5>
        <PostsList />
      </div>
    );
  }
}

export default HomePage;
