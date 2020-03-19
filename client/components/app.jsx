import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import HomePage from './home-page';
import LoginPage from './login-page';
import EditProfile from './edit-profile';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profile: []
    };
    this.updateProfile = this.updateProfile.bind(this);
  }

  componentDidMount() {
    this.getProfile();
  }

  async getProfile() {
    try {
      const response = await fetch('/api/users');
      const profile = await response.json();
      this.setState({
        profile
      });
    } catch (error) {
      console.error(error.message);
    }
  }

  async updateProfile(entry) {
    try {
      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      const response = await fetch(`/api/users/${entry.userId}`, {
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
    return (
      <Router>
        <Switch>
          <Route path="/login" component={LoginPage} />
          <Route path="/home" render={props =>
            <div className="container">
              <HomePage />
            </div>
          }/>
          <Route path="/profile" render={props =>
            <EditProfile profile={this.state.profile} updateProfile={this.updateProfile} />
          }/>
        </Switch>
      </Router>
    );
  }
}

export default App;
