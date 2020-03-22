import React from 'react';
import { withRouter } from 'react-router-dom';

import PostsList from './posts-list';

class HomePage extends React.Component {
  render() {
    const today = new Date();
    const time = today.getHours();
    let greeting;
    switch (true) {
      case (time < 12):
        greeting = 'Good Morning,';
        break;
      case (time < 18):
        greeting = 'Good Afternoon,';
        break;
      default:
        greeting = 'Good Evening,';
        break;
    }
    return (
      <div className="row">
        <h3 className="col-12 d-flex justify-content-center text-white mt-4">{greeting} {this.props.profile.username}!</h3>
        <h5 className="col-12 d-flex justify-content-center font-weight-bold text-white">Here are the latest posts...</h5>
        <PostsList />
      </div>
    );
  }
}

export default withRouter(HomePage);
