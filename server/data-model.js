const pg = require('pg');
const bcrypt = require('bcryptjs');

const serverConfig = require('./server-config');

module.exports.Users = {
	findByEmail: (email, callback) => {
		var results = [],
			query = {};

		pg.connect(serverConfig.database.connectionString, (err, client, done) => {
			if (err) {
				done(err);
				callback(err, undefined);
			}
			else {
				results = [];
				query = client.query('SELECT * FROM uzytkownicy WHERE (lower(uz_email)=lower($1))', [email]);
				query.on('row', (row) => {
					results.push(row);
				});
				query.on('end', () => {
					done();
					callback(undefined, results);
				})
			}
		});
	},
	findByEmailPassword: (email, password, callback) => {
		var results = [],
			query = {};

		pg.connect(serverConfig.database.connectionString, (err, client, done) => {
			if (err) {
				done(err);
				callback(err, undefined);
			}
			else {
				results = [];
				query = client.query('SELECT * FROM uzytkownicy WHERE (lower(uz_email)=lower($1))', [email]);
				query.on('row', (row) => {
					results.push(row);
				});
				query.on('end', () => {
					var res = [];

					done();
					res = [];
					for (let i = 0; i < results.length; i += 1) {
						if (bcrypt.compareSync(password, results[i].uz_haslo)) {
							res.push(results[i]);
						}
					}
					callback(undefined, res);
				})
			}
		});
	},
	save: (firstName, surname, email, password, callback) => {
		var results = [],
			query = {};

		bcrypt.genSalt(10, (err, salt) => {
			if (err) {
				callback(err, undefined);
			}
			else {
				bcrypt.hash(password, salt, (err, hash) => {
					if (err) {
						callback(err, undefined);
					}
					else {
						pg.connect(serverConfig.database.connectionString, (err, client, done) => {
							if (err) {
								done(err);
								callback(err, undefined);
							}
							else {
								client.query('BEGIN', (err) => {
									if (err) {
										client.query('ROLLBACK', (err) => {
											done(err);
											callback(err, undefined);
										});
									}
									else {
										client.query('INSERT INTO uzytkownicy (uz_haslo, uz_email, uz_nazwisko, uz_imie) VALUES ($1, $2, $3, $4)', [hash, email, surname, firstName], (err) => {
											if (err) {
												client.query('ROLLBACK', (err) => {
													done(err);
													callback(err, undefined);
												});
											}
											else {
												query = client.query('SELECT currval(pg_get_serial_sequence(\'uzytkownicy\', \'uz_id\')) AS id');
												query.on('row', (row) => {
													results.push(row);
												});
												query.on('end', () => {
													client.query('COMMIT', (err, result) => {
														if (err) {
															done(err);
															callback(err, undefined);
														}
														else {
															done();
															callback(undefined, results);
														}
													});
												})
											}
										});
									}
								});
							}
						});
					}
				});
			}
		});
	}
};
module.exports.Items = {
	findAll: (offset, limit, callback) => {
		var results = [],
			query = {};

		pg.connect(serverConfig.database.connectionString, (err, client, done) => {
			if (err) {
				done(err);
				callback(err, undefined);
			}
			else {
				results = [];
				query = client.query('SELECT t_id AS id, t_nazwa AS nazwa, t_link AS link, kat_id AS kat_id, kat_nazwa AS kat_nazwa FROM towary LEFT JOIN kategorie ON (t_kat_id=kat_id) ORDER BY t_nazwa LIMIT $1 OFFSET $2', [limit, offset]);
				query.on('row', (row) => {
					results.push(row);
				});
				query.on('end', () => {
					done();
					callback(undefined, results);
				})
			}
		});
	},
	getRowsCount: (callback) => {
		var results = [],
			query = {};

		pg.connect(serverConfig.database.connectionString, (err, client, done) => {
			if (err) {
				done(err);
				callback(err, undefined);
			}
			else {
				results = [];
				query = client.query('SELECT COUNT(*) AS rows_count FROM towary');
				query.on('row', (row) => {
					results.push(row);
				});
				query.on('end', () => {
					done();
					callback(undefined, results);
				})
			}
		});
	}
};
