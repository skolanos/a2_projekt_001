module.exports = {
	getRowsCount: (dataObj, dbConnObj, callback) => {
		let client = dbConnObj.client;
		let results = [];
		let query = '';

		if (dataObj.status) {
			query = client.query('SELECT COUNT(*) AS rows_count FROM zamowienia WHERE (zam_uz_id=$1) AND (zam_zas_id=$2)',
				[dataObj.userId, dataObj.status]);
		}
		else {
			query = client.query('SELECT COUNT(*) AS rows_count FROM zamowienia WHERE (zam_uz_id=$1)',
				[dataObj.userId]);
		}
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
		let status_zarejestrowane = 1;

		client.query('INSERT INTO zamowienia (zam_uz_id, zam_zas_id) VALUES ($1, $2)',
			[dataObj.userId, status_zarejestrowane], (err) => {
			if (err) {
				callback(err, undefined);
			}
			else {
				let query = client.query(`
					SELECT currval(pg_get_serial_sequence('zamowienia', 'zam_id')) AS id
				`);
				query.on('row', (row) => {
					results.push(row);
				});
				query.on('end', () => {
					callback(undefined, results);
				})
			}
		});
	},
	copyItemsFromCart: (dataObj, dbConnObj, callback) => {
		let client = dbConnObj.client;
		let results = [];

		client.query(`
			INSERT INTO zamowienia_pozycje (zap_zam_id, zap_c_id, zap_ile)
			SELECT $2, ko_c_id, ko_ile
			FROM koszyk
			WHERE (ko_uz_id=$1)
		`, [dataObj.userId, dataObj.orderId], (err) => {
			if (err) {
				callback(err, undefined);
			}
			else {
				callback(undefined, results);
			}
		});
	}
};
