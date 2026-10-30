import _ from 'lodash';
import React, { Component } from 'react';

class SearchPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      band: null,
      discogs: null,
      message: '',
      search: ''
    };
    this.getBandInfo = this.getBandInfo.bind(this);
    this.getDiscogs = this.getDiscogs.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    // A single debounced searcher for the lifetime of the component, so that
    // rapid typing collapses into one request instead of firing one (actually
    // two - band + discogs) per keystroke and tripping Discogs' rate limit.
    this.debouncedSearch = _.debounce(this.getBandInfo, 800);
  }

  componentWillUnmount() {
    this.debouncedSearch.cancel();
  }

  async getBandInfo(query) {
    const term = (query || '').trim();
    if (term.length < 2) {
      return this.setState({ band: null, discogs: null, message: 'Please enter at least 2 characters.' });
    }
    this.setState({ message: 'Loading...' });
    try {
      const response = await fetch(`/api/bands/${encodeURIComponent(term)}`);
      const band = await response.json();
      if (!response.ok || !band || band.error) {
        return this.setState({
          band: null,
          discogs: null,
          message: (band && band.error) || 'Could not find that band. Please try again in a moment.'
        });
      }
      this.setState({ band, discogs: null, message: '' });
      if (band.id) this.getDiscogs(band.id);
    } catch (error) {
      console.error(error.message);
      this.setState({ message: 'Something went wrong while searching. Please try again.' });
    }
  }

  async getDiscogs(id) {
    try {
      const response = await fetch(`/api/discogs/${encodeURIComponent(id)}`);
      if (!response.ok) return;
      const discogs = await response.json();
      this.setState({ discogs });
    } catch (error) {
      console.error(error.message);
    }
  }

  handleChange(event) {
    const { value } = event.target;
    this.setState({ search: value });
    if (value.trim().length >= 2) {
      this.debouncedSearch(value);
    } else {
      this.debouncedSearch.cancel();
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    this.debouncedSearch.cancel();
    this.getBandInfo(this.state.search);
  }

  render() {
    const { band, discogs, message } = this.state;
    const card = band && band.band
      ? (<div className="card band-card" style={{ overflow: 'auto' }} >
        <img
          src={band.image || '/images/placeholder.png'}
          alt={band.band}
          className="card-img-top search-img"
          onError={event => { event.target.onerror = null; event.target.src = '/images/placeholder.png'; }} />
        <div className="card-body">
          <h5 className="card-title text-center" style={{ color: '#FFF' }}><u><em>{band.band}</em></u></h5>
          <p className="card-text" style={{ color: '#FFF' }}>{discogs && discogs.profile}</p>
        </div>
      </div>)
      : null;
    return (
      <React.Fragment>
        <header className="container-fluid mt-4">
          <div className="row">
            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <h1 className="text-center">Search</h1>
            </div>
          </div>
        </header>
        <main className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-12 col-sm-12 col-md-8 col-lg-6 col-xl-6 mb-md-3">
              <form onSubmit={this.handleSubmit}>
                <div className="form-group">
                  <label htmlFor="search">Band Name</label>
                  <input
                    type="search"
                    name="search"
                    id="search"
                    value={this.state.search}
                    placeholder="Search for bands"
                    onChange={this.handleChange}
                    className="form-control" />
                </div>
              </form>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-12 col-sm-12 col-md-8 col-lg-6 col-xl-6">
              {message
                ? <h3 className="text-center">{message}</h3>
                : card}
            </div>
          </div>
        </main>
      </React.Fragment>
    );
  }
}

export default SearchPage;
