itemsGetWhereFromFilter = (filter, params) => {
	var sqlWhere = '',
		sqlParams = [];

	sqlParams = params.slice();
	if (filter) {
		if (filter.categoryId) {
			sqlParams.push(filter.categoryId);
			sqlWhere += ' AND (t_kat_id=$' + sqlParams.length + ') ';
		}
		if (filter.itemName && filter.itemName !== '') {
			sqlParams.push('%' + filter.itemName + '%');
			sqlWhere += ' AND (UPPER(t_nazwa) LIKE UPPER($' + sqlParams.length + ')) '
		}
	}

	return {
		where: sqlWhere,
		params: sqlParams
	};
};

module.exports = {
	getRowsCount: (dataObj, dbConnObj, callback) => {
		let client = dbConnObj.client;
		let results = [];

		let dataSql = itemsGetWhereFromFilter({ categoryId: dataObj.categoryId, itemName: dataObj.itemName }, []);
		let query = client.query('SELECT COUNT(*) AS rows_count FROM towary WHERE (1=1) ' + dataSql.where, dataSql.params);
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

		let dataSql = itemsGetWhereFromFilter({ categoryId: dataObj.filter.categoryId, itemName: dataObj.filter.itemName }, [dataObj.limit, dataObj.offset]);
		let sql = 'SELECT t_id AS id, t_nazwa AS nazwa, t_link AS link, t_kat_id AS kat_id, kat_nazwa AS kat_nazwa ' +
			'FROM towary ' +
			'LEFT JOIN kategorie ON (t_kat_id=kat_id) ' +
			'WHERE (1=1) ' + dataSql.where + ' ' +
			'ORDER BY t_nazwa ' +
			'LIMIT $1 OFFSET $2';

		let query = client.query(sql, dataSql.params);
		query.on('row', (row) => {
			results.push(row);
		});
		query.on('end', () => {
			callback(undefined, results);
		});
	}
};
