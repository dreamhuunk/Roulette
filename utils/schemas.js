const Joi = require('@hapi/joi');


exports.common = {

    amountValidator: Joi.object({

        balance_amount: Joi.number()
            .required()
            .positive()
            .messages({
                'number.base': `balance_amount should be a number`,
                'number.positive': `balance_amount should be a positive value`,
                'number.empty': `invalid value passed for balance_amount`

            })
    }),

    betValidator: Joi.object({
        game_id: Joi.number()
            .integer()
            .required()
            .messages({
                'number.base': `Invalid value passed for game_id`,
                'number.required' : `Invalid value passed for game_id`
            }),
        bet_number: Joi.number()
            .integer()
            .required()
            .min(1)
            .max(36)
            .messages({
                'number.base': `Invalid value passed for bet_number`,
                'number.min': `bet_number should be between 1 and 36`,
                'number.max': `bet_number should be between 1 and 36`,
            }),
        bet_amount: Joi.number()
            .required()
            .positive()
            .messages({
                'number.base': `bet_amount should be a number`,
                'number.positive': `bet_amount should be a positive value`,
                'number.empty': `invalid value passed for bet_amount`

            })
        })
    }; 