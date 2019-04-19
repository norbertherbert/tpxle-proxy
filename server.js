
const CONFIG = require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');

// The code that describes the proxy between NS and Location Solver
const proxyNsLs = require('./controllers/proxy_ns_ls');

// The code that describes the Application Server that stores resolved location in DB
const appServer = require('./controllers/app_server');

const app = express();

app.use(bodyParser.json());

// This is just to allow testing if the server is up and running
app.get(CONFIG.server.path, (req, res) => {
    res.json({"message": "Welcome to the TPX Location Engine Proxy application"});
});


// Receives uplink messages from Actility Network Server that
// should be forwarded to Location Solver
app.post(
    `${CONFIG.server.path}/uplink_actility`,
    proxyNsLs.uplinkActility
);

// Receives downlink message from Location Solver that 
// should be transformed and forwarded to Actility Network Server
app.post(
    `${CONFIG.server.path}/downlink_actility`,
    proxyNsLs.downlinkActility
);

// Receives uplink messages from TTN Network Server that
// should be forwarded to Location Solver
app.post(
    `${CONFIG.server.path}/uplink_ttn`,
    proxyNsLs.uplinkTTN
);

// Receives downlink message from Location Solver that 
// should be transformed and forwarded to TTN Network Server
app.post(
    `${CONFIG.server.path}/downlink_ttn`,
    proxyNsLs.downlinkTTN
);

// Receives uplink messages from Loriot Network Server that
// should be forwarded to Location Solver
app.post(
    `${CONFIG.server.path}/uplink_loriot`,
    proxyNsLs.uplinkLoriot
);

// Receives downlink message from Location Solver that 
// should be transformed and forwarded to Loriot Network Server
app.post(
    `${CONFIG.server.path}/downlink_loriot`,
    proxyNsLs.downlinkLoriot
);

// Receives resolved location from Location Solver that 
// should be stored in DB
app.post(
    `${CONFIG.server.path}/app_server`,
    appServer.saveResolvedLocation
);


// Start the server
app.listen(CONFIG.server.port, () => {
    console.log(`Server is listening on port ${CONFIG.server.port}`);
    console.log(
        'App running at http://localhost:' 
        + CONFIG.server.port
        + CONFIG.server.path
    );

});
