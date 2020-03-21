import React, { Component } from 'react';

export default class SearchConcerts extends Component {
  componentDidMount() {
    this.getConcerts();
  }

  getConcerts(postalCode) {
    fetch(`/api/concerts/${postalCode}`)
      .then(res => res.json())
      .then(concerts => concerts)
      .catch(err => console.error(err));
  }

  render() {
    return (
      <div>
        <h1 className="text-center mt-4">Concerts near you</h1>
        <form className="form-group-sm mb-5 pb-5 px-5">
          <label className="float-left" htmlFor="search">ZipCode</label>
          <input type="text" className="form-control" placeholder="Enter Zipcode"/>
        </form>
      </div>
    );
  }
}
