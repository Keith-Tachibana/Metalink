import React, { Component } from 'react';

class VideoSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      term: ''
    };
  }

  onInputChange(term) {
    this.setState({ term });
    this.props.onSearchTermChange(term);
  }

  render() {
    return (
      <div className="search-bar">
        <label htmlFor="search">Video Search</label>
        <input
          value={this.state.term}
          type="search"
          name="search"
          id="search"
          placeholder="Search for videos"
          className="form-control"
          onChange={event => this.onInputChange(event.target.value)} />
      </div>
    );
  }
}

export default VideoSearch;
