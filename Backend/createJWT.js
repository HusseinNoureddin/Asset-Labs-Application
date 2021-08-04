const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.createToken = function ( fn, ln, id )
{
    return _createToken( fn, ln, id );
}

_createToken = function ( fn, ln, id )
{
    try
    {
      const expiration = new Date();
      const user = {userId:id,firstName:fn,lastName:ln};
      // console.log("In createToken: id: "+ id)
         // const accessToken =  jwt.sign( user, process.env.ACCESS_TOKEN_SECRET);

     //
      const accessToken= jwt.sign(user,process.env.ACCESS_TOKEN_SECRET, 
         { expiresIn: '60m'} );
                       
      //

      var ret = {accessToken:accessToken};
    }
    catch(e)
    {
      var ret = {error:e.message};
    }
    return ret;
}

exports.isExpired = function( token )
{
   var isError = jwt.verify( token, process.env.ACCESS_TOKEN_SECRET, 
     (err, verifiedJwt) =>
   {
     if( err )
     {
       return true;
     }
     else
     {
       return false;
     }
   });

   return isError;

}

exports.refresh = function( token )
{
  var ud = jwt.decode(token,{complete:true});

  var userId = ud.payload.id;
  var firstName = ud.payload.firstName;
  var lastName = ud.payload.lastName;

  return _createToken( firstName, lastName, userId );
}
exports.createTokenPassword = function ( email, pass,code )
{
    return _createTokenPassword( email, pass,code );
}
_createTokenPassword = function ( email, pass ,code)
{
    try
    {
     
      const expiration = new Date();
      
      const user = {email:email,password:pass, code:code};

      // const accessToken =  jwt.sign( user, process.env.ACCESS_TOKEN_SECRET);

     //
      const accessToken= jwt.sign(user,process.env.ACCESS_TOKEN_SECRET, 
         { expiresIn: '60m'} );
                       
      //

      var ret = {accessToken:accessToken};
    }
    catch(e)
    {
      var ret = {error:e.message};
    }
    return ret;
}

exports.createTokenVerify = function ( email,pass, code )
{
    return _createTokenVerify( email,pass, code );
}
_createTokenVerify = function ( email ,pass, code)
{
    try
    {
      console.log("IN the _createTokenVerify\n");
      const expiration = new Date();
      
      const user = {email:email, password:pass, code:code};

      // const accessToken =  jwt.sign( user, process.env.ACCESS_TOKEN_SECRET);

     //
      const accessToken= jwt.sign(user,process.env.ACCESS_TOKEN_SECRET, 
         { expiresIn: '60m'} );
                       
      //

      var ret = {accessToken:accessToken};
    }
    catch(e)
    {
      var ret = {error:e.message};
    }
    return ret;
}
exports.refreshPassword = function( token )
{
  var ud = jwt.decode(token,{complete:true});

  var email = ud.payload.email;
  var pass = ud.payload.password;
  var code = ud.payload.code;
  
  return _createTokenPassword(email,pass, code);
}
exports.refreshEmail = function( token )
{
  var ud = jwt.decode(token,{complete:true});

  var email = ud.payload.email;
  var code = ud.payload.code;
  
  return _createTokenEmail(email,code);
}
exports.createRegisterToken = function ( comp, fn, ln, us,em,ph,pass,id)
{
    return _createRegisterToken( comp, fn, ln, us,em,ph,pass,id);
}

_createRegisterToken = function ( comp, fn, ln, us,em,ph,pass,id )
{
    try
    {
      const expiration = new Date();
     
      const user = {userId:id,CompanyName: comp, FirstName:fn,LastName:ln, Email:em,Phone:ph, Login:us, Password:pass};
console.log("Created a token for the register info");
      // const accessToken =  jwt.sign( user, process.env.ACCESS_TOKEN_SECRET);

     //
      const accessToken= jwt.sign(user,process.env.ACCESS_TOKEN_SECRET, 
         { expiresIn: '60m'} );
                       
      //

      var ret = {accessToken:accessToken};
    }
    catch(e)
    {
      var ret = {error:e.message};
    }
    return ret;
}
