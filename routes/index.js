var express = require('express');
var router = express.Router();
var empMode= require('../modules/employee');

var asdMode= require('../modules/asd');

var jwt = require('jsonwebtoken');


/* GET home page. */

var asd=asdMode.find({});

var r=2;

if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}

function checkempty(req,res,next){
  var username=req.body.uname;
  var email=req.body.email;
  var password=req.body.password;
  var con=req.body.conformpass;

  if(username=='' || email==''|| password=='' || con=='' )
  res.render('signup',{msg:'All Values Are Required'});

  else
  next();
}

function checkUsername(req,res,next){
  var uname=req.body.uname;
  var checkexitemail=asdMode.findOne({username:uname});
  checkexitemail.exec((err,data)=>{
 if(err) throw err;
 if(data){
  
return res.render('signup', { title: 'Password Management System', msg:'Username Already Exit' });

 }
 next();
  });
}

function checkLoginUser(req,res,next){
  var userToken=localStorage.getItem('userToken');
  try {
    var decoded = jwt.verify(userToken, 'loginToken');
  } catch(err) {
    r=0;
    res.redirect('/login');
  }
  next();
}

function checkEmail(req,res,next){
  var email=req.body.email;
  var checkexitemail=asdMode.findOne({email:email});
  checkexitemail.exec((err,data)=>{
 if(err) throw err;
 if(data){
  
return res.render('signup', { title: 'Password Management System', msg:'Email Already Exit' });

 }
 next();
  });
}

router.get('/',function(req,res,next){
  
  var a=localStorage.getItem('loginUser');

  if(r==2)
  res.render('home',{loginuser:a,msg:''});

  else
  res.render('home',{loginuser:a,msg:'Please Login First '});

});

module.exports = router;
var employee=empMode.find({});

router.get('/index' ,checkLoginUser,function(req, res, next) {
  var a=localStorage.getItem('loginUser');
  employee.exec(function(err,data){
    if(err) throw err;
    res.render('index',{title:'Employee Records', records:data,loginuser:a});
  });
});

router.post('/index',checkLoginUser,function(req, res, next) {
  var a=localStorage.getItem('loginUser');
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
      res.render('index',{title:'Employee Records', records:data,loginuser:a});
    });

  });
  
});



router.post('/signup',checkempty,checkEmail, checkUsername ,function(req, res, next) {
 
  var empdetails=new asdMode({
    username:req.body.name,
    email:req.body.email,
    password:req.body.password,
    use:req.body.name

  });

  var password=req.body.password;
  var con=req.body.conformpass;

if(password==con)
{
  empdetails.save(function(err,res1){
    if(err) throw err;

    asd.exec(function(err,data){
      if(err) throw err;
     res.redirect('login');

    });

  });
  
}

else
res.render('signup',{msg:'password not matched'});


 
});


router.get('/signup',function(err,res,next){
  var a=localStorage.getItem('loginUser');
  res.render('signup',{msg:'',loginuser:a});
})

router.get('/login',function(err,res,next){

  var a=localStorage.getItem('loginUser');
  res.render('login',{msg:'please log in first',loginuser:a});
})

router.post('/login',function(req,res,next){
  var a=localStorage.getItem('loginUser');
  var password=req.body.password;
  var username=req.body.uname;
  
  var checkUser=asdMode.findOne({username:username});
  checkUser.exec((err, data)=>{
   if(data==null){
    res.render('login', { title: 'Password Management System', msg:"Invalid Username and Password.",loginuser:a});

   }
   
   else{
if(err) throw err;

var getUserID=data._id;
var getPassword=data.password;

if(getPassword==password){
  r=2;
  var token = jwt.sign({ userID: getUserID }, 'loginToken');
  localStorage.setItem('userToken', token);
  localStorage.setItem('loginUser', username);

  res.redirect('/dasboard');
}

else{
  res.render('index', { title: 'Password Management System', msg:"Invalid Username and Password.",loginuser:a });

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

router.get('/font',checkLoginUser,function(err,res,next){
  var a=localStorage.getItem('loginUser');
  res.render('font',{loginuser:a});
})


