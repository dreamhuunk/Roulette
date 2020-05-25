
const db = require('../config/db.config');
const Casino = db.casino;
const Dealer = db.dealer;
const Sequelize = db.Sequelize;
const response = require('../utils/response');
const RouletteError = require('../errors/RouletteError');
const ErrorConstant = require('../errors/errorhandling');



//Registering a casino
//To Do getting value from req.body change to middlewere

exports.registerCasino = async function (req, res, next) {
    await Casino.create(req.body)
        .then(casino => {
            response.responseWriter(res, 200, casino);
        })
        .catch(err => {
            //Unique Constraint fails
            if (err instanceof Sequelize.ValidationError) {
                throw new RouletteError(ErrorConstant.nameTakenMsg(), 400);
            }

        });
};

//Recharge Balance

exports.rechargeBalance = async function (req, res, next) {

    //Using transactions to prevent parallel updates
    //Package limitation hence making to retrieve calls

    const t = await db.sequelize.transaction();

    try {

        const id = parseInt(req.params.id, 10);
        let casino = await Casino.findByPk(id);

        if (!casino) {
            throw new RouletteError(ErrorConstant.casinoNotFoundMsg(), 404);
        }

        await Casino.update({
            BalanceAmount: casino.getBalanceAmount() + req.body.BalanceAmount
        }, {
            where: {
                casinoID: id
            }
        }, { transaction: t })
            .then(async result => {
                let updatedCasino = await Casino.findByPk(id);
                return response.responseWriter(res, 200, updatedCasino);
            });
        await t.commit();

    } catch (error) {

        //Catch block is added for rollback purpose
        await t.rollback();
        throw error;
    }
};



exports.addDealer = async function (req, res, next) {

    //TO DO casino Should be ID 
    const casinoID = parseInt(req.params.id, 10);
    const casino = await Casino.findByPk(casinoID);
    if (!casino) {
        throw new RouletteError(ErrorConstant.casinoNotFoundMsg(), 404);
    }

    await Dealer.create({
        name: req.body.name,
        casinoID : casinoID
    })
    .then( result => {
        return response.responseWriter(res,200,result);
    });
        
};


exports.listDealers = async function (req, res) {

    const casinoID = parseInt(req.params.id, 10);
    const casino = await Casino.findByPk(casinoID);
    if (!casino) {
        throw new RouletteError(ErrorConstant.casinoNotFoundMsg(), 404);
    }

    let casinoDealers = {
        casinoID: casinoID,
        dealers : []
    };
    dealers = await Dealer.findAll({
        attributes : ['name','DealerID'],
        where : {
            casinoID : casinoID
        }
    });
    if(dealers)
    {
        casinoDealers.dealers = dealers;
    }
    return response.responseWriter(res,200,casinoDealers);
};