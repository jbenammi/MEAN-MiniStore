var product = mongoose.model('products');

module.exports = {
	index: function(request, response){
		product.find({}, function(err, products){
			if(err) {
				response.json(err);
			}
			else{
				response.json(products);
			}
		})
	},
	create: function(request, response){
		var newProduct = new product(request.body);

		newProduct.save(function(err){
			if(err){
				response.json(err);
			}
			else{
				response.json({success: true});
			}
		})
	},
	update: function(request, response){
		product.update({_id: request.params.id}, {$set: {qty: request.body.qty}}, function(err){
			if(err){
				response.json(err);
			}
			else{
				response.json({success: true});
			}
		})
	},
	// function available should it be needed.
	delete: function(request, response){
		console.log(request.params.id)
		product.remove({_id: request.params.id}, function(err){
			if(err){
				response.json(err);
			}
			else{
				response.json({success: true});
			}
		})
	}
}