const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://new-Shashank:ShAsHaNk@cluster0.loytd.mongodb.net/<dbname>?retryWrites=true&w=majority', {useNewUrlParser: true});
var conn=mongoose.connection;

var sellerSchema =new mongoose.Schema({
  username:String,
  title:String,
  projectid:String,
  total:Number,
});

var sellerModel = mongoose.model('seller', sellerSchema);
module.exports=sellerModel;