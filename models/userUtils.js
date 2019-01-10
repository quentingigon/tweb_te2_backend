const UserSchema = require('./user')

function addMovieToWatchList(username, movie) {
  const user = UserSchema.UserModel.find({ username })
  let watchlist = user.watchlist + movie
  user.update({ username }, {
    watchlist,
  })
}

function getUserWatchList(username) {
  const user = UserSchema.UserModel.find({ username })
  return user.watchlist
}

module.exports = {
  getUserWatchList,
  addMovieToWatchList
}