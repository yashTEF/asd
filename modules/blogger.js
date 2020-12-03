const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://new-Shashank:ShAsHaNk@cluster0.loytd.mongodb.net/<dbname>?retryWrites=true&w=majority', {useNewUrlParser: true});
var conn=mongoose.connection;

var bloggerSchema =new mongoose.Schema({
	title:String,
	username:String,
	description:String,
	artical:String,
	image:String,
});

var bloggerModel = mongoose.model('blogger', bloggerSchema);
module.exports=bloggerModel;