const express = require("express");
const bodyParser = require("body-parser");
const twilio = require("twilio");
const dotenv = require("dotenv");

dotenv.config();

// requireing mongoose
const mongoose = require("mongoose");

const bcrypt = require("bcrypt");
const saltRounds = 10;

//require sms login code
// require("sms-login-code.js");

let gigs = ["My First Gig is here!"];


// connecting to the database
mongoose.connect("mongodb://127.0.0.1:27017/louisDB", {useNewUrlParser: true, useUnifiedTopology: true});
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.use(bodyParser.json());



// creating a schema
const userSchema = ({
  email: {
    type: String,
    unique: true
  },
  password: String,
  // gige data
  Fname: String,
  skill:String,
  tel:String,
  location: String,
  description: String


});

//WORKERS SCHAME
var imageSchema = new mongoose.Schema({
  Fname: String,
  email: String,
  password: String,
  // gige data
  location: String,
  skill:String,
  tel:String,
  description: String
});


// creating a schema
const workSchema = ({
  email: String,
  password: String,
  // gige data
  Fname: String,
  skill:String,
  tel:String,
  location: String,
  picture: String,
  description:String


});

//contact schema code below
const contactSchema = ({
     
  name: String,
  email: String,
  subject: String,
  message: String
})






// creating a model (e.g table name) for sigup and login with email and pass
const User = mongoose.model("User", userSchema);

// create a database for giges is here
const GigeTable = mongoose.model("GigeTable", imageSchema);




const PostWorkDB = mongoose.model("PostWorkDB", workSchema);


// main contact form below code
const contactForm = mongoose.model("contactForm", contactSchema);


//sms message code below
function sendSMS(){

  const client = new twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH)
  return client.messages.create({body:"hey this is a message from bolgatanga workers jobs portal", from:"+13345084973", to:process.env.PHONE})
  .then(message => console.log(message))
  .catch(err => console.log(err))

}




//end of sms code 




// code for the footer year
const day = new Date();
const currentYear = day.getFullYear();


app.get("/", function(req, res){

  GigeTable.find({}, function(err,workerFound){
       res.render("list", {footerYear: currentYear, workers:workerFound});
   })


});


app.get("/signUp", function(req, res){
  res.render("signUp");
})

app.get("/login", function(req, res){
  res.render("login");
})

//get route for find talented Workers
app.get("/find-talent-workers", function(req, res){

  GigeTable.find({}, function(err,workerFound){
      res.render("find-talent-workers", {footerYear: currentYear, workers:workerFound});
      

  })

});

app.get("/sms-sent-thanks", function(req, res){
 
  sendSMS();
  res.render("sms-sent-thanks");
});


app.get("/congratulation-on-create-gige", function(req, res){
      res.render("congratulation-on-create-gige", {footerYear: currentYear});
})




// users profiles
app.get("/createSkill", function(req, res){
  res.render("createSkill", {footerYear: currentYear});
})

app.get("/viewProfile", function(req, res){
  res.render("viewProfile", {footerYear: currentYear});
})

app.get("/all-gigs", function(req, res){
  GigeTable.find({}, function(err,workerFound){
    res.render("all-gigs", {footerYear: currentYear, workers:workerFound});
})

 
})



// this is the get routes of post work
app.get("/login-customer", function(req, res){
  res.render("post-work-files/login-customer");
})

app.get("/sign-up-to-post-work", function(req, res){
  res.render("post-work-files/sign-up-to-post-work");
})

app.get("/work-poster-dashboard", function(req, res){
  res.render("post-work-files/work-poster-dashboard");
})

//admin route
app.get("/view_all_workers", function(req, res){

  GigeTable.find({}, function(err,workerFound){
    res.render("admin/view_all_workers", {footerYear: currentYear, workers:workerFound});
    

})
});


//find by skills categories 

app.get("/electrician", function(req, res){
  GigeTable.find({}, function(err,workerFound){
    res.render("electrician", {footerYear: currentYear, workers:workerFound});
    

})
})

app.get("/carpenter", function(req, res){
  GigeTable.find({}, function(err,workerFound){
    res.render("carpenters", {footerYear: currentYear, workers:workerFound});
    

})
})

app.get("/cleaner", function(req, res){
  GigeTable.find({}, function(err,workerFound){
    res.render("cleaners", {footerYear: currentYear, workers:workerFound});
    

})
})

app.get("/gardener", function(req, res){
  GigeTable.find({}, function(err,workerFound){
    res.render("gardeners", {footerYear: currentYear, workers:workerFound});
    

})
})
//end of find by skills categories 


app.post("/signUp", function(req, res){

  try {

    bcrypt.hash(req.body.Password, saltRounds, function(err, hash){

       const newUser = new User({
         email: req.body.Useremail,
         password: hash
       });

       newUser.save(function(err){
         if(err){
           console.log(err);
         }else{
           res.redirect("login");
         }
       });

    });

  } catch (err) {
    console.log(err);

  }
});




 app.post("/login", function(req, res){

      try {

        const username = req.body.Useremail;
        const password = req.body.Password;


         User.findOne({email: username}, function(err, foundUser){
           if(err){
             console.log(err);
           }else {
             if(foundUser){
               bcrypt.compare(password, foundUser.password, function(err, result){
                 if(result === true){
                   res.render("viewProfile", {footerYear: currentYear, me: foundUser.email, gigsHere:gigs});
                 }
               });
             }
           }
         });


      } catch (err) {
          res.redirect("/login")
      }


 });

// this is the giges workers post ...................................



app.post("/createSkill", function(req, res){

  try {

       const newUser = new GigeTable({
         email: req.body.email,
         Fname: req.body.fNane,
         skill:req.body.skillName,
         tel:req.body.telNumber,
         location:req.body.locationName,
         description:req.body.descriptionDoc

       });

       newUser.save(function(err){
         if(err){
           console.log(err);
         }else{
           res.redirect("/congratulation-on-create-gige");
         }
       });



  } catch (err) {
    console.log(err);

  }
});


// this is the login and signup routes for post work

app.post("/sign-up-to-post-work", function(req, res){

  try {

    bcrypt.hash(req.body.Password, saltRounds, function(err, hash){

       const newUser = new PostWorkDB({
         email: req.body.Useremail,
         password: hash
       });

       newUser.save(function(err){
         if(err){
           console.log(err);
         }else{
           res.redirect("login-customer");
         }
       });

    });

  } catch (err) {
    console.log(err);

  }
});



 app.post("/login-customer", function(req, res){

      try {

        const username = req.body.Useremail;
        const password = req.body.Password;


        PostWorkDB.findOne({email: username}, function(err, foundUser){
           if(err){
             console.log(err);
           }else {
             if(foundUser){
               bcrypt.compare(password, foundUser.password, function(err, result){
                 if(result === true){
                    res.render("post-work-files/work-poster-dashboard", {footerYear: currentYear, me: foundUser.email, gigsHere:gigs});
                 }
               });
             }
           }
         });


      } catch (err) {
          res.redirect("/login-customer");
      }


 });

//main contact form insert code here

app.post("/contact", function(req, res){

  try {

       const contactinfo = new contactForm({
       
         name: req.body.name,
         email: req.body.email,
           subject: req.body.subject,
           message: req.body.message
       });

       contactinfo.save(function(err){
         if(err){
           console.log(err);
         }else{
           res.redirect("/");
         }
       });



  } catch (err) {
    console.log(err);

  }
});











//admin route
// delete workers
app.post("/delete", function(req, res){
 const checkBoxId = req.body.checkbox;
 GigeTable.findByIdAndRemove(checkBoxId, function(err){
  if(!err){
    console.log("completed deleted the item from the database!");
    res.redirect("/view_all_workers");
  }
 })

})




//.........................................................



app.listen(5000, function(){
  console.log("server is running on port 5000");
})
