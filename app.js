const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf=require('csurf')
const multer=require('multer')

const errorController = require('./controllers/error');
const User = require('./models/user');


const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString().replaceAll(":","-") + '-' + file.originalname);
  }
});

const MONGODB_URI =
  'mongodb+srv://youhannamen:nDzaKXKun6Tgdn4R@cluster0.rn3azdg.mongodb.net/shop?retryWrites=true&w=majority';

const app = express();
//for session
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});
//for csrf attack
const csrfProtection=csrf()
app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
//for files images is the folder we store in 
app.use(multer({storage: fileStorage}).single('image')) 
//static folders
app.use(express.static(path.join(__dirname, 'public')));
//must for entering image
app.use('/images',express.static(path.join(__dirname, 'images')));
//for session
app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
  })
);

//must make it after intiallizing the session
 app.use(csrfProtection);

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      if(!user){
        return next();
      }
      req.user = user;
      next();
    })
    .catch(err => {throw new Error(err)});
});

//to pass variable to all the pages
app.use((req,res,next)=>{
res.locals.isAuthenticated=req.session.isLoggedIn
res.locals.csrfToken=req.csrfToken();
next();

})

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);


app.get('/500',errorController.get500)

app.use(errorController.get404);


app.use((error,req,res,next)=>{
  console.log(error)
res.redirect('/500')

})

mongoose
  .connect(MONGODB_URI)
  .then(result => {
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });
