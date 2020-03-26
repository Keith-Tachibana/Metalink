import React from 'react';

class Posts extends React.Component {
  renderDate() {
    const { datePosted } = this.props;
    const split = datePosted.split('-');
    const splitLast = split[2].split('T');
    const splitTime = splitLast[1].split(':');
    const hour = splitTime[0] < 10 ? splitTime[0].slice(1) : splitTime[0];
    const hourPST = parseInt(hour) - 7;
    const realHour = ((hourPST - 7) < 0) ? (24 + hourPST) : hourPST;
    const hour12 = (parseInt(realHour) > 12) ? (parseInt(realHour) - 12) : parseInt(realHour);
    let realHour12 = hour12 > 12 ? hour12 - 12 : hour12;
    const amPM = (realHour < 12) ? 'AM' : 'PM';
    const time = `${Math.abs(realHour12) === 0 ? realHour12 = 12 : Math.abs(realHour12)}:${splitTime[1]} ${amPM}`;
    const month = split[1] < 10 ? split[1].slice(1) : split[1];
    const postDate = `${month}/${splitLast[0]}/${split[0]} @ ${time}`;
    return postDate;
  }

  render() {
    this.renderDate();
    return (
      <div className="card col-10 mb-2 post-home">
        <div className="card-body post-body" style={{ color: '#FFF' }}>
          <p><span>User: </span>{ this.props.username }</p>
          <p><span>Date: </span>{ this.renderDate() }</p>
          <p><span>Subject: </span>{ this.props.subject }</p>
          <br />
          <p>{ this.props.content }</p>
        </div>
      </div>
    );
  }
}

export default Posts;
