module.exports = (mf) => {
	var express = require('express');
	var app = express();
	var bodyParser = require('body-parser');

	
	app.use(bodyParser.urlencoded({ extended: false }));
	
	// parse application/json
	
	app.use(bodyParser.json());
	
	app.get('/beneficiary', function (req, res) {

		console.log("MF ---> " + JSON.stringify(mf) );

		console.log(">>>---------------- 1. headers ------------");
		console.log(JSON.stringify(req.headers));
		console.log("");
	
		console.log("---------------- 2. params ------------");
		console.log(req.query);
		console.log("");
	
	
		if (req.body) {
			console.log("---------------- 3. Body ------------");
			console.log(JSON.stringify(req.body));
		}
	
		console.log("---------------- 4. get");
		res.json([{ "firstName": "Ajay", "lastName": "Kapoor", "bankName": "ABCD", "accountNumber": "1486423458200" }, { "firstName": "Rakesh", "lastName": "Sharma", "bankName": "PQRS", "accountNumber": "0386423456235" }]);
	
		console.log("<<---------------------------");
	})
	
	app.post('/beneficiary', function (req, res) {
	
		// console.log(">>>---------------- 1. headers ------------");
		// console.log(JSON.stringify(req.headers));	
		// console.log("");
	
		// console.log("---------------- 2. params ------------");
		// console.log(req.query);	
		// console.log("");
	
	
		// if (req.body){
		// 	console.log("---------------- 3. Body ------------");	
		// 	console.log(JSON.stringify(req.body));	
		// }
	
		//console.log(req.body);
	
	
		console.log(req.body);
	
		console.log(JSON.stringify(req.headers));
		console.log(">>> post");
		res.json({});
	});
	
	
	app.put('/beneficiary', function (req, res) {
		console.log(JSON.stringify(req.headers));
		console.log(">>> put");
		res.json({});
	});
	
	
	app.delete('/beneficiary', function (req, res) {
		console.log(JSON.stringify(req.headers));
		console.log(">>> delete");
		res.json({});
	});
	
	var port = process.env.PORT || 7000;
	app.listen(port);
	console.log('Node.js web server at port 7000 is running..');
	
	console.log("checking changes ----> server in exports");
	return app;
	};
