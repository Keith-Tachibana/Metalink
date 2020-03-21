import React, { Component } from 'react';

class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      term: ''
    };
  }

  onInputChange(term) {
    if (!term) {
      this.setState({
        term: 'Metalocalypse'
      });
      this.props.onSearchTermChange(term);
    } else {
      this.setState({ term });
      this.props.onSearchTermChange(term);
    }
  }

  render() {
    return (
      <div className="search-bar justify-content-center">
        <input
          value={this.state.term}
          name="search"
          placeholder="Search for videos"
          className="form-control"
          onChange={event => this.onInputChange(event.target.value)} />
      </div>
    );
  }
}

export default SearchBar;
