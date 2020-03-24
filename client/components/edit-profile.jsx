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
      profileImage: this.props.profileImage,
      genre1: '',
      genre2: '',
      genre3: ''
    };
    this.handleFile = this.handleFile.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }

  handleFile(event) {
    event.preventDefault();
    this.setState({
      profileImage: event.target.files[0]
    });
    const formData = new FormData(event.target.form);
    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    };
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
    this.clearFields();
  }

  handleReset(event) {
    event.preventDefault();
    this.clearFields();
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
        ? <img src='' alt='' />
        : <img src={profileImage} alt="My profile picture" className="profile-image" />
    );
  }

  render() {
    const { profile } = this.props;
    return (
      <React.Fragment>
        <header className="container-fluid mb-4">
          <div className="row">
            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <h1 className="text-center mt-4">My Profile</h1>
            </div>
          </div>
        </header>
        <main className="container-fluid mb-4" style={{ height: '568px' }}>
          <div className="row">
            <div className="col-5 col-sm-5 col-md-5 col-lg-5 col-xl-5">
              <div className="image-container">
                {this.renderImage()}
              </div>
              <form id="image-form">
                <input type="file" name="profileImage" className="my-2" onChange={this.handleFile} />
              </form>
              <div className="genres-container">
                <ul>
                  My Favorite Genres
                  <li><span className="text-danger">First:</span> <p className="genres">{profile.genre1}</p></li>
                  <li><span className="text-danger">Second:</span> <p className="genres">{profile.genre2}</p></li>
                  <li><span className="text-danger">Third:</span> <p className="genres">{profile.genre3}</p></li>
                </ul>
              </div>
              <form onSubmit={this.handleSubmit}>
                <label htmlFor="genre1">
                  1<sup>st</sup> Favorite Genre
                  <select name="genre1" id="genre1" className="profile-select" value={this.state.genre1} onChange={this.handleChange}>
                    <option defaultValue=""></option>
                    <option value="Black Metal">Black Metal</option>
                    <option value="Blackened Death Metal">Blackened Death Metal</option>
                    <option value="Deathcore">Deathcore</option>
                    <option value="Doom Metal">Doom Metal</option>
                    <option value="Folk Metal">Folk Metal</option>
                    <option value="Glam Metal">Glam Metal</option>
                    <option value="Grindcore">Grindcore</option>
                    <option value="Groove Metal">Groove Metal</option>
                    <option value="Heavy Metal">Heavy Metal</option>
                    <option value="Melodic Death Metal">Melodic Death Metal</option>
                    <option value="Metalcore">Metalcore</option>
                    <option value="Neoclassical Metal">Neoclassical Metal</option>
                    <option value="Pagan Metal">Pagan Metal</option>
                    <option value="Pirate Metal">Pirate Metal</option>
                    <option value="Power Metal">Power Metal</option>
                    <option value="Progressive Metal">Progressive Metal</option>
                    <option value="Sludge Metal">Sludge Metal</option>
                    <option value="Speed Metal">Speed Metal</option>
                    <option value="Symphonic Metal">Symphonic Metal</option>
                    <option value="Symphonic Black Metal">Symphonic Black Metal</option>
                    <option value="Technical Death Metal">Technical Death Metal</option>
                    <option value="Thrash Metal">Thrash Metal</option>
                    <option value="Viking Metal">Viking Metal</option>
                  </select>
                </label>
                <label htmlFor="genre2">
                  2<sup>nd</sup> Favorite Genre
                  <select name="genre2" id="genre2" className="profile-select" value={this.state.genre2} onChange={this.handleChange}>
                    <option defaultValue=""></option>
                    <option value="Black Metal">Black Metal</option>
                    <option value="Blackened Death Metal">Blackened Death Metal</option>
                    <option value="Deathcore">Deathcore</option>
                    <option value="Doom Metal">Doom Metal</option>
                    <option value="Folk Metal">Folk Metal</option>
                    <option value="Glam Metal">Glam Metal</option>
                    <option value="Grindcore">Grindcore</option>
                    <option value="Groove Metal">Groove Metal</option>
                    <option value="Heavy Metal">Heavy Metal</option>
                    <option value="Melodic Death Metal">Melodic Death Metal</option>
                    <option value="Metalcore">Metalcore</option>
                    <option value="Neoclassical Metal">Neoclassical Metal</option>
                    <option value="Pagan Metal">Pagan Metal</option>
                    <option value="Pirate Metal">Pirate Metal</option>
                    <option value="Power Metal">Power Metal</option>
                    <option value="Progressive Metal">Progressive Metal</option>
                    <option value="Sludge Metal">Sludge Metal</option>
                    <option value="Speed Metal">Speed Metal</option>
                    <option value="Symphonic Metal">Symphonic Metal</option>
                    <option value="Symphonic Black Metal">Symphonic Black Metal</option>
                    <option value="Technical Death Metal">Technical Death Metal</option>
                    <option value="Thrash Metal">Thrash Metal</option>
                    <option value="Viking Metal">Viking Metal</option>
                  </select>
                </label>
                <label htmlFor="genre3">
                  3<sup>rd</sup> Favorite Genre
                  <select name="genre3" id="genre3" className="profile-select" value={this.state.genre3} onChange={this.handleChange}>
                    <option defaultValue=""></option>
                    <option value="Black Metal">Black Metal</option>
                    <option value="Blackened Death Metal">Blackened Death Metal</option>
                    <option value="Deathcore">Deathcore</option>
                    <option value="Doom Metal">Doom Metal</option>
                    <option value="Folk Metal">Folk Metal</option>
                    <option value="Glam Metal">Glam Metal</option>
                    <option value="Grindcore">Grindcore</option>
                    <option value="Groove Metal">Groove Metal</option>
                    <option value="Heavy Metal">Heavy Metal</option>
                    <option value="Melodic Death Metal">Melodic Death Metal</option>
                    <option value="Metalcore">Metalcore</option>
                    <option value="Neoclassical Metal">Neoclassical Metal</option>
                    <option value="Pagan Metal">Pagan Metal</option>
                    <option value="Pirate Metal">Pirate Metal</option>
                    <option value="Power Metal">Power Metal</option>
                    <option value="Progressive Metal">Progressive Metal</option>
                    <option value="Sludge Metal">Sludge Metal</option>
                    <option value="Speed Metal">Speed Metal</option>
                    <option value="Symphonic Metal">Symphonic Metal</option>
                    <option value="Symphonic Black Metal">Symphonic Black Metal</option>
                    <option value="Technical Death Metal">Technical Death Metal</option>
                    <option value="Thrash Metal">Thrash Metal</option>
                    <option value="Viking Metal">Viking Metal</option>
                  </select>
                </label>
              </form>
            </div>
            <div className="col-7 col-sm-7 col-md-7 col-lg-7 col-xl-7 mb-2">
              <div><span className="text-danger">Name:</span> <span className="profile-element">{profile.name}</span></div>
              <div><span className="text-danger">Username:</span> <span className="profile-element">{profile.username}</span></div>
              <div><span className="text-danger">E-mail:</span> <span className="profile-element">{profile.email}</span></div>
              <div><span className="text-danger">Zipcode:</span> <span className="profile-element">{profile.zipcode}</span></div>
              <div><span className="text-danger">Phone:</span> <span className="profile-element">{profile.phone}</span></div>
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
                <button type="submit" name="save" className="btn btn-primary btn-sm mr-2">Update</button>
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
