import React, { useState } from 'react';
import { Link, withRouter } from 'react-router-dom';

const ChatRoom = () => {
  const [roomName, setRoomName] = useState('');
  const handleRoomNameChange = event => {
    setRoomName(event.target.value);
  };

  return (
    <React.Fragment>
      <div className="container-fluid d-flex justify-content-center">
        <div className="row">
          <input
            type="text"
            placeholder="Enter room name"
            value={roomName}
            onChange={handleRoomNameChange}
            className="form-control"
          />
          <input
            type="text"
            value={this.props.profile.username}
            disabled
            className="form-control"
          />
          <Link to={`/rooms/${roomName}/:id`}>
            Join Room
          </Link>
        </div>
      </div>
    </React.Fragment>
  );
};

export default withRouter(ChatRoom);
