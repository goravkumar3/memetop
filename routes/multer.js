const multer=require('multer')
const {v4:uuidv4}=require('uuid')
const path=require('path')
const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'./public/images/uploads');//destination
    },
    filename:function(req,file,cb){
        //generating unique file name before saving in directory

        const uniqueFilename=uuidv4()
        cb(null,uniqueFilename+path.extname(file.originalname))
    }
})
const upload=multer({storage:storage})
module.exports=upload