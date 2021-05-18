const users = [];

const addUser = (id, roomName, username) => {
  const existingUser = users.find(user => {
    return (user.roomName === roomName && user.username === username);
  });

  if (!username || !roomName) return { error: 'Username and room are required.' };
  if (existingUser) return { error: 'Username is already taken.' };
  const user = { id, username, roomName };
  users.push(user);
  return { user };
};

const getUser = id => {
  const user = users.find(user => user.id === id);
  return user;
};

const getUsersInRoom = roomName => users.filter(user => user.roomName === roomName);

const deleteUser = id => {
  const index = users.findIndex(user => user.id === id);
  if (index === -1) return;
  return users.splice(index, 1)[0];
};

module.exports = { addUser, getUser, getUsersInRoom, deleteUser };
