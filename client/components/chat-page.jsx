
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import moment from 'moment';
import io from 'socket.io-client';

const socket = io.connect('http://localhost:4001');

class ChatPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: this.props.profile.username,
      message: '',
      chat: [],
      population: 0
    };
    // this.timerID = null;
    this.handleChange = this.handleChange.bind(this);
    this.getMessages = this.getMessages.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
  }

  componentDidMount() {
    socket.on('message', ({ id, username, msg }) => {
      this.setState({
        chat: [...this.state.chat, { id, username, msg }]
      });
    });
  }

  /*  componentDidUpdate() {
    this.scrollChatToBottom();

    if (prevState.messages.length !== this.state.messages.length) {
      this.getMessages();
    }
  }

  componentWillUnmount() {

    clearInterval(this.timerID);
    socket.close();
    this.props.unregisterHandler();
  }
*/
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

  renderChat() {
    const { chat } = this.state;
    return (
      chat.map(({ username, msg }, idx) => (
        <div key={idx}>
          <span style={{ color: 'green' }}>{username}: </span>

          <span>{msg}</span>
        </div>
      ))
    );
  }

  sendMessage(event) {
    event.preventDefault();
    socket.emit('message', {
      username: this.state.username,
      message: this.state.message,
      time: moment().format('h:mm:ss A')
    });
    this.setState({
      message: ''
    });
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
                    <div>{this.renderChat()}</div>
                  <div>
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
        </div>
      </main>
    </React.Fragment>
    );
  }
}

export default withRouter(ChatPage);
