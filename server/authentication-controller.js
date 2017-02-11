const jwt = require('jsonwebtoken');

const serverConfig = require('./server-config');
const dataModel = require('./data-model');

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
module.exports.register = (req, res) => {
	dataModel.Users.findByEmail(req.body.email, (err, results) => {
		if (err) {
			res.json({ status: 400, message: err, data: [] });
		}
		else {
			if (results.length === 0) {
				dataModel.Users.save(req.body.firstName, req.body.surname, req.body.email, req.body.password, (err, results) => {
					if (err) {
						res.json({ status: 400, message: err, data: [] });
					}
					else {
						dataModel.Users.findByEmailPassword(req.body.email, req.body.password, (err, results) => {
							if (err) {
								res.json({ status: 400, message: err, data: [] });
							}
							else {
								if (results.length === 1) {
									res.json({ status: 200, message: '', data: [] });
								}
								else {
									res.json({ status: 400, message: 'Nieprawidłowy adres e-mail albo hasło użytkownika.', data: [] });
								}
							}
						});
					}
				});
			}
			else {
				res.json({ status: 400, message: 'Użytkownik o podanym adresie e-mail jest już zarejestrowany.', data: [] });
			}
		}
	});
};
module.exports.login = (req, res) => {
	function validateParams(req) {
		var res = true;

		if (req.body.email === '') {
			res = false;
		}
		if (req.body.password === '') {
			res = false;
		}
		return res;
	}

	if (validateParams(req)) {
		dataModel.Users.findByEmailPassword(req.body.email, req.body.password, (err, results) => {
			if (err) {
				res.json({ status: 400, message: err, data: [] });
			}
			else {
				if (results.length === 1) {
					let tokenData = {
						uz_id: results[0].uz_id
					};
					let token = jwt.sign(tokenData, serverConfig.jsonwebtoken.secret, { expiresIn: 60 * 24 });
					res.json({ status: 200, message: '', data: [{ token: token }] });
				}
				else {
					res.json({ status: 400, message: 'Nieprawidłowy adres e-mail albo hasło użytkownika.', data: [] });
				}
			}
		});
	}
	else {
		res.json({ status: 400, message: 'Nieprawidłowy adres e-mail albo hasło użytkownika.', data: [] });
	}
};
module.exports.logout = (req, res) => {
	res.json({ status: 200, message: '', data: [] });
};
