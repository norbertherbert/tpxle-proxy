const mc = require('mongodb').MongoClient;
const assert = require('assert');
const appRoot = require('app-root-path');

const logger = require(`${appRoot}/config/logger`);
const CONFIG = require(`${appRoot}/config/config`);
const dbCollName = 'loc_history';

module.exports.saveResolvedLocation = function saveResolvedLocation (req, res, next) {
    mc.connect(CONFIG.db.dbUrl, CONFIG.db.dbOptions, function(err, client) {
        if (err) {
            res.status(500).send({message: {text: `MongoError: ${err.message}`, code:500}});
            logger.error(`MongoError: ${err.message}`);
            return;
        }
        client.db(CONFIG.db.dbName).collection(dbCollName).insertOne(req.body, function(result) {
            assert.equal(err, null);

            res.status(200).send({message: {text: 'RESOLVED LOCATION RECEIVED AND SAVED BY THE AS', code: 200}});
            client.close();

            logger.info('RESOLVED LOCATION RECEIVED AND SAVED BY THE AS');
            logger.debug(JSON.stringify(req.body,null,4));

        })
    });
}
