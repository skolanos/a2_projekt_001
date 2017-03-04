const dataModel = require('./data-model');

module.exports.orderRegisterNew = (req, res) => {
	dataModel.BO.registerNewOrder({ userId: req.decoded.uz_id }, (err, value) => {
		if (err) {
			res.json({ status: 400, message: err.detail, data: [] });
		}
		else {
			res.json({ status: 200, message: '', data: [] });
		}
	});
};
module.exports.ordersNumberOfOrders = (req, res) => {
	dataModel.BO.getNumberOfOrders({ userId: req.decoded.uz_id }, (err, value) => {
		if (err) {
			res.json({ status: 400, message: err, data: [] });
		}
		else {
			res.json({ status: 200, message: '', data: [ { rowsCount: value.data[0].rows_count } ] });
		}
	});
};
module.exports.ordersNumberOfActiveOrders = (req, res) => {
	dataModel.BO.getNumberOfActiveOrders({ userId: req.decoded.uz_id }, (err, value) => {
		if (err) {
			res.json({ status: 400, message: err, data: [] });
		}
		else {
			res.json({ status: 200, message: '', data: [ { rowsCount: value.data[0].rows_count } ] });
		}
	});
};
module.exports.ordersList = (req, res) => {
	dataModel.BO.getOrdersList({ userId: req.decoded.uz_id }, (err, value) => {
		if (err) {
			res.json({ status: 400, message: err, data: [] });
		}
		else {
			res.json({ status: 200, message: '', data: value.data });
		}
	});
};
