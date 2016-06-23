var customerSchema = new mongoose.Schema({
	name: {type: String, require: true, minlength: 4, maxlength: 100},
	_orders: [{type: mongoose.Schema.Types.ObjectId, ref: 'orders'}]
},{timestamps: true});

var orderSchema = new mongoose.Schema({
	product: {type: String, require: true},
	qty: {type: Number, require: true, min: 1, max: 99},
	customer: {type: String, require:true}
},{timestamps: true});

var productSchema = new mongoose.Schema({
	name: {type: String, require: true, minlength: 4, maxlength: 50},
	qty: {type: Number, require: true, min: 1, max: 999},
	img: {type: String, require: true},
	description: {type: String, require:true, maxlength:255}
},{timestamps: true});

mongoose.model('customers', customerSchema);
mongoose.model('orders', orderSchema);
mongoose.model('products', productSchema);