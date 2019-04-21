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

module.exports.listResolvedLocations = function listResolvedLocations (req, res, next) {
    console.log(req.query);
    mc.connect(CONFIG.db.dbUrl, CONFIG.db.dbOptions, function(err, client) {
        if (err) {
            res.status(500).send({message: {text: `MongoError: ${err.message}`, code:500}});
            logger.error(`MongoError: ${err.message}`);
            return;
        }

        const filter = req.query;
        client.db(CONFIG.db.dbName).collection(dbCollName).find(filter).sort({natural: -1}).limit(25).toArray( (err, result) => {
            if (err) {
                res.status(500).send({message: {text: `MongoError: ${err.message}`, code:500}});
                logger.error(`MongoError: ${err.message}`);
                return;
            }
            res.status(200).send(result);
            client.close();

            logger.info('RESOLVED LOCATION LIST RETREIVED FROM DB');
            // logger.debug(JSON.stringify(result));

        })

    });
}
