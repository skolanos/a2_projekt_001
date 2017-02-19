module.exports = {
	findById: (dataObj, dbConnObj, callback) => {
		let client = dbConnObj.client;
		let results = [];

		let query = client.query('SELECT * FROM ceny WHERE (c_id=$1)', [dataObj.id]);
		query.on('row', (row) => {
			results.push(row);
		});
		query.on('end', () => {
			callback(undefined, results);
		});
	},
	findByItemId: (dataObj, dbConnObj, callback) => {
		let client = dbConnObj.client;
		let results = [];

		let query = client.query('SELECT * FROM ceny WHERE (c_t_id=$1) ORDER BY c_id', [dataObj.itemId]);
		query.on('row', (row) => {
			results.push(row);
		});
		query.on('end', () => {
			callback(undefined, results);
		});
	}
};
