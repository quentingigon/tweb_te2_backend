const conf = {
	db: {
		port: '15854',
		host: process.env.NODE_ENV === 'production' ? process.env.MONGODB_ENDPOINT_URL : 's115854.mlab.com',
		name: 'tweb_te2',
		usr: 'admin',
		pwd: 'password1',
		reconnectTries: 10,
		reconnectInterval: 500
	},
  secret: 'greenappletreeleafs',
  apikey: 'f1be4bafe6f7cb0cb84f5948c5b75497'
}
conf.db.url = `mongodb://${conf.db.usr}:${conf.db.pwd}@ds115854.mlab.com:15854/${conf.db.name}`

// conf.db.url = `mongodb+srv://example:vLLv9md5L9spb80K@ga-demo-bcqlk.mongodb.net/movies-explorer?retryWrites=true`

exports.default = conf