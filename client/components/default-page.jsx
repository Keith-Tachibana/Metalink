import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';

class DefaultPage extends Component {
  render() {
    return (
      <React.Fragment>
        <header className="container-fluid mb-4">
          <div className="row">
            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 d-flex justify-content-center">
            <picture>
              <source srcSet="/images/metalink.webp" type="image/webp" />
              <source srcSet="/images/metalink.png" type="image/png" />
              <img src="/images/metalink.png" alt="Metalink Logo" className="img-fluid mb-3" />
            </picture>
            <h1 className="text-center mt-4"><em>404:</em> Page Not Found</h1>
          </div>
        </div>
      </header>
      <footer>
        <div className="container-fluid justify-content-center d-flex">
          <Link to="/">
            <button className="btn btn-danger btn-sm">
              <i className="fas fa-arrow-circle-left"></i> Login
            </button>
          </Link>
        </div>
      </footer>
    </React.Fragment>
    );
  }
}

export default withRouter(DefaultPage);
