var express = require('express');
var router = express.Router();
var userModel=require('./users')
var postModel=require('./posts')
var passport=require('passport')
const upload=require('./multer')
const localStrategy=require('passport-local')
passport.use(new localStrategy(userModel.authenticate()))
/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});
router.get('/login',function(req, res) {
  res.render('login',{error:req.flash('error')});
});

//create user
router.post('/register',function(req,res){
  const {username,email,fullname,password}=req.body
  let userData=new userModel({username,email,fullname})
  userModel.register(userData,password)
  .then(function(registereduser){
    passport.authenticate('local')(req,res,function(){
      res.redirect('/profile')
    })
  })
})
//login
router.post('/login',passport.authenticate('local',{
  successRedirect:'/profile',
  failureRedirect:"/login",
  failureFlash:true
}),function(req,res){})


// is logged middleware

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next()
  }
  res.redirect('/login')
}
//logout
router.get('/logout',function(req,res,next){
  req.logout(function(err){
    if(err){
      return next(err)
    }
    res.redirect("/login")
  })
})

//profile
router.get('/profile',isLoggedIn ,async function (req, res){
  let user=await userModel.findOne({
    username:req.session.passport.user
  }).populate('posts')
res.render('profile',{user})
})

router.get('/creatememe',isLoggedIn , function(req, res) {
  res.render('creatememes');
});
//upload file
router.post('/upload',upload.single('file'),async(req,res)=>{
  if(!req.file){
    return res.status(400).send("no file were uploaded.")
  }
  let user=await userModel.findOne({
    username:req.session.passport.user
  })
  let post=await postModel.create({
    title:req.body.title,
    files:req.file.filename,
    user:user._id
  })
  user.posts.push(post._id)
  await user.save();
  res.redirect('/profile')
})
router.get("/home",isLoggedIn,async function (req, res) {
  let users=await userModel.find({}).populate('posts')
  console.log(users)
  res.render('home',{users})
})
// Create Post
// router.get('/post',isLoggedIn,async function(req,res){
//   let postData=await postModel.create({
//     postText:"Hello Chutiya",
//     user:
//   })
//   let user=await userModel.findOne({_id:'65b34345cbf4998790e421fe'})
//   user.posts.push(postData._id);
//   await user.save()
//   res.send('done')
// })
// //all post

module.exports = router;
