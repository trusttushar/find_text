const moment = require('moment');
const fs = require('fs');
var bodyParser = require('body-parser');
const uniqueString = require('unique-string');
const nodemailer = require("nodemailer");
var File = require('./models/files');
module.exports = function(app, passport) {

// To display file upload page
app.get("/",(req,res)=>{
  res.render("file_upload_page.ejs",{message:req.flash('err_file_size')});
})

//Add files Action
app.post("/add/file",(req,res)=>{
     let sampleFile = req.files.fileup;
     if(sampleFile.size<=5000000){
     sampleFile.mv('./public/assets/documents/' +  sampleFile.name, function(err) {

       if (err) throw err;
       let newFile = new File({
        file_title:req.body.file_title,
        file_name:sampleFile.name
       })

       newFile.save(newFile,(err, data) =>{
        if(err) throw err;                
        res.redirect("/");         
       })
     });
    }else{
      req.flash('err_file_size','file size is too larg must be less then 5mb')
      res.redirect("/");
    }
})

// To display All uploaded files
app.get("/added/files",(req,res)=>{
  File.find({},(err,data)=>{
    console.log(data)
    res.render("all_uploaded_files.ejs",{data:data});
  })
})
//to Display search bar for selected file 
app.get("/file/search/text/:id",(req,res)=>{
    res.render("search_bar_page.ejs",{id:req.params.id});
})

// Search text Action 
app.get("/search/text",(req,res)=>{
  File.findOne({_id:req.query.id},(err,data)=>{
    fs.readFile('./public/assets/documents/' + data.file_name, 'utf8', (err, contents)=> {
      let reg = new RegExp(req.query.text,"gi"), result = [], array = contents.split(/\n/);
      array.forEach((val,index)=>{
          if(val.search(reg)!=-1){
            let count=val.split(reg).length-1;
            result.push({line_number:index + 1,number_of_occurrence:count});
          }
      })
      res.json(result);
    });
  })  
})
}
