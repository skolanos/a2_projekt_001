module.exports = {
	getRowsCount: (dataObj, dbConnObj, callback) => {
		let client = dbConnObj.client;
		let results = [];

		let query = client.query('SELECT COUNT(*) AS rows_count FROM koszyk WHERE (ko_uz_id=$1)', [dataObj.userId]);
		query.on('row', (row) => {
			results.push(row);
		});
		query.on('end', () => {
			callback(undefined, results);
		});
	},
	findAll: (dataObj, dbConnObj, callback) => {
		let client = dbConnObj.client;
		let results = [];

		let query = client.query('SELECT * FROM koszyk WHERE (ko_uz_id=$1) ORDER BY ko_id', [dataObj.userId]);
		query.on('row', (row) => {
			results.push(row);
		});
		query.on('end', () => {
			callback(undefined, results);
		});
	},
	findByUserIdPriceId: (dataObj, dbConnObj, callback) => {
		let client = dbConnObj.client;
		let results = [];

		let query = client.query('SELECT * FROM koszyk WHERE (ko_uz_id=$1) AND (ko_c_id=$2) ORDER BY ko_id', [dataObj.userId, dataObj.priceId]);
		query.on('row', (row) => {
			results.push(row);
		});
		query.on('end', () => {
			callback(undefined, results);
		});
	},
	save: (dataObj, dbConnObj, callback) => {
		let client = dbConnObj.client;
		let results = [];

		client.query('INSERT INTO koszyk (ko_uz_id, ko_c_id, ko_ile) VALUES ($1, $2, $3)', [dataObj.userId, dataObj.priceId, dataObj.amount], (err) => {
			if (err) {
				callback(err, undefined);
			}
			else {
				let query = client.query('SELECT currval(pg_get_serial_sequence(\'koszyk\', \'ko_id\')) AS id');
				query.on('row', (row) => {
					results.push(row);
				});
				query.on('end', () => {
					callback(undefined, results);
				})
			}
		});
	},
	update: (dataObj, dbConnObj, callback) => {
		let client = dbConnObj.client;
		client.query('UPDATE koszyk SET ko_ile=$1 WHERE (ko_id=$2)', [dataObj.amount, dataObj.cartId], (err) => {
			if (err) {
				callback(err, undefined);
			}
			else {
				callback(undefined, [{ ko_id: dataObj.cartId }]);
			}
		});
	}
};
