'use strict';

const CONFIG = require('./config/config');

const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const jsyaml = require('js-yaml');
const express = require("express");
const oasTools = require('oas-tools');
// const morgan = require('morgan');

const app = express();

const spec = fs.readFileSync(path.join(__dirname, 'api/oas-doc.yaml'), 'utf8');
const oasDoc = jsyaml.safeLoad(spec);

const oasOptions = {

	controllers: path.join(__dirname, './controllers'),
	checkControllers: false,

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

// This sets access control origin to *
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

// app.use(morgan('combined'));

oasTools.configure(oasOptions);

oasTools.initialize(oasDoc, app, function() {
	app.listen(CONFIG.server.port, function() {
		console.log(
			'App running at http://localhost:' 
			+ CONFIG.server.port
		);
		console.log(
			'API docs (Swagger UI) available on http://localhost:'
			+ CONFIG.server.port 
			+ oasOptions.docs.swaggerUiPrefix
			+ oasOptions.docs.swaggerUi
		);
	})
});
