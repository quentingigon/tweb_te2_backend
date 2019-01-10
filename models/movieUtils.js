const MovieSchema = require('./movie')

function findAllMoviesWithPagination(page, perPage) {
  return MovieSchema.MovieModel.find()
    .skip((perPage * page) - perPage)
    .limit(perPage)
    .exec()
}

module.exports = {
  findAllMoviesWithPagination,
}