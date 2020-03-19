import React from 'react';

class Header extends React.Component {
  render() {
    const headerStyle = {
      height: '75px',
      objectFit: 'cover',
      padding: 0
    };
    return (
      <div className="text-white">
        <div className="col-3 fas fa-bars fa-2x mt-2"></div>
        <img src="/images/login.jpg" className="col-9" style={ headerStyle } />
      </div>
    );
  }
}

export default Header;
