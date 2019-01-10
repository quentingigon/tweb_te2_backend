const mongoose = require('mongoose')

const Schema  = mongoose.Schema

const UserSchema = new Schema({
  username: String,
  password: String,
  email: String,
  watchlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'movies' }]
})

module.exports.UserModel = mongoose.model('users', UserSchema)