import React from 'react';
import { Link, withRouter } from 'react-router-dom';

class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      isEmpty: false,
      wrongUsername: false,
      incorrectPassword: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { username, password } = this.state;
    const { history } = this.props;
    if (username === '' || password === '') {
      this.setState(prevState => {
        return {
          isEmpty: true
        };
      });
    } else {
      this.setState(prevState => {
        return {
          isEmpty: false
        };
      });
    }
    const request = { ...this.state };
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify(request),
      headers
    })
      .then(response => {
        if (response.status === 200) {
          return response.json();
        } else if (response.status === 401) {
          return response.json();
        }
      })
      .then(result => {
        if (result.message === 'You entered an incorrect password.') {
          this.setState(prevState => ({
            incorrectPassword: true
          }));
        } else if (result.message === 'No user found with that username.') {
          this.setState(prevState => ({
            wrongUsername: true
          }));
        } else {
          this.setState(prevState => ({
            incorrectPassword: false,
            wrongUsername: false
          }));
          history.push(`/home/${result}`);
        }
      })
      .catch(err => console.error(err.message));
  }

  render() {
    return (
      <React.Fragment>
        <header className="container-fluid mb-4">
          <div className="row">
            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <img src="./images/login.jpg" alt="Pentagram" className="img-fluid mb-3 login-heading" />
              <h1 className="text-center mt-4 mb-4">Welcome to Metalink</h1>
              <h4 className="text-center">Your link to all things metal!</h4>
            </div>
          </div>
        </header>
        <main className="container-fluid mb-4">
          <div className="row">
            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <form>
                <div className="form-row" style={{ height: '75px' }}>
                  <div className="form-group col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                    <label htmlFor="username">Username</label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      className="form-control"
                      onChange={this.handleChange}
                      value={this.state.username}/>
                    <div className="mb-4 pb-4">
                      {
                        this.state.wrongUsername
                          ? <p className="text-danger text-center mb-0 pb-0">No user found with that username.</p>
                          : ''
                      }
                    </div>
                  </div>
                </div>
                <div className="form-row" style={{ height: '75px' }}>
                  <div className="form-group col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                    <label htmlFor="password">Password</label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      className="form-control"
                      onChange={this.handleChange}
                      value={this.state.password}/>
                    <div className="mb-4 pb-4">
                      {
                        this.state.incorrectPassword
                          ? <p className="text-danger text-center mb-0 pb-0">You entered an incorrect password.</p>
                          : ''
                      }
                    </div>
                  </div>
                </div>
                <div className="form-row text-center">
                  <div className="form-group col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                    <button
                      type="submit"
                      name="submit"
                      onClick={this.handleSubmit}
                      className="btn btn-primary mt-4">
                      Sign In
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </main>
        <footer>
          <Link className="mt-5 pt-5 text-center" to="/signup"><h6>Sign up for an account here</h6></Link>
        </footer>
      </React.Fragment>
    );
  }
}

export default withRouter(LoginPage);
