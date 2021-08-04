var token = require('./createJWT.js');
const user = require('./models/user.js');
const sgMail = require('@sendgrid/mail');
const crypto = require ('crypto');
const jwt = require("jsonwebtoken");
const { DH_CHECK_P_NOT_PRIME } = require('constants');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
templates = 
{
  password_reset: "d-67f50f09913244c1b7eca21c6f60849e",
};

exports.setApp = function ( app, client )
{
    // Incoming : userId, Name, Brand, Model, Category, Location, Replacement, Serial,
    // Outcoming: itemId, error
    app.post('/api/additem', async (req, res, next) =>
    {
      var ret='';
      var error = '';

      const { userId, Name, Brand, Model, Category, Location, Replacement, Serial,  jwtToken } = req.body;

      const db = client.db();
      var count =  await db.collection('counterItem').find({name:"count"}).toArray();

      var index = count[0].index;
      var itemId =index +1;

      var newvalues = { $set: {index: itemId} };
      await db.collection('counterItem').updateOne({name:"count"}, newvalues, function(err, res)
      {
        if (err) console.log("Error");
      })

      const newItem = {userId:userId, Name:Name, Brand:Brand, Model:Model, Category:Category, Location:Location, Replacement:Replacement, Serial:Serial, itemId: itemId};

      try
      {
        const db = client.db();
        const result = db.collection('Assets').insertOne(newItem);
      }
      catch(e)
      {
        error = e.toString();
      }

      var refreshedToken = null;
  
      try
      {
        refreshedToken = token.refresh(jwtToken).accessToken;
      }
      catch(e)
      {
        console.log(e.message);
      }

      var ret = { error: error, jwtToken: refreshedToken };

      res.status(200).json(ret);
    });


    //Incoming: itemId, jwtToken
    app.post('/api/deleteitem', async (req, res, next) =>
    {
     var error = "";
     var id = -1;
     var arr= [];

     const { itemId, jwtToken} = req.body;

     const db = client.db();
     const results = await db.collection('Assets').find({itemId:itemId}).toArray();

     console.log("arr.length:" + arr.length);

     if(results.length > 0)
     {
       id = results[0].userId;

     } else 
     {
       var r = {error: "Item with this Id doesn't exist in the DB", jwtToken:''};
       res.status(200).json(r);
       return;
     }

      try
      {
        if( token.isExpired(jwtToken))
        {
          var r = {error:'The JWT is no longer valid', jwtToken: ''};
          res.status(200).json(r);
          return;
        }
      }
      catch(e)
      {
        console.log(e.message);
      }

      try
      {
       var myquery = {itemId: itemId};

       db.collection("Assets").deleteOne(myquery, function(err,obj)
        {
           if (err) 
           {
             error ="Item with this ID doesnt't exist"
             throw err;
           }
           console.log("Item deleted");
        })
      }
      catch(e)
      {
        error = e.toString();
      }

      var refreshedToken = null;

      try
      {
        refreshedToken = token.refresh(jwtToken).accessToken;
      }
      catch(e)
      {
        console.log(e.message);
      }

      arr = await db.collection('Assets').find({userId:id}).toArray();

      try
      {
        arr = await db.collection('Assets').find({userId:id}).toArray();
        console.log("Delete " + arr.length);
      }
      catch(e)
      {
        console.log("New find");
      }

      var ret = { error: error, jwtToken: refreshedToken, arr:arr};
    
      res.status(200).json(ret);
    });


     // Incoming: FirstName, LastName, Email,Login, Password, Phone, Company Name ,  jwtToken (not required)
     // Ps. Password was already hashed in frontend with md5 file 
     // Outgoing : error
     // Adds the user to the database, creates a token with First, Last names and id
    app.post('/api/register', async (req, res, next) =>
    {
      function getSequenceNextValue(sequenceOfName)
      {
        const db = client.db();
        var sequenceDoc = db.collection('counters').findAndModify(
        {
           query:{_id: sequenceOfName },
           update: {$inc:{sequence_value:1}},
           new:true
         });

       return sequenceDoc.sequence_value;
      }

      const { FirstName, LastName, Email, Login, Password, Phone, CompanyName, jwtToken } = req.body;
      let id = getSequenceNextValue("user_id");
      const newUser = {  userId: id, FirstName:FirstName, LastName:LastName, Email:Email, Login:Login, Password:Password, Phone:Phone, CompanyName:CompanyName};
      var error = '';

      try
      {
        const db = client.db();

        const result = db.collection('Users').insertOne(newUser);
      }
      catch(e)
      {
        error = e.toString();
      }

      try
      {
        const token = require("./createJWT.js");
        ret = token.createToken( FirstName, lastName, id );
      }
      catch(e)
      {
        ret = {error:e.message};
      }

      var ret = { error: error};

      res.status(200).json(ret);
    });


    // incoming: login, password
    // outgoing: token, arr
    // Checks if username with correct passwords are in database
    app.post('/api/login', async (req, res, next) =>
    {

      var error = '';
      var arr= [];
      const { login, password } = req.body;

      const db = client.db();
      const results = await db.collection('Users').find({Login:login,Password:password}).toArray();
      var id = -1;
      var fn = '';
      var ln = '';

      var ret="";

      if( results.length > 0 )
      {
        id = results[0].userId;
        fn = results[0].FirstName;
        ln = results[0].LastName;

        console.log("id"+ id);

        const arr = await db.collection('Assets').find({userId:id}).toArray();

        console.log("Arr length"+ arr.length);

        try
        {
          const token = require("./createJWT.js");
          ret = {token: token.createToken( fn, ln, id ), arr: arr};
        }
        catch(e)
        {
          ret = {error:e.message};
        }
      }

      else
      {
        ret = {error:"Login/Password incorrect"};
      }

      res.status(200).json(ret);
    });


    // incoming: email
    // outgoing: id, email
    // Checks if the user with this email exists in the DB
    // I used it before i created api/checkexistance, i don't want to delete it yet just in case
    app.post('/api/validateEmail', async (req, res, next) =>
    {

      var error = '';
      var { email } = req.body;
      const db = client.db();
      const results = await db.collection('Users').find({Email:email}).toArray();
      var id = -1;
      var email ='';
      var ret;

      if( results.length > 0 )
      {
        id = results[0].userId;
        email = results[0].Email;
        
        try
        {
          ret = {email:email, id:id};
        }
        catch(e)
        {
          ret = {error:e.message};
          console.log("Error");
        }
      }

      else
      {
        ret = {error:"User not found"};
      }

      res.status(200).json(ret);
    });


    // incoming: userId, search (String)
    // outgoing: results[], error
    //Search for cards in DB, if user is still active, refreshes the token
    app.post('/api/searchcards', async (req, res, next) =>
    {
      var error = '';
      const { userId, search, jwtToken } = req.body;
      try
      {
        if( token.isExpired(jwtToken))
        {
          var r = {error:'The JWT is no longer valid', jwtToken: ''};
          res.status(200).json(r);
          return;
        }
      }
      catch(e)
      {
        console.log(e.message);
      }

      var _search = search.trim();
      const db = client.db();

      const results = await db.collection('Cards').find({"Card":{$regex:_search+'.*', $options:'r'}}).toArray();

      var _ret = [];

      for( var i=0; i<results.length; i++ )
      {
        _ret.push( results[i].Card );
      }

      var refreshedToken = null;

      try
      {
        refreshedToken = token.refresh(jwtToken).accessToken;
      }
      catch(e)
      {
        console.log(e.message);
      }

      var ret = { results:_ret, error: error, jwtToken: refreshedToken };

      res.status(200).json(ret);
    });


     // Ingoing : email
     //Outgoing: reset password code (token.resetPasswordToken), error
     //Sends an email with generted code which is stored in token.resetPasswordToken.
    app.post('/api/recover', async (req, res, next) =>
    {

      var error = ''
      var ret ={};

      var { email } = req.body;
      console.log(email);
      const db = client.db();
      const results = await db.collection('Users').find({Email:email}).toArray();

      if (results.length===0)
      {
        console.log("User with this email doesn't exist");

       ret = {error: "Email not registered"};

      }
      else 
      {
        const code = Math.floor(Math.random()*90000+10000);
        console.log('Code: '+ code);

        try
        {
          const token = require("./createJWT.js");
          token.resetPasswordToken=code;
  
          ret = token.resetPasswordToken;
        }
        catch(e)
        {
          ret = {error:e.message};
        }

      // SENDING with TEMPLATE
         function sendTemplate  (to, from, templateId, dynamic_template_data)
         {
             const msg = 
             {
               to,
               from: {name:'Asset labs', email: from},
               templateId,
               dynamic_template_data
             };
             console.log(msg);

             sgMail.send(msg)
             .then((response)=> 
             {
               console.log("response",response);
             })

             .catch((error)=>
             {
               console.log("SendGrid error: ", error)
             })
          }

          var emailCode = {"code":code};
          try 
          {
            sendTemplate(email, 'asset.labs.app@gmail.com', 'd-67f50f09913244c1b7eca21c6f60849e', emailCode);
            console.log("Email was sent");
          }
          catch (err)
          {
            console.log("Error sending the email "+ err);
          }

          ret = {error:error, code:code, email:email};
      }   

      console.log("Ret "+ ret);
      res.status(200).json(ret);
    });
    

    // Ingoing: Email, password
    // Outgoing error
    // Resets password in the DB
    app.post('/api/reset', async (req, res, next) =>
    {
      const { Email, Password } = req.body;
      var error = '';
  
      try
      {
        const db = client.db();

        var myquery = {Email: Email};
        var newvalues = { $set: { Password: Password}};
      
        db.collection("Users").updateOne(myquery, newvalues, function(err, res) 
        {
        if (err) throw err;
        })
      } 
      catch(e)
      {
        error = e.toString();
      }

    });

    
    //Ingoing :  email
    // Outgoing:  error, code
    //Send an email with the code to verify email
    app.post('/api/verifyEmail', async (req, res, next) =>
    {
      const { Email } = req.body;
      const code = Math.floor(Math.random()*90000+10000);
      console.log('Code: '+ code);
      var error = '';

  function sendTemplate  (to, from, templateId, dynamic_template_data){
    const msg = {
      to,
      from: {name:'Asset labs', email: from},
      templateId,
      dynamic_template_data
    };
    console.log(msg);
    sgMail.send(msg)
    .then((response)=> {
      //console.log('Email sent', {templateId, dynamic_template_data});
      console.log("response",response);
    })
    .catch((error)=>{
      console.log("SendGrid error: ", error)
    })

 }
var emailCode = {"code":code};

     try {
     sendTemplate(Email, 'asset.labs.app@gmail.com', 'd-fcbfafbb60504701b9786bc29344ed7c', emailCode);
     console.log("Email was sent");
    }
    catch (err){
console.log("Error sending the email "+ err);
    }
/*
   async function sendEmail() {
    try {
      await sgMail.send(getMessage());
      console.log('Test email sent successfully');
    } catch (error) {
      console.error('Error sending test email');
      console.error(error);
      if (error.response) {
        console.error(error.response.body)
      }
    }
  }
  sendEmail();
  */
    var ret = { error: error, code : code};

    res.status(200).json(ret);
     try
      {

    }

      catch(e)
      {
        error = e.toString();
      }
      });


// ingoing : Email, username
//outgoing: error

// Checks if the user with username/email alredy exists. return corresponding error
    app.post('/api/checkexistance', async (req, res, next) =>
    {
      const { Email, Login } = req.body;
     console.log("Checking "+ Email +" " +Login + "for existed user");
     //compares the token from the input with the token saved to the user

     const db = client.db();
     const results = await db.collection('Users').find({Login:Login}).toArray();
     var id = -1;
     var username = "";
     var ret = "";

     if( results.length > 0 )
     {
      // id = results[0].userId;
      //console.log(results.length);
       username = results[0].Login;
      //console.log("The user exists with " + username);

      ret = {error:"This Username is already taken"};

     } else {
        const results2 = await db.collection('Users').find({Email:Email}).toArray();

     var email = "";

    //  var ret;
    console.log(results2.length);
     if( results2.length > 0 )
     {
      // id = results[0].userId;
       email = results2[0].Email;
     // console.log("The user exists with " + email);

      ret = {error:"The user with the same email already exists"};

     }

    }

    res.status(200).json(ret);
   });
   // Ingoing : SN (serial NUmber)
 // Outgoing {error ,correct} Return either error "This S/N already exists" or correct "Unique S/N"
  app.post('/api/verifySN', async (req, res, next) =>
  {
    const {Serial } = req.body;
    console.log(Serial);
    var ret = "";
    var error="";
    var correct = "";
   //compares the S/N with the ones in Database

   const db = client.db();
   const results = await db.collection('Assets').find({Serial:Serial}).toArray();
   console.log(results.length);
   if( results.length > 0 )
   {
   error = "This S/N already exists";

   } else {

  correct = "Unique S/N";

  }

   ret = {error: error, correct: correct};
  res.status(200).json(ret);
 });
 app.post('/api/searchassets', async (req, res, next) =>
     {
       // incoming: userId, search
       // outgoing: results[], error

       var error = '';

       const { userId, search, jwtToken } = req.body;

       try
       {
         if( token.isExpired(jwtToken))
         {
           var r = {error:'The JWT is no longer valid', jwtToken: ''};
           res.status(200).json(r);
           return;
         }
       }
       catch(e)
       {
         console.log(e.message);
       }

       var _search = search.trim();

       const db = client.db();
       const nameResults = await db.collection('Assets').find({userId: userId, Name:{$regex: ".*" + _search + ".*", $options: 'i'}}).toArray();
       const brandResults = await db.collection('Assets').find({userId: userId, Brand:{$regex: ".*" + _search + ".*", $options: 'i'}}).toArray();
       const modelResults = await db.collection('Assets').find({userId: userId, Model:{$regex: ".*" + _search + ".*", $options: 'i'}}).toArray();
       const catResults = await db.collection('Assets').find({userId: userId, Category:{$regex: ".*" + _search + ".*", $options: 'i'}}).toArray();
       const locResults = await db.collection('Assets').find({userId: userId, Location:{$regex: ".*" + _search + ".*", $options: 'i'}}).toArray();
       const replResults = await db.collection('Assets').find({userId: userId, Replacement:{$regex: ".*" + _search + ".*", $options: 'i'}}).toArray();
       const serResults = await db.collection('Assets').find({userId: userId, Serial:{$regex: ".*" + _search + ".*", $options: 'i'}}).toArray();

       var _ret = [];
       var seenIds = [];
       var seen = false;

       //*********************************************************************************************************************************************************************************
       //Name Results return
       for( var i=0; i<nameResults.length; i++ ){

         seenIds.push(nameResults[i]._id);
         _ret.push(nameResults[i]);
       }
       //*********************************************************************************************************************************************************************************

       //*********************************************************************************************************************************************************************************
       //Brand Results return
       seen = false;
       for(var i = 0; i < brandResults.length; i++){

         for (var j = 0; j < seenIds.length; j++) {

           if (brandResults[i]._id.equals(seenIds[j])) {

             seen = true;
             break;
           }
         }

         if (seen == true) {

           seen = false;
         }
         else{

           seenIds.push(brandResults[i]._id);
           _ret.push(brandResults[i]);
         }
       }
       //*********************************************************************************************************************************************************************************

       //*********************************************************************************************************************************************************************************
       //Model Results return
       seen = false;
       for(var i = 0; i < modelResults.length; i++){

         for (var j = 0; j < seenIds.length; j++) {

           if (modelResults[i]._id.equals(seenIds[j])) {

             seen = true;
             break;
           }
         }

         if (seen == true) {

           seen = false;
         }
         else{

           seenIds.push(modelResults[i]._id);
           _ret.push(modelResults[i]);
         }
       }
       //*********************************************************************************************************************************************************************************

       //*********************************************************************************************************************************************************************************
       //Category Results return
       seen = false;
       for(var i = 0; i < catResults.length; i++){

         for (var j = 0; j < seenIds.length; j++) {

           if (catResults[i]._id.equals(seenIds[j])) {

             seen = true;
             break;
           }
         }

         if (seen == true) {

           seen = false;
         }
         else{

           seenIds.push(catResults[i]._id);
           _ret.push(catResults[i]);
         }
       }
       //*********************************************************************************************************************************************************************************

       //*********************************************************************************************************************************************************************************
       //Location Results return
       seen = false;
       for(var i = 0; i < locResults.length; i++){

         for (var j = 0; j < seenIds.length; j++) {

           if (locResults[i]._id.equals(seenIds[j])) {

             seen = true;
             break;
           }
         }

         if (seen == true) {

           seen = false;
         }
         else{

           seenIds.push(locResults[i]._id);
           _ret.push(locResults[i]);
         }
       }
       //*********************************************************************************************************************************************************************************

       //*********************************************************************************************************************************************************************************
       //Replacement Results return
       seen = false;
       for(var i = 0; i < replResults.length; i++){

         for (var j = 0; j < seenIds.length; j++) {

           if (replResults[i]._id.equals(seenIds[j])) {

             seen = true;
             break;
           }
         }

         if (seen == true) {

           seen = false;
         }
         else{

           seenIds.push(replResults[i]._id);
           _ret.push(replResults[i]);
         }
       }
       //*********************************************************************************************************************************************************************************

       //*********************************************************************************************************************************************************************************
       //Serial Results return
       seen = false;
       for(var i = 0; i < serResults.length; i++){

         for (var j = 0; j < seenIds.length; j++) {

           if (serResults[i]._id.equals(seenIds[j])) {

             seen = true;
             break;
           }
         }

         if (seen == true) {

           seen = false;
         }
         else{

           seenIds.push(serResults[i]._id);
           _ret.push(serResults[i]);
         }
       }
       //*********************************************************************************************************************************************************************************

       var refreshedToken = null;
       try
       {
         refreshedToken = token.refresh(jwtToken).accessToken;
       }
       catch(e)
       {
         console.log(e.message);
       }

       var ret = { results:_ret, error: error, jwtToken: refreshedToken };

       res.status(200).json(ret);
     });
     app.post('/api/edititem', async (req, res, next) =>
     {
       //var ret='';
       var error = '';
       const { userId, Name, Brand, Model, Category, Location, Replacement, Serial, itemId, jwtToken } = req.body;
     
        try
       {
         if( token.isExpired(jwtToken))
         {
           var r = {error:'The JWT is no longer valid', jwtToken: ''};
           res.status(200).json(r);
           return;
         }
       }
       catch(e)
       {
         console.log(e.message);
       }


      // const filter = {userId: userId, itemId: itemId}
      // const newItem = {Name:Name, Brand:Brand, Model:Model, Category:Category, Location:Location, Replacement:Replacement, Serial:Serial};

      var myfilter = {itemId:itemId};
      var newitem = {$set: {Name:Name, Brand:Brand, Model:Model, Category:Category, Location:Location, Replacement:Replacement, Serial:Serial}}
       try{

         const db = client.db();
       //  const result = db.collection('Assets').findOneandUpdate(filter, newItem);
         db.collection("Assets").updateOne(myfilter, newitem, function(err, res) {
          if (err) throw err;
         // console.log("User Updated: " );


        })

      
       }
       catch(e){

         error = e.toString();
       }
       var refreshedToken = null;
       
       try{

         refreshedToken = token.refresh(jwtToken).accessToken;
       }
       catch(e){

         console.log(e.message);
       }

       var ret = { error: error, jwtToken: refreshedToken};

       res.status(200).json(ret);
     });

     app.post('/api/search', async (req, res, next) =>
     {
 var error = "";
      const {userId} = req.body;
      const db = client.db();
      
      var arr= [];
      console.log("arr.length:" + arr.length);
       
      try
       {
         if( token.isExpired(jwtToken))
         {
           var r = {error:'The JWT is no longer valid', jwtToken: ''};
           res.status(200).json(r);
           return;
         }
       }
       catch(e)
       {
         console.log(e.message);
       }
 
       var refreshedToken = null;
 
       try
       {
         refreshedToken = token.refresh(jwtToken).accessToken;
       }
       catch(e)
       {
         console.log(e.message);
       }
 
       try
       {
         arr = await db.collection('Assets').find({userId:userId}).toArray();
        // console.log("Delete " + arr.length);
       }
       catch(e)
       {
         error = e;
       }
       var ret = { error: error, jwtToken: refreshedToken, arr:arr};
        arr = [];
      //  console.log("arr.length after"+ arr.length);
       res.status(200).json(ret);
     });
}
