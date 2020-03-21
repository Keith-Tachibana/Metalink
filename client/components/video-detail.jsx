import React from 'react';

const VideoDetail = ({ video }) => {
  if (!video) {
    return <div className="ml-4">Loading...</div>;
  }

  const videoId = video.id.videoId;
  const url = `https://www.youtube.com/embed/${videoId}`;

  return (
    <div className="video-detail col-md-8">
      <div className="embed-responsive embed-responsive-16by9">
        <iframe className="embed-responsive-item" src={url}></iframe>
      </div>
      <div className="details mb-2" style={{ height: '135px', overflow: 'auto' }}>
        <div className="text-center"><u><em>{video.snippet.title}</em></u></div>
        <div>{video.snippet.description}</div>
      </div>
    </div>
  );
};

export default VideoDetail;
