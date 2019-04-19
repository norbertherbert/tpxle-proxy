const https = require("https");

const CONFIG = require('../config/config');

const interfaceActility = require('./interface-actility');
const interfaceTTN = require('./interface-ttn');
const interfaceLoriot = require('./interface-loriot');

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

function forward (res, forwardBody, forwardOptions) {
    if (!forwardBody) {
        res.status(400).send({message: {text: 'The message received from the NS cannot be transformed for the Loc Solver.', code: 400}});
        console.log(`The message received from the NS cannot be transformed for the Loc Solver.`);
        return;
    }
    let forwardReq = https.request(forwardOptions, function (forwardRes) {
        let forwardResString = '';
        forwardRes.on('data', function (data) {
            forwardResString += data;
        });
        forwardRes.on('end', () => {

            console.log();
            console.log('RESPONSE RECEIVED FROM FORWARD DESTINATION:');
            console.log('RESPONSE STATUS CODE: ' + forwardRes.statusCode);
            console.log(forwardResString);
            console.log();
        
            res.status(200).send({message: {text:'RESPONSE RECEIVED FROM FORWARD DESTINATION.', code: 200}});

        });
    });
    forwardReq.on('error', (err) => {
        console.error(`There was a problem with the forwardedRequest: ${err.message}`);
        res.status(200).send({message: {text: `There was a problem with the forwardedRequest: ${err.message}`, code: 200}});
    });
    let forwardBodyJSON = JSON.stringify(forwardBody, null, 4);
    forwardReq.write(forwardBodyJSON);
    forwardReq.end();

    console.log();
    console.log('REQUEST SENT TO FORWARD DESTINATION:');
    console.log(forwardBodyJSON);
    console.log();

}
