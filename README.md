# tpxle-proxy
Actility ThingPark X Location Engine Proxy for foreign Network Servers

For more details please study 
[/docs/DX_Location_API_Integration_V1.0.pdf](https://github.com/norbertherbert/docs/DX_Location_API_Integration_V1.0.pdf)

### Installation:
Prerequisits: 
[nodejs](https://https://nodejs.org/), 
[mongodb](https://docs.mongodb.com/manual/installation/)
```bash
git clone https://github.com/norbertherbert/tpxle-proxy.git
cd tpxle-proxy
npm install
```
### Usage:
Edit config/token_template.js, add your ThingPark DX API token and save it as config/token.js

Edit config.js and update the server URLs

```bash
node server.js
```
