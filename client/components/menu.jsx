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
          <a href="javascript:void(0)" onClick={this.handleClick} className="close-button">Close</a>
          <br />
          <Link to="/home">
            <div onClick={this.handleClick}>
              <h4>
                <i className="fas fa-home text-primary ml-4 mb-2"></i>
                <span className="text-white"> Home</span>
              </h4>
            </div>
          </Link>
          <Link to="/profile">
            <div onClick={this.handleClick}>
              <h4>
                <i className="fas fa-id-card text-info ml-4 mb-2"></i>
                <span className="text-white"> Profile</span>
              </h4>
            </div>
          </Link>
          <Link to="/concerts">
            <div onClick={this.handleClick}>
              <h4>
                <i className="fas fa-guitar text-warning ml-4 mb-2"></i>
                <span className="text-white"> Concerts</span>
              </h4>
            </div>
          </Link>
          <Link to="/search">
            <div onClick={this.handleClick}>
              <h4>
                <i className="fas fa-search text-success ml-4 mb-2"></i>
                <span className="text-white"> Search</span>
              </h4>
            </div>
          </Link>
          <Link to="/videos">
            <div onClick={this.handleClick}>
              <h4>
                <i className="fab fa-youtube text-danger ml-4 mb-2"></i>
                <span className="text-white"> Videos</span>
              </h4>
            </div>
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
