import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import axios from 'axios';

class EmailPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      error: false,
      message: '',
      emailError: false,
      length: 0,
      validating: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.sendEmail = this.sendEmail.bind(this);
  }

  handleChange(event) {
    const { name, value } = event.target;
    const emailRegExp = new RegExp('^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,4}$', 'i');
    this.setState(prevState => {
      return {
        [name]: value,
        length: this.state.email.length
      };
    }, () => {
      this.setState({
        emailError: emailRegExp.test(this.state.email)
      });
    });
  }

  handleBlur() {
    this.setState({
      validating: true
    });
  }

  alertEmail() {
    return (this.state.validating && this.state.emailError === false)
      ? 'Please enter a valid e-mail address.'
      : null;
  }

  alertLength() {
    return (this.state.validating && this.state.length === 0)
      ? 'Please fill out your e-mail address.'
      : null;
  }

  renderIconEmail() {
    return this.state.emailError === true
      ? 'fas fa-check fa-lg valid'
      : 'fas fa-times fa-lg invalid';
  }

  sendEmail(event) {
    event.preventDefault();
    const { length } = this.state;
    if (length === 0) {
      this.setState(prevState => {
        return {
          error: false,
          message: ''
        };
      });
    } else {
      axios
        .post('/api/email', {
          email: this.state.email
        })
        .then(response => {
          if (response.status === 403) {
            this.setState({
              error: true,
              message: ''
            });
          } else if (response.data.message === 'Password reset e-mail sent!') {
            this.setState({
              error: false,
              message: 'Password reset e-mail sent!'
            });
          }
        })
        .catch(error => {
          console.error(error.message);
        });
    }
  }

  render() {
    const { message, error } = this.state;
    return (
      <React.Fragment>
        <header className="container-fluid mb-4">
          <div className="row">
            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <img src="/images/metalink.jpg" alt="Metalink Logo" className="img-fluid mb-3" />
              <h1 className="text-center mt-4">E-mail Password Reset</h1>
            </div>
          </div>
        </header>
        <main className="container-fluid mb-4" style={{ height: '275px', overflow: 'auto' }}>
          <div className="row">
            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <form>
                <div className="form-row">
                  <div className="form-group col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 form-pw" style={{ height: '150px' }}>
                    <label htmlFor="email">E-mail Address<em className="asterisk">&#42;</em><span className="ml-4"><i className={this.renderIconEmail()}></i></span></label>
                    <input
                      autoFocus
                      type="email"
                      id="email"
                      name="email"
                      value={this.state.email}
                      onChange={this.handleChange}
                      onBlur={this.handleBlur}
                      placeholder="example@example.com"
                      className="form-control"
                      autoComplete="off" />
                    <p><small className="text-danger">{this.alertEmail()}</small></p>
                    <p><small className="text-danger">{this.alertLength()}</small></p>
                  </div>
                </div>
                <h6 className="asterisk ml-4 text-center">&#42; &#61; required</h6>
              </form>
            </div>
          </div>
          {error && (
            <React.Fragment>
              <div className="d-flex justify-content-center">
                <h6 className="text-danger">That e-mail address was not recognized. Please try again or register for a new account.</h6>
              </div>
            </React.Fragment>
          )}
          {message === 'Password reset e-mail sent!' && (
            <React.Fragment>
              <div className="d-flex justify-content-center">
                <h6 className="text-danger">The password reset e-mail was successfully sent!</h6>
              </div>
            </React.Fragment>
          )}
        </main>
        <footer>
          <div className="container-fluid justify-content-center d-flex">
            <Link to="/">
              <button className="btn btn-danger btn-sm">
                <i className="fas fa-arrow-circle-left"></i> Login
              </button>
            </Link>
            <button
              className="btn btn-primary btn-sm ml-2"
              disabled={(this.state.length === 0) ? 'disabled' : false}
              name="submit"
              type="submit"
              onClick={this.sendEmail}>
              <i className="far fa-envelope"></i> Send
            </button>
            <Link to="/signup">
              <button className="btn btn-warning btn-sm ml-2">
                <i className="fas fa-user-plus"></i> Register
              </button>
            </Link>
          </div>
        </footer>
      </React.Fragment>
    );
  }
}

export default withRouter(EmailPassword);
