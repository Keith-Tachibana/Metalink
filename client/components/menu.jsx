import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clicked: false
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState({
      clicked: !this.state.clicked
    });
  }

  render() {
    const cssClass = this.state.clicked ? 'menu-container menu-open' : 'menu-container menu-closed';
    return (
      <React.Fragment>
        <div className={cssClass}>
          <h1 className="ml-4"><u>Menu</u></h1>
          <a href="#" onClick={this.handleClick} className="close-button">Close</a>
          <br />
          <Link to="/home" onClick={this.handleClick}>
            <h4 className="ml-4 mb-2">Home</h4>
          </Link>
          <Link to="/profile" onClick={this.handleClick}>
            <h4 className="ml-4 mb-2">Profile</h4>
          </Link>
          <Link to="/concerts" onClick={this.handleClick}>
            <h4 className="ml-4 mb-2">Concerts</h4>
          </Link>
          <Link to="/search" onClick={this.handleClick}>
            <h4 className="ml-4 mb-2">Search</h4>
          </Link>
          <Link to="/videos" onClick={this.handleClick}>
            <h4 className="ml-4 mb-2">Videos</h4>
          </Link>
        </div>
        <div className="nav-bg">
          <i onClick={this.handleClick} className="fas fa-bars fa-2x menu ml-2 mt-4 text-danger"></i>
        </div>
      </React.Fragment>
    );
  }
}

export default Menu;
