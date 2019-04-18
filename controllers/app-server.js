const mc = require('mongodb').MongoClient;
const assert = require('assert');

const CONFIG = require('../config');
const dbCollName = 'loc_history';

module.exports.saveResolvedLocation = function lsResolvedLocation (req, res, next) {
    mc.connect(CONFIG.db.dbUrl, CONFIG.db.dbOptions, function(err, client) {
        if (err) {
            res.status(500).end('Internal Server Error: ' + err.message);
            return;
        }
        client.db(CONFIG.db.dbName).collection(dbCollName).insertOne(req.body, function(result) {
            assert.equal(err, null);
            res.sendStatus(200);
            client.close();

            console.log('RESOLVED LOCATION RECEIVED AND SAVED BY THE AS:');
            console.log(req.body);

        })
    });
}
