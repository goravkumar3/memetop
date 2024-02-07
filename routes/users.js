const mongoose=require('mongoose')
const plm=require('passport-local-mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/pinterest')

const userSecheme=new mongoose.Schema({
 username:{
  type:String,
  unique:true,
  requied:true
 },
 posts:[{
   type:mongoose.Schema.Types.ObjectId,
   ref:'Post'
 }],
 dp:{
  type:String
 },
 email:{
    type:String,
    requied:true,
    unique:true
 },
 password:{
  type:String
 },
 fullname:{
  type:String,
  requied:true
 }
})
userSecheme.plugin(plm)
module.exports=mongoose.model('User',userSecheme)
