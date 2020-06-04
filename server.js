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
	
	app.get('/custom',(req,res) => {
	var customData = {
		  "active": true,
		  "scope": "RegisteredClient push.mobileclient",
		  "username": "anonymous",
		  "client_id": "11111-4491-4f48-94d1-df541247e6ee",
		  "exp": 1591254974076,
		  "mfp-application": {
		    "id": "com.demo.test",
		    "clientPlatform": "android",
		    "version": "1.0"
		  },
		  "mfp-device": {
		    "id": "111111-6fe3-348a-a13f-e1bf5fcccf03",
		    "hardware": "Android SDK built for x86lol",
		    "platform": "android 12",
		    "deviceDisplayName": null,
		    "status": "ACTIVE"
		  },
		  "mfp-user": null,
		  "mfp-checks": {}
	}
	mf.analytics.sendCustomLogs(customData);
	res.send("custom logs have been sent!");
	
	})
	
	app.get('/analytics/networktransactions', (req, res) => {
		
		
		var networkLogInputs = {
			"resourceURL": "http://9.8.7.6:9080/some/path",
			"responseCode": "200",
			"requestMethod": "GET",
			"loginModuleName": "My Login Module",
			"realmName": "userCredChallengerRealm",
			"sessionID": "jfkld789087f908s",
			"trackingID": "f81d4fae-7dec-11d0-a765-00a0c91e6bf6",
			"serverIpAddress": "172.16.254.1",
			"bytesReceived": "2300",
			"bytesSent": "120",
			"serverProcessingTime": "289",
			"backendProcessingTime": "95",
			"adapterName": "MyAdapter",
			"procedureName": "MyProcedure",
			"authenticator": "com.ibm.acme.MyAuthenticator",
			"loginModule": "com.ibm.acme.MyLoginModule",
			"authSuccess": false,
			"validationCode": "TOKEN_FAILED_MISSING_PARAMETER",
			"roundTripTime": "598",
			"inboundTimestamp": "2020-05-03T05:12:53.459Z",
			"outboundTimestamp": "2020-05-03T05:12:53.459Z",
			"userAgent": "Mozilla/5.0 (Linux; U; Android 4.0.3; ...",
			"appVersion": "2.0 Beta",
			"appName": "IBM Acme App",
			"appID": "com.ibm.acme",
			"appVersionCode": "2",
			"deviceID": "518c66913ec337f0",
			"deviceModel": "iPhone6,2",
			"deviceBrand": "Apple",
			"deviceOS": "iOS",
			"deviceOSversion": "9.2.1",
			"timestamp": "2020-05-03T05:12:53.459Z",
			"timezone": "60"
		};
		
		mf.analytics.sendNetworkTransactions(networkLogInputs);
		res.send("Network logs have been sent!");
		
	});
	
	app.get('/order',mf.securityUtils.mfpAuth('accessRestricted'), (req, res) => {
		var messageText = "Hello world from MFP";
		mf.push.sendNotification(messageText);

		mf.liveupdate.setProperty('bcg1', 'background', 'blue', "Property that is used to set background color");
		
		/* Below push related user context data is obtained using the "securityUtils.mfpAuth" filter in the app.get request and 
		sent to the analytics server. Hence the push parameters are passed to the "mf-security" module and push scope is sent to the 
		filter as a parameter. */

		var userContext = JSON.stringify(req.securityContext);
		userContext = userContext.replace('mfp-application', 'mfpapplication'); //This is done to avoid json accessing errors
		userContext = userContext.replace('mfp-device', 'mfpdevice'); 
		userContext = userContext.replace('mfp-user', 'mfpuser');
		userContext = JSON.parse(userContext);
			
			var datetime = new Date();
			var customLogInputs = {
				"serverIpAddress": mf.analytics.mf_url,
				"customDataMap": {
					"client id": userContext.client_id
				},
				"timestamp": datetime,
				"timezone": "60",
				"appVersion": userContext.mfpapplication.version,
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

// 		mf.push.sendNotificationByUser(messageText, [userContext.mfpuser.id] );
		
		mf.push.sendNotificationByDeviceId(messageText, [userContext.mfpdevice.id]);

		res.send("Order placed!");
	});
	
	app.get('/placeOrder',securityUtils.mfpAuth('push.mobileclient'), (req, res) => {
		
		var messageText = "Hello world from MFP";
		mf.push.sendNotification(messageText);

		mf.liveupdate.setProperty('titleColour', 'titleColour', "red", "Sample property description");
		
		/* Below push related user context data is obtained using the "securityUtils.mfpAuth" filter in the app.get request and 
		sent to the analytics server. Hence the push parameters are passed to the "mf-security" module and push scope is sent to the 
		filter as a parameter. */
		
			var userContext = JSON.stringify(req.securityContext);
			console.log("UserContext --> " + userContext);
			userContext = userContext.replace(/-/g, '');
			userContext = JSON.parse(userContext);
			console.log("Usercontext replaced ---> " + userContext.mfpapplication);
	
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
			
// 			mf.analytics.sendCustomLogs(customLogInputs);

			res.send("Order placed! : " + userContext);
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
	
	var port = process.env.PORT || 8080;
	app.listen(port);
	console.log('Node.js web server at port 7000 is running..');
	
	console.log("checking changes ----> server in exports");
	return app;
	};
