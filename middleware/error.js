//All uncaught exception will be handled here

const response = require('../utils/response');
const RouletteError = require('../errors/RouletteError');

module.exports = function(err,req,res,next)
{
    if(err instanceof RouletteError)
    {
        return response.responseWriter(res,err.status,{message : err.message});
    }
    //TODO Logging has to be added
    console.log(err.message);
    return response.responseWriter(res,500,{message: "Internal Error"});

};