import _ from 'lodash';
import React, { Component } from 'react';
import YTSearch from 'youtube-api-search';

import VideoSearch from './video-search';
import VideoList from './video-list';
import VideoDetail from './video-detail';

const API_KEY = 'AIzaSyDRqxcYbeqom6kgNF80bEu8La0KpyM6naU';

class VideosPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      videos: [],
      selectedVideo: null
    };
  }

  componentDidMount() {
    this.videoSearch('Metalocalypse');
  }

  videoSearch(term) {
    YTSearch({ key: API_KEY, term }, videos => {
      this.setState({
        videos,
        selectedVideo: videos[0]
      });
    });
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
        <main style={{ height: '487px', overflow: 'auto' }}>
          <VideoSearch onSearchTermChange={videoSearch} />
          <VideoDetail video={this.state.selectedVideo} />
          <VideoList
            onVideoSelect={selectedVideo => this.setState({ selectedVideo })}
            videos={this.state.videos} />
        </main>
      </React.Fragment>
    );
  }
}

export default VideosPage;
