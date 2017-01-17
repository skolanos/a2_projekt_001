const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
//const session = require('express-session');
//const passport require('passport');
//const LocalStrategy = require('passport-local').Strategy;

const authenticationController = require('./authentication-controller');

const app = express();

const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../client')))
//app.use(session({secret: 't364tr673', saveUninitialized: true, resave: true}));
//app.use(passport.initialize());
//app.use(passport.session())

app.post('/api/user-register', authenticationController.register);
app.post('/api/user-login',    authenticationController.login);

app.listen(port, () => {
	console.log(`Serwer uruchomiony http://localhost:${port}/`);
});
