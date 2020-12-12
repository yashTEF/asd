const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://new-Shashank:ShAsHaNk@cluster0.loytd.mongodb.net/<dbname>?retryWrites=true&w=majority', {useNewUrlParser: true});
var conn=mongoose.connection;

var projectSchema =new mongoose.Schema({
    index:String,
    id:String,
    username:String,
    title:String,
    projecttype:String,
    shortd:String,
    price:Number,
	description:String,
	image:String,
});

var projectModel = mongoose.model('project', projectSchema);
module.exports=projectModel;