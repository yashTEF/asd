const mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost:27017/employee', {useNewUrlParser: true, useCreateIndex: true,});

mongoose.connect('mongodb+srv://new-Shashank:ShAsHaNk@cluster0.loytd.mongodb.net/<dbname>?retryWrites=true&w=majority', {useNewUrlParser: true});
var conn=mongoose.connection;
//var conn =mongoose.Collection;
var employeeSchema=new mongoose.Schema({
    name: String,
    email: String,
    etype:String,
    hourlyrate: Number,
    totalhour:Number
});

var employeeModel=mongoose.model('Employee',employeeSchema);

module.exports=employeeModel;