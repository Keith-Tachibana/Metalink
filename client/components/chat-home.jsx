import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ChatHome = () => {
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
          <Link to={`/rooms/${roomName}`}>
            Join Room
          </Link>
        </div>
      </div>
    </React.Fragment>
  );
};

export default ChatHome;
