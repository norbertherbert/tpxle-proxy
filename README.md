# tpxle-proxy
'tpxle-proxy' is an API proxy for Actility ThingPark X Location Engine to connect foreign Network Servers (it is also called Operator Interface). For details please study 
[/docs/DX_Location_API_Integration_V1.0.pdf](https://github.com/norbertherbert/tpxle-proxy/blob/master/docs/DX_Location_API_Integration_v1.0.pdf).

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

### Strat the server:
```bash
npm start
```
### Set up uplink routing
* Open the Swagger-UI web page that's URL is printed on the console after the server has been started.
* Note in the swagger documentation that
    * Uplink messages from Actility network server should be forwarded the 'POST /uplink_actility' endpoint.
    * Uplink messages from TTN network server should be forarded to the 'POST /uplink_ttn' endpoint.
    * Uplink messages from Loriot network server should be forwarded to the 'POST /uplink_loriot' endpoint.
* Configure the Connector Module of ThingPark X Location API so that resolved locations are sent to the 'POST /app_server' endpoint. 
### Test the server
* Make your tracker to send a few location updates. (E.g.: Shake the tracker if it is configured for Movement Tracking.)
* Check the logs either in the console or in the '/logs' directory.
* You can also use the 'GET /app_server' endpoint (on Swagger-UI) to query the most recent location messages received from the Location Sorver. 

### Integrate your Network Server:
If the API of your Network Server is different from what is presented by Swagger-UI, you can write your own interface (or modify an existing one) based on an existing interface in the '/controllers' folder. For example the interface for TTN is the following:

[/controllers/interface-ttn.js](https://github.com/norbertherbert/tpxle-proxy/blob/master/controllers/interface-ttn.js)


