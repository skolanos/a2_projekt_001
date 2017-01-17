const jwt = require('jsonwebtoken');

const dataModel = require('./data-model-wrapper');

const authenticatedUsers = [];

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
					token = jwt.sign(results[0], 'sekretne_haslo_przechowac_w_config', { expiresIn: 60 * 24 });
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
module.exports.authenticateRequest = (req, res) => {
	console.log('POST\t/api/authenticate-request\t', JSON.stringify(req.body));

	var token = req.headers['x-accss-token'] || req.body.token || req.query.token;

	if (token) {
		jwt.verify(token, 'sekretne_haslo_przechowac_w_config', (err, decoded) => {
			if (err) {
				res.json({ status: 400, message: 'Nieprawidłowa identyfikacja sesji.', obj: [] });
			}
			else {
				req.decoded = decoded;
				res.json({ status: 200, message: 'Poprawna identyfikacja sesji.', data: [] });
			}
		});
	}
	else {
		res.json({ status: 403, message: 'Nie zainicjowano sesji.', obj: [] });
	}
};
