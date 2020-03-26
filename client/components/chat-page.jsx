import React, { Component } from 'react';
import moment from 'moment';
import io from 'socket.io-client';

const socket = io('localhost:3001');

class ChatPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: this.props.profile.username,
      message: '',
      messages: [],
      population: 0
    };
    this.handleChange = this.handleChange.bind(this);
    this.addMessage = this.addMessage.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
  }

  componentDidMount() {
    socket.emit('ADD_USER', this.state.username);
    socket.on('RECEIVE_MESSAGE', data => {
      this.addMessage(data);
    });
    socket.on('USER_CONNECTED', data => {
      socket.emit('SEND_MESSAGE', {
        message: data.username + ' has joined the room.'
      });
      this.setState({
        population: data.population
      });
    });
    socket.on('USER_DISCONNECTED', data => {
      socket.emit('SEND_MESSAGE', {
        message: data.username + ' has left the room.'
      });
      this.setState({
        population: data.population
      });
    });
  }

  componentWillUnmount() {
    socket.close();
  }

  addMessage(data) {
    this.setState({
      messages: [...this.state.messages, data.message]
    });
  }

  sendMessage(event) {
    event.preventDefault();
    socket.emit('SEND_MESSAGE', {
      username: this.state.username,
      message: this.state.message,
      time: moment().format('h:mm:ss A')
    });
    this.setState({
      message: ''
    });
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  }

  render() {
    const { messages } = this.state;
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
            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <div className="card" style={{ backgroundColor: '#000' }}>
                <div className="card-body" style={{ color: '#FFF' }}>
                  <div className="card-title">Number of people in chat room: {this.state.population}</div>
                  <hr style={{ backgroundColor: '#FFF' }} />
                  <div className="messages" style={{ height: '240px', overflow: 'auto' }}>
                    {messages.map((message, index) => {
                      return (
                        <React.Fragment key={index}>
                          <div style={{ color: '#FFF' }}><span className="text-danger">{message.username}</span><span><small><em> {message.time}</em></small></span></div>
                          <div style={{ color: '#FFF' }}>{message.message}</div>
                        </React.Fragment>
                      );
                    })}
                  </div>
                  <div className="footer">
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
          </div>
        </main>
      </React.Fragment>
    );
  }
}

export default ChatPage;