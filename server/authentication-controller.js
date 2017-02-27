const jwt = require('jsonwebtoken');

const serverConfig = require('./server-config');
const dataModel = require('./data-model');

/**
 * Procedura sprawdza czy przekazno prawidłowy token przy żądaniu.
 * 
 * @param req {Request} request
 * @param res {Response} response
 * @param next {function}
 */
module.exports.authenticateRequest = (req, res, next) => {
	var token = req.headers['x-accss-token'] || req.body.token || req.query.token;

	if (token) {
		jwt.verify(token, serverConfig.jsonwebtoken.secret, (err, decoded) => {
			if (err) {
				return res.json({ status: 400, message: 'Nieprawidłowa weryfikacja żądania', data: [] });
			}
			else {
				req.decoded = decoded;
				next();
			}
		});
	}
	else {
		return res.status(403).json({ status: 403, message: 'Nie można przeprowadzić weryfikacji żadania', data: [] });
	}
};

/**
 * Procedura rejestruje nowego użytkownika.
 * 
 * @param req {Request} request
 * @param res {Response} response
 */
module.exports.register = (req, res) => {
	let validateParams = (req) => {
		var res = true;

		if (req.body.firstName === '') {
			res = false;
		}
		if (req.body.surname === '') {
			res = false;
		}
		if (req.body.email === '') {
			res = false;
		}
		// TODO: sprawdzenie czy email jest poprawny (jeżeli chodzi o format)
		/*
		let re = /^[a-zA-Z0-9\._%+\-]+@[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,}$/;
		if (!re.test(req.body.email)) {
			res = false;
		}
		*/
		if (req.body.email.indexOf('@') < 0) {
			res = false;
		}
		if (req.body.password === '') {
			res = false;
		}
		return res;
	};

	if (validateParams(req)) {
		dataModel.BO.registerNewUser({
			firstName: req.body.firstName,
			surname: req.body.surname,
			email: req.body.email,
			password: req.body.password
		}, (err, value) => {
			if (err) {
				res.json({ status: 400, message: err, data: [] });
			}
			else {
				if (value.status === 0) {
					res.json({ status: 200, message: '', data: [] });
				}
				else {
					res.json({ status: 400, message: value.message, data: [] });
				}
			}
		});
	}
	else {
		res.json({ status: 400, message: 'Nie podano wszystkich potrzebnych danych.', data: [] });
	}
};
/**
 * Procedura loguje użytkownika.
 * 
 * @param req {Request} request
 * @param res {Response} response
 */
module.exports.login = (req, res) => {
	let validateParams = (req) => {
		var res = true;

		if (req.body.email === '') {
			res = false;
		}
		if (req.body.password === '') {
			res = false;
		}
		return res;
	};

	if (validateParams(req)) {
		dataModel.BO.userLogin({
			email: req.body.email,
			password: req.body.password
		}, (err, value) => {
			if (err) {
				res.json({ status: 400, message: err, data: [] });
			}
			else {
				if (value.status === 0) {
					res.json({ status: 200, message: '', data: [{ token: value.data[0].token }] });
				}
				else {
					res.json({ status: 400, message: value.message, data: [] });
				}
			}
		});
	}
	else {
		res.json({ status: 400, message: 'Nieprawidłowy adres e-mail albo hasło użytkownika.', data: [] });
	}
};
module.exports.loginByToken = (req, res) => {
	var token = req.headers['x-accss-token'] || req.body.token || req.query.token;

	if (token) {
		jwt.verify(token, serverConfig.jsonwebtoken.secret, (err, decoded) => {
			if (err) {
				res.json({ status: 400, message: 'Nieprawidłowa weryfikacja żądania', data: [] });
			}
			else {
				let tokenData = { uz_id: decoded.uz_id };
				let token = jwt.sign(tokenData, serverConfig.jsonwebtoken.secret, { expiresIn: 60 * 24 });
				res.json({ status: 200, message: '', data: [{ token: token }] });
			}
		});
	}
	else {
		res.status(403).json({ status: 403, message: 'Nie można przeprowadzić weryfikacji żadania', data: [] });
	}
};
/**
 * Procedura wylogowuje użytkownika.
 * 
 * @param req {Request} request
 * @param res {Response} response
 */
module.exports.logout = (req, res) => {
	res.json({ status: 200, message: '', data: [] });
};
