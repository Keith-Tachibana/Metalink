import React from 'react';
import Posts from './posts';

class PostsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: []
    };
  }

  componentDidMount() {
    this.getPosts();
  }

  getPosts() {
    fetch('/api/posts')
      .then(res => res.json())
      .then(posts => this.setState({
        posts: posts
      }));
  }

  render() {
    const posts = this.state.posts.map(posts => {
      return (
        <Posts
          key={ posts.postId }
          datePosted={ posts.datePosted }
          subject={ posts.subject }
          content={ posts.content } />
      );
    });
    return (
      <div className="container">
        <div className="row d-flex justify-content-center h-25 overflow-auto">
          { posts }
        </div>
      </div>
    );
  }
}

export default PostsList;
