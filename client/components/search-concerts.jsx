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
    if (/^\d{5}(?:[-\s]\d{4})?$/g.test(postalCode)) {
      fetch(`/api/concerts/${postalCode}`)
        .then(res => res.json())
        .then(concerts => this.setState({ concerts }))
        .catch(err => console.error(err))
        .finally(() => this.setState({ loading: false }));
    } else {
      return this.setState({ message: 'Valid zipcode please' });
    }
  }

  render() {
    const resultItems = this.state.concerts.map((concert, idx) => {
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
    // const messages = this.state.loading ? <h4>Loading...</h4> : 'stuff'
    return (
      <div>
        <h1 className="text-center mt-4">Concerts near you</h1>
        <form className="form-group-sm mb-2 px-5">
          <label className="float-left" htmlFor="search">ZipCode</label>
          <input onChange={this.handleChange}
            type="text" className="form-control"
            placeholder="Enter Zipcode" pattern="/^\d{5}(?:[-\s]\d{4})?$/g" />
        </form>
        <div className="concertsearch-table table-responsive-sm px-4">
          <table className="table table-sm table-dark table-striped">
            {resultItems}
          </table>
        </div>
      </div>
    );
  }
}
