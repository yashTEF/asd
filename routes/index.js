var express = require('express');
var router = express.Router();
var empMode= require('../modules/employee');
var multer = require('multer');
var asdMode= require('../modules/asd');
var bloggerMode= require('../modules/blogger');
var projectMode= require('../modules/project');
var sellerMode= require('../modules/seller');
var buyerMode= require('../modules/buyer');
var cartMode= require('../modules/cart');
const session = require('express-session')
const fs = require('fs');
var jwt = require('jsonwebtoken');
var path = require('path');
const { websecurityscanner } = require('googleapis/build/src/apis/websecurityscanner');
const { ESTALE } = require('constants');

var employee=empMode.find({});
var project=projectMode.find({});
var blogger=bloggerMode.find({});
var seller=sellerMode.find({});
var buyerer=buyerMode.find({});
var cart=cartMode.find({});
/* GET home page. */

var asd=asdMode.find({});

var r=1;

//#########################3
if (router.get('env') === 'production') {
  app.set('trust proxy', 1) // trust first proxy
  sess.cookie.secure = true // serve secure cookies
}

router.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge:24*60*60*1000 }
})
)



//########################


//###########3IMAGE
router.use(express.static(__dirname+"./public/"));

var ups="uploads";
var Storage= multer.diskStorage({
 
  destination:"./public/"+ups+"/",
  filename:(req,file,cb)=>{
    cb(null,file.fieldname+"_"+Date.now()+path.extname(file.originalname));
  }
});

var upload = multer({
  storage:Storage
}).single('file');


//##########image
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
  
  var a=req.session.username;
  var b=req.session.char;

  if(r==2)
  res.render('home',{loginuser:a,msg:'',loginas:b,loginuser:a});

  else
  res.render('home',{loginuser:a,msg:'Please Login First ',loginas:b,loginuser:a});

});




router.get('/index' ,checkLoginUser,function(req, res, next) {
  var a=req.session.username;
  var b=req.session.char;


  employee.exec(function(err,data){
    if(err) throw err;
    res.render('index',{title:'Employee Records', records:data,loginas:b,loginuser:a});
  });
});

router.post('/index',checkLoginUser,function(req, res, next) {
  var a=req.session.username;
  var b=req.session.char;

  var empdetails=new empMode({
    name:req.body.name,
    email:req.body.mail,
    etype:req.body.etype,
    hourlyrate:req.body.hrate,
    totalhour:req.body.totalhour,
    Image:req.body.file,

  });


  empdetails.save(function(err,res1){
    if(err) throw err;

    employee.exec(function(err,data){
      if(err) throw err;
      
      res.render('index',{title:'Employee Records', records:data,loginuser:a,loginas:b});
    });

  });
  
});



router.post('/signup',checkempty,checkEmail, checkUsername ,function(req, res, next) {
  
  var a=req.session.username;
  var b=req.session.char;


  var empdetails=new asdMode({
    username:req.body.name,
    email:req.body.email,
    password:req.body.password,
    use:req.body.name,
    

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
res.render('signup',{msg:'password not matched',loginas:b,loginuser:a});


 
});


router.get('/signup',function(req,res,next){

  if(req,session.username){
    res.redirect('/');
  }

  else{
    
    var a=req.session.username;
    var b=req.session.char;

  res.render('signup',{msg:'',loginuser:a,loginas:b});
  }

})

router.get('/login',function(req,res,next){

  if(req.session.username){
    
    var a=req.session.username;
    var b=req.session.char;
  
    res.render('home',{msg:'please log in first',loginuser:a,loginas:b});
  }


  else{
    var a=req.session.username;
    var b=req.session.char;
  
    res.render('login',{msg:'please log in first',loginuser:a,loginas:b});
  }

})

router.post('/login',function(req,res,next){
  
  var password=req.body.password;
  var username=req.body.uname;
  var loginas=req.body.loginas;


  var a=req.session.username;
  var b=req.session.char;

  var checkUser=asdMode.findOne({username:username});
  checkUser.exec((err, data)=>{
   if(data==null){
    res.render('login', { title: 'Password Management System', msg:"Invalid Username and Password.",loginuser:a,loginas:b});

   }
   
   else{
if(err) throw err;

var getUserID=data._id;
var getPassword=data.password;

if(getPassword==password){
  r=2;
  var token = jwt.sign({ userID: getUserID }, 'loginToken',);
  localStorage.setItem('userToken', token);
  localStorage.setItem('loginUser', username);
  localStorage.setItem('loginas',loginas);
  req.session.username=username;
  req.session.char=loginas;

  res.redirect('/');
}

else{
  res.render('login', { title: 'Password Management System', msg:"Invalid Username and Password.",loginuser:a ,loginas:b});

}
   }
  });
 

});

router.get('/dasboard',checkLoginUser,function(req, res, next) {

  if(req.session.username){

    var a=req.session.username;
  var b=req.session.char;

  blogger.exec(function(err,data){
if(err) throw err;
res.render('dasboard', { title: 'Employee Records', records:data, success:'',loginas:b,loginuser:a });
  });

  }
  else{
    res.redirect('/login');
  }
  
  
});


router.post('/dasboard', upload, function(req, res, next) {

  var a=req.session.username;
  var b=req.session.char;
  var x=new Date();
  var bloggerDetails = new bloggerMode({
    title:req.body.title,
    username:x,
    description:req.body.description,
    artical:req.body.artical,
    image:req.file.filename,
    
  });

  bloggerDetails.save(function(err,req1){
    if(err) throw err;
    blogger.exec(function(err,data){
      if(err) throw err;
      res.render('dasboard', { title: 'Employee Records', records:data, success:'Record Inserted Successfully',loginuser:a,loginas:b });
        });
  })
  
  
});


router.get('/logout',function(req,res,next){
 /*
  req.session.destroy(function(err){

    if(err) throw err;

    localStorage.removeItem('userToken');
  localStorage.removeItem('loginUser');
  localStorage.removeItem('loginas');


    res.redirect('/');
  })
 */

 req.session.char=null;
 req.session.username=null;
 res.redirect('/');

})


router.get('/blogger',function(req,res){

  var a=req.session.username;
  var b=req.session.char;

  blogger.exec(function(err,data){
    if(err) throw err;
    res.render('blogger_dashboard', { title: 'Employee Records', records:data, success:'',loginas:b,loginuser:a });
      });
      
})

router.get('/blog_post/:id', function(req, res, next) {
  var username=req.params.id;
  var a=req.session.username;
  var b=req.session.char;

var edit= bloggerMode.findOne({username:username});
edit.exec(function(err,data){
if(err) throw err;
res.render('blog_post', { title: 'Edit Employee Record', records:data,loginuser:a,loginas:b });
  });
  
});



router.get('/projectinfo',checkLoginUser,function(req,res,next){

  if(req.session.username){
    var a=req.session.username;
    var b=req.session.char;
  
    project.exec(function(err,data){
      if(err) throw err;
      res.render('projectinfo',{success:'',records:data,loginas:b,loginuser:a});
    })
  }
  else{
    res.redirect('/login');
  }

})

router.post('/projectinfo',checkLoginUser, upload, function(req, res, next) {
  
  var a=req.session.username;
  var b=req.session.char;
  var x=new Date();
  var w=0;
  var sellerDetails=new sellerMode({
    username:a,
    title:req.body.title,
    projectid:x,
    total:w,
  })

  sellerDetails.save();

  var projectDetails = new projectMode({
    index:x,
    title:req.body.title,
    username:a,
    description:req.body.description,
    shortd:req.body.shortd,
    image:req.file.filename,
    projecttype:req.body.projecttype,
    price:req.body.price,
  });

  projectDetails.save(function(err,res1){
    if(err) throw err;



    project.exec(function(err,data){
      if(err) throw err;
      res.render('projectinfo',{success:"Data Entered Successfully",records:data,loginuser:a,loginas:b})
    })
  })
  
  
});

router.get('/project_dashboard',function(req,res,next){

  var a=req.session.username;
  var b=req.session.char;

  project.exec(function(err,data){
    if(err) throw err;
    res.render('project_dashboard',{records:data,loginas:b,loginuser:a});
  })
})

router.get('/project_card/:id',checkLoginUser,function(req,res,next){


 if(req.session.username)
 {
  var a=req.session.username;
  var b=req.session.char;

  var index=req.params.id;
  var buyerDetails=buyerMode.findOne({username:a,projectid:index});
  var cartDetails=cartMode.findOne({username:a,projectid:index});
  var edit= projectMode.findOne({index:index});
  
  buyerDetails.exec(function(err,data1){
    if(data1==null){

      cartDetails.exec(function(err,data2){
        if(data2==null){
          edit.exec(function(err,data){
            if(err) throw err;   
    
            res.render('project_card', { title: 'Edit Employee Record', records:data ,msg:'not',cart:'not',loginas:b,loginuser:a});             
          
          });

        }

        else{

          edit.exec(function(err,data){
            if(err) throw err;   
    
            res.render('project_card', { title: 'Edit Employee Record', records:data ,msg:'not',cart:'yes',loginas:b,loginuser:a});             
          
          });
        }


      });
     
    }

    else
    {
      edit.exec(function(err,data){
        if(err) throw err;
        res.render('project_card', { title: 'Edit Employee Record', records:data,msg:'yes',loginas:b,loginuser:a });
          });
    }

  })

 }
  else{
    res.redirect('/login');
  }
  
  })
  



  router.post('/project_card/:id',checkLoginUser,function(req,res,next){
    var a=req.session.username;
    var b=req.session.char;


    var projectid=req.body.projectid;
    var username=req.body.username;
    var title=req.body.title;
    var what=req.body.buy;
    var price=req.body.price;
    var image=req.body.image;

   
    
    if(what=='Buy'){

      var cartDetails=cartMode.findOneAndDelete({username:a,projectid:projectid});
      cartDetails.exec(function(err,data){
        if(err) throw err;
  
        var buyerDetails=buyerMode({
          username:a,
          projectid:projectid,
          title:title,
          price:price,
          image:image,

        });
    
        buyerDetails.save();
    
        var checkUser=sellerMode.findOne({projectid:projectid});
        checkUser.exec((err, data)=>{
          if(data==null)
          res.send('data is null');
    
          else{
            if(err) throw err;
            var x=data.total;
            x=x+parseInt(price);
    
            var del=sellerMode.findOneAndDelete({projectid:projectid});
            
            del.exec(function(err,data){
              if(err) throw err;
    
              var sellerDetails=new sellerMode({
                projectid:projectid,
                username:username,
                title:title,
                total:x,
              })
            
              sellerDetails.save();
              res.redirect("/video");
            })
           
          }
    
        })
        
      });
      }

    else{
        var cartDetails=cartMode({
          username:username,
          projectid:projectid,
          title:title,
          price:price,
          image:image,

        });
        cartDetails.save();
        var link='/project_card/'+projectid;
        res.redirect(link);
    }

  })


  router.get('/video',checkLoginUser,function(req,res,next){
   if(req.session.username){
    var a=req.session.username;
    var b=req.session.char;
  
      res.render('video',{loginas:b,loginuser:a,loginas:b});
   }

   else{
     res.redirect('/login');
   }

  })


  router.get('/cart',checkLoginUser,function(req,res,next){

    if(req.session.username){
      var a=req.session.username;
    var b=req.session.char;

    var cartDetails=cartMode.find({username:a});
    cartDetails.exec(function(err,data){
      if(err) throw err;

      res.render('cart',{records:data,loginas:b,loginuser:a});
    })
    }
    else{
      res.redirect('/login');
    }

  })


  router.get('/mycourse',function(req,res,next){

if(req.session.username){
  var a=req.session.username;
  var b=req.session.char;

    var buyerDetails=buyerMode.find({username:a});

    buyerDetails.exec(function(err,data){
      if(err) throw err;
      
      res.render('mycourse',{records:data,loginas:b,loginuser:a});
    })
}

else{
  res.redirect('/login');
}
   
  })

  router.get('/earning',function(req,res,next){


    if(req.session.username){

      var a=req.session.username;
  var b=req.session.char;

    var sellerDetails=sellerMode.find({username:a});

    sellerDetails.exec(function(err,data){
      if(err) throw err;
      
      res.render('earning',{records:data,loginas:b,loginuser:a});

    });

    }

    else{

        res.redirect('/login');
    }
    

  })
//client id
//80181116872-qnom0akloqd0muvo1n46vtm5gb9st820.apps.googleusercontent.com
module.exports = router;


/*
var password=req.body.password;
  var username=req.body.uname;
  
  var checkUser=asdMode.findOne({username:username});
  checkUser.exec((err, data)=>{
   if(data==null){
    res.render('login', { title: 'Password Management System', msg:"Invalid Username and Password."});

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

  res.redirect('/');
}

else{
  res.render('login', { title: 'Password Management System', msg:"Invalid Username and Password.",loginuser:a });

}
   }
  });
*/