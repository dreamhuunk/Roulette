//Response Writer can be extended for further version defining a simplified one as of now

module.exports.responseWriter = (res,status,responseObj) => {
    return res.status(status).json(responseObj).end();
};