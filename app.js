// Imports
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

const conf = require('./conf').default
// Get database models
const User = require('./models/user')
const movieUtils = require('./models/movieUtils')
const userUtils = require('./models/userUtils')

// Useful variables
const app = express()

const corsOptions = {
	origin: '*',
	optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*')
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
	next()
})

app.use(cors(corsOptions))

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const mongoOpt = {
	useNewUrlParser: true,
	reconnectTries: conf.db.reconnectTries,
	reconnectInterval: conf.db.reconnectInterval
}

const mongoUrl = process.env.NODE_ENV === 'production' ? encodeURI(process.env.MONGODB_ENDPOINT_URL) : conf.db.url

// MongoDB connection with retry
const connectWithRetry = () => {
	mongoose.connect(mongoUrl, mongoOpt)
		.then(
			() => {
				console.log('Connected to MongoDB') // eslint-disable-line no-console
			},
			(err) => {
				console.error('Failed to connect to MongoDB', err) // eslint-disable-line no-console
				setTimeout(connectWithRetry, 5000)
			}
		)
}

app.set('secret', conf.secret)

// Connect to MongoDB
connectWithRetry()

/********************************************
 * Unprotected routes
 *******************************************/

 app.get('/', (req, res, next) => {
	res.send('hello world')
 		.catch(next)
 })

/**
* Sign a user up
*/
app.post('/auth/register', (req, res, next) => {
	const username  = req.body.username
	const password = req.body.password
	const email = req.body.email
	User.UserModel.find({ username})
		.then(result => {
			if (result.length === 0) {
				User.UserModel.create({
					username: username,
					email: email,
					password: password
				})
					.then((user) => {
						res.send(user)
					})
			} else {
				const error = new Error('Username already exists')
				error.status = 400
				next(error)
			}
		})
})

/**
* register a user 
*/
app.post('/auth/login', (req, res, next) => {
	const { username, password } = req.body
	User.UserModel.findOne({ username })
		.then((user) => {
			if (password === user.password) {
				const payload = { username }
				const token = jwt.sign(payload, app.get('secret'), {
					expiresIn: 60 * 60 * 24 // expires in 24 hours
				})
				// return the information including token as JSON
				res.status(201).json({
					success: true,
					token,
					user: {
						id: user._id,
						username: user.username,
						email: user.email
					}
				})
			} else {
				throw new Error('Wrong password')
			}
		})
		.catch(next)
})

app.get('/movies', (req, res, next) => {
	// get page in query or it is page 1. with 10 element per page
	return movieUtils.findAllMoviesWithPagination(req.query.page || 1, 10)
		.catch(next)
})

/**
 * Asks for a json web token for all subsequent routes
 */
app.use((req, res, next) => {
	const token = req.body.token || req.query.token || req.headers['x-access-token']

	if (token) {
		jwt.verify(token, app.get('secret'), (err, decoded) => {
			if (err) {
				return res.json({ success: false, message: 'Failed to authenticate token.' })
			}
			req.decoded = decoded
			next()
			return null
		})
	} else {
		return res.status(403).send({
			success: false,
			message: 'No token provided.'
		})
	}
	return null
})

/********************************************
 * Protected routes
 *******************************************/

// get user's watchlist
app.get('/users/:username/watchlist', (req, res, next) => {
	return userUtils.getUserWatchList(req.params.username)
		.catch(next)
})

// add film to user's watchlist
app.post('/users/:username/watchlist', (req, res, next) => {
	const { movie } = req.body
	userUtils.addMovieToWatchList(req.params.username, movie._id)
		.catch(next)
})

// Forward 404 to error handler
app.use((req, res, next) => {
	const error = new Error('Not found')
	error.status = 404
	next(error)
})

// Error handler
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
	console.error(err) // eslint-disable-line no-console
	res.status(err.status || 500)
	res.send(err.message)
})

// Server
const server = app.listen(8081, () => {
	const host = server.address().address
	const port = server.address().port
	console.log('Node server listening at http://%s:%s', host, port) // eslint-disable-line no-console
})