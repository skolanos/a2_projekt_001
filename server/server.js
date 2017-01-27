const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const serverConfig = require('./server-config');
const serverRouter = require('./server-router');

const app = express();

const port = serverConfig.httpServer.port;

app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(serverConfig.httpServer.wwwRoot));

app.use('/api', serverRouter);

app.get('/*', (req, res) => {
	res.redirect('/');
});

app.listen(port, () => {
	console.log(`Serwer uruchomiony http://localhost:${port}/`);
});
