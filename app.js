const express=require('express');
const app=express();

const bodyParser=require('body-parser');
const mongoose=require('mongoose');

//Models
const User=require('./models/user');
const localStrategy=require('passport-local');
const passport=require('passport');
const passportLocalMongoose=require('passport-local-mongoose');

mongoose.connect('mongodb://localhost/authDemo');

app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');


app.use(require('express-session')({
    secret:'Bu bir session express uygulamasıdır.',
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());


passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//Routes


app.get('/',(req,res)=>{
    res.render('home');
});



//register
app.get('/register',(req,res)=>{
    res.render('register');
});

app.post('/register',(req,res)=>{
    User.register(new User({username: req.body.username}),req.body.password,(err,user)=>{
        
        if(err){
            console.log(err);
            return res.render('home');
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/");
        });
        
    });
});



//login 
app.get('/login',(req,res)=>{
    res.render('login');
});

app.post('/login',passport.authenticate('local',{ successRedirect:'/secret',failureRedirect:'/login'}));


//sign out
app.get('/signout',(req,res)=>{
    req.logout();
    res.redirect('/');
});


function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next;
    }
    res.redirect('/login');
}

//secret
app.get('/secret',isLoggedIn,(req,res)=>{
    res.render('secret');
});


//-------------------------------
const server=app.listen(3000,()=>{
    console.log('server started at : '+server.address().port);
});


