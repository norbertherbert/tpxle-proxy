# tpxle-proxy
'tpxle-proxy' is an API proxy for Actility ThingPark X Location Engine to connect foreign Network Servers (it is also called Operator Interface). For details please study 
[/docs/DX_Location_API_flows_v1.1.pdf](https://github.com/norbertherbert/tpxle-proxy/blob/master/docs/DX_Location_API_flows_v1.1.pdf).

If you want to test this server without installing it on your cloud, visit this [demo server](https://nano-things.net/tpxle-proxy/docs/). Please note that the server under that link is operated in a best effort manner and may not be available all the time.
1. Configure your devices with the online [Abeeway device configurator](https://nano-things.net/abeeway-demo) tool.
1. Set up you network server so that it forwards uplink messages to the appropriate API endpoint of the demo server. For example in case of Actility ThingPark Wireles or ThingPark Enterprice SaaS/OCP network servers the API endpoint is https://nano-things.net/tpxle-proxy/latest/api/uplink_actility
1. See the locations of your trackers on the map presented by the basic [demo app](https://nano-things.net/tpxle-proxy/app) of the demo server. The app is a static web page relaying Open Streetmap and Openlayers. You can see and save the source code using your web browser.

### Installation:
* Install and configure dependencies: 
[nodejs](https://nodejs.org/), 
[mongodb](https://docs.mongodb.com/manual/installation/)
* Install the proxy server:
```bash
git clone https://github.com/norbertherbert/tpxle-proxy.git
cd tpxle-proxy
npm install
```
After installation, you should delete the '/node_modules/oas-tools/.git' directory otherwise you always get a '/node_modules/oas-tools/ is a git repository' error message whenever you use the 'mpn install' command. (Don't touch the /.git directory in the root folder!)
### Configuration:
* Edit 
[/config/token_template.js](https://github.com/norbertherbert/tpxle-proxy/blob/master/config/token_template.js)
, add your ThingPark DX API token and save it as '/config/token.js'. 
* Edit
[/config/config.js](https://github.com/norbertherbert/tpxle-proxy/blob/master/config/config.js)
, update the server URLs and save it.
* If you want to collect your logs in the '/logs/server.log' file, edit 
[/config/logger.js](https://github.com/norbertherbert/tpxle-proxy/blob/master/config/logger.js)
, and uncomment the '// new transports.File(options.file),' line.

### Strat the server:
```bash
npm start
```
### Make the server available from the Internet
* Set up a reverse proxy (e.g.: configure your nginx web server) so that the internal port of your app is mapped to a sub-path of your web server. (e.g.: https://your.domain.com/yourpath/tpxle-proxy.
* If you want to test your public API with Swagger-UI, edit the
[/api/oas-doc.yaml](https://github.com/norbertherbert/tpxle-proxy/blob/master/api/oas-doc.yaml) file and add your url to the 'servers' section.
* Read more details on Open API Specification v3 [here](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md) and about the oas-tools nodejs module [here](https://github.com/isa-group/oas-tools).
### Set up uplink routing
* Open the Swagger-UI web page that's URL is printed on the console after the server has been started.
* Note in the swagger documentation that
    * Uplink messages from Actility network server should be forwarded the 'POST /uplink_actility' endpoint.
    * Uplink messages from TTN network server should be forarded to the 'POST /uplink_ttn' endpoint.
    * Uplink messages from Loriot network server should be forwarded to the 'POST /uplink_loriot' endpoint.
* Configure the [Connector Module](https://dx-api.thingpark.com/location-connector/latest/swagger-ui/index.html?shortUrl=tpdx-location-connector-api-contract.json) of ThingPark X Location API so that resolved locations are sent to the 'POST /app_server' endpoint.
### Test the server
* Make your tracker to send a few location updates. (E.g.: Shake the tracker if it is configured for Movement Tracking.)
* Check the logs either in the console or in the '/logs' directory.
* You can also use the 'GET /app_server' endpoint (on Swagger-UI) to query the most recent location messages received from the Location Sorver. 

### Integrate your Network Server:
If the API of your Network Server is different from what is presented by Swagger-UI, you can write your own interface (or modify an existing one) based on an existing interface in the '/controllers' folder. For example the interface for TTN is the following:

[/controllers/interface-ttn.js](https://github.com/norbertherbert/tpxle-proxy/blob/master/controllers/interface-ttn.js)


