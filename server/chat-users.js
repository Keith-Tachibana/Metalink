const users = [];

const addUser = (id, room, username) => {
  const existingUser = users.find(user => {
    return (user.room === room && user.username === username);
  });

  if (!username || !room) return { error: 'Username and room are required.' };
  if (existingUser) return { error: 'Username is already taken.' };
  const user = { id, username, room };
  users.push(user);
  return { user };
};

const getUser = id => {
  const user = users.find(user => user.id === id);
  return user;
};

const getUsersInRoom = room => users.filter(user => user.room === room);

const deleteUser = id => {
  const index = users.findIndex(user => user.id === id);
  if (index === -1) return;
  return users.splice(index, 1)[0];
};

module.exports = { addUser, getUser, getUsersInRoom, deleteUser };
