import React, { Component } from 'react';
import HomePage from './home-page';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: null,
      isLoading: true
    };
  }

  componentDidMount() {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => this.setState({ message: data.message || data.error }))
      .catch(err => this.setState({ message: err.message }))
      .finally(() => this.setState({ isLoading: false }));
  }

  render() {
    return (
      <React.Fragment>
        <div className="container">
          <HomePage />
        </div>
      </React.Fragment>
    );
  }
}

export default App;
