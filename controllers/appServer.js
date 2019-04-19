const mc = require('mongodb').MongoClient;
const assert = require('assert');

const CONFIG = require('../config/config');
const dbCollName = 'loc_history';

module.exports.saveResolvedLocation = function saveResolvedLocation (req, res, next) {
    mc.connect(CONFIG.db.dbUrl, CONFIG.db.dbOptions, function(err, client) {
        if (err) {
            res.status(500).send({message: {text: 'MongoDB Error: ' + err.message, code:500}});
            return;
        }
        client.db(CONFIG.db.dbName).collection(dbCollName).insertOne(req.body, function(result) {
            assert.equal(err, null);

            res.status(200).send({message: {text: 'RESOLVED LOCATION RECEIVED AND SAVED BY THE AS', code: 200}});
            client.close();

            console.log('RESOLVED LOCATION RECEIVED AND SAVED BY THE AS:');
            console.log(req.body);

        })
    });
}
