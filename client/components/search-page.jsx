import React, { Component } from 'react';

class SearchPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      band: ''
    };
  }

  async getBandInfo(band) {
    try {
      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      await fetch(`/api/bands/${band}`, {
        method: 'GET',
        headers
      });
    } catch (error) {
      console.error(error.message);
    }
  }

  render() {
    return (
      <React.Fragment>
        <h1 className="text-center mt-4">Search</h1>
      </React.Fragment>
    );
  }
}

export default SearchPage;
