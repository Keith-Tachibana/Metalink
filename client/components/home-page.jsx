import React from 'react';
import PostsList from './postsList';
import Header from './header';

class HomePage extends React.Component {
  render() {
    return (
      <div className="row">
        <Header />
        <h5 className="col-12 d-flex justify-content-center  text-white">Good Evening, SonicMetal15</h5>
        <p className="col-12 d-flex justify-content-center font-weight-bold  text-white">Here are the latest posts...</p>
        <PostsList />
        <div className="container fixed-bottom">
          <div className="row">
            <div className="col-4 text-white d-flex justify-content-center">Create Post</div>
            <div className="col-4 text-white d-flex justify-content-center">Edit Post</div>
            <div className="col-4 text-white d-flex justify-content-center">Exit</div>
          </div>
        </div>
      </div>
    );
  }
}

export default HomePage;
