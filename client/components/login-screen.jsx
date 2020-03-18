import React from 'react';

export default class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: []
    };
  }

  componentDidMount() {
    fetch('/api/users')
      .then(res => res.json())
      .then(users => this.setState({ users }))
      .catch(err => console.error(err));
  }

  render() {
    return (
      <div className="text-center">
        <img className="img-fluid" src="./images/login.jpg" alt="login" />
        <h1>Welcome to Metalink</h1>
        <h3>Your link to all things metal</h3>
        <form className="dropdown" action="">
          <label htmlFor="login">Username</label>
          <select name="login" id="login">
            {
              this.state.users.map(user => {
                return (
                  <option key={user.userId} value={user.screenName}>{user.screenName}</option>
                );
              })
            }
          </select>
        </form>
        <a href="">Sign up for an account here</a>
      </div>
    );
  }
}
