import React, { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
// import { withRouter } from 'react-router-dom';
// import moment from 'moment';
import { io } from 'socket.io-client';

const connectChatServer = () => {
  const socket = io(process.env.CHAT_SERVER_URL, {
    transports: ['websocket'],
    path: '/'
  });
  // eslint-disable-next-line no-console
  socket.onAny((type, message) => console.log(type, message));

  return socket;
};

export default function ChatRoom() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const listRef = useRef(null);
  const socketRef = useRef(null);

  function handleSubmit(e) {
    e.preventDefault();
    if (!socketRef.current) throw Error("There's no socket!");
    const socket = socketRef.current;
    const body = text.trim();
    if (body === '') {
      return;
    }
    socket.send({
      body
    });
    setText('');
  }

  useEffect(() => {
    const socket = connectChatServer();
    socketRef.current = socket;

    function scrollToLastMessage() {
      const lastChild = listRef.current.lastElementChild;
      lastChild.scrollIntoView({
        block: 'end',
        inline: 'nearest',
        behavior: 'smooth'
      });
    }

    socket.onAny((type, message) => {
      if (type === 'chat-message') {
        flushSync(() => {
          setMessages(m => [
            ...m,
            {
              body: message.body,
              user: message.user,
              time: message.time
            }
          ]);
        });
        scrollToLastMessage();
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

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
        <div className="row justify-content-center">
          <div className="col-12 col-sm-12 col-md-8 col-lg-8 col-xl-6">
            <div className="card" style={{ backgroundColor: '#000' }}>
              <div className="card-body" style={{ color: '#FFF' }}>
                <div className="card-title">Number of people in chat room:</div>
                <hr style={{ backgroundColor: '#FFF' }} />
                <div id="messages" className="overflow-auto chat-container">
                  <ul ref={listRef} style={{ listStyleType: 'none' }}>
                    {messages.map((message, idx) => (
                        <li key={idx}>
                          <small><span style={{ color: 'lightgrey' }}>{message.time}</span></small>
                          <em><span style={{ color: 'darkred' }}>{message.user}:</span></em>
                          {message.body}
                        </li>
                    ))}
                  </ul>
                </div>
                <form onSubmit={handleSubmit}>
                  <input
                    className="form-control chat-message"
                    value={text}
                    onChange={e => setText(e.target.value)}
                  />
                  <br />
                  <button className="btn btn-primary form-control bg-blue-200" type="submit">
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
  </React.Fragment>
  );
}

/*
class ChatRoom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: this.props.profile.username,
      message: '',
      chat: [],
      users: {},
      population: 0,
      announcement: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.getMessages = this.getMessages.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
  }

  componentDidMount() {
    const { username } = this.props.profile;
    // eslint-disable-next-line no-console
    console.log('Username:', username);
    socket.emit('User connected', {
      username
    });
    socket.on('Announcement', data => {
      this.setState({
        username: data.username,
        population: data.population,
        announcement: data.announcement
      });
    });
  }

  async getMessages() {
    try {
      const response = await fetch('/api/chat');
      const messages = await response.json();
      this.setState({
        messages
      });
    } catch (error) {
      console.error(error.message);
    }
  }

  sendMessage(event) {
    event.preventDefault();
    const current = moment().format('h:mm:ss A');
    socket.emit('Send message', {
      time: current,
      username: this.state.username,
      message: this.state.message
    });
    const entry = { time: current, username: this.state.username, message: this.state.message };
    this.setState({
      chat: [...this.state.chat, entry],
      message: ''
    }, () => this.updateScroll());
  }

  updateScroll() {
    const messages = document.getElementById('messages');
    messages.scrollTop = messages.scrollHeight;
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  }

  render() {
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
          <div className="row justify-content-center">
            <div className="col-12 col-sm-12 col-md-8 col-lg-8 col-xl-6">
              <div className="card" style={{ backgroundColor: '#000' }}>
                <div className="card-body" style={{ color: '#FFF' }}>
                  <div className="card-title">Number of people in chat room: {this.state.population}</div>
                  <hr style={{ backgroundColor: '#FFF' }} />
                  <div id="messages" className="overflow-auto chat-container">
                    <ul style={{ listStyleType: 'none' }}>
                      {this.state.chat.map(message => {
                        return (
                          <>
                            <li key={message.time} style={{ color: 'lightgrey' }}>{message.time}</li>
                            <li><em><span style={{ color: 'darkred' }}>{message.username}:</span></em> {message.message}</li>
                          </>
                        );
                      })}
                    </ul>
                  </div>
                  <textarea
                    type="text"
                    placeholder="Message"
                    name="message"
                    value={this.state.message}
                    onChange={this.handleChange}
                    className="form-control chat-message">
                  </textarea>
                  <br />
                  <button onClick={this.sendMessage} className="btn btn-primary form-control">Send</button>
                </div>
              </div>
            </div>
          </div>
        </main>
    </React.Fragment>
    );
  }
}
*/

// export default withRouter(ChatRoom);
