import React from 'react';
import Posts from './posts';

class PostsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      users: []
    };
  }

  componentDidMount() {
    this.getPosts();
    this.getUsers();
  }

  getPosts() {
    fetch('/api/posts')
      .then(res => res.json())
      .then(posts => this.setState({
        posts: posts
      }));
  }

  getUsers() {
    fetch('/api/users')
      .then(res => res.json())
      .then(users => this.setState({
        users: users
      }));
  }

  render() {
    const posts = this.state.posts.map(post => {
      return (
        <Posts
          key={ post.postId }
          username={ post.username }
          datePosted={ post.datePosted }
          subject={ post.subject }
          content={ post.content } />
      );
    });
    return (
      <div className="container mb-4" style={{ height: '575px', overflow: 'auto' }}>
        <div className="row d-flex justify-content-center">
          { posts }
        </div>
      </div>
    );
  }
}

export default PostsList;
