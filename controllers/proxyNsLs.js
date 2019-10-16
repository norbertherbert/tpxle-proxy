const https = require("https");
const appRoot = require('app-root-path');

const logger = require(`${appRoot}/config/logger`);
const CONFIG = require(`${appRoot}/config/config`);

const interfaceActility = require('./interface-actility');
const interfaceTTN = require('./interface-ttn');
const interfaceLoriot = require('./interface-loriot');
const interfaceKerlink = require('./interface-kerlink');

module.exports.uplinkActility = function uplinkActility (req, res, next) {
    let forwardBody = interfaceActility.ns2ls(req.body);
    forward(res, forwardBody, CONFIG.lsFeeds);
}
module.exports.downlinkActility = function downlinkActility (req, res, next) {
    let forwardBody = interfaceActility.ls2ns(req.body);
    forward(res, forwardBody, CONFIG.nsActility);
}

module.exports.uplinkTTN = function uplinkTTN (req, res, next) {
    let forwardBody = interfaceTTN.ns2ls(req.body);
    forward(res, forwardBody, CONFIG.lsFeeds);
}
module.exports.downlinkTTN = function downlinkTTN (req, res, next) {
    let forwardBody = interfaceTTN.ls2ns(req.body);
    forward(res, forwardBody, CONFIG.nsTTN);
}

module.exports.uplinkLoriot = function uplinkLoriot (req, res, next) {
    let forwardBody = interfaceLoriot.ns2ls(req.body);
    forward(res, forwardBody, CONFIG.lsFeeds);
}
module.exports.downlinkLoriot = function downlinkLoriot (req, res, next) {
    let forwardBody = interfaceLoriot.ls2ns(req.body);
    forward(res, forwardBody, CONFIG.nsLoriot);
}

module.exports.uplinkKerlink = function uplinkKerlink (req, res, next) {
    let forwardBody = interfaceKerlink.ns2ls(req.body);
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
