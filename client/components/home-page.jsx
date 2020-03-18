import React from 'react';
import PostsList from './postsList';

class HomePage extends React.Component {
  render() {
    return (
      <div className="row">
        <div className="h-50 text-white">
                    navbar
        </div>
        <h5 className="col-12 d-flex justify-content-center  text-white">Good Evening, SonicMetal15</h5>
        <p className="col-12 d-flex justify-content-center font-weight-bold  text-white">Here are the latest posts...</p>
        <PostsList />
        <div className="row fixed-bottom">
          <div className="col-4">Create Post</div>
          <div className="col-4">Edit Post</div>
          <div className="col-4">Exit</div>
        </div>
      </div>
    );
  }
}

export default HomePage;
