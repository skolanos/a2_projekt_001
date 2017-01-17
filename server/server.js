const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
//const session = require('express-session');
//const passport require('passport');
//const LocalStrategy = require('passport-local').Strategy;

const serverConfig = require('./server-config');
const authenticationController = require('./authentication-controller');

const app = express();

const port = serverConfig.httpServer.port;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(serverConfig.httpServer.wwwRoot));
//app.use(session({secret: 'jakis_sekret', saveUninitialized: true, resave: true}));
//app.use(passport.initialize());
//app.use(passport.session())

app.post('/api/user-register', authenticationController.register);
app.post('/api/user-login',    authenticationController.login);

app.listen(port, () => {
	console.log(`Serwer uruchomiony http://localhost:${port}/`);
});
