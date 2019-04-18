// ThingPark DX API token
const TOKEN = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzY29wZSI6WyJTVUJTQ1JJQkVSOjI2NTkiXSwiZXhwIjozNjQ4NjQ1MjE1LCJqdGkiOiIzMmMzNzIzNS0xY2ViLTQwMWQtYTEwYy01NTJhY2YwMzMzZTQiLCJjbGllbnRfaWQiOiJwb2MtYXBpL25vcmJlcnQuaGVyYmVydCtzdWJAYWN0aWxpdHkuY29tIn0.awbwX-TuyDzDQbJZnOXUtpClzY2lMgou5eYY81EzAfxDeAZ7h2gR00lC-HTkAU6Z6-uZzB-Xh7oGxxIoRBIoaA';

// Exported CONFIG
const CONFIG = {
	// this server
	server: {
		host: 'localhost',
		port: 8086,
		path: '/tpls-proxy'
	},
	// database server
	db: {
		host: 'localhost',
		port: 27017,
		dbUrl: 'mongodb://localhost:27017',
		dbName: 'tpxle-proxy',
		dbOptions: { 
			useNewUrlParser: true 
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