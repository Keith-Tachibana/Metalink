import React from 'react';

import VideoListItem from './video-list-item';

const VideoList = props => {
  const videoItems = props.videos.map(video => {
    return (
      <VideoListItem
        onVideoSelect={props.onVideoSelect}
        key={video.etag}
        video={video} />
    );
  });

  return (
    <ul
      className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 list-group mx-2 mb-4"
      style={{ height: '200px', overflow: 'auto' }}>
      {videoItems}
    </ul>
  );
};

export default VideoList;
