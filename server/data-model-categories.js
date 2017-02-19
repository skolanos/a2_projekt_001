module.exports = {
	findAll: (dbConnObj, callback) => {
		let client = dbConnObj.client;
		let results = [];

		let query = client.query('SELECT * FROM kategorie ORDER BY kat_nazwa');
		query.on('row', (row) => {
			results.push(row);
		});
		query.on('end', () => {
			callback(undefined, results);
		});
	}
};
