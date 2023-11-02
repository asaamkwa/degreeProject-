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
                 res.render("find-talent-workers", {footerYear: currentYear, me: foundUser.email, gigsHere:gigs});
               }
             });
           }
         }
       });


    } catch (err) {
        res.redirect("/login")
    }


});