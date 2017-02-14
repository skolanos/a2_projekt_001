const serverConfig = require('./server-config');
const dataModel = require('./data-model');
const authenticationController = require('./authentication-controller');

module.exports.categoriesList = (req, res) => {
	dataModel.Categories.findAll((err, results) => {
		if (err) {
			res.json({ status: 400, message: err, data: [] });
		}
		else {
			res.json({ status: 200, message: '', data: results });
		}
	});
};
module.exports.itemsList = (req, res) => {
	var offset = 0,
		limit = 0,
		data = {};

	offset = parseInt(req.body.dataOffset, 10);
	limit = 20;
	if ((parseInt(req.body.dataLimit, 10) >= 5) && (parseInt(req.body.dataLimit, 10) <= 100)) {
		limit = parseInt(req.body.dataLimit, 10);
	}

	data = {};
	dataModel.Items.getRowsCount({itemName: req.body.filter.itemName, categoryId: req.body.filter.categoryId}, (err, results) => {
		if (err) {
			res.json({ status: 400, message: err, data: [] });
		}
		else {
			data.rowsCount = results[0].rows_count;
			dataModel.Items.findAll({itemName: req.body.filter.itemName, categoryId: req.body.filter.categoryId}, offset, limit, (err, results) => {
				if (err) {
					res.json({ status: 400, message: err, data: [] });
				}
				else {
					data.rows = results;
					res.json({ status: 200, message: '', data: data });
				}
			});
		}
	});
};
module.exports.itemPrices = (req, res) => {
	// TODO: sprawdzenie czy itemId jest poprawną liczbą całkowitą
	dataModel.Prices.findByItemId(req.body.itemId, (err, results) => {
		if (err) {
			res.json({ status: 400, message: err, data: [] });
		}
		else {
			res.json({ status: 200, message: '', data: results });
		}
	});
};
module.exports.itemAddToCart = (req, res) => {
	// TODO: sprawdzenie czy priceId jest poprawną liczbą całkowitą
	// TODO: sprawdzenie czy amount jest poprawną liczbą całkowitą
	dataModel.Prices.findById(req.body.priceId, (err, results) => {
		var uz_id = 0,
			price = {};

		if (err) {
			res.json({ status: 400, message: err, data: [] });
		}
		else {
			if (results.length === 0) {
				res.json({ status: 400, message: err, data: [] });
			}
			else {
				// TODO: to wszystko powinno odbyć się w transakcji a nie tylko dodanie czy aktualizacja pozycji (ten model jest kiepski potrzebna lepsza specjalizacja)
				uz_id = req.decoded.uz_id;
				price = results[0];
				dataModel.Cart.findByUserIdPriceId(uz_id, price.c_id, (err, results) => {
					if (err) {
						res.json({ status: 400, message: err, data: [] });
					}
					else {
						if (results.length === 0) {
							// pozycji nie było jeszcze w koszyku, jej dodanie
							dataModel.Cart.save(uz_id, price.c_id, parseInt(req.body.amount, 10), (err, results) => {
								if (err) {
									res.json({ status: 400, message: err, data: [] });
								}
								else {
									res.json({ status: 200, message: '', data: [] });
								}
							});
						}
						else {
							// pozycja była w koszyku, jej aktualizacja
							dataModel.Cart.update(results[0].ko_id, parseInt(results[0].ko_ile, 10) + parseInt(req.body.amount, 10), (err, results) => {
								if (err) {
									res.json({ status: 400, message: err, data: [] });
								}
								else {
									res.json({ status: 200, message: '', data: [] });
								}
							});
						}
					}
				});
			}
		}
	});
};
module.exports.cartNumberOfItems = (req, res) => {
	var uz_id = req.decoded.uz_id;
	dataModel.Cart.getRowsCount(uz_id, (err, results) => {
		if (err) {
			res.json({ status: 400, message: err, data: [] });
		}
		else {
			res.json({ status: 200, message: '', data: [ { rowsCount: results[0].rows_count } ] });
		}
	});
};