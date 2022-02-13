const mysql = require('mysql');

// Connection Pool
const pool = mysql.createPool({
	connectionLimit: 100,
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: '',
	database: process.env.DB_NAME,
});

// View Users
exports.view = (req, res) => {
	pool.getConnection((err, connection) => {
		if (err) throw err; // not connected
		console.log('Connected as ID', +connection.threadID);

		// User the connection
		connection.query(
			'SELECT * FROM user WHERE status = "active"',
			(err, rows) => {
				// When done with the connection, release it
				connection.release();

				if (!err) {
					let removedUser = req.query.removed;
					res.render('home', { rows, removedUser });
				} else {
					console.log(err);
				}
				console.log('The data from user table: \n', rows);
			}
		);
	});
};

// Find department by Search
exports.find = (req, res) => {
	pool.getConnection((err, connection) => {
		if (err) throw err; // not connected
		console.log('Connected as ID', +connection.threadID);

		let searchTerm = req.body.search;

		// User the connection
		connection.query(
			'SELECT * FROM user WHERE department LIKE ?',
			['%' + searchTerm + '%'],
			(err, rows) => {
				// When done with the connection, release it
				connection.release();

				if (!err) {
					res.render('home', { rows });
				} else {
					console.log(err);
				}
				console.log('The data from user table: \n', rows);
			}
		);
	});
};

exports.form = (req, res) => {
	res.render('add-user');
};

// Add new user
exports.create = (req, res) => {
	const { name, cpf, department, phone, email } = req.body;

	pool.getConnection((err, connection) => {
		if (err) throw err; // not connected
		console.log('Connected as ID', +connection.threadID);

		let searchTerm = req.body.search;

		// User the connection
		connection.query(
			'INSERT INTO user SET name = ?,cpf = ?,department = ?,phone = ?,email = ?',
			[name, cpf, department, phone, email],
			(err, rows) => {
				// When done with the connection, release it
				connection.release();

				if (!err) {
					res.render('add-user', {
						alert: 'Colaborador cadastrado com sucesso!',
					});
				} else {
					console.log(err);
				}
				console.log('The data from user table: \n', rows);
			}
		);
	});
};

// Edit user
exports.edit = (req, res) => {
	pool.getConnection((err, connection) => {
		if (err) throw err; // not connected
		console.log('Connected as ID', +connection.threadID);

		// User the connection
		connection.query(
			'SELECT * FROM user WHERE id = ?',
			[req.params.id],
			(err, rows) => {
				// When done with the connection, release it
				connection.release();

				if (!err) {
					res.render('edit-user', { rows });
				} else {
					console.log(err);
				}
				console.log('The data from user table: \n', rows);
			}
		);
	});
};

// Update User
exports.update = (req, res) => {
	const { name, cpf, department, phone, email } = req.body;

	pool.getConnection((err, connection) => {
		if (err) throw err; // not connected
		console.log('Connected as ID', +connection.threadID);

		// User the connection
		connection.query(
			'UPDATE user SET name = ?,cpf = ?,department = ?,phone = ?,email = ? WHERE id = ?',
			[name, cpf, department, phone, email, req.params.id],
			(err, rows) => {
				// When done with the connection, release it
				connection.release();

				if (!err) {
					pool.getConnection((err, connection) => {
						if (err) throw err; // not connected
						console.log('Connected as ID', +connection.threadID);

						// User the connection
						connection.query(
							'SELECT * FROM user WHERE id = ?',
							[req.params.id],
							(err, rows) => {
								// When done with the connection, release it
								connection.release();

								if (!err) {
									res.render('edit-user', {
										rows,
										alert: `${name} foi atualizado com sucesso!`,
									});
								} else {
									console.log(err);
								}
								console.log('The data from user table: \n', rows);
							}
						);
					});
				} else {
					console.log(err);
				}
				console.log('The data from user table: \n', rows);
			}
		);
	});
};

// Delete user
exports.delete = (req, res) => {
	pool.getConnection((err, connection) => {
		if (err) throw err;
		connection.query(
			'UPDATE user SET status = ? WHERE id = ?',
			['removed', req.params.id],
			(err, rows) => {
				if (!err) {
					let removedUser = encodeURIComponent('User successfuly removed.');
					res.redirect('/?removed=' + removedUser);
				} else {
					console.log(err);
				}
				console.log('The data from beer table are: \n', rows);
			}
		);
	});
};

// View Users
exports.viewall = (req, res) => {
	pool.getConnection((err, connection) => {
		if (err) throw err; // not connected
		console.log('Connected as ID', +connection.threadID);

		// User the connection
		connection.query(
			'SELECT * FROM user WHERE id = ?',
			[req.params.id],
			(err, rows) => {
				// When done with the connection, release it
				connection.release();

				if (!err) {
					res.render('view-user', { rows });
				} else {
					console.log(err);
				}
				console.log('The data from user table: \n', rows);
			}
		);
	});
};
