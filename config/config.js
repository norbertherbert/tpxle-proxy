// ThingPark DX API Token.
// Please create a TOKEN.js file in the /config folder based on the 
// TOKEN_template.js file so that you can import it here!!!
const TOKEN = require('./token.js');

// Exported CONFIG
const CONFIG = {
	// this server
	server: {
		host: 'localhost',
		port: 8086,
		path: '/tpxle-proxy'
	},
	// database server
	db: {
		host: 'localhost',
		port: 27017,
		dbUrl: 'mongodb://localhost:27017',
		dbName: 'tpxle-proxy',
		dbOptions: { 
			useNewUrlParser: true,
			useUnifiedTopology: true,
		}
	},
	// ThingPark Location Solver - /feeds API
	lsFeeds: {
		host: 'dx-api.thingpark.com',
		path: '/location/latest/api/feeds',
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': 'Bearer ' + TOKEN,
		}
	},
	// Actility network server - downlink API
	nsActility: {
		host: 'api-dev1.thingpark.com',
		path: '/thingpark/lrc/rest/downlink',
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		}
	},
	// TTN network server - downlink API
	nsTTN: {
		host: 'webhook.site',
		path: '/9ede0aac-6db2-4b8c-b217-72ccebf10824',
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		}
	},
	// Loriot Network Server - downlink API
	nsLoriot: {
		host: 'webhook.site',
		path: '/9ede0aac-6db2-4b8c-b217-72ccebf10824',
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		}
	},
}

module.exports = CONFIG;