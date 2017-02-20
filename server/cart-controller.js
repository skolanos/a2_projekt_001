const dataModel = require('./data-model');

module.exports.cartNumberOfItems = (req, res) => {
	dataModel.BO.getNumberOfItemsInCart({ userId: req.decoded.uz_id }, (err, value) => {
		if (err) {
			res.json({ status: 400, message: err, data: [] });
		}
		else {
			res.json({ status: 200, message: '', data: [ { rowsCount: value.data[0].rows_count } ] });
		}
	});
};
module.exports.cartItemsList = (req, res) => {
	dataModel.BO.getItemsListInCart({ userId: req.decoded.uz_id }, (err, value) => {
		if (err) {
			res.json({ status: 400, message: err, data: [] });
		}
		else {
			res.json({ status: 200, message: '', data: value.data });
		}
	});
};
