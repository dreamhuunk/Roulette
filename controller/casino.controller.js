/*jshint sub:true*/

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

    let casinoObj = {
        name : req.body['name']
    };
    await Casino.create(casinoObj)
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

        let casinoBalanceAmount  = req.body['balance_amount'];

        if (!casino) {
            throw new RouletteError(ErrorConstant.casinoNotFoundMsg(), 404);
        }

        let updatedRows = await Casino.update({
            BalanceAmount: casino.getBalanceAmount() + casinoBalanceAmount
        }, {
            where: {
                casinoID: id
            },
            transaction: t
        })
            .then(async result => {
                await t.commit();
                let updatedCasino = await Casino.findByPk(id);
                return response.responseWriter(res, 200, { casino_id: updatedCasino.getCasinoID(), balance_amount: updatedCasino.getBalanceAmount() });
            });


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

    const dealerName = req.body['dealer_name'];

    if (!casino) {
        throw new RouletteError(ErrorConstant.casinoNotFoundMsg(), 404);
    }

    await Dealer.create({
        name: dealerName,
        casinoID: casinoID
    })
        .then(dealer => {
            return response.responseWriter(res, 200, {dealer_id: dealer.getDealerID(),casinoID: dealer.getCasinoID(),message:"Dealer Added Successfully"});
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
        dealers: []
    };
    dealers = await Dealer.findAll({
        attributes: ['name', 'DealerID'],
        where: {
            casinoID: casinoID
        }
    });
    if (dealers) {
        casinoDealers.dealers = dealers;
    }
    return response.responseWriter(res, 200, casinoDealers);
};