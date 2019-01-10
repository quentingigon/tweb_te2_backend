const mongoose = require('mongoose')

const Schema = mongoose.Schema

const user = new Schema({
  username: String,
  password: String,
  email: String,
  watchlist: [{ type: Schema.Types.ObjectId, ref: 'movies' }]
})

module.exports = mongoose.model('users', user)