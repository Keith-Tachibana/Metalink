import React from 'react';

const VideoDetail = ({ video }) => {
  if (!video) {
    return <div className="ml-4"><p>Search for a band or song above to watch videos.</p></div>;
  }

  const videoId = video.id;
  const url = `https://www.youtube.com/embed/${videoId}`;

  return (
    <div className="video-detail">
      <div className="embed-responsive embed-responsive-16by9">
        <iframe
          className="embed-responsive-item"
          src={url}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen></iframe>
      </div>
      <div className="details mb-2" style={{ height: '135px', overflow: 'auto' }}>
        <div className="text-center"><u><em>{video.title}</em></u></div>
        <div>{video.description}</div>
      </div>
    </div>
  );
};

export default VideoDetail;
