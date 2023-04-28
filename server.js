// import syntax (recommended)
// import yahooFinance from 'yahoo-finance2';

// require syntax (if your code base does not support imports)
const yahooFinance = require('yahoo-finance2').default; // NOTE the .default
const express = require('express')
// const results = yahooFinance.search('AAPL').then((response) => {
// 	console.log(response)
// });
// const results = await yahooFinance.search('AAPL', { someOption: true, etc });

// console.log(results)
const app = express()
const port = 3001;
app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.get('/api', (req, res) => {

	if (Object.keys(req.query).length && Object.keys(req.query).includes('ticker')) {
		const fieldsToReturn = [
			'shortName',
			'averageAnalystRating', 
			'fiftyDayAverage', 
			'fiftyDayAverageChangePercent', 
			'regularMarketPrice', 
			'regularMarketDayHigh', 
			'regularMarketDayRange'
		];
		const result = yahooFinance.quote(req.query.ticker.trim()).then(response => {
			let newFields = {};
			// console.log(response)
			fieldsToReturn.forEach(item => {
				if (response[item]) {
					newFields[item] = response[item];
				}
			})
			console.log(newFields)	
		    res.header("Access-Control-Allow-Origin", "*");
    		res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Headers, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization");
    		res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, PATCH, OPTIONS');
		    res.setHeader('Content-Type', 'application/json');
    		res.end(JSON.stringify(newFields));
		});	
	}

})
app.listen(port, () => {
  console.log(`Example app listening on port ${port} http://localhost:${port}`)
})



const query = 'TSLA';
if (false) {
	const queryOptions = { 
		period1: new Date(new Date().setDate(new Date().getDate()-14)).toLocaleDateString("en-US"), 
		period2: new Date().toLocaleDateString("en-US"),
		interval: '1d' 
	};
	// const result = await yahooFinance.historical(query, queryOptions);
	const result = yahooFinance.historical(query, queryOptions)
		.then(response => {
			console.log(response)
		});

	console.log(result)
}

if (false) {
	const fieldsToReturn = ['averageAnalystRating', 'fiftyDayAverage', 'fiftyDayAverageChangePercent', 'regularMarketPrice', 'regularMarketDayHigh', 'regularMarketDayRange', 'priceToBook']
	const result = yahooFinance.quote('AAPL').then(response => {
		let newFields = {};
		fieldsToReturn.forEach(item => {
			if (response[item]) {
				newFields[item] = response[item];
			}
		})
		console.log(newFields)
	});	
}
