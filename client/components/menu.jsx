import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';

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
    const { match } = this.props;
    return (
      <React.Fragment>
        <nav className={cssClass}>
          <h1 className="ml-4"><u>Menu</u></h1>
          <a href="#" onClick={this.handleClick} className="close-button">Close</a>
          <br />
          <Link to={`/home/${match.params.id}`} onClick={this.handleClick}>
            <h4 className="ml-4 mb-2">Home</h4>
          </Link>
          <Link to={`/profile/${match.params.id}`} onClick={this.handleClick}>
            <h4 className="ml-4 mb-2">Profile</h4>
          </Link>
          <Link to={`/concerts/${match.params.id}`} onClick={this.handleClick}>
            <h4 className="ml-4 mb-2">Concerts</h4>
          </Link>
          <Link to={`/search/${match.params.id}`} onClick={this.handleClick}>
            <h4 className="ml-4 mb-2">Search</h4>
          </Link>
          <Link to={`/videos/${match.params.id}`} onClick={this.handleClick}>
            <h4 className="ml-4 mb-2">Videos</h4>
          </Link>
          <Link to={`/chatHome/${match.params.id}`} onClick={this.handleClick}>
            <h4 className="ml-4 mb-2">Chat</h4>
          </Link>
          <Link to={`/about/${match.params.id}`} onClick={this.handleClick}>
            <h4 className="ml-4 mb-2">About</h4>
          </Link>
          <Link to={'/'} onClick={this.props.handleExit}>
            <h4 className="ml-4 mb-2">Sign Out</h4>
          </Link>
        </nav>
        <nav className="nav-bg">
          <i onClick={this.handleClick} className="fas fa-bars fa-2x menu ml-4 mt-4 text-danger"></i>
        </nav>
      </React.Fragment>
    );
  }
}

export default withRouter(Menu);
