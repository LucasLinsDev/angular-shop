var { expressjwt: jwt } = require("express-jwt");

function authJwt(){
    return jwt({
        secret: "shhhhhhared-secret",
        algorithms: ["HS256"],
        //algorithms: ['RS256']
        isRevoked:isRevoked
      }).unless({
        path:[
        //   {url:/\/api\/v1\/products(.*)/,methods:['GET','OPTIONS']},
        //   {url:/\/api\/v1\/categories(.*)/,methods:['GET','OPTIONS']},
        //   `${api}/users/login`,
        //   `${api}/users/register`,
        // 
        {url:/(.*)/},
      ]
      });
}

async function isRevoked(req,payload,done){
  if(!payload.isAdmin){
    done(null,true)
  }
  done();
}


module.exports=authJwt