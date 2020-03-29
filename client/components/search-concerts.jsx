import React, { Component } from 'react';

export default class SearchConcerts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      concerts: [],
      message: '',
      loading: true,
      map: null
    };
    this.timeout = null;
    this.getConcerts = this.getConcerts.bind(this);
    this.initializeMap = this.initializeMap.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.initializeMap();
  }

  handleChange(event) {
    const { value } = event.target;
    if (this.timeout) clearTimeout(this.timeout);
    this.timeout = setTimeout(() => this.getConcerts(value), 1000);
  }

  getConcerts(postalCode) {
    this.setState({ message: 'Loading...' });
    if (/^\d{5}(?:[-\s]\d{4})?$/g.test(postalCode)) {
      fetch(`/api/concerts/${postalCode}`)
        .then(res => res.json())
        .then(concerts => this.setState({ concerts }))
        .catch(err => console.error(err))
        .finally(() => this.setState({ loading: false, message: '' }));
    } else {
      return this.setState({ message: 'Valid US zipcode please' });
    }
  }

  initializeMap() {
    this.setState(prevState => {
      // eslint-disable-next-line no-undef
      const map = new google.maps.Map(document.getElementById('map'), {
        center: {
          lat: 33.634928,
          lng: -117.740481
        },
        zoom: 12,
        disableDefaultUI: true
      });
      return {
        map
      };
    });
  }

  render() {
    const resultItems = this.state.concerts.error ? <thead><tr><td>{this.state.concerts.error}</td></tr></thead>
      : this.state.concerts.map((concert, idx) => {
        const split = concert.date.split('-');
        const month = split[1] < 10 ? split[1].slice(1) : split[1];
        const day = split[2] < 10 ? split[2].slice(1) : split[2];
        const newDate = `${month}/${day}/${split[0]}`;
        // eslint-disable-next-line no-undef
        const marker = new google.maps.Marker({
          // eslint-disable-next-line no-undef
          position: new google.maps.LatLng(concert.lat, concert.long),
          map: this.state.map,
          title: concert.name,
          draggable: true,
          // eslint-disable-next-line no-undef
          animation: google.maps.Animation.DROP
        });
        marker.setIcon('/images/marker.gif');
        const contentString =
          '<div class="card bg-dark">' +
            `<img class="card-img-top" src="${concert.image}" alt="${concert.name}" style="object-fit: cover; height: 100%; width: 100%;"` +
            '<div class="card-body">' +
              `<h5 class="card-title text-danger text-center mt-2">${concert.name}</h5>` +
              `<p class="card-text text-white text-center mb-2">${newDate}: ${concert.venues} @ ${concert.location}</p>` +
            '</div>' +
            '<div class="card-footer text-white bg-dark text-center">' +
              `<a href=${concert.url} target="_blank">Order Tickets Here</a>` +
            '</div>' +
          '</div>';
        // eslint-disable-next-line no-undef
        const infowindow = new google.maps.InfoWindow({
          content: contentString
        });
        marker.addListener('click', () => {
          infowindow.open(this.state.map, marker);
          if (marker.getAnimation() !== null) {
            marker.setAnimation(null);
          } else {
            // eslint-disable-next-line no-undef
            marker.setAnimation(google.maps.Animation.BOUNCE);
          }
        });
        marker.setMap(this.state.map);
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
        <h1 className="text-center mt-4 mb-4">Concerts near you</h1>
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
        <div className="concertsearch-table table-responsive overflow-auto mx-auto">
          {this.state.message ? <h3 className="text-center">{this.state.message}</h3>
            : <table className="table table-sm table-dark table-striped">
              {resultItems}
            </table>}
          <br />
          <div id="map" className="col-10 col-sm-10 col-md-10 col-lg-10 col-xl-10 m-auto" style={{ height: '300px' }}></div>
        </div>
      </div>
    );
  }
}
