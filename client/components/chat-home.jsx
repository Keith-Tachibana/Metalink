import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

class ChatHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roomName: '',
      successful: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  }

  handleSubmit(event, props) {
    event.preventDefault();
    const { createRoom } = this.props;
    const result = createRoom(this.state.roomName);
    if (!result.successful) {
      this.setState({
        successful: false
      });
    } else {
      this.setState({
        successful: true
      });
      history.push(`/chat/rooms/${this.state.roomName}`);
    }
  }

  render() {
    return (
      <React.Fragment>
        <header className="container-fluid">
          <div className="row">
            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <h1 className="text-center mt-4">Chat: Create Room</h1>
            </div>
          </div>
        </header>
        <main className="container-fluid mb-4">
          <div className="row justify-content-center">
            <div className="col-12 col-sm-12 col-md-8 col-lg-8 col-xl-6">
              <label htmlFor="roomName">Enter Room Name</label>
              <input id="roomName" className="form-control" type="text" name="roomName" onChange={this.handleChange} value={this.state.roomName} />
              <button type="submit" name="submit" className="btn btn-primary btn-sm" onClick={this.handleSubmit}>Submit</button>
              <div className="row d-flex justify-content-center">
                {!this.state.successful
                  ? (<h6 className="text-center text-danger">That room name has already been taken. Please try again.</h6>)
                  : (<h6 className="text-center text-success">Room created successfully!</h6>)
                }
              </div>
            </div>
          </div>
        </main>
      </React.Fragment>
    );
  }
}

export default withRouter(ChatHome);
