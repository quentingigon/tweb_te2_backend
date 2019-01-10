const UserSchema = require('./user')

function addMovieToWatchList(username, movie) {
  const user = UserSchema.UserModel.find({ username })
  let watchlist = user.watchlist + movieId
  user.update({ username }, {
    watchlist,
  }, (err, raw) => {
    if (err) console.log('Error: ', err)
      console.log('Dev was updated')
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