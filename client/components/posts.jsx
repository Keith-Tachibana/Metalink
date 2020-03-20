import React from 'react';

class Posts extends React.Component {
  render() {
    return (
      <div className="card col-10 mb-2">
        <div className="card-body">
          <p>{ this.props.username }</p>
          <p>{ this.props.datePosted }</p>
          <p>{ this.props.subject }</p>
          <p>{ this.props.content }</p>
        </div>
      </div>
    );
  }
}

export default Posts;
