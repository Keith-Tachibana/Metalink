import React from 'react';

const VideoDetail = ({ video }) => {
  if (!video) {
    return <div className="ml-4"><p>This API key has exceeded its maximum allotted quota from YouTube. Please try again later when it resets.</p></div>;
  }

  const videoId = video.id.videoId;
  const url = `https://www.youtube.com/embed/${videoId}`;

  return (
    <div className="video-detail">
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
