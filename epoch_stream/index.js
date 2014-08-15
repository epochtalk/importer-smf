var path = require('path');

module.exports = {
  createBoardStream: require(path.join(__dirname, 'board-stream')),
  createThreadStream: require(path.join(__dirname, 'thread-stream')),
  createPostStream: require(path.join(__dirname, 'post-stream'))
}
