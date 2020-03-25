import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';

class EditProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      username: '',
      email: '',
      zipcode: '',
      phone: '',
      profileImage: this.props.profile.profileImage,
      genre1: '',
      genre2: '',
      genre3: '',
      editing: false

    };
    this.handleFile = this.handleFile.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleFile(event) {
    event.preventDefault();
    this.setState({
      profileImage: event.target.files[0]
    });
    const formData = new FormData(event.target.form);
    const headers = new Headers();
    headers.append('Content-Type', 'multipart/form-data');
    const config = { headers };
    axios.post('/api/profileImage', formData, config)
      .then(response => {
        this.setState({
          profileImage: response.data
        });
      })
      .catch(error => {
        console.error(error.message);
      });
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { updateProfile, match } = this.props;
    const entry = {
      name: this.state.name,
      username: this.state.username,
      email: this.state.email,
      zipcode: parseInt(this.state.zipcode),
      phone: this.state.phone,
      profileImage: this.state.profileImage,
      genre1: this.state.genre1,
      genre2: this.state.genre2,
      genre3: this.state.genre3,
      userId: parseInt(match.params.id)
    };
    updateProfile(entry);
    this.setState({
      editing: false
    });
    this.clearFields();
  }

  handleReset(event) {
    event.preventDefault();
    this.setState({
      editing: false
    });
    this.clearFields();
  }

  handleClick(event) {
    event.preventDefault();
    const { profile } = this.props;
    this.setState({
      name: profile.name,
      username: profile.username,
      email: profile.email,
      zipcode: profile.zipcode,
      phone: profile.phone,
      profileImage: profile.profileImage,
      genre1: profile.genre1,
      genre2: profile.genre2,
      genre3: profile.genre3,
      editing: !this.state.editing
    });
  }

  clearFields() {
    const clearFields = {
      name: '',
      username: '',
      email: '',
      zipcode: '',
      phone: '',
      genre1: '',
      genre2: '',
      genre3: ''
    };
    this.setState(clearFields);
  }

  renderImage() {
    const { profileImage } = this.state;
    return (
      profileImage === null
        ? <img src='/images/placeholder.png' alt='Placeholder' className="profile-image" />
        : <img src={profileImage} alt="My profile picture" className="profile-image" />
    );
  }

  renderButton() {
    return this.state.editing
      ? <button
        type="submit"
        name="save"
        className="btn btn-primary btn-sm mr-2">
        Save
      </button>
      : <button
        type="button"
        name="edit"
        onClick={this.handleClick}
        className="btn btn-primary btn-sm mr-2">
        Edit
      </button>;
  }

  render() {
    const { profile } = this.props;
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
              <h1 className="text-center mt-4">My Profile</h1>
            </div>
          </div>
        </header>
        <main className="container overflow-auto mx-auto mb-4 profile-container">
          <div className="row">
            <div className="col-5">
              <div className="image-container">
                {this.renderImage()}
              </div>
              <form id="image-form">
                <input type="file" name="profileImage" className="my-2" onChange={this.handleFile} />
              </form>
              <div>
                <div>
                  <span className="text-danger"><u>My Favorite Genres</u></span>
                  <div><span className="text-danger">First:</span> <p className="genres">{profile.genre1}</p></div>
                  <div><span className="text-danger">Second:</span> <p className="genres">{profile.genre2}</p></div>
                  <div><span className="text-danger">Third:</span> <p className="genres">{profile.genre3}</p></div>
                </div>
              </div>
            </div>
            <div className="col-6 mb-2">
              <div><span className="text-danger">Name:</span> <p className="profile-element">{profile.name}</p></div>
              <div><span className="text-danger">Username:</span> <p className="profile-element">{profile.username}</p></div>
              <div><span className="text-danger">E-mail:</span> <p className="profile-element">{profile.email}</p></div>
              <div><span className="text-danger">Zipcode:</span> <p className="profile-element">{profile.zipcode}</p></div>
              <div><span className="text-danger">Phone:</span> <p className="profile-element">{profile.phone}</p></div>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <h4 className="text-center">Edit Profile</h4>
            </div>
          </div>
          <div className="row">
            <div className="col-5">
              <form onSubmit={this.handleSubmit}>
                <label htmlFor="genre1">
                  1<sup>st</sup> Favorite Genre
                  <select name="genre1" id="genre1" className="profile-select" value={this.state.genre1} onChange={this.handleChange}>
                    <option defaultValue=""></option>
                    {metalGenreArr.map((genreOption, idx) => <option key={idx} value={genreOption}>{genreOption}</option>)}
                  </select>
                </label>
                <label htmlFor="genre2">
                  2<sup>nd</sup> Favorite Genre
                  <select name="genre2" id="genre2" className="profile-select" value={this.state.genre2} onChange={this.handleChange}>
                    <option defaultValue=""></option>
                    {metalGenreArr.map((genreOption, idx) => <option key={idx} value={genreOption}>{genreOption}</option>)}
                  </select>
                </label>
                <label htmlFor="genre3">
                  3<sup>rd</sup> Favorite Genre
                  <select name="genre3" id="genre3" className="profile-select" value={this.state.genre3} onChange={this.handleChange}>
                    <option defaultValue=""></option>
                    {metalGenreArr.map((genreOption, idx) => <option key={idx} value={genreOption}>{genreOption}</option>)}
                  </select>
                </label>
              </form>
            </div>
            <div className="col-6">
              <form onSubmit={this.handleSubmit} className="form-container mt-2">
                <div className="form-group">
                  <label htmlFor="name">
                    Name<em className="asterisk">&#42;</em>
                    <input
                      autoFocus
                      type="text"
                      name="name"
                      id="name"
                      value={this.state.name}
                      onChange={this.handleChange}
                      className="form-control profile-input"
                    />
                  </label>
                </div>
                <div className="form-group">
                  <label htmlFor="username">
                    Username<em className="asterisk">&#42;</em>
                    <input
                      type="text"
                      name="username"
                      id="username"
                      value={this.state.username}
                      onChange={this.handleChange}
                      className="form-control profile-input"
                    />
                  </label>
                </div>
                <div className="form-group">
                  <label htmlFor="email">
                    E-mail Address<em className="asterisk">&#42;</em>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={this.state.email}
                      onChange={this.handleChange}
                      className="form-control profile-input"
                    />
                  </label>
                </div>
                <div className="form-group">
                  <label htmlFor="zipcode">
                    Zipcode<em className="asterisk">&#42;</em>
                    <input
                      type="text"
                      name="zipcode"
                      id="zipcopde"
                      value={this.state.zipcode}
                      onChange={this.handleChange}
                      className="form-control profile-input"
                    />
                  </label>
                </div>
                <div className="form-group">
                  <label htmlFor="phone">
                    Phone Number
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      value={this.state.phone}
                      onChange={this.handleChange}
                      className="form-control profile-input"
                    />
                    <small className="asterisk">&#42; &#61; required</small>
                  </label>
                </div>
                {this.renderButton()}
                <button name="cancel" onClick={this.handleReset} className="btn btn-danger btn-sm">Cancel</button>
              </form>
            </div>
          </div>
        </main>
      </React.Fragment>
    );
  }
}

export default withRouter(EditProfile);
