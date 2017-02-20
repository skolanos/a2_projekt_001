const dataModel = require('./data-model');

/**
 * Procedura zwraca listę kategorii towarów.
 * 
 * @param req {Request}
 * @param res {Response}
 */
module.exports.categoriesList = (req, res) => {
	dataModel.BO.getCategoriesList((err, value) => {
		if (err) {
			res.json({ status: 400, message: err, data: [] });
		}
		else {
			res.json({ status: 200, message: '', data: value.data });
		}
	});
};
/**
 * Procedura zwraca listę towarów.
 * 
 * @param req {Request}
 * @param res {Response}
 */
module.exports.itemsList = (req, res) => {
	const minLimit = 5;
	const maxLimit = 100;

	// TODO: sprawdzenie poprawności przekazanych danych (dataOffset: int, dataLimit: int, categoryId: ?int)
	let offset = parseInt(req.body.dataOffset, 10);
	let limit = 20;
	if ((parseInt(req.body.dataLimit, 10) >= minLimit) && (parseInt(req.body.dataLimit, 10) <= maxLimit)) {
		limit = parseInt(req.body.dataLimit, 10);
	}
	dataModel.BO.getItemsList({
		filter: {
			itemName: req.body.filter.itemName,
			categoryId: req.body.filter.categoryId,
		},
		offset: offset,
		limit: limit
	}, (err, value) => {
		if (err) {
			res.json({ status: 400, message: err, data: [] });
		}
		else {
			res.json({ status: 200, message: '', data: { rowsCount: value.data.rowsCount, rows: value.data.rows } });
		}
	});
};
/**
 * Procedura zwraca listę cen dla wybranego towaru.
 * 
 * @param req {Request}
 * @param res {Response}
 */
module.exports.itemPrices = (req, res) => {
	// TODO: sprawdzenie poprawności przekazanych danych (itemId: int)
	dataModel.BO.getItemPricesList({ itemId: req.body.itemId }, (err, value) => {
		if (err) {
			res.json({ status: 400, message: err, data: [] });
		}
		else {
			res.json({ status: 200, message: '', data: value.data });
		}
	});
};
/**
 * Procedura dodaje towar do koszyka.
 * 
 * @param req {Request}
 * @param res {Response}
 */
module.exports.itemAddToCart = (req, res) => {
	// TODO: sprawdzenie poprawności przekazanych danych (priceId: int, amount: int+)
	dataModel.BO.addItemToCart({ userId: req.decoded.uz_id, priceId: req.body.priceId, amount: parseInt(req.body.amount, 10) }, (err, value) => {
		if (err) {
			res.json({ status: 400, message: err, data: [] });
		}
		else {
			res.json({ status: 200, message: '', data: [] });
		}
	});
};
