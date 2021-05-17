import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ChatRoom = () => {
  const [roomName, setRoomName] = useState('');
  const handleRoomNameChange = event => {
    setRoomName(event.target.value);
  };

  return (
    <React.Fragment>
      <div>
        <input
          type="text"
          placeholder="Enter room name"
          value={roomName}
          onChange={handleRoomNameChange}
          className="form-control"
        />
        <Link to={`/rooms/${roomName}/users`}>
          Join Room
        </Link>
      </div>
    </React.Fragment>
  );
};

export default ChatRoom;
