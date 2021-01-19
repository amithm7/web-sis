var express = require("express");
var session = require("express-session");
var mysql = require('mysql');

// Creating mysql connection
var connection = mysql.createConnection({
	host: 'localhost',
	user: 'sisAPI',
	password: 'password',
	database: 'SIS',
	multipleStatements: true,
	timezone: 'utc'
});
connection.connect(function (err) {
	if (!err) {
		console.log("Database is connected ... \n\n");
	} else {
		console.log("Error connecting database ... \n\n");
		// throw err;
	}
});

var app = express();

// Start Server
app.listen(8888, function () {
	console.log("Started on PORT 8888: http://localhost:8888");
});

// To read post data from client
// - parse json encoded bodies
app.use(express.json());
// - parse application/x-www-form-urlencoded
app.use(express.urlencoded({
	extended: true
}));

// Secret key is a random string and visible for the project purpose
app.use(session({ secret: "hf9sf7hy8s7f77syef98", resave: false, saveUninitialized: true }));

// To serve static files in 'public' folder with '/static' endpoint
app.use('/static', express.static(__dirname + '/app/public'));

/* Routes */
// Home
app.get('/', function (req, res) {
	if (req.session.user) {
		res.redirect('/dashboard');
	} else {
		res.sendFile('login.html', { root: __dirname + '/app' });
	}
});

// Dashboard
app.get('/dashboard', function (req, res) {
	if (!req.session.user) {
		return res.status(401).send('Unauthorized');
	} else {
		return res.status(200).sendFile('app.html', { root: __dirname + '/app' });
	}
});

/* API */
// Login
app.post('/api/login', function (req, res) {
	if (req.body.username == "admin" && req.body.password == "admin") {
		req.session.user = req.body.username;
		res.redirect('/dashboard');
	} else {
		res.redirect('back');	// Back 1 page
	}
});

// Logout
app.get('/api/logout', function (req, res) {
	req.session.destroy();
	res.redirect('/');
});

// Add Student
app.post('/api/addStudent', function(req, res) {
	if (!req.session.user) {
		return res.status(401).send('Unauthorized');
	}

	console.log(req.body);

	// Check if this student exists in the DB
	var studentExists = "SELECT COUNT(*) FROM STUDENT WHERE ID = \"" + req.body.id + "\";";
	connection.query(studentExists, function (err, result) {
		if (err) {
			return res.sendStatus(500);
		}

		// If student record not found in the DB, add it
		if (result[0]['COUNT(*)'] == 0) {
			var newCustomerSQL = "INSERT INTO STUDENT (ID, FIRST_NAME, LAST_NAME, SEX, DOB, ADDRESS, CITY, STATE," + 
				"PIN_CODE, PHONE) VALUES ('" +
				req.body.id + "', '" +
				req.body.firstName + "', '" +
				req.body.lastName + "', '" +
				req.body.sex + "', '" +
				req.body.dob + "', '" +
				req.body.address + "', '" +
				req.body.city + "', '" +
				req.body.state + "', " +
				req.body.pincode + ", " +
				req.body.phone + ");";
			connection.query(newCustomerSQL, function (err, result) {
				if (err) {
					console.log(err);
					return res.sendStatus(500);
				}
				console.log("New student added: " + req.body.id);
				res.status(200).send("New Student Added!");
			});
		} else {
			return res.status(500).send("Student Exists already!");
		}
	});
});
