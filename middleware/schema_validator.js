const Joi = require('@hapi/joi');

exports.schemaValidator = (schema) => { 
  return (req, res, next) => { 
    const { error } = schema.validate(req.body); 
    const valid = error == null; 
    if (valid) { next(); } 
    else { 
      const { details } = error; 
      const message = details.map(i => i.message).join(',');
      console.log("error", message); 
      return res.status(422).json({ error: message }) ;
    } 
  };
};