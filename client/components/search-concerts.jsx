import React, { Component } from 'react';

import loadGoogleMaps from './load-google-maps';

const DEFAULT_CENTER = { lat: 33.634928, lng: -117.740481 };

function formatDate(dateString) {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-');
  return `${parseInt(month, 10)}/${parseInt(day, 10)}/${year}`;
}

export default class SearchConcerts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      concerts: [],
      message: '',
      loading: true
    };
    this.timeout = null;
    this.map = null;
    this.markers = [];
    this.infoWindow = null;
    this.getConcerts = this.getConcerts.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    loadGoogleMaps()
      .then(() => {
        this.initializeMap();
        this.updateMarkers();
        this.setState({ loading: false });
      })
      .catch(err => {
        console.error(err);
        this.setState({ loading: false, message: 'The map could not be loaded. Please refresh and try again.' });
      });
  }

  componentWillUnmount() {
    if (this.timeout) clearTimeout(this.timeout);
    this.clearMarkers();
  }

  handleChange(event) {
    const { value } = event.target;
    if (this.timeout) clearTimeout(this.timeout);
    this.timeout = setTimeout(() => this.getConcerts(value), 1000);
  }

  getConcerts(postalCode) {
    if (!/^\d{5}(?:[-\s]\d{4})?$/.test(postalCode)) {
      return this.setState({ message: 'Valid US zipcode please' });
    }
    this.setState({ message: 'Loading...' });
    fetch(`/api/concerts/${postalCode}`)
      .then(res => res.json())
      .then(concerts => {
        this.setState({
          concerts,
          message: concerts.error ? concerts.error : ''
        }, () => this.updateMarkers());
      })
      .catch(err => {
        console.error(err);
        this.setState({ message: 'Something went wrong while searching for concerts.' });
      });
  }

  initializeMap() {
    const mapEl = document.getElementById('map');
    if (!mapEl) return;
    this.map = new window.google.maps.Map(mapEl, {
      center: DEFAULT_CENTER,
      zoom: 10,
      disableDefaultUI: true,
      zoomControl: true
    });
    this.infoWindow = new window.google.maps.InfoWindow();
  }

  clearMarkers() {
    this.markers.forEach(marker => marker.setMap(null));
    this.markers = [];
  }

  updateMarkers() {
    if (!this.map || !window.google) return;
    this.clearMarkers();

    const { concerts } = this.state;
    if (!Array.isArray(concerts) || concerts.length === 0) {
      this.map.setCenter(DEFAULT_CENTER);
      this.map.setZoom(10);
      return;
    }

    const google = window.google;
    const bounds = new google.maps.LatLngBounds();

    concerts.forEach(concert => {
      const position = {
        lat: parseFloat(concert.lat),
        lng: parseFloat(concert.long)
      };
      if (Number.isNaN(position.lat) || Number.isNaN(position.lng)) return;

      const marker = new google.maps.Marker({
        position,
        map: this.map,
        title: concert.name,
        icon: '/images/marker.gif',
        animation: google.maps.Animation.DROP
      });

      const contentString =
        '<div class="card bg-dark" style="max-width: 240px; border: none;">' +
          `<img class="card-img-top" src="${concert.image}" alt="${concert.name}" style="object-fit: cover; height: 120px; width: 100%;" />` +
          '<div class="card-body">' +
            `<h5 class="card-title text-danger text-center mt-2">${concert.name}</h5>` +
            `<p class="card-text text-white text-center mb-2">${formatDate(concert.date)}: ${concert.venues} @ ${concert.location}</p>` +
          '</div>' +
          '<div class="card-footer text-white bg-dark text-center">' +
            `<a href="${concert.url}" target="_blank" rel="noopener noreferrer">Order Tickets Here</a>` +
          '</div>' +
        '</div>';

      marker.addListener('click', () => {
        this.infoWindow.setContent(contentString);
        this.infoWindow.open(this.map, marker);
      });

      this.markers.push(marker);
      bounds.extend(position);
    });

    if (this.markers.length === 1) {
      this.map.setCenter(bounds.getCenter());
      this.map.setZoom(12);
    } else if (this.markers.length > 1) {
      this.map.fitBounds(bounds);
    }
  }

  render() {
    const resultItems = this.state.concerts.error
      ? <tbody><tr><td>{this.state.concerts.error}</td></tr></tbody>
      : this.state.concerts.map((concert, idx) => {
        const newDate = formatDate(concert.date);
        return (
          <tbody key={idx} className="table-hover">
            <tr>
              <td className="text-danger">{newDate}: {concert.venues} @ {concert.location}</td>
            </tr>
            <tr>
              <td><img src={concert.image} alt={concert.name} style={{ objectFit: 'cover', height: '90px', width: '160px' }} /></td>
            </tr>
            <tr>
              <td>{concert.name}</td>
            </tr>
            <tr>
              <td><a href={`${concert.url}`} target="_blank" rel="noopener noreferrer">Order Tickets Here</a></td>
            </tr>
          </tbody>
        );
      });
    return (
      <div>
        <h1 className="text-center mt-4 mb-4">Concerts Near You</h1>
        <main className="container-fluid">
          <div className="row">
            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <form className="form-group mx-auto mb-2 concertsearch-form">
                <label htmlFor="search">ZipCode</label>
                <input onChange={this.handleChange}
                  type="text" className="form-control"
                  placeholder="Enter Zipcode" minLength="5" maxLength="5" />
              </form>
            </div>
          </div>
        </main>
        <div id="map" className="concert-map mx-auto mb-2"></div>
        <div className="concertsearch-table table-responsive overflow-auto mx-auto mb-5">
          {this.state.message
            ? <h3 className="text-center">{this.state.message}</h3>
            : <table className="table table-sm table-dark table-striped">
              {resultItems}
            </table>}
        </div>
      </div>
    );
  }
}
