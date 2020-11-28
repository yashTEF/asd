var express = require('express');
var router = express.Router();
var empMode= require('../modules/employee');

var asdMode= require('../modules/asd');

var jwt = require('jsonwebtoken');


/* GET home page. */

var asd=asdMode.find({});

if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}


function checkLoginUser(req,res,next){
  var userToken=localStorage.getItem('userToken');
  try {
    var decoded = jwt.verify(userToken, 'loginToken');
  } catch(err) {
    res.redirect('/login');
  }
  next();
}

router.get('/home',function(req,res,next){
  

  res.render('home');
});

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



router.post('/signup', function(req, res, next) {

  var empdetails=new asdMode({
    username:req.body.name,
    email:req.body.email,
    password:req.body.password,
    use:req.body.name

  });


  empdetails.save(function(err,res1){
    if(err) throw err;

    asd.exec(function(err,data){
      if(err) throw err;
      res.render('signup',{title:'Employee Records', msg:'data is entered'});

    });

  });
  
});


router.get('/signup',function(err,res,next){
  res.render('signup',{msg:''});
})

router.get('/login',function(err,res,next){
  res.render('login',{msg:''});
})

router.post('/login',function(req,res,next){
  
  var password=req.body.password;
  var username=req.body.uname;
  
  var checkUser=asdMode.findOne({username:username});
  checkUser.exec((err, data)=>{
   if(data==null){
    res.render('login', { title: 'Password Management System', msg:"Invalid Username and Password." });

   }
   
   else{
if(err) throw err;

var getUserID=data._id;
var getPassword=data.password;

if(getPassword==password){
  var token = jwt.sign({ userID: getUserID }, 'loginToken');
  localStorage.setItem('userToken', token);
  localStorage.setItem('loginUser', username);

  res.redirect('/dasboard');
}

else{
  res.render('index', { title: 'Password Management System', msg:"Invalid Username and Password." });

}
   }
  });
 

});

router.get('/dasboard',checkLoginUser,function(req,res,next){

  //localStorage.setItem('loginUser',username);
  var a=localStorage.getItem('loginUser');

  res.render('dasboard',{loginuser:a});

});


router.get('/logout',function(err,res,next){
  localStorage.removeItem('userToken');
  localStorage.removeItem('loginUser');

  res.redirect('/');
})


