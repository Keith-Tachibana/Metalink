import _ from 'lodash';
import React, { Component } from 'react';

import VideoSearch from './video-search';
import VideoList from './video-list';
import VideoDetail from './video-detail';

class VideosPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      videos: [],
      selectedVideo: null,
      message: ''
    };
    this.videoSearch = this.videoSearch.bind(this);
  }

  componentDidMount() {
    this.videoSearch('Metalocalypse');
  }

  async videoSearch(term) {
    if (term) {
      try {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        const response = await fetch(`/api/videos/${term}`, {
          method: 'GET',
          headers
        });
        const json = response.json();
        json.then(videos => {
          this.setState({
            videos,
            selectedVideo: videos[0],
            message: ''
          });
        }).catch(err => console.error(err.message));
      } catch (error) {
        console.error(error.message);
      }
    } else {
      return this.setState({
        message: 'Please enter a search query.'
      });
    }
  }

  render() {
    const videoSearch = _.debounce(term => { this.videoSearch(term); }, 300);
    return (
      <React.Fragment>
        <header className="container-fluid">
          <div className="row">
            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <h1 className="text-center mt-4">Videos</h1>
            </div>
          </div>
        </header>
        <main className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-8">
              <VideoSearch onSearchTermChange={videoSearch} />
            </div>
          </div>
          <div className="row">
            <div className="col-8 col-sm-8 col-md-8 col-lg-8 col-xl-8 overflow-auto videoresult-container" >
              <VideoDetail video={this.state.selectedVideo} />
            </div>
            <div className="col-4 col-sm-4 col-md-4 col-lg-4 col-xl-4">
              <VideoList
                onVideoSelect={selectedVideo => this.setState({ selectedVideo })}
                message={this.state.message}
                videos={this.state.videos} />
            </div>
          </div>
        </main>
      </React.Fragment >
    );
  }
}

export default VideosPage;
