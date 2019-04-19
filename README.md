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
### Configuration:
* Edit 
[/config/token_template.js](https://github.com/norbertherbert/tpxle-proxy/blob/master/config/token_template.js)
, add your ThingPark DX API token and save it as /config/token.js 
* Edit
[/config/config.js](https://github.com/norbertherbert/tpxle-proxy/blob/master/config/config.js)
, update the server URLs and save it.

### Strat the server:
```bash
node server.js
```
or if you want to test and see the API Docs with swagger-ui (according to Open API Specification v3):
```bash
node serverOAS.js
```
