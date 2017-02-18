const pg = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const serverConfig = require('./server-config');

itemsGetWhereFromFilter = (filter, params) => {
	var sqlWhere = '',
		sqlParams = [];

	sqlParams = params.slice();
	if (filter) {
		if (filter.categoryId) {
			sqlParams.push(filter.categoryId);
			sqlWhere += ' AND (t_kat_id=$' + sqlParams.length + ') ';
		}
		if (filter.itemName && filter.itemName !== '') {
			sqlParams.push('%' + filter.itemName + '%');
			sqlWhere += ' AND (UPPER(t_nazwa) LIKE UPPER($' + sqlParams.length + ')) '
		}
	}

	return {
		where: sqlWhere,
		params: sqlParams
	};
};

const Users = {
	findByEmail: (dataObj, dbConnObj, callback) => {
		let client = dbConnObj.client;
		let results = [];

		let query = client.query('SELECT * FROM uzytkownicy WHERE (lower(uz_email)=lower($1))', [dataObj.email]);
		query.on('row', (row) => {
			results.push(row);
		});
		query.on('end', () => {
			callback(undefined, results);
		})
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

module.exports.BO = {
	registerNewUser: (dataObj, callback) => {
		pg.connect(serverConfig.database.connectionString, (err, client, done) => {
			if (err) {
				done(err);
				callback(err, undefined)
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
						Users.findByEmail({ email: dataObj.email }, { client: client }, (err, value) => {
							if (err) {
								client.query('ROLLBACK', (err) => {
									done(err);
									callback(err, undefined);
								});
							}
							else {
								if (value.length === 0) {
									Users.save({ firstName: dataObj.firstName, surname: dataObj.surname, email: dataObj.email, password: dataObj.password }, { client: client }, (err, value) => {
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
													done();
													callback(undefined, { status: 0, message: 'Zarejestrowano nowego użytkownika.', data: [] });
												}
											});
										}
									});
								}
								else {
									client.query('ROLLBACK', (err) => {
										if (err) {
											done(err);
											callback(err, undefined);
										}
										else {
											done();
											callback(undefined, { status: -1, message: 'Użytkownik o podanym adresie e-mail jest już zarejestrowany.', data: [] });
										}
									});
								}
							}
						});
					}
				});
			}
		});
	},
	userLogin: (dataObj, callback) => {
		pg.connect(serverConfig.database.connectionString, (err, client, done) => {
			if (err) {
				done(err);
				callback(err, undefined)
			}
			else {
				Users.findByEmailPassword({email: dataObj.email, password: dataObj.password }, { client: client }, (err, value) => {
					if (err) {
						done(err);
						callback(err, undefined);
					}
					else {
						done();
						if (value.length === 1) {
							let tokenData = { uz_id: value[0].uz_id };
							let token = jwt.sign(tokenData, serverConfig.jsonwebtoken.secret, { expiresIn: 60 * 24 });
							callback(undefined, { status: 0, message: 'Zalogowano użytkownika.', data: [{ token: token }]});
						}
						else {
							callback(undefined, { status: -1, message: 'Nieprawidłowy adres e-mail albo hasło użytkownika.', data: [] });
						}
					}
				});
			}
		});
	}
};
/*
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
					var res = [],
						i = 0;

					done();
					res = [];
					for (i = 0; i < results.length; i += 1) {
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
*/
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
			query = {},
			sql = '',
			dataSql = {};

		dataSql = itemsGetWhereFromFilter(filter, [limit, offset]);
		sql = 'SELECT t_id AS id, t_nazwa AS nazwa, t_link AS link, t_kat_id AS kat_id, kat_nazwa AS kat_nazwa ' +
			'FROM towary ' +
			'LEFT JOIN kategorie ON (t_kat_id=kat_id) ' +
			'WHERE (1=1) ' + dataSql.where + ' ' +
			'ORDER BY t_nazwa ' +
			'LIMIT $1 OFFSET $2';

		pg.connect(serverConfig.database.connectionString, (err, client, done) => {
			if (err) {
				done(err);
				callback(err, undefined);
			}
			else {
				results = [];
				query = client.query(sql, dataSql.params);
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
			query = {},
			sql = '',
			dataSql = {};

		dataSql = itemsGetWhereFromFilter(filter, []);
		sql = 'SELECT COUNT(*) AS rows_count ' +
			'FROM towary ' +
			'WHERE (1=1) ' + dataSql.where;

		pg.connect(serverConfig.database.connectionString, (err, client, done) => {
			if (err) {
				done(err);
				callback(err, undefined);
			}
			else {
				results = [];
				query = client.query(sql, dataSql.params);
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
