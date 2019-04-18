// Function that converts messages of the Network Server to the format of the Location Solver
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

    if ('DevEUI_uplink' in body) {
        body = body.DevEUI_uplink;
    } else {
        return undefined;
    }

    if ('DevEUI' in body) { 
        feeds.deviceEUI = body.DevEUI; 
    }
    else { 
        return undefined; 
    }

    if ('Time' in body) { 
        feeds.time = body.Time;   
    }

    if ('FCntUp' in body) { 
        feeds.solverInput.sequenceNumber = body.FCntUp; 
    }
    if ('FPort' in body) { 
        feeds.solverInput.port = body.FPort; 
    }
    if ('Time' in body) { 
        feeds.solverInput.receptionTime = body.Time; 
    }
    if ('SpFact' in body) { 
        feeds.solverInput.SF = body.SpFact; 
    }

    if ( 
        ('Lrrs' in body) && 
        ('Lrr' in body.Lrrs) && 
        Array.isArray(body.Lrrs.Lrr) 
    ) { 
        let lrr = body.Lrrs.Lrr;
        let packet;
        for (let i=0; i<lrr.length; i++) {
            packet = {};
            if ('Lrrid' in lrr[i]) { 
                packet.baseStationId = lrr[i].Lrrid; 
            } 
            if ('LrrSNR' in lrr[i]) { 
                packet.SNR = lrr[i].LrrSNR; 
            }
            if ('LrrRSSI' in lrr[i]) { 
                packet.RSSI = lrr[i].LrrRSSI; 
            }
            if ( ('LrrLAT' in lrr[i]) && ('LrrLON' in lrr[i]) ) {
                packet.antennaCoordinates = [
                    lrr[i].LrrLAT, 
                    lrr[i].LrrLON
                ]; 
            } else if (
                ('Lrrid' in body ) &&
                (body.Lrrid === lrr[i].Lrrid) &&
                ('LrrLAT' in body) && 
                ('LrrLON' in body) 
            ) {
                packet.antennaCoordinates = [
                    body.LrrLAT, 
                    body.LrrLON
                ];
            }
            feeds.solverInput.packets.push(packet);
        }
    }

    if ('payload_hex' in body) { 
        feeds.payload.payloadEncoded = body.payload_hex; 
    }

    return feeds;

}

// Function that converts messages of the Location Solver to the format of the Network Server
let ls2ns = (body) => {
    // Operator Interface for downlink packets is not implemented yet
    return undefined;
}

module.exports = {
    ns2ls: ns2ls,
    ls2ns: ls2ns,
}
