const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://new-Shashank:ShAsHaNk@cluster0.loytd.mongodb.net/<dbname>?retryWrites=true&w=majority', {useNewUrlParser: true});
var conn=mongoose.connection;

var buyerSchema =new mongoose.Schema({
  username:String,
  title:String,
  projectid:String,
  price:Number,
  image:String,

});

var buyerModel = mongoose.model('buyer', buyerSchema);
module.exports=buyerModel;