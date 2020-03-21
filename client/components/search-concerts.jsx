import React, { Component } from 'react';

export default class SearchConcerts extends Component {
  render() {
    return (
      <div>
        <h1 className="text-center mt-4">Concerts near you</h1>
        <form className="form-group-sm mb-5 pb-5 px-5">
          <label className="float-left" htmlFor="search">ZipCode</label>
          <input type="text"/>
        </form>
      </div>
    );
  }
}
