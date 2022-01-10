import React from 'react';
import { withRouter } from 'react-router-dom';

import PostsList from './posts-list';

class HomePage extends React.Component {
  render() {
    const today = new Date();
    const time = today.getHours();
    let greeting;
    switch (true) {
      case (time < 5):
        greeting = 'Good Evening,';
        break;
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
      <div className="container">
        <h4 className="col-12 d-flex justify-content-center text-white mt-4">{greeting}</h4>
        <h4 className="col-12 d-flex justify-content-center text-white">{this.props.profile.username}!</h4>
        <h5 className="col-12 d-flex justify-content-center text-white">Here are the latest posts...</h5>
        <PostsList />
      </div>
    );
  }
}

export default withRouter(HomePage);
