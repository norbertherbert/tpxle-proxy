'use strict';

const fs = require('fs');
const appRoot = require('app-root-path');
const bodyParser = require('body-parser');
const jsyaml = require('js-yaml');
const express = require("express");
const oasTools = require('oas-tools');

const logger = require(`${appRoot}/config/logger`);
const CONFIG = require(`${appRoot}/config/config`);

const spec = fs.readFileSync(`${appRoot}/api/oas-doc.yaml`, 'utf8');
const oasDoc = jsyaml.safeLoad(spec);

const oasOptions = {

	controllers: `${appRoot}/controllers`,
	checkControllers: true,

	loglevel: 'info',

	router: true,

	validator: true,
	strict: false,
	ignoreUnknownFormats: true,

	docs: {
		apiDocs: '/api-docs',
		apiDocsPrefix: CONFIG.server.path,
		swaggerUi: '/docs',
		swaggerUiPrefix: CONFIG.server.path
	},

	oasSecurity: false,
	securityFile: null,

	oasAuth: false,
	grantsFile: null,

};

const app = express();

// This sets access control origin to * that helps testing java script apps from localhost
app.options(`${CONFIG.server.path}/*`, function(req, res) {
	res.set({
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE, OPTIONS',
		'Access-Control-Allow-Headers': 'Authorization, Content-Type', 
	});
	res.status(201).end();
});
app.use(`${CONFIG.server.path}/*`, function(req, res, next) {
	res.set({
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE, OPTIONS',
		'Access-Control-Allow-Headers': 'Authorization, Content-Type', 
	});
	next();
});

app.use(bodyParser.json({
	strict: false
}));

oasTools.configure(oasOptions);

oasTools.initialize(oasDoc, app, function() {
	app.listen(CONFIG.server.port, function() {
		logger.info(
			'API server is running at http://localhost:' 
			+ CONFIG.server.port
			+ oasOptions.docs.swaggerUiPrefix
			+ '/latest/api'
		);
		logger.info(
			'API docs (Swagger UI) available on http://localhost:'
			+ CONFIG.server.port 
			+ oasOptions.docs.swaggerUiPrefix
			+ oasOptions.docs.swaggerUi
		);
	})
});
