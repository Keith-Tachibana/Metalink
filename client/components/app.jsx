import React, { Component } from 'react';
import {
  BrowserRouter as Router, Route,
  Switch, withRouter
} from 'react-router-dom';
import HomePage from './home-page';
import LoginPage from './login-page';
import EditProfile from './edit-profile';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profile: [],
      user: null
    };
    this.updateProfile = this.updateProfile.bind(this);
    this.getProfile = this.getProfile.bind(this);
  }

  componentDidMount() {
    this.getProfile(2);
  }

  async getProfile(userId) {
    try {
      const response = await fetch(`/api/profile/${userId}`);
      const profile = await response.json();
      this.setState({ profile });
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

  render() {
    const Menu = withRouter(LoginPage);
    return (
      <Router>
        <Switch>
          <Route path="/login" render={props =>
            <LoginPage {...props} getProfile={this.getProfile} />
          } />
          <Route path={`/home/${this.state.profile.userId}`} render={() =>
            <div className="container">
              <HomePage profile={this.state.profile} />
            </div>
          } />
          <Menu />
          <Route path="/profile" render={props =>
            <EditProfile profile={this.state.profile} updateProfile={this.updateProfile} />
          } />
        </Switch>
      </Router>
    );
  }
}

export default App;
