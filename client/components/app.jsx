import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';

import Menu from './menu';
import BottomNavbar from './bottom-navbar';
import SignUp from './sign-up';
import HomePage from './home-page';
import LoginPage from './login-page';
import EditProfile from './edit-profile';
import EditPosts from './edit-posts';
import SearchPage from './search-page';
import VideosPage from './videos-page';
import SearchConcerts from './search-concerts';
import CreatePost from './create-post';
import ChatHome from './chat-home';
import ChatPage from './chat-page';
import AboutPage from './about-page';
import EmailPassword from './email-password';
import ResetPassword from './reset-password';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profile: [],
      posts: [],
      editing: null,
      authorizing: true,
      loading: true
    };
    this.getProfile = this.getProfile.bind(this);
    this.updateProfile = this.updateProfile.bind(this);
    this.updatePost = this.updatePost.bind(this);
    this.updatePostFetch = this.updatePostFetch.bind(this);
    this.deletePost = this.deletePost.bind(this);
    this.createPost = this.createPost.bind(this);
    this.handleExit = this.handleExit.bind(this);
  }

  componentDidMount() {
    fetch('/api/auth')
      .then(res => res.json())
      .then(profile => {
        if (profile.user === null) return this.setState({ authorizing: false });
        this.setState({ profile: profile.user, authorizing: false, loading: false });
      })
      .catch(err => console.error(err));
    this.getPosts();
  }

  async getProfile(userId) {
    try {
      const response = await fetch(`/api/profile/${userId}`);
      const profile = await response.json();
      this.setState({ profile, loading: false });
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

  async createPost(entry) {
    try {
      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      const response = await fetch('/api/posts', {
        method: 'POST',
        body: JSON.stringify(entry),
        headers
      });
      const post = await response.json();
      this.setState({
        posts: post
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
        method: 'PUT',
        body: JSON.stringify(entry),
        headers
      });
      const profile = await response.json();
      this.setState({
        profile
      }, () => this.getProfile(entry.userId));
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

  handleExit() {
    const userId = this.state.profile.userId;
    const req = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    };
    if (userId) {
      fetch('/api/logout', req)
        .then(res => res.json())
        .then(status => status)
        .catch(err => console.error(err));
    }
  }

  render() {
    if (this.state.authorizing) return null;
    return (
      <Router>
        <Switch>
          <Route path="/signup" exact render={props =>
            <React.Fragment>
              <SignUp />
            </React.Fragment>
          } />
          <Route path='/home/:id' exact render={props =>
            <React.Fragment>
              <Menu handleExit={this.handleExit} />
              {this.state.loading
                ? <h1 className="text-center mt-4" style={{ height: '535px' }}>Profile Loading...</h1>
                : <HomePage profile={this.state.profile} />}
              <BottomNavbar handleExit={this.handleExit} />
            </React.Fragment>
          } />
          <Route path="/profile/:id" exact render={props =>
            <React.Fragment>
              <Menu handleExit={this.handleExit} />
              <EditProfile
                profile={this.state.profile}
                updateProfile={this.updateProfile} />
              <BottomNavbar handleExit={this.handleExit} />
            </React.Fragment>
          } />
          <Route path="/concerts/:id" exact render={props =>
            <React.Fragment>
              <Menu handleExit={this.handleExit} />
              <SearchConcerts />
              <BottomNavbar handleExit={this.handleExit} />
            </React.Fragment>
          } />
          <Route path="/posts/:id" exact render={props =>
            <React.Fragment>
              <Menu handleExit={this.handleExit} />
              <EditPosts
                posts={this.state.posts}
                editing={this.state.editing}
                deletePost={this.deletePost}
                updatePostFetch={this.updatePostFetch}
                updatePost={this.updatePost}
                profile={this.state.profile} />
              <BottomNavbar handleExit={this.handleExit} />
            </React.Fragment>
          } />
          <Route path="/create/:id" exact render={props =>
            <React.Fragment>
              <Menu handleExit={this.handleExit} />
              <CreatePost
                posts={this.state.posts}
                createPost={this.createPost} />
              <BottomNavbar handleExit={this.handleExit} />
            </React.Fragment>
          } />
          <Route path="/search/:id" exact render={props =>
            <React.Fragment>
              <Menu handleExit={this.handleExit} />
              <SearchPage />
              <BottomNavbar handleExit={this.handleExit} />
            </React.Fragment>
          } />
          <Route path="/videos/:id" exact render={props =>
            <React.Fragment>
              <Menu handleExit={this.handleExit} />
              <VideosPage />
              <BottomNavbar handleExit={this.handleExit} />
            </React.Fragment>
          } />
          <Route path="/chatHome/:id" exact render={() =>
            <React.Fragment>
              <Menu handleExit={this.handleExit} />
              <ChatHome profile={this.state.profile} />
              <BottomNavbar handleExit={this.handleExit} />
            </React.Fragment>
          } />
          <Route path="/rooms/:roomId/users" exact render={props =>
            <React.Fragment>
              <Menu handleExit={this.handleExit} />
              <ChatPage profile={this.state.profile} />
              <BottomNavbar handleExit={this.handleExit} />
            </React.Fragment>
          } />
          <Route path="/about/:id" exact render={props =>
            <React.Fragment>
              <Menu handleExit={this.handleExit} />
              <AboutPage />
              <BottomNavbar handleExit={this.handleExit} />
            </React.Fragment>
          } />
          <Route path="/email" exact render={props =>
            <EmailPassword />
          } />
          <Route path="/reset/:token" exact render={props =>
            <ResetPassword />
          } />
          <Route path="/" exact render={props =>
            <LoginPage {...props} getProfile={this.getProfile} />
          } />
          <Route path="*" render={props =>
            <React.Fragment>
              <header className="container-fluid justify-content-center mb-4">
                <div className="row">
                  <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                    <picture>
                      <source srcSet="/images/metalink.webp" type="image/webp" />
                      <source srcSet="/images/metalink.png" type="image/png" />
                      <img src="/images/metalink.png" alt="Metalink Logo" className="img-fluid mb-3" />
                    </picture>
                    <h1 className="text-center mt-4"><em>404:</em> Page Not Found</h1>
                  </div>
                </div>
              </header>
              <footer>
                <div className="container-fluid justify-content-center d-flex">
                  <Link to="/">
                    <button className="btn btn-danger btn-sm">
                      <i className="fas fa-arrow-circle-left"></i> Login
                    </button>
                  </Link>
                </div>
              </footer>
            </React.Fragment>
          } />
        </Switch>
      </Router>
    );
  }
}

export default App;
