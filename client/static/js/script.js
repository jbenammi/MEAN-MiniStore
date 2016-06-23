		var myApp = angular.module('myApp', ['ngRoute', 'ngMessages', 'angularMoment']);

		myApp.config(function($routeProvider){
			$routeProvider
				.when('/', {
					templateUrl: 'static/partials/dashboard.html'
				})
				.when('/customers', {
					templateUrl: 'static/partials/customers.html'
				})d
				.when('/orders', {
					templateUrl: 'static/partials/orders.html'
				})
				.when('/products', {
					templateUrl: 'static/partials/products.html'
				})
				.otherwise({
					redirectTo: '/'
				})
		})

		// myApp.config(function(paginationTemplateProvider) {
		//     paginationTemplateProvider.setPath('path/to/dirPagination.tpl.html');
		//     paginationTemplateProvider.setString('<div class="my-page-links">...</div>');
		// });

		myApp.factory('customerFactory', function($http){
			var customers = [];
			var factory = {};

			factory.index = function(callback){
				$http.get('/customers').success(function(results){
					customers = results;
					callback(customers);
				})
			}

			factory.create = function(customer, callback){
				if(customers.length == 0){
					$http.post('/customers', customer).success(function(results){
							callback();
						})
						return true
				}
				else{
					for (var i = 0; i < customers.length; i++) {
						if(customers[i].name == customer.name){
							console.log(customers[i])
							return false
						}
					}
					$http.post('/customers', customer).success(function(results){
						callback();
					})
					return true
				}
			}
			factory.delete = function(customer_id, callback){
				$http.delete('/customers/' + customer_id).success(function(results){
					callback();
				})
			}
			return factory;
		})

		myApp.factory('orderFactory', function($http){
			var orders = [];
			var factory = {};

			factory.index = function(callback){
				$http.get('/orders').success(function(data){
					orders = data;
					callback(orders);
				})
			}
			factory.create = function(id, order, callback){
				$http.post('/orders/' + id, order).success(function(results){
					console.log('c_order', results)
					callback();
				})
			}

			factory.delete = function(customer_id, callback){
				$http.delete('/orders/' + customer_id).success(function(results){
					console.log(results);
					callback();
				})
			}			
			return factory;
		})

		myApp.factory('productFactory', function($http){
			var products = [];
			var factory = {};

			factory.index = function(callback){
				$http.get('/products').success(function(data){
					products = data;
					callback(products);
				})
			}
			factory.create = function(product, callback){
				console.log(product);
				$http.post('/products', product).success(function(results){
					console.log(results);
					callback();
				})
			}

			factory.update = function(product_id, ord_qty, callback){
				console.log(product_id);
				console.log(ord_qty)
				$http.post('/products/' + product_id +"/update", ord_qty).success(function(results){
					console.log(results);
					callback();
				})
			}			

			factory.delete = function(product_id, callback){
				console.log(product_id);
				$http.delete('/products/' + product_id).success(function(results){
					console.log(results);
					callback();
				})
			}			
			return factory;
		})
		myApp.controller('customersController', function(customerFactory){
			var self = this
			self.customers = []
			self.newCustomer = {}
			self.userExists = {exists: false}

			customerFactory.index(function(data){
				self.customers = data;
			});

			self.create = function(){
				self.userExists.exists = false;
				var valid = customerFactory.create(self.newCustomer, function(){
					customerFactory.index(function(data){
						self.customers = data;
					})
				});
				if(valid){
					self.newCustomer = {};
				}
				else{
					self.userExists.exists = true;
					self.newCustomer = {};
				}
			}

			self.delete = function(customer_id){
				customerFactory.delete(customer_id, function(){
					customerFactory.index(function(data){
						self.customers = data;
					})
				});
			}
		})

		myApp.controller('ordersController', function(customerFactory, orderFactory, productFactory){
			var self = this
			self.customers = [];
			self.orders = [];
			self.products = [];
			self.newOrder = {};

			customerFactory.index(function(data){
				self.customers = data;
			})

			orderFactory.index(function(data){
				self.orders = data;
			})

			productFactory.index(function(data){
				self.products = data;
			})

			self.create = function(){
				var product_index;
				var customer_id;
				var product_id;
				var new_qty;
				for (var i = 0; i < self.products.length; i++) {
						// console.log(self.products[i].qty)
					if(self.products[i]._id == self.newOrder.product){
						product_index = i
						product_id = self.newOrder.product;
						self.newOrder.product = self.products[product_index].name;
					}
				}
				if(self.newOrder.qty > self.products[product_index].qty){
					alert('Requested order quantity exceeds amount on hand')
					self.newOrder = {}
				}
				else{
					for (var i = 0; i < self.customers.length; i++) {
						if(self.customers[i]._id == self.newOrder.customer){
							customer_id = self.newOrder.customer;
							self.newOrder.customer = self.customers[i].name;
						}
					}
					new_qty = {qty: self.products[product_index].qty - self.newOrder.qty};
					console.log(self.new)
					orderFactory.create(customer_id, self.newOrder, function(){
						orderFactory.index(function(data){
							self.orders = data;
						})
					});
					productFactory.update(product_id, new_qty, function(){
						productFactory.index(function(data){
							self.products = data
						})
					});
				}
				self.newOrder = {};
			}

			self.delete = function(order_id){
				console.log(order_id)
				orderFactory.delete(order_id, function(){
					orderFactory.index(function(data){
						self.orders = data;
					})
				});
			}
		});
		myApp.controller('productsController', function(productFactory){
			var self = this
			self.products = [];
			self.newProduct = {};

			productFactory.index(function(data){
				self.products = data;
			})

			self.create = function(){
				console.log(self.newProduct);
				productFactory.create(self.newProduct, function(){
					productFactory.index(function(data){
						self.products = data;
					})
				});
				self.newProduct = {};
			}

			self.delete = function(product_id){
				console.log(product_id);
				productFactory.delete(product_id, function(){
					productFactory.index(function(data){
						self.products = data;
					})
				});
			}
		});