var path = require('path');

module.exports = {
  createUserStream: require(path.join(__dirname, 'user-stream')),
  createBoardStream: require(path.join(__dirname, 'board-stream')),
  createThreadStream: require(path.join(__dirname, 'thread-stream')),
  createPostStream: require(path.join(__dirname, 'post-stream'))
};
