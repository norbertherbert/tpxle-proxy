# tpxle-proxy
Actility ThingPark X Location Engine Proxy for foreign Network Servers

For more details please study 
[/docs/DX_Location_API_Integration_V1.0.pdf](https://github.com/norbertherbert/tpxle-proxy/blob/master/docs/DX_Location_API_Integration_v1.0.pdf)

### Installation:
* Install and configure dependencies: 
[nodejs](https://nodejs.org/), 
[mongodb](https://docs.mongodb.com/manual/installation/)
* Use the following commands to install the proxy server
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
