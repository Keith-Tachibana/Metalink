import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

const images = [
  {
    id: 1,
    alt: 'Jack Chou',
    src: '/images/Jack_Chou.webp',
    altsrc: '/images/Jack_Chou.png',
    title: 'Jack Chou',
    subtitle: 'Role: Frontend and Backend Developer',
    text: 'His experience interacting with Salesforce, Microsoft Access, and SQL in his previous roles ultimately led to his decision to attend an accelerated web development program at LearningFuze. He lives in Fullerton, California.'
  },

  {
    id: 2,
    alt: 'Andrew Song',
    src: '/images/Andrew_Song.webp',
    altsrc: '/images/Andrew_Song.png',
    title: 'Andrew Song',
    subtitle: 'Role: Frontend and Backend Developer',
    text: 'His love of learning new languages and technologies led to his decision to become a full-stack web developer by enrolling in a coding bootcamp at LearningFuze. He is from Irvine, California.'
  },

  {
    id: 3,
    alt: 'Keith Tachibana',
    src: '/images/Keith_Tachibana.webp',
    altsrc: '/images/Keith_Tachibana.png',
    title: 'Keith Tachibana',
    subtitle: 'Role: Frontend and Backend Developer',
    text: 'His prior work experience as an IT (Information Technology) Technician led to his decision to change roles and become a full-stack web developer by attending a program at LearningFuze. He resides in Irvine, California.'
  }
];

class AboutPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageIndex: 0
    };
    this.timerID = null;
    this.handlePrevious = this.handlePrevious.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.handleDot = this.handleDot.bind(this);
    this.renderDot = this.renderDot.bind(this);
  }

  startTimer() {
    this.timerID = setInterval(this.handleNext, 10000);
  }

  stopTimer() {
    clearInterval(this.timerID);
  }

  componentDidMount() {
    this.startTimer();
  }

  componentDidUpdate() {
    this.stopTimer();
    this.startTimer();
  }

  componentWillUnmount() {
    this.stopTimer();
  }

  handlePrevious() {
    this.setState(prevState => {
      if (prevState.imageIndex === 0) {
        return {
          imageIndex: images.length - 1
        };
      } else {
        return {
          imageIndex: prevState.imageIndex - 1
        };
      }
    });
  }

  handleNext() {
    this.setState(prevState => {
      if (prevState.imageIndex === images.length - 1) {
        return {
          imageIndex: 0
        };
      } else {
        return {
          imageIndex: prevState.imageIndex + 1
        };
      }
    });
  }

  handleDot(event) {
    this.setState({
      imageIndex: Number(event.target.id)
    });
  }

  renderDot() {
    return (
      <React.Fragment>
        {images.map((image, index) => {
          let dot;
          const current = index === this.state.imageIndex;
          if (current) {
            dot = 'fas fa-circle mr-2';
          } else {
            dot = 'far fa-circle mr-2';
          }
          return <i className={dot} key={index} id={index} onClick={this.handleDot}></i>;
        })}
      </React.Fragment>
    );
  }

  render() {
    return (
      <React.Fragment>
        <header className="container-fluid mt-4">
          <div className="row">
            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <h1 className="text-center">About</h1>
            </div>
          </div>
        </header>
        <main className="container-fluid" style={{ height: '487px' }}>
          <div className="row">
            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <div className="carousel">
                <i className="previous fas fa-chevron-left" onClick={this.handlePrevious}></i>
                <div className="card bg-dark" style={{ overflow: 'auto' }}>
                  <picture>
                    <source srcSet={images[this.state.imageIndex].src} type="image/webp" />
                    <source srcSet={images[this.state.imageIndex].altsrc} type="image/png" />
                    <img
                      className="card-img-top"
                      height="250"
                      src={images[this.state.imageIndex].altsrc}
                      alt={images[this.state.imageIndex].alt}
                      key={images[this.state.imageIndex].id} />
                  </picture>
                  <div className="card-body">
                    <h5 className="card-title text-danger">{images[this.state.imageIndex].title}</h5>
                    <h6 className="card-subtitle mb-2 text-info">{images[this.state.imageIndex].subtitle}</h6>
                    <p className="card-text text-white">{images[this.state.imageIndex].text}</p>
                  </div>
                </div>
                <i className="next fas fa-chevron-right" onClick={this.handleNext}></i>
              </div>
            </div>
            <div className="dot">
              <this.renderDot />
            </div>
          </div>
        </main>
      </React.Fragment>
    );
  }
}

export default withRouter(AboutPage);
