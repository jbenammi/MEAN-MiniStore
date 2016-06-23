var customers = require('../controllers/customers.js');
var orders = require('../controllers/orders.js');
var products = require('../controllers/products.js');


module.exports = function(app){
	app.get('/customers', function(request, response){
		customers.index(request, response);
	});

	app.post('/customers', function(request, response){
		customers.create(request, response);
	});

	app.delete('/customers/:id', function(request, response){
		customers.delete(request, response);
	});

	app.get('/orders', function(request, response){
		orders.index(request, response);
	});

	app.post('/orders/:id', function(request, response){
		orders.create(request, response);
	});

	app.delete('/orders/:id', function(request, response){
		orders.delete(request, response);
	});

	app.get('/products', function(request, response){
		products.index(request, response);
	})

	app.post('/products', function(request, response){
		products.create(request, response);
	});

	app.delete('/products/:id', function(request, response){
		products.delete(request, response);
	});	

	app.post('/products/:id/update', function(request, response){
		console.log(request.body, request.params.id)
		products.update(request, response);
	})
}