import React, { Component } from 'react';

export default class SearchConcerts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      concerts: []
    };
    this.timeout = null;
    this.getConcerts = this.getConcerts.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    const { value } = event.target;
    if (this.timeout) clearTimeout(this.timeout);
    this.timeout = setTimeout(() => this.getConcerts(value), 500);
  }

  getConcerts(postalCode) {
    fetch(`/api/concerts/${postalCode}`)
      .then(res => res.json())
      .then(concerts => this.setState({ concerts }))
      .catch(err => console.error(err));
  }

  render() {
    return (
      <div>
        <h1 className="text-center mt-4">Concerts near you</h1>
        <form className="form-group-sm mb-5 pb-5 px-5">
          <label className="float-left" htmlFor="search">ZipCode</label>
          <input onChange={this.handleChange}type="text" className="form-control" placeholder="Enter Zipcode" />
        </form>
        <table>

        </table>
        <ul>
          {/* {
            this.state.concerts.map()
          } */}
        </ul>
      </div>
    );
  }
}
