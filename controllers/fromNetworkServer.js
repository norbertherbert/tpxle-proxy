const mc = require('mongodb').MongoClient;
const https = require("https");
const appRoot = require('app-root-path');

// const createUPDU = require('abeeway-driver').createUPDU;
const { createUPDU } = require('abeeway-driver');

const logger = require(`${appRoot}/config/logger`);
const CONFIG = require(`${appRoot}/config/config`);
const dbCollName = 'loc_history_local';

const interfaceActility = require('./interfaces/interface-actility');
const interfaceTTN = require('./interfaces/interface-ttn');
const interfaceLoriot = require('./interfaces/interface-loriot');
const interfaceKerlink = require('./interfaces/interface-kerlink');

module.exports.uplinkActility = function uplinkActility (req, res, next) {
    let forwardBody = interfaceActility.ns2ls(req.body);
    localDecodeAndSave(forwardBody);
    forward(res, forwardBody, CONFIG.lsFeeds);
}
module.exports.downlinkActility = function downlinkActility (req, res, next) {
    let forwardBody = interfaceActility.ls2ns(req.body);
    forward(res, forwardBody, CONFIG.nsActility);
}

module.exports.uplinkTTN = function uplinkTTN (req, res, next) {
    let forwardBody = interfaceTTN.ns2ls(req.body);
    localDecodeAndSave(forwardBody);
    forward(res, forwardBody, CONFIG.lsFeeds);
}
module.exports.downlinkTTN = function downlinkTTN (req, res, next) {
    let forwardBody = interfaceTTN.ls2ns(req.body);
    forward(res, forwardBody, CONFIG.nsTTN);
}

module.exports.uplinkLoriot = function uplinkLoriot (req, res, next) {
    let forwardBody = interfaceLoriot.ns2ls(req.body);
    localDecodeAndSave(forwardBody);
    forward(res, forwardBody, CONFIG.lsFeeds);
}
module.exports.downlinkLoriot = function downlinkLoriot (req, res, next) {
    let forwardBody = interfaceLoriot.ls2ns(req.body);
    forward(res, forwardBody, CONFIG.nsLoriot);
}

module.exports.uplinkKerlink = function uplinkKerlink (req, res, next) {
    let forwardBody = interfaceKerlink.ns2ls(req.body);
    localDecodeAndSave(forwardBody);
    forward(res, forwardBody, CONFIG.lsFeeds);
}
module.exports.downlinkKerlink = function downlinkKerlink (req, res, next) {
    let forwardBody = interfaceKerlink.ls2ns(req.body);
    forward(res, forwardBody, CONFIG.nsTTN);
}

function forward (res, forwardBody, forwardOptions) {
    if (!forwardBody) {
        res.status(400).send({message: {text: 'The message received from the NS cannot be transformed for the Loc Solver.', code: 400}});
        logger.error(`The message received from the NS cannot be transformed for the Loc Solver.`);
        return;
    }
    let forwardReq = https.request(forwardOptions, function (forwardRes) {
        let forwardResString = '';
        forwardRes.on('data', function (data) {
            forwardResString += data;
        });
        forwardRes.on('end', () => {
            res.status(200).send({message: {text:'RESPONSE RECEIVED FROM FORWARD DESTINATION.', code: 200}});

            logger.info('RESPONSE RECEIVED FROM FORWARD DESTINATION');
            logger.info('RESPONSE STATUS CODE: ' + forwardRes.statusCode);
            logger.debug(forwardResString);

        });
    });
    forwardReq.on('error', (err) => {
        res.status(200).send({message: {text: `There was a problem with the forwardedRequest: ${err.message}`, code: 200}});
        logger.error(`There was a problem with the forwardedRequest: ${err.message}`);
    });
    let forwardBodyJSON = JSON.stringify(forwardBody, null, 4);
    forwardReq.write(forwardBodyJSON);
    forwardReq.end();

    logger.info('REQUEST SENT TO FORWARD DESTINATION');
    logger.debug(forwardBodyJSON);

}

function localDecodeAndSave (forwardBody) {

    if ((!forwardBody) || (forwardBody.payload.payloadEncoded === '')) {
        return;
    }

    let dbDocument = {
        devEUI: forwardBody.deviceEUI,
        fPort: ('port' in forwardBody.solverInput) ? forwardBody.solverInput.port : '',
        time: ('receptionTime' in forwardBody.solverInput) ? forwardBody.solverInput.receptionTime : '',
        payloadHex: forwardBody.payload.payloadEncoded,
    };
    try {
        let pdu = createUPDU(forwardBody.payload.payloadEncoded);
        dbDocument.payloadDecoded = pdu.toComponents();
    }
    catch(err) {
        logger.error(`Abeeway Local CODEC Error: ${err.message}`);
        dbDocument.decodingError = err.message;
    }

    mc.connect(CONFIG.db.dbUrl, CONFIG.db.dbOptions, function(err, client) {
        if (err) {
            logger.error(`MongoError: ${err.message}`);
            return;
        }
        client.db(CONFIG.db.dbName).collection(dbCollName).insertOne(dbDocument, function(err, result) {
            if (err) {
                logger.error(`MongoError: ${err.message}`);
                return;
            }
            client.close();
            logger.info('UPLINK MESSAGE RECEIVED, LOCALLY DECODED AND SAVED BY THE AS');
            logger.debug(JSON.stringify(dbDocument,null,4));
        })
    });

}

module.exports.listDecodedMessages = function listDecodedMessages (req, res, next) {
    mc.connect(CONFIG.db.dbUrl, CONFIG.db.dbOptions, function(err, client) {
        if (err) {
            res.status(500).send({message: {text: `MongoError: ${err.message}`, code:500}});
            logger.error(`MongoError: ${err.message}`);
            return;
        }

        let filter = {};
        if ('devEUI' in req.query) { filter.devEUI = req.query.devEUI; }
        
        client.db(CONFIG.db.dbName)
        .collection(dbCollName)
        .find(filter)
        .sort({$natural: -1})
        .limit(100)
        .toArray( (err, result) => {
            if (err) {
                res.status(500).send({message: {text: `MongoError: ${err.message}`, code:500}});
                logger.error(`MongoError: ${err.message}`);
                return;
            }
            res.status(200).send(result);
            client.close();

            logger.info('LOCALLY DECODED LOCATION LIST RETREIVED FROM DB');
            // logger.debug(JSON.stringify(result));

        })

    });
}
