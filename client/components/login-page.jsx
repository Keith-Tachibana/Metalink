import React from 'react';

export default class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      currentUser: ''
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    fetch('/api/users')
      .then(res => res.json())
      .then(users => this.setState({ users }))
      .catch(err => console.error(err));
  }

  handleChange(event) {
    const { value } = event.target;
    const req = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(value)
    };
    fetch('/api/login', req)
      .then(res => res.json())
      .then(currentUser => this.setState({ currentUser }))
      .catch(err => console.error(err))
      .finally(() => this.props.history.push(`/home/${value}`));
    this.props.getProfile(value);
  }

  render() {
    return (
      <div className="text-center">
        <img className="img-fluid login-heading mb-3" src="./images/login.jpg" alt="login" />
        <h2 className="mb-3">Welcome to Metalink</h2>
        <h3 className="mb-5">Your link to all things metal!</h3>
        <form className="form-group-sm mb-5 pb-5 px-5">
          <label className="float-left" htmlFor="login">Username</label>
          <select onChange={this.handleChange}
            className="form-control" name="login" id="login">
            <option defaultValue=""></option>
            {
              this.state.users.map(user => {
                return (
                  <option key={user.userId}
                    value={user.userId}>
                    {user.username}</option>
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
