import React from 'react';

const VideoListItem = ({ video, onVideoSelect }) => {
  const imageUrl = video.thumbnails && video.thumbnails.default
    ? video.thumbnails.default.url
    : `https://i.ytimg.com/vi/${video.id}/default.jpg`;
  return (
    <li onClick={() => onVideoSelect(video)} className="list-group-item">
      <div className="video-list media">
        <div className="media-left">
          <img className="media-object mr-2" src={imageUrl} />
        </div>
        <div className="media-body">
          <div className="media-heading">{video.title}</div>
        </div>
      </div>
    </li>
  );
};

export default VideoListItem;
