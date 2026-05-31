import React, { useEffect, useRef, useState } from 'react';
import moment from 'moment';
import { io } from 'socket.io-client';

export default function ChatRoom({ profile }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [userCount, setUserCount] = useState(0);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const listRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    if (listRef.current && listRef.current.lastElementChild) {
      listRef.current.lastElementChild.scrollIntoView({
        block: 'end',
        inline: 'nearest',
        behavior: 'smooth'
      });
    }
  }, [messages]);

  useEffect(() => {
    const socket = io({ transports: ['websocket'] });
    socketRef.current = socket;

    fetch('/api/chat')
      .then(r => r.json())
      .then(history => {
        if (Array.isArray(history)) {
          setMessages(history.map(m => ({
            body: m.message,
            user: m.username,
            time: moment(m.timeSent).format('h:mm:ss A')
          })));
        }
      })
      .catch(err => console.error('Chat history error:', err));

    if (profile && profile.username) {
      socket.emit('User connected', {
        username: profile.username,
        userId: profile.userId
      });
    }

    socket.on('chat-message', message => {
      setMessages(m => [...m, message]);
    });

    socket.on('Announcement', data => {
      setUserCount(data.population);
      if (Array.isArray(data.users)) {
        setOnlineUsers(data.users);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function handleSubmit(e) {
    e.preventDefault();
    if (!socketRef.current) return;
    const body = text.trim();
    if (!body) return;
    socketRef.current.emit('Send message', { body });
    setText('');
  }

  return (
    <React.Fragment>
      <header className="container-fluid">
        <div className="row">
          <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
            <h1 className="text-center mt-4">Chat</h1>
          </div>
        </div>
      </header>
      <main className="container-fluid mb-4">
        <div className="row justify-content-center align-items-start">
          <div className="col-12 col-sm-12 col-md-8 col-lg-7 col-xl-6">
            <div className="card" style={{ backgroundColor: '#000' }}>
              <div className="card-body" style={{ color: '#FFF' }}>
                <div className="card-title">Number of people in chat room: {userCount}</div>
                <hr style={{ backgroundColor: '#FFF' }} />
                <div id="messages" className="overflow-auto chat-container">
                  <ul ref={listRef} style={{ listStyleType: 'none' }}>
                    {messages.map((message, idx) => (
                      <li key={idx}>
                        <small><span style={{ color: 'lightgrey' }}>{message.time}</span></small>
                        {' '}<em><span style={{ color: 'darkred' }}>{message.user}:</span></em>
                        {' '}{message.body}
                      </li>
                    ))}
                  </ul>
                </div>
                <form onSubmit={handleSubmit}>
                  <input
                    className="form-control chat-message"
                    value={text}
                    onChange={e => setText(e.target.value)}
                    placeholder="Type a message..."
                  />
                  <br />
                  <button className="btn btn-primary form-control bg-blue-200" type="submit">
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
          <aside
            className="col-12 col-sm-12 col-md-3 col-lg-2 col-xl-2"
            style={{
              float: 'right',
              backgroundColor: '#1a1a1a',
              color: '#FFF',
              borderRadius: '6px',
              padding: '12px'
            }}>
            <h6 className="text-center mb-2">Online Users</h6>
            <hr style={{ backgroundColor: '#555', marginTop: 0 }} />
            <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
              {onlineUsers.map((user, idx) => (
                <li key={idx} style={{ padding: '4px 0', wordBreak: 'break-word' }}>
                  <span style={{ color: 'lightgreen' }}>&#9679;</span> {user}
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </main>
    </React.Fragment>
  );
}
