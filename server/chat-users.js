const users = [];

const addUser = (id, username) => {
  const user = { id, username };
  users.push(user);
  return { user };
};

const getUser = id => {
  const user = users.find(user => user.id === id);
  return user;
};

const deleteUser = id => {
  const index = users.findIndex(user => user.id === id);
  if (index === -1) return;
  return users.splice(index, 1)[0];
};

module.exports = { addUser, getUser, deleteUser };
