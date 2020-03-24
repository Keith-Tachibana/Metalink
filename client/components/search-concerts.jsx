import React, { Component } from 'react';

export default class SearchConcerts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      concerts: [],
      message: '',
      loading: true
    };
    this.timeout = null;
    this.getConcerts = this.getConcerts.bind(this);
    this.handleChange = this.handleChange.bind(this);
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
      return this.setState({ message: 'Valid zipcode please' });
    }
  }

  render() {
    const resultItems = this.state.concerts.error ? <thead><tr><td>{this.state.concerts.error}</td></tr></thead>
      : this.state.concerts.map((concert, idx) => {
        return (
          <tbody key={idx} className="table-hover">
            <tr>
              <td>{concert.date}: {concert.venues}, {concert.location}</td>
            </tr>
            <tr>
              <td>{concert.name}</td>
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
              <form className="form-group mb-2">
                <label htmlFor="search">ZipCode</label>
                <input onChange={this.handleChange}
                  type="text" className="form-control"
                  placeholder="Enter Zipcode" pattern="/^\d{5}(?:[-\s]\d{4})?$/g" />
              </form>
            </div>
          </div>
        </main>
        <div className="concertsearch-table table-responsive-sm px-4">
          {this.state.message ? <h3 className="text-center">{this.state.message}</h3>
            : <table className="table table-sm table-dark table-striped">
              {resultItems}
            </table>}
        </div>
      </div>
    );
  }
}
