const pg = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const serverConfig = require('./server-config');
const Users = require('./data-model-users');
const Categories = require('./data-model-categories');
const Items = require('./data-model-items');
const Prices = require('./data-model-prices');
const Cart = require('./data-model-cart');
const Orders = require('./data-model-orders');

module.exports.BO = {
	/**
	 * Procedura rejestruje nowego użytkownika.
	 * 
	 * @param dataObj {any} obiekt z danymi o użytkowniku
	 * @param callback {function}
	 */
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
						// szukamy użytkownika o podanym adresie email
						Users.findByEmail({ email: dataObj.email }, { client: client }, (err, value) => {
							if (err) {
								client.query('ROLLBACK', (err) => {
									done(err);
									callback(err, undefined);
								});
							}
							else {
								if (value.length === 0) {
									// nie znaleźliśmy użytkownika więc go dopisujemy
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
									// znaleźliśmy użytkownika - błąd nie można dopisać kolejnego o takim samym adresie email
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
	/**
	 * Procedura loguje użytkownika.
	 * 
	 * @param dataObj {any} obiekt z danymi o użytkowniku
	 * @param callback {function}
	 */
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
							callback(undefined, { status: 0, message: 'Zalogowano użytkownika.', data: [{ token: token }] });
						}
						else {
							callback(undefined, { status: -1, message: 'Nieprawidłowy adres e-mail albo hasło użytkownika.', data: [] });
						}
					}
				});
			}
		});
	},
	/**
	 * Procedura zwraca listę kategorii towarów.
	 * 
	 * @param callback {function}
	 */
	getCategoriesList: (callback) => {
		pg.connect(serverConfig.database.connectionString, (err, client, done) => {
			if (err) {
				done(err);
				callback(err, undefined)
			}
			else {
				Categories.findAll({ client: client }, (err, value) => {
					if (err) {
						done(err);
						callback(err, undefined);
					}
					else {
						done();
						callback(undefined, { status: 0, message: '', data: value });
					}
				});
			}
		});
	},
	/**
	 * 
	 */
	getItemsList: (dataObj, callback) => {
		pg.connect(serverConfig.database.connectionString, (err, client, done) => {
			if (err) {
				done(err);
				callback(err, undefined)
			}
			else {
				Items.getRowsCount({ categoryId: dataObj.filter.categoryId, itemName: dataObj.filter.itemName }, { client: client }, (err, value) => {
					if (err) {
						done(err);
						callback(err, undefined)
					}
					else {
						let rowsCount = value[0].rows_count;
						Items.findAll({ filter: { categoryId: dataObj.filter.categoryId, itemName: dataObj.filter.itemName }, offset: dataObj.offset, limit: dataObj.limit }, { client: client }, (err, value) => {
							if (err) {
								done(err);
								callback(err, undefined)
							}
							else {
								done();
								callback(undefined, { status: 0, message: '', data: { rowsCount: rowsCount, rows: value } });
							}
						});
					}
				});
			}
		});
	},
	/**
	 * 
	 */
	getItemPricesList: (dataObj, callback) => {
		pg.connect(serverConfig.database.connectionString, (err, client, done) => {
			if (err) {
				done(err);
				callback(err, undefined)
			}
			else {
				Prices.findByItemId({ itemId: dataObj.itemId }, { client: client}, (err, value) => {
					if (err) {
						done(err);
						callback(err, undefined)
					}
					else {
						done();
						callback(undefined, { status: 0, message: '', data: value });
					}
				});
			}
		});
	},
	/**
	 * 
	 */
	addItemToCart: (dataObj, callback) => {
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
						Prices.findById({ id: dataObj.priceId }, { client: client }, (err, value) => {
							if (err) {
								client.query('ROLLBACK', (err) => {
									done(err);
									callback(err, undefined);
								});
							}
							else {
								if (value.length === 1) {
									// sprawdzenie czy towar o danej cenie jest już w koszyku użytkownika
									Cart.findByUserIdPriceId({ userId: dataObj.userId, priceId: dataObj.priceId }, { client: client }, (err, value) => {
										if (err) {
											client.query('ROLLBACK', (err) => {
												done(err);
												callback(err, undefined);
											});
										}
										else {
											if (value.length === 0) {
												// towaru o danej cenie nie było jeszcze w koszyku użytkownika
												Cart.save({ userId: dataObj.userId, priceId: dataObj.priceId, amount: dataObj.amount }, { client: client }, (err, value) => {
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
																callback(undefined, { status: 0, message: 'Dodano towar do koszyka.', data: [] });
															}
														});
													}
												});
											}
											else {
												// towar o danej cenie jest już w koszyku użytkownika
												Cart.update({ cartId: value[0].ko_id, amount: parseInt(value[0].ko_ile, 10) + parseInt(dataObj.amount, 10) }, { client: client }, (err, value) => {
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
																callback(undefined, { status: 0, message: 'Uaktualniono ilość towaru w koszyku.', data: [] });
															}
														});
													}
												});
											}
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
											callback(undefined, { status: -1, message: 'Nie znaleziono ceny o podanym identyfikatorze.', data: [] });
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
	/**
	 * 
	 */
	getNumberOfItemsInCart: (dataObj, callback) => {
		pg.connect(serverConfig.database.connectionString, (err, client, done) => {
			if (err) {
				done(err);
				callback(err, undefined)
			}
			else {
				Cart.getRowsCount({ userId: dataObj.userId }, { client: client}, (err, value) => {
					if (err) {
						done(err);
						callback(err, undefined)
					}
					else {
						done();
						callback(undefined, { status: 0, message: '', data: value });
					}
				});
			}
		});
	},
	getItemsListInCart: (dataObj, callback) => {
		pg.connect(serverConfig.database.connectionString, (err, client, done) => {
			if (err) {
				done(err);
				callback(err, undefined)
			}
			else {
				Cart.findAll({ userId: dataObj.userId }, { client: client }, (err, value) => {
					if (err) {
						done(err);
						callback(err, undefined)
					}
					else {
						done();
						callback(undefined, { status: 0, message: '', data: value });
					}
				});
			}
		});
	},
	deleteItemFromCart: (dataObj, callback) => {
		pg.connect(serverConfig.database.connectionString, (err, client, done) => {
			if (err) {
				done(err);
				callback(err, undefined)
			}
			else {
				Cart.deleteItem({ userId: dataObj.userId, cartId: dataObj.cartId }, { client: client }, (err, value) => {
					if (err) {
						done(err);
						callback(err, undefined)
					}
					else {
						done();
						callback(undefined, { status: 0, message: '', data: value });
					}
				});
			}
		});
	},
	deleteAllItemsFromCart: (dataObj, callback) => {
		pg.connect(serverConfig.database.connectionString, (err, client, done) => {
			if (err) {
				done(err);
				callback(err, undefined)
			}
			else {
				Cart.deleteAll({ userId: dataObj.userId }, { client: client }, (err, value) => {
					if (err) {
						done(err);
						callback(err, undefined)
					}
					else {
						done();
						callback(undefined, { status: 0, message: '', data: value });
					}
				});
			}
		});
	},
	registerNewOrder: (dataObj, callback) => {
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
						Orders.save({ userId: dataObj.userId }, { client: client }, (err, value) => {
							if (err) {
								client.query('ROLLBACK', (err) => {
									done(err);
									callback(err, undefined);
								});
							}
							else {
								let zam_id = value[0].id;
								Orders.copyItemsFromCart({ userId: dataObj.userId, orderId: zam_id }, { client: client }, (err, value) => {
									if (err) {
										client.query('ROLLBACK', (err) => {
											done(err);
											callback(err, undefined);
										});
									}
									else {
										Cart.deleteAll({ userId: dataObj.userId }, { client: client }, (err, value) => {
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
														callback(undefined, { status: 0, message: 'Zarejestrowano nowe zamówienie.', data: [] });
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
		});
	},
	getNumberOfOrders: (dataObj, callback) => {
		pg.connect(serverConfig.database.connectionString, (err, client, done) => {
			if (err) {
				done(err);
				callback(err, undefined)
			}
			else {
				Orders.getRowsCount({ userId: dataObj.userId }, { client: client}, (err, value) => {
					if (err) {
						done(err);
						callback(err, undefined)
					}
					else {
						done();
						callback(undefined, { status: 0, message: '', data: value });
					}
				});
			}
		});
	},
	getNumberOfActiveOrders: (dataObj, callback) => {
		pg.connect(serverConfig.database.connectionString, (err, client, done) => {
			if (err) {
				done(err);
				callback(err, undefined)
			}
			else {
				let status_zarejestrowane = 1;
				Orders.getRowsCount({ userId: dataObj.userId, status: status_zarejestrowane }, { client: client}, (err, value) => {
					if (err) {
						done(err);
						callback(err, undefined)
					}
					else {
						done();
						callback(undefined, { status: 0, message: '', data: value });
					}
				});
			}
		});
	},
};
