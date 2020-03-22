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
        <header className="container-fluid mb-4">
          <div className="row">
            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <h1 className="text-center mt-4">Search</h1>
            </div>
          </div>
        </header>

      </React.Fragment>
    );
  }
}

export default SearchPage;
