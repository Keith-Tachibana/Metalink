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
    const posts = this.state.posts.map(posts => {
      return (
        <Posts
          key={ posts.postId }
          screenName={ posts.screenName }
          datePosted={ posts.datePosted }
          subject={ posts.subject }
          content={ posts.content } />
      );
    });
    return (
      <div className="container">
        <div className="row d-flex justify-content-center">
          { posts }
        </div>
      </div>
    );
  }
}

export default PostsList;
