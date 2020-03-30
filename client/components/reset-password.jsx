import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import axios from 'axios';

class ResetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: '',
      confirm: '',
      error: false,
      updated: false,
      loading: true,
      length: 0,
      hasCapital: false,
      hasDigit: false,
      hasSpecial: false,
      strength: 'very weak',
      passwordMatch: false,
      validating: false,
      emptyFields: false
    };
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleConfirmChange = this.handleConfirmChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.updatePassword = this.updatePassword.bind(this);
  }

  async componentDidMount() {
    await axios
      .get('/api/reset', {
        params: {
          resetPasswordToken: this.props.match.params.token
        }
      })
      .then(response => {
        if (response.data.message === 'The password reset link is valid.') {
          this.setState({
            username: response.data.username,
            updated: false,
            loading: false,
            error: false
          });
        } else {
          this.setState({
            updated: false,
            loading: false,
            error: true
          });
        }
      })
      .catch(error => {
        console.error(error.message);
      });
  }

  handlePasswordChange() {
    const { name, value } = event.target;
    const capitalRegExp = new RegExp('.*[A-Z].*', 'g');
    const specialRegExp = new RegExp('.*[!@#$%^&*()].*', 'g');
    const digitRegExp = new RegExp('.*[\\d].*', 'g');
    this.setState(prevState => {
      return {
        [name]: value,
        length: this.state.password.length
      };
    }, () => {
      this.setState({
        hasCapital: capitalRegExp.test(this.state.password),
        hasSpecial: specialRegExp.test(this.state.password),
        hasDigit: digitRegExp.test(this.state.password)
      });
      if (this.state.length === 0 && !this.state.hasCapital && !this.state.hasDigit && !this.state.hasSpecial) {
        this.setState(prevState => {
          return {
            strength: 'very weak'
          };
        });
      } else if (this.state.length > 0 && this.state.length < 8 && !this.state.hasCapital && !this.state.hasDigit && !this.state.hasSpecial) {
        this.setState(prevState => {
          return {
            strength: 'weak'
          };
        });
      } else if (this.state.length > 8 && this.state.hasCapital && !this.state.hasDigit && !this.state.hasSpecial) {
        this.setState(prevState => {
          return {
            strength: 'medium'
          };
        });
      } else if (this.state.length > 8 && this.state.hasCapital && this.state.hasDigit && !this.state.hasSpecial) {
        this.setState(prevState => {
          return {
            strength: 'strong'
          };
        });
      } else if (this.state.length > 8 && this.state.hasCapital && this.state.hasDigit && this.state.hasSpecial) {
        this.setState(prevState => {
          return {
            strength: 'very strong'
          };
        });
      }
    });
  }

  handleConfirmChange(event) {
    const { name, value } = event.target;
    this.setState(prevState => {
      return {
        [name]: value
      };
    }, () => {
      const { password, confirm } = this.state;
      if (password !== confirm) {
        this.setState(prevState => {
          return {
            passwordMatch: false
          };
        });
      } else {
        this.setState(prevState => {
          return {
            passwordMatch: true
          };
        });
      }
      if (password === '' || confirm === '') {
        this.setState(prevState => {
          return {
            emptyFields: true
          };
        });
      } else {
        this.setState(prevState => {
          return {
            emptyFields: false
          };
        });
      }
    });
  }

  handleBlur() {
    this.setState({
      validating: true
    });
  }

  handleReset() {
    this.setState({
      password: '',
      confirm: ''
    });
  }

  alertPasswordMatch() {
    return (this.state.validating && this.state.passwordMatch === false)
      ? 'Your passwords do not match.'
      : null;
  }

  alertPasswordLength() {
    return (this.state.validating && this.state.length >= 0 && this.state.length < 8)
      ? 'Your password must be at least 9 characters long.'
      : null;
  }

  alertNoCapital() {
    return (this.state.validating && this.state.hasCapital === false)
      ? 'Your password must contain at least 1 capital letter.'
      : null;
  }

  alertNoSpecial() {
    return (this.state.validating && this.state.hasSpecial === false)
      ? 'Your password must contain at least 1 special character.'
      : null;
  }

  alertNoDigit() {
    return (this.state.validating && this.state.hasDigit === false)
      ? 'Your password must contain at least 1 digit.'
      : null;
  }

  alertEmptyFields() {
    return (this.state.emptyFields === true)
      ? 'Please fill out all fields that have an asterisk.'
      : null;
  }

  renderIconPassword() {
    return (this.state.length >= 8 && this.state.hasCapital && this.state.hasDigit && this.state.hasSpecial)
      ? 'fas fa-check fa-lg valid'
      : 'fas fa-times fa-lg invalid';
  }

  renderIconConfirm() {
    return (this.state.length > 8 && this.state.passwordMatch === true)
      ? 'fas fa-check fa-lg valid'
      : 'fas fa-times fa-lg invalid';
  }

  updatePassword(event) {
    event.preventDefault();
    axios
      .put('/api/update', {
        username: this.state.username,
        password: this.state.password
      })
      .then(response => {
        if (response.data.message === 'Password successfully updated.') {
          this.setState({
            updated: true,
            error: false
          });
        } else {
          this.setState({
            updated: false,
            error: true
          });
        }
      })
      .catch(error => {
        console.error(error.message);
      });
  }

  render() {
    let strengthClass;
    switch (this.state.strength) {
      case 'very weak':
        strengthClass = 'very-weak';
        break;
      case 'weak':
        strengthClass = 'weak';
        break;
      case 'medium':
        strengthClass = 'medium';
        break;
      case 'strong':
        strengthClass = 'strong';
        break;
      case 'very strong':
        strengthClass = 'very-strong';
        break;
    }
    return (
      <React.Fragment>
        <header className="container-fluid mb-4">
          <div className="row">
            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <img src="/images/metalink.webp" alt="Metalink Logo" className="img-fluid mb-3" />
              <h1 className="text-center mt-4">Reset Password</h1>
            </div>
          </div>
        </header>
        <main className="container-fluid mb-4" style={{ height: '275px', overflow: 'auto' }}>
          <div className="row">
            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12" style={{ height: '250px' }}>
              <form>
                <div className="form-row">
                  <div className="form-group col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 form-pw">
                    <div className="d-flex justify-content-between">
                      <label htmlFor="password">New Password<em className="asterisk">&#42;</em><span className="ml-4"><i className={this.renderIconPassword()}></i></span></label>
                      <span className={strengthClass}>{this.state.strength}</span>
                    </div>
                    <input
                      autoFocus
                      type="password"
                      id="password"
                      name="password"
                      onChange={this.handlePasswordChange}
                      onBlur={this.handleBlur}
                      value={this.state.password}
                      className="form-control"
                      autoComplete="off"
                      placeholder="Please enter a new password" />
                  </div>
                  <div className="form-group col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 form-pw" style={{ height: '200px' }}>
                    <label htmlFor="confirm">Confirm New Password<em className="asterisk">&#42;</em><span className="ml-4"><i className={this.renderIconConfirm()}></i></span></label>
                    <input
                      type="password"
                      id="confirm"
                      name="confirm"
                      onChange={this.handleConfirmChange}
                      onBlur={this.handleBlur}
                      value={this.state.confirm}
                      placeholder="Please confirm new password"
                      className="form-control" />
                    <p><small className="text-danger">{this.alertPasswordLength()}</small></p>
                    <p><small className="text-danger">{this.alertNoCapital()}</small></p>
                    <p><small className="text-danger">{this.alertNoSpecial()}</small></p>
                    <p><small className="text-danger">{this.alertNoDigit()}</small></p>
                    <p><small className="text-danger">{this.alertPasswordMatch()}</small></p>
                    <p><small className="text-danger">{this.alertEmptyFields()}</small></p>
                  </div>
                </div>
                <h6 className="asterisk ml-4 text-center">&#42; &#61; required</h6>
              </form>
            </div>
          </div>
          {this.state.updated && (<h6 className="text-center text-danger">Your password has been successfully reset, please try logging in again.</h6>)}
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
              onClick={this.updatePassword}>
              <i className="far fa-check-square"></i> Submit
            </button>
            <button className="btn btn-warning btn-sm ml-2"
              name="reset"
              type="reset"
              onClick={this.handleReset}>
              <i className="fas fa-eraser"></i> Reset
            </button>
          </div>
        </footer>
      </React.Fragment>
    );
  }
}

export default withRouter(ResetPassword);
