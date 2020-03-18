import React from 'react';

export default class LoginPage extends React.Component {
  render() {
    return (
      <div className="text-center">
        <img className="img-fluid" src="./images/login.jpg" alt="login" />
        <h1>Welcome to Metalink</h1>
        <h3>Your link to all things metal</h3>
        <form className="dropdown" action="">
          <label htmlFor="login">Username</label>
          <select name="login" id="login">
            <option value="stuff">Stuff</option>
            <option value="stuff">Stuff</option>
            <option value="stuff">Stuff</option>
          </select>
        </form>
        <a href="">Sign up for an account here</a>
      </div>
    );
  }
}
