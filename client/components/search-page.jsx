import _ from 'lodash';
import React, { Component } from 'react';

class SearchPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      band: [],
      discogs: [],
      message: '',
      search: '',
      loading: true
    };
    this.getBandInfo = this.getBandInfo.bind(this);
    this.getDiscogs = this.getDiscogs.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  async getBandInfo(query = this.state.search) {
    this.setState({
      message: 'Loading...'
    });
    if (query) {
      try {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        const response = await fetch(`/api/bands/${query}`, {
          method: 'GET',
          headers
        });
        const json = response.json();
        json.then(band => {
          this.setState({
            band
          }, query => this.getDiscogs(band.id));
        })
          .catch(err => console.error(err))
          .finally(() => {
            this.setState({
              loading: false,
              message: ''
            });
          });
      } catch (error) {
        console.error(error.message);
      }
    } else {
      return (
        this.setState({
          message: 'Please enter a band name to search.'
        })
      );
    }
  }

  async getDiscogs(query) {
    try {
      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      const response = await fetch(`/api/discogs/${query}`, {
        method: 'GET',
        headers
      });
      const json = response.json();
      json.then(discogs => {
        this.setState({
          discogs
        });
      }).catch(err => console.error(err));
    } catch (error) {
      console.error(error.message);
    }
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    }, _.debounce(value => { this.getBandInfo(value); }, 300));
  }

  render() {
    const { band, discogs, message } = this.state;
    const response = band.error
      ? <div>{band.error}</div>
      : (<div className="card band-card" style={{ height: '385px', overflow: 'auto', border: '1px solid #FFF' }}>
        <img src={band.image} alt={band.band} className="card-img-top img-fluid search-img" />
        <div className="card-body">
          <h5 className="card-title text-center" style={{ color: '#FFF' }}><u><em>{band.band}</em></u></h5>
          <p className="card-text" style={{ color: '#FFF' }}>{discogs.profile}</p>
        </div>
      </div>);
    return (
      <React.Fragment>
        <header className="container-fluid mb-1">
          <div className="row">
            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <h1 className="text-center mt-1 mb-0">Search</h1>
            </div>
          </div>
        </header>
        <main className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-12 col-sm-12 col-md-8 col-lg-6 col-xl-6 mb-md-3">
              <form>
                <div className="form-group">
                  <label htmlFor="search">Band Name</label>
                  <input
                    type="search"
                    name="search"
                    id="search"
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
                ? <h3 className="text-center" style={{ height: '377px', overflow: 'auto' }}>{message}</h3>
                : <React.Fragment>{response}</React.Fragment> }
            </div>
          </div>
        </main>
      </React.Fragment>
    );
  }
}

export default SearchPage;
