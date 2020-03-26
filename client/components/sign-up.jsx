import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fullname: '',
      password: '',
      confirm: '',
      username: '',
      email: '',
      zipcode: '',
      phone: '',
      genre1: '',
      genre2: '',
      genre3: '',
      emptyFields: false,
      duplicate: false,
      noPasswordMatch: false,
      emailError: false,
      zipcodeError: false,
      phoneError: false,
      hasCapital: false,
      hasSpecial: false,
      hasDigit: false,
      nameIsLetters: false,
      strength: 'very weak',
      length: 0,
      usernameError: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleConfirmChange = this.handleConfirmChange.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.createAccount = this.createAccount.bind(this);
  }

  handleReset() {
    this.setState({
      fullname: '',
      password: '',
      confirm: '',
      username: '',
      email: '',
      zipcode: '',
      phone: '',
      genre1: '',
      genre2: '',
      genre3: ''
    });
  }

  handlePasswordChange(event) {
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
      if (this.state.password !== this.state.confirm) {
        this.setState(prevState => {
          return {
            noPasswordMatch: false
          };
        });
      } else {
        this.setState(prevState => {
          return {
            noPasswordMatch: true
          };
        });
      }
    });
  }

  handleChange(event) {
    const { name, value } = event.target;
    const emailRegExp = new RegExp('^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,4}$', 'i');
    const zipcodeRegExp = new RegExp('^\\d{5}$');
    const phoneRegExp = new RegExp('^[2-9]\\d{2}-\\d{3}-\\d{4}$');
    const lettersRegExp = new RegExp('^[A-Za-z]+\\s[A-Za-z]+$', 'g');
    const usernameRegExp = new RegExp('^[a-zA-Z0-9]{4,}$');
    this.setState(prevState => {
      return {
        [name]: value
      };
    }, () => {
      switch (name) {
        case 'fullname':
          this.setState({
            nameIsLetters: lettersRegExp.test(this.state.fullname)
          });
          break;
        case 'username':
          this.setState({
            usernameError: usernameRegExp.test(this.state.username)
          });
          break;
        case 'email':
          this.setState({
            emailError: emailRegExp.test(this.state.email)
          });
          break;
        case 'zipcode':
          this.setState({
            zipcodeError: zipcodeRegExp.test(this.state.zipcode)
          });
          break;
        case 'phone':
          this.setState({
            phoneError: phoneRegExp.test(this.state.phone)
          });
          break;
      }
    });
    const { fullname, duplicate, password, confirm, username, email, zipcode } = this.state;
    if (duplicate) {
      this.setState(prevState => {
        return {
          duplicate: false
        };
      });
    }
    if (fullname === '' || password === '' || confirm === '' || username === '' || email === '' || zipcode === '') {
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
  }

  alertEmptyFields() {
    return this.state.emptyFields === true
      ? 'Please fill out all fields that have an asterisk.'
      : null;
  }

  alertDuplicate() {
    return this.state.duplicate === true
      ? 'That name, username, or e-mail address has already been taken.'
      : null;
  }

  alertName() {
    return this.state.nameIsLetters === false
      ? 'Your full name must be upper/lowercase letters with a space.'
      : null;
  }

  alertUsername() {
    return this.state.usernameError === false
      ? 'Your username must be alphanumeric only and at least 4 characters.'
      : null;
  }

  alertPasswordMatch() {
    return this.state.noPasswordMatch === false
      ? 'Your passwords do not match.'
      : null;
  }

  alertPasswordLength() {
    return (this.state.length >= 0 && this.state.length < 8)
      ? 'Your password must be at least 9 characters long.'
      : null;
  }

  alertNoCapital() {
    return this.state.hasCapital === false
      ? 'Your password must contain at least 1 capital letter.'
      : null;
  }

  alertNoSpecial() {
    return this.state.hasSpecial === false
      ? 'Your password must contain at least 1 special character.'
      : null;
  }

  alertNoDigit() {
    return this.state.hasDigit === false
      ? 'Your password must contain at least 1 digit.'
      : null;
  }

  alertEmail() {
    return this.state.emailError === false
      ? 'Please enter a valid e-mail address.'
      : null;
  }

  alertZipcode() {
    return this.state.zipcodeError === false
      ? 'Please enter a valid zipcode in this format: XXXXX.'
      : null;
  }

  alertPhone() {
    return this.state.phoneError === false
      ? 'Please enter a valid phone number in this format: XXX-XXX-XXXX.'
      : null;
  }

  renderIconName() {
    return this.state.nameIsLetters === true
      ? 'fas fa-check fa-lg valid'
      : 'fas fa-times fa-lg invalid';
  }

  renderIconUsername() {
    return this.state.usernameError === true
      ? 'fas fa-check fa-lg valid'
      : 'fas fa-times fa-lg invalid';
  }

  renderIconEmail() {
    return this.state.emailError === true
      ? 'fas fa-check fa-lg valid'
      : 'fas fa-times fa-lg invalid';
  }

  renderIconPhone() {
    return this.state.phoneError === true
      ? 'fas fa-check fa-lg valid'
      : 'fas fa-times fa-lg invalid';
  }

  renderIconZipcode() {
    return this.state.zipcodeError === true
      ? 'fas fa-check fa-lg valid'
      : 'fas fa-times fa-lg invalid';
  }

  renderIconPassword() {
    return (this.state.length >= 8 && this.state.hasCapital && this.state.hasDigit && this.state.hasSpecial)
      ? 'fas fa-check fa-lg valid'
      : 'fas fa-times fa-lg invalid';
  }

  renderIconConfirm() {
    return this.state.noPasswordMatch === true
      ? 'fas fa-check fa-lg valid'
      : 'fas fa-times fa-lg invalid';
  }

  createAccount(event) {
    event.preventDefault();
    const { history } = this.props;
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const request = { ...this.state };
    fetch('/api/signup', {
      method: 'POST',
      body: JSON.stringify(request),
      headers
    })
      .then(response => {
        return response.json();
      })
      .then(json => {
        if (json === 'That name, username, or e-mail address already exists.' || json.error === 'an unexpected error occurred') {
          this.setState(prevState => ({
            duplicate: true
          }));
        } else {
          history.push('/');
        }
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
    const metalGenreArr = ['Black Metal', 'Blackened Death Metal', 'Deathcore',
      'Death Metal', 'Doom Metal', 'Folk Metal', 'Glam Metal', 'Grindcore', 'Groove Metal',
      'Heavy Metal', 'Melodic Death Metal', 'Metalcore',
      'Neoclassical Metal', 'Pagan Metal', 'Pirate Metal',
      'Power Metal', 'Progressive Metal', 'Sludge Metal',
      'Speed Metal', 'Symphonic Metal', 'Symphonic Black Metal',
      'Technical Death Metal', 'Thrash Metal', 'Viking Metal'];
    return (
      <React.Fragment>
        <header className="container-fluid mb-4">
          <div className="row">
            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <img src="./images/metalink.jpg" alt="Metalink Logo" className="img-fluid mb-3" />
              <h1 className="text-center mt-4">Account Sign Up</h1>
            </div>
          </div>
        </header>
        <main className="container-fluid mb-4" style={{ height: '275px', overflow: 'auto' }}>
          <div className="row">
            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <form>
                <div className="form-row">
                  <div className="form-group col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                    <label htmlFor="fullname">Name<em className="asterisk">&#42;</em><span className="ml-4"><i className={this.renderIconName()}></i></span></label>
                    <input
                      type="text"
                      id="fullname"
                      name="fullname"
                      onChange={this.handleChange}
                      value={this.state.fullname}
                      className="form-control"
                      autoComplete="off"
                      placeholder="Full name" />
                    <small className="text-danger">{this.alertName()}</small>
                  </div>
                  <div className="form-group col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                    <label htmlFor="username">Username<em className="asterisk">&#42;</em><span className="ml-4"><i className={this.renderIconUsername()}></i></span></label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      onChange={this.handleChange}
                      value={this.state.username}
                      autoComplete="off"
                      className="form-control" />
                    <small className="text-danger">{this.alertUsername()}</small>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 form-pw">
                    <div className="d-flex justify-content-between">
                      <label htmlFor="password">Password<em className="asterisk">&#42;</em><span className="ml-4"><i className={this.renderIconPassword()}></i></span></label>
                      <span className={strengthClass}>{this.state.strength}</span>
                    </div>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      onChange={this.handlePasswordChange}
                      value={this.state.password}
                      className="form-control" />
                    <p><small className="text-danger">{this.alertPasswordLength()}</small></p>
                    <p><small className="text-danger">{this.alertNoCapital()}</small></p>
                    <p><small className="text-danger">{this.alertNoSpecial()}</small></p>
                    <p><small className="text-danger">{this.alertNoDigit()}</small></p>
                  </div>
                  <div className="form-group col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                    <label htmlFor="confirm">Confirm Password<em className="asterisk">&#42;</em><span className="ml-4"><i className={this.renderIconConfirm()}></i></span></label>
                    <input
                      type="password"
                      id="confirm"
                      name="confirm"
                      onChange={this.handleConfirmChange}
                      value={this.state.confirm}
                      className="form-control" />
                    <small className="text-danger">{this.alertPasswordMatch()}</small>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                    <label htmlFor="email">E-mail Address<em className="asterisk">&#42;</em><span className="ml-4"><i className={this.renderIconEmail()}></i></span></label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      onChange={this.handleChange}
                      value={this.state.email}
                      className="form-control"
                      autoComplete="off"
                      placeholder="example@example.com" />
                    <small className="text-danger">{this.alertEmail()}</small>
                  </div>
                  <div className="form-group col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                    <label htmlFor="zipcode">Zipcode<em className="asterisk">&#42;</em><span className="ml-4"><i className={this.renderIconZipcode()}></i></span></label>
                    <input
                      type="text"
                      inputMode="numeric"
                      name="zipcode"
                      onChange={this.handleChange}
                      value={this.state.zipcode}
                      className="form-control"
                      placeholder="XXXXX"
                      autoComplete="off"
                      pattern="^\d{5}$" />
                    <small className="text-danger">{this.alertZipcode()}</small>
                  </div>
                  <div className="form-group col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                    <label htmlFor="phone">Phone Number<span className="ml-4"><i className={this.renderIconPhone()}></i></span></label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      onChange={this.handleChange}
                      value={this.state.phone}
                      className="form-control"
                      autoComplete="off"
                      placeholder="XXX-XXX-XXXX" />
                    <small className="text-danger">{this.alertPhone()}</small>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                    <label htmlFor="genre1" className="mr-3">1<sup>st</sup> Favorite Genre</label>
                    <select name="genre1" id="genre1" onChange={this.handleChange} value={this.state.genre1} className="signup-genre">
                      <option defaultValue=""></option>
                      {metalGenreArr.map((genreOption, idx) => <option key={idx} value={genreOption}>{genreOption}</option>)}
                    </select>
                  </div>
                  <div className="form-group col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                    <label htmlFor="genre2" className="mr-2">2<sup>nd</sup> Favorite Genre</label>
                    <select name="genre2" id="genre2" onChange={this.handleChange} value={this.state.genre2} className="signup-genre">
                      <option defaultValue=""></option>
                      {metalGenreArr.map((genreOption, idx) => <option key={idx} value={genreOption}>{genreOption}</option>)}
                    </select>
                  </div>
                  <div className="form-group col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 form-genre">
                    <label htmlFor="genre3" className="mr-2">3<sup>rd</sup> Favorite Genre</label>
                    <select name="genre3" id="genre3" onChange={this.handleChange} value={this.state.genre3} className="signup-genre">
                      <option defaultValue=""></option>
                      {metalGenreArr.map((genreOption, idx) => <option key={idx} value={genreOption}>{genreOption}</option>)}
                    </select>
                    <p><small className="text-danger">{this.alertEmptyFields()}</small></p>
                    <p><small className="text-danger">{this.alertDuplicate()}</small></p>
                  </div>
                </div>
                <h6 className="asterisk ml-4 text-center">&#42; &#61; required</h6>
              </form>
            </div>
          </div>
        </main>
        <div className="container-fluid justify-content-center d-flex">
          <Link to="/">
            <button className="btn btn-danger btn-sm">
              <i className="fas fa-arrow-circle-left"></i> Back
            </button>
          </Link>
          <button
            className="btn btn-primary btn-sm ml-2"
            disabled={this.state.emptyFields ? 'disabled' : false}
            name="submit"
            type="submit"
            onClick={this.createAccount}>
            Create Account
          </button>
          <button className="btn btn-warning btn-sm ml-2"
            name="reset"
            type="reset"
            onClick={this.handleReset}
          >
            Reset
          </button>
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(SignUp);
