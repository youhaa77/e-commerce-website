const User = require('../models/user');

const { query, validationResult } = require('express-validator');



exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: false
  });
};

exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    isAuthenticated: false,
    error:''
  });
};

exports.postLogin = (req, res, next) => {

  User.findOne({email:req.body.email})
    .then(user => {
      if(user && user.password===req.body.password){
      req.session.isLoggedIn = true;
      req.session.user = user;
      req.session.save(err => {
        console.log(err);
        res.redirect('/');
      });
    }else{res.redirect('/login');}
    })
    .catch(err => console.log(err));
};

exports.postSignup = (req, res, next) => {
    const email=req.body.email
    const password=req.body.password
    const confirmPassword=req.body.confirmPassword
    const cart={item:[]}
    const errors = validationResult(req);
    console.log(errors.array())
   //const errors=validation(req)
    if(!errors.isEmpty()){
      console.log(errors.array());
      res.status(422).render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      isAuthenticated: false,
      error:errors.array()[0].msg
      });
    }
    else{
    User.findOne({email:email}).then(result =>{
    if(!result && password===confirmPassword){
    const newUser=new User({email:email,password:password,cart:cart})
    newUser.save()
    res.redirect('/login')
    }
    else{
      res.redirect('/signup') 
    }
    }
    )
  }

};

exports.postLogout = (req, res, next) => {
  console.log("logooooout")
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};
