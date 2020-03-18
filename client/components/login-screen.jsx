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
        <img className="img-fluid login-headimg mb-3" src="./images/login.jpg" alt="login" />
        <h1 className="mb-3">Welcome to Metalink</h1>
        <h3 className="mb-5">Your link to all things metal</h3>
        <form className="dropdown mb-5 pb-5" action="">
          <label htmlFor="login">Username</label>
          <select className="" name="login" id="login">
            {
              this.state.users.map(user => {
                return (
                  <option key={user.userId}
                    value={user.screenName.replace(/\s/g, '').toLowerCase()}>
                    {user.screenName}</option>
                );
              })
            }
          </select>
        </form>
        <a className="mt-5 pt-5" href="">Sign up for an account here</a>
      </div>
    );
  }
}
