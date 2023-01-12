function errorHandler(err,req,res,next){

    if(err.name==="UnauthorizedError"){
        res.status(500).json({message:"The user is not authorized"})
    }

    if(error.name === "ValidationError"){
        return res.status(401).json({message:err})
    }

    return res.status(500).json(err);

}

module.exports=errorHandler