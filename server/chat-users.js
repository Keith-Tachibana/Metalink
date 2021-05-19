const getUser = (id, users) => {
  const user = users.find(user => user.id === id);
  return user;
};

module.exports = getUser;
