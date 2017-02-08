const serverConfig = require('./server-config');
const dataModel = require('./data-model');
const authenticationController = require('./authentication-controller');

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
	dataModel.Items.getRowsCount((err, results) => {
		if (err) {
			res.json({ status: 400, message: err, data: [] });
		}
		else {
			data.rowsCount = results[0].rows_count;
			dataModel.Items.findAll(offset, limit, (err, results) => {
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
