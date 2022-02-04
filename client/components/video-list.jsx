import React from 'react';

import VideoListItem from './video-list-item';

const VideoList = props => {
  const videoItems = props.message
    ? <h3 className="text-center">{props.message}</h3>
    : props.videos.map(video => {
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
      style={{ minHeight: '95vh', overflowY: 'auto' }}>
      {videoItems}
    </ul>
  );
};

export default VideoList;
