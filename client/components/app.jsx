import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Menu from './menu';
import BottomNavbar from './bottom-navbar';
import HomePage from './home-page';
import LoginPage from './login-page';
import EditProfile from './edit-profile';
import EditPosts from './edit-posts';
import SearchPage from './search-page';
import VideosPage from './videos-page';

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
    this.deletePost = this.deletePost.bind(this);
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

  async deletePost(id) {
    try {
      const { posts } = this.state;
      const deletedPosts = posts.filter(post => post.postId !== id);
      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
        body: JSON.stringify(deletedPosts),
        headers
      });
      this.setState({
        posts: deletedPosts
      });
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
            <React.Fragment>
              <Menu />
              <HomePage />
              <BottomNavbar />
            </React.Fragment>
          } />
          <Route path="/profile" render={props =>
            <React.Fragment>
              <Menu />
              <EditProfile
                profile={this.state.profile}
                updateProfile={this.updateProfile} />
              <BottomNavbar />
            </React.Fragment>
          } />
          <Route path="/concerts" render={props =>
            <React.Fragment>
              <Menu />
              <h1 className="text-center mt-4">Concerts</h1>
              <BottomNavbar />
            </React.Fragment>
          } />
          <Route path="/posts" render={props =>
            <React.Fragment>
              <Menu />
              <EditPosts
                posts={this.state.posts}
                editing={this.state.editing}
                deletePost={this.deletePost}
                updatePostFetch={this.updatePostFetch}
                updatePost={this.updatePost} />
              <BottomNavbar />
            </React.Fragment>
          } />
          <Route path="/create" render={props =>
            <React.Fragment>
              <Menu />
              <BottomNavbar />
            </React.Fragment>
          } />
          <Route path="/search" render={props =>
            <React.Fragment>
              <Menu />
              <SearchPage />
              <BottomNavbar />
            </React.Fragment>
          } />
          <Route path="/videos" render={props =>
            <React.Fragment>
              <Menu />
              <VideosPage />
              <BottomNavbar />
            </React.Fragment>
          } />
        </Switch>
      </Router>
    );
  }
}

export default App;
