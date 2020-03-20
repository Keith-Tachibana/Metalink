import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import HomePage from './home-page';
import LoginPage from './login-page';
import EditProfile from './edit-profile';
import EditPosts from './edit-posts';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profile: [],
      posts: [],
      editing: null
    };
    this.updateProfile = this.updateProfile.bind(this);
    this.updatePost = this.updatePost.bind(this);
    this.updatePostFetch = this.updatePostFetch.bind(this);
  }

  componentDidMount() {
    this.getProfile();
    this.getPosts();
  }

  async getProfile() {
    try {
      const response = await fetch('/api/profile');
      const profile = await response.json();
      this.setState({
        profile
      });
    } catch (error) {
      console.error(error.message);
    }
  }

  async getPosts() {
    try {
      const response = await fetch('/api/posts');
      const posts = await response.json();
      this.setState({
        posts
      });
    } catch (error) {
      console.error(error.message);
    }
  }

  async updateProfile(entry) {
    try {
      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      const response = await fetch(`/api/profile/${entry.userId}`, {
        method: 'PATCH',
        body: JSON.stringify(entry),
        headers
      });
      const profile = await response.json();
      this.setState({
        profile
      }, () => this.getProfile());
    } catch (error) {
      console.error(error.message);
    }
  }

  async updatePostFetch(entry) {
    try {
      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      const response = await fetch(`/api/posts/${entry.postId}`, {
        method: 'PUT',
        body: JSON.stringify(entry),
        headers
      });
      const result = await response.json();
      this.setState(previous => {
        const newPosts = previous.posts.map(post => post.postId === result.postId ? result : post);
        return {
          posts: newPosts
        };
      }, () => this.getPosts());
    } catch (error) {
      console.error(error.message);
    }
  }

  updatePost(id) {
    const { posts } = this.state;
    const [updatedPost] = posts.filter(post => post.postId === id);
    this.setState({
      editing: updatedPost
    });
  }

  render() {
    return (
      <Router>
        <Switch>
          <Route path="/login" component={LoginPage} />
          <Route path="/home" render={props =>
            <div className="container">
              <HomePage />
            </div>
          } />
          <Route path="/profile" render={props =>
            <EditProfile
              profile={this.state.profile}
              updateProfile={this.updateProfile} />
          } />
          <Route path="/posts" render={props =>
            <EditPosts
              posts={this.state.posts}
              editing={this.state.editing}
              updatePostFetch={this.updatePostFetch}
              updatePost={this.updatePost} />
          } />
        </Switch>
      </Router>
    );
  }
}

export default App;
