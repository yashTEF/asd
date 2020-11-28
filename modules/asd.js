const mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost:27017/employee', {useNewUrlParser: true, useCreateIndex: true,});

mongoose.connect('mongodb+srv://new-Shashank:ShAsHaNk@cluster0.loytd.mongodb.net/<dbname>?retryWrites=true&w=majority', {useNewUrlParser: true});
var conn=mongoose.connection;
//var conn =mongoose.Collection;
var asdSchema=new mongoose.Schema({
    username:String,
    password:String,
    email:String,
    use:String
});

var asdModel=mongoose.model('asd',asdSchema);

module.exports=asdModel;