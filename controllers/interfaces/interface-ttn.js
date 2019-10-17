
// This function converts messages of the Network Server 
// to the format of the Location Solver

let ns2ls = (body) => {
    let feeds = {
        // deviceEUI: "",                                     // mandatory
        // time: "",
        // coordinates: [],                                   // [longitude, latitude, altitude]
                                                              // used if NS provides resolved coordinates
        solverInput: {
            solverInputType: "FeedInputForGpsSolver",
            // sequenceNumber: 1,                             // LoRaWAN FCntUp
            // port: 1,                                       // LoRaWAN FPort
            // receptionTime: "",
            // SF: 12,                                        // LoRaWAN Spreading Factor
            packets: [
                // {
                    // baseStationId: "0805022D",
                    // antennaId: 0,
                    // antennaCoordinates: [7.0513, 43.6181], // [longitude, latitude, altitude]
                    // antennaHeight: 150,                    // in cm
                    // SNR: 10,                               // in dB
                    // RSSI: -29,                             // in dBm
                    // barometerMeasure: 0,                   // in mB
                    // arrivalSeconds: 1,                     // in seconds
                    // arrivalAdditionalNanos: 7275           // in nanoseconds
                // }
            ]
            // dynamicMotionState: "string",    // ['MOVING', 'STATIC', 'UNKNOWN']
            // temperatureMeasure: 0,           // in Celsius
            // accelerometerMeasures: [],       // measures per axis, i.e. [x, y, z]
            // gyroscopeMeasures: [],           // measures per axis, i.e. [roll, pitch, yaw]
            // barometerMeasure: 0,             // in mBar
            // lastContext: "string"            // Base64 encoded binary solver state
                                                // with the last calculated position
        },
        payload: {
            deviceProfileId: "ABEEWAY/MICRO",   // Currently only Abeeway Microtracker and
                                                // Industrial Tracker are supported. "deviceProfileId"
                                                // should be set to "ABEEWAY/MICRO" for both
            payloadEncoded: ""
        }
    }

    if ('hardware_serial' in body) { 
        feeds.deviceEUI = body.hardware_serial; 
    }
    else { 
        return undefined; 
    }

    if ( ('metadata' in body) && ('time' in body.metadata) ) { 
        feeds.time = body.metadata.time;
    }

    if ('counter' in body) { 
        feeds.solverInput.sequenceNumber = body.counter; 
    }
    if ('port' in body) { 
        feeds.solverInput.port = body.port 
    }

    if ('metadata' in body) {
        if ('time' in body.metadata) { 
            feeds.solverInput.receptionTime = body.metadata.time; 
        }
        if ('data_rate' in body.metadata) { 
            feeds.solverInput.SF = parseInt(body.metadata.data_rate.substring(2,4)); // SF7BW125
        }
        if ( ('gateways' in body.metadata) && Array.isArray(body.metadata.gateways) ) {
            let gateways = body.metadata.gateways;
            let packet;
            for (let i=0; i<gateways.length; i++) {
                packet = {};
                if ('gtw_id' in gateways[i]) { 
                    packet.baseStationId = gateways[i].gtw_id; 
                } 
                if ('snr'    in gateways[i]) { 
                    packet.SNR = gateways[i].snr; 
                }
                if ('rssi'   in gateways[i]) { 
                    packet.RSSI = gateways[i].rssi; 
                }
                if ( 
                    ('longitude' in gateways[i]) && 
                    ('latitude' in gateways[i]) 
                ) {
                    packet.antennaCoordinates = [ 
                        gateways[i].longitude,
                        gateways[i].latitude
                    ];
                    if ('altitude' in gateways[i]) {
                        packet.antennaCoordinates.push(gateways[i].altitude);
                    }
                }
                feeds.solverInput.packets.push(packet);
            }
        }
    }

    if ('payload_raw' in body) { 
        feeds.payload.payloadEncoded = Buffer.from(body.payload_raw, 'base64').toString('hex') 
    }

    return feeds;

}

// This function converts messages of the Location Solver to
// the format of the Network Server

let ls2ns = (body) => {
    // Operator Interface for downlink packets is not implemented yet
    return undefined;
}

module.exports = {
    ns2ls: ns2ls,
    ls2ns: ls2ns,
}
