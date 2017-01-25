const jwt = require('jsonwebtoken');

const serverConfig = require('./server-config');
const dataModel = require('./data-model');

const authenticatedUsers = [];

module.exports.authenticateRequest = (req, callback) => {
	console.log('authenticate-request()\t', JSON.stringify(req.body));

	var token = req.headers['x-accss-token'] || req.body.token || req.query.token;

	if (token) {
		jwt.verify(token, serverConfig.jsonwebtoken.secret, (err, decoded) => {
			if (err) {
				callback(err, undefined);
			}
			else {
				callback(undefined, decoded);
			}
		});
	}
	else {
		callback({status: 403, message: 'Nie zainicjowano sesji.'}, undefined);
	}
};
module.exports.register = (req, res) => {
	console.log('POST\t/api/user-register\t', JSON.stringify(req.body));

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
	var token = '';

	console.log('POST\t/api/user-login\t', JSON.stringify(req.body));

//	if (validateParamsLogin()) {
//		// TODO:
//	}
//	else {
		dataModel.Users.findByEmailPassword(req.body.email, req.body.password, (err, results) => {
			if (err) {
				res.json({ status: 400, message: err, data: [] });
			}
			else {
				if (results.length === 1) {
					token = jwt.sign(results[0], serverConfig.jsonwebtoken.secret, { expiresIn: 60 * 24 });
					authenticatedUsers.push({
						user: results[0],
						token: token
					});
					res.json({ status: 200, message: '', data: [{ token: token }] });
				}
				else {
					res.json({ status: 400, message: 'Nieprawidłowy adres e-mail albo hasło użytkownika.', obj: [] });
				}
			}
		});
//	}
};
