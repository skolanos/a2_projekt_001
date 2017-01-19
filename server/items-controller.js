const serverConfig = require('./server-config');
const dataModel = require('./data-model');

module.exports.itemsList = (req, res) => {
	var offset = 0,
		limit = 0;
	console.log('POST\t/api/items-list\t', 'token:' + req.headers['x-accss-token'], JSON.stringify(req.body));

	// TODO: sprawdzenie tokena

	offset = parseInt(req.body.dataOffset, 10);
	limit = 20;
	if ((parseInt(req.body.dataLimit, 10) >= 5) && (parseInt(req.body.dataLimit, 10) <= 100)) {
		offset = parseInt(req.body.dataLimit, 10);
	}

	dataModel.Items.findAll(offset, limit, (err, results) => {
		if (err) {
			res.json({ status: 400, message: err, data: [] });
		}
		else {
			res.json({ status: 200, message: '', data: results });
		}
	});
};
