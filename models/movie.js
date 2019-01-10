const mongoose = require('mongoose')

const  {Schema}  = mongoose

const Movie = new Schema({
  vote_count: Boolean,
  vote_average: Number,
  title: String,
  popularity: Number,
  poster_path: String,
  original_language: String,
  original_title: String,
  backdrop_path: String,
  adult: Boolean,
  overview: String,
  release_date: String,
  tmdb_id: Number,
  genres: [String]
})

module.exports = mongoose.model('movies', Movie)