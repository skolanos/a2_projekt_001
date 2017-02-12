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
module.exports.Categories = {
	findAll: (callback) => {
		var results = [],
			query = {};

		pg.connect(serverConfig.database.connectionString, (err, client, done) => {
			if (err) {
				done(err);
				callback(err, undefined);
			}
			else {
				results = [];
				query = client.query('SELECT * FROM kategorie ORDER BY kat_nazwa');
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
module.exports.Items = {
	findAll: (filter, offset, limit, callback) => {
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
	getRowsCount: (filter, callback) => {
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
module.exports.Prices = {
	findById: (id, callback) => {
		var results = [],
			query = {};

		pg.connect(serverConfig.database.connectionString, (err, client, done) => {
			if (err) {
				done(err);
				callback(err, undefined);
			}
			else {
				results = [];
				query = client.query('SELECT * FROM ceny WHERE (c_id=$1)', [id]);
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
	findByItemId: (itemId, callback) => {
		var results = [],
			query = {};

		pg.connect(serverConfig.database.connectionString, (err, client, done) => {
			if (err) {
				done(err);
				callback(err, undefined);
			}
			else {
				results = [];
				query = client.query('SELECT * FROM ceny WHERE (c_t_id=$1) ORDER BY c_id', [itemId]);
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
module.exports.Cart = {
	findByUserIdPriceId: (userId, priceId, callback) => {
		var results = [],
			query = {};

		pg.connect(serverConfig.database.connectionString, (err, client, done) => {
			if (err) {
				done(err);
				callback(err, undefined);
			}
			else {
				results = [];
				query = client.query('SELECT * FROM koszyk WHERE (ko_uz_id=$1) AND (ko_c_id=$2) ORDER BY ko_id', [userId, priceId]);
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
	getRowsCount: (userId, callback) => {
		var results = [],
			query = {};

		pg.connect(serverConfig.database.connectionString, (err, client, done) => {
			if (err) {
				done(err);
				callback(err, undefined);
			}
			else {
				results = [];
				query = client.query('SELECT COUNT(*) AS rows_count FROM koszyk WHERE (ko_uz_id=$1)', [userId]);
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
	save: (userId, priceId, amount, callback) => {
		var results = [],
			query = {};

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
						client.query('INSERT INTO koszyk (ko_uz_id, ko_c_id, ko_ile) VALUES ($1, $2, $3)', [userId, priceId, amount], (err) => {
							if (err) {
								client.query('ROLLBACK', (err) => {
									done(err);
									callback(err, undefined);
								});
							}
							else {
								query = client.query('SELECT currval(pg_get_serial_sequence(\'koszyk\', \'ko_id\')) AS id');
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
	},
	update: (cartId, amount, callback) => {
		var results = [],
			query = {};

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
						client.query('UPDATE koszyk SET ko_ile=$1 WHERE WHERE (ko_id=$2)', [amount, cartId], (err) => {
							if (err) {
								client.query('ROLLBACK', (err) => {
									done(err);
									callback(err, undefined);
								});
							}
							else {
								client.query('COMMIT', (err, result) => {
									if (err) {
										done(err);
										callback(err, undefined);
									}
									else {
										results.push({id: cartId});
										done();
										callback(undefined, results);
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
