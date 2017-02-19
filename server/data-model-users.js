const bcrypt = require('bcryptjs');

module.exports = {
	findByEmail: (dataObj, dbConnObj, callback) => {
		let client = dbConnObj.client;
		let results = [];

		let query = client.query('SELECT * FROM uzytkownicy WHERE (lower(uz_email)=lower($1))', [dataObj.email]);
		query.on('row', (row) => {
			results.push(row);
		});
		query.on('end', () => {
			callback(undefined, results);
		});
	},
	findByEmailPassword: (dataObj, dbConnObj, callback) => {
		let client = dbConnObj.client;
		let results = [];

		let query = client.query('SELECT * FROM uzytkownicy WHERE (lower(uz_email)=lower($1))', [dataObj.email]);
		query.on('row', (row) => {
			results.push(row);
		});
		query.on('end', () => {
			let res = [];
			for (let i = 0; i < results.length; i += 1) {
				if (bcrypt.compareSync(dataObj.password, results[i].uz_haslo)) {
					res.push(results[i]);
				}
			}
			callback(undefined, res);
		});
	},
	save: (dataObj, dbConnObj, callback) => {
		let client = dbConnObj.client;
		let results = [];

		bcrypt.genSalt(10, (err, salt) => {
			if (err) {
				callback(err, undefined);
			}
			else {
				bcrypt.hash(dataObj.password, salt, (err, hash) => {
					if (err) {
						callback(err, undefined);
					}
					else {
						client.query('INSERT INTO uzytkownicy (uz_haslo, uz_email, uz_nazwisko, uz_imie) VALUES ($1, $2, $3, $4)', [hash, dataObj.email, dataObj.surname, dataObj.firstName], (err) => {
							if (err) {
								callback(err, undefined);
							}
							else {
								let query = client.query('SELECT currval(pg_get_serial_sequence(\'uzytkownicy\', \'uz_id\')) AS id');
								query.on('row', (row) => {
									results.push(row);
								});
								query.on('end', () => {
									callback(undefined, results);
								})
							}
						});
					}
				});
			}
		});
	}
};
