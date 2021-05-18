const uuid = require('uuid');

const messages = [];

function addMessage(roomName, message) {
  const msg = {
    id: uuid.v4(),
    roomName,
    ...message
  };
  messages.push(msg);
  return msg;
}

function deleteMessage(id) {
  const index = messages.findIndex(message => message.id === id);
  if (index !== -1) {
    return (
      messages.splice(index, 1)[0]
    );
  }
}

function getMessage(id) {
  messages.find(message => message.id === id);
}

function getMessagesInRoom(room) {
  messages.filter(message => message.roomName === roomName);
}

module.exports.addMessage = addMessage;
module.exports.deletedMessage = deleteMessage;
module.exports.getMessage = getMessage;
module.exports.getMessagesInRoom = getMessagesInRoom;
