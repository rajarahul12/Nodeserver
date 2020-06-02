module.exports = (options) => {
	var express = require('express');
	var app = express();
	var bodyParser = require('body-parser');
	var mf = options.mf;
	console.log("This is MF as a param ---> " + JSON.stringify(mf));
	var params = JSON.parse(process.env.MF_ENVVARS);
	var securityUtils = require('../mobile-foundation/mf-security.js')(params.push);

	
	app.use(bodyParser.urlencoded({ extended: false }));
	
	// parse application/json
	
	app.use(bodyParser.json());
	
	app.get('/placeOrder',securityUtils.mfpAuth('push.mobileclient'), (req, res) => {
		
		var messageText = "Hello world from MFP";
		mf.push.sendNotification(messageText);

		mf.liveupdate.setProperty('sampleID', 'sampleProperty', 1234, "Sample property description");
		
		/* Below push related user context data is obtained using the "securityUtils.mfpAuth" filter in the app.get request and 
		sent to the analytics server. Hence the push parameters are passed to the "mf-security" module and push scope is sent to the 
		filter as a parameter. */
		
			var userContext = JSON.stringify(req.securityContext);
			console.log("UserContext --> " + userContext);
			userContext = userContext.replace(/-/g, ''); //This is done to avoid json accessing errors
	
			var customLogInputs = {
				"serverIpAddress": "9.1.2.34",
				"customDataMap": {
					"client id": userContext.client_id
				},
				"timestamp": "2020-05-03T05:12:53.432Z",
				"timezone": "60",
				"appVersion": "2.0 Beta",
				"appName": "IBM Acme App",
				"appID": userContext.mfpapplication.id,
				"appVersionCode": userContext.mfpapplication.version,
				"deviceID": userContext.mfpdevice.id,
				"deviceModel": "iPhone6,2",
				"deviceBrand": "Apple",
				"deviceOS": "iOS",
				"deviceOSversion": "9.2.1"
			};
			
			mf.analytics.sendCustomLogs(customLogInputs);

			res.send("Order placed!");
	});
	
	app.get('/liveupdate', (req, res) => {
		
		mf.liveupdate.setProperty('sampleID', 'sampleProperty', 1234, "Sample property description");
		res.send("Sample property has been set!");
		
	});
	
	app.get('/beneficiary', function (req, res) {

		console.log("MF ---> " + JSON.stringify(mf) );

		mf.push.sendNotification("Hello from APP");

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
