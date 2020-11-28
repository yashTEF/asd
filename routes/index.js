var express = require('express');
var router = express.Router();
var empMode= require('../modules/employee');
/* GET home page. */



module.exports = router;
var employee=empMode.find({});

router.get('/', function(req, res, next) {
  employee.exec(function(err,data){
    if(err) throw err;
    res.render('index',{title:'Employee Records', records:data});
  });
});

router.post('/',function(req, res, next) {

  var empdetails=new empMode({
    name:req.body.name,
    email:req.body.mail,
    etype:req.body.etype,
    hourlyrate:req.body.hrate,
    totalhour:req.body.totalhour,

  });


  empdetails.save(function(err,res1){
    if(err) throw err;

    employee.exec(function(err,data){
      if(err) throw err;
      res.render('index',{title:'Employee Records', records:data});
    });

  });
  
});

router.get('/login',function(err,res,next){
  res.render('login');
})


router.get('/signup',function(err,res,next){
  res.render('signup',{msg:''});
})
router.get('/login',function(err,res,next){
  res.render('login',{msg:''});
})