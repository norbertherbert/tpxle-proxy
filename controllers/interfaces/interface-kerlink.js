
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

    if ('endDevice' in body) { 
        if ('devEui' in body.endDevice) {
            feeds.deviceEUI = body.endDevice.devEui;
        }
    }
    else { 
        return undefined; 
    }

    if (('recvTime' in body) && (typeof body.recvTime === 'number')) { 
        let t = (new Date(body.recvTime)).toISOString();
        feeds.time = t;
        feeds.solverInput.receptionTime = t;
    }
    if ('fCntUp' in body) { 
        feeds.solverInput.sequenceNumber = body.fCntUp; 
    }
    if ('fPort' in body) { 
        feeds.solverInput.port = body.fPort 
    }
    if ('dataRate' in body) {
        let i = body.dataRate.indexOf('BW');
        let s = body.dataRate.substring(2, i);
        feeds.solverInput.SF = parseInt(s);
    } 

    if ('gwInfo' in body) {
        for (let gateway of body.gwInfo) {
            let packet = {};
            if ('gwEui' in gateway) {
                packet.baseStationId = gateway.gwEui;
            }
            if ('rssi' in gateway) {
                packet.RSSI = gateway.rssi;
            }
            if ('snr' in gateway) {
                packet.SNR = gateway.snr;
            }
            if ('radioId' in gateway) {
                packet.antennaId = gateway.radioId;
            }
            feeds.solverInput.packets.push(packet);
        }
    }

    if ('payload' in body) { 
        feeds.payload.payloadEncoded = body.payload; 
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
