/*jshint sub:true*/

const db = require('../config/db.config');
const Sequelize = db.Sequelize;
const User = db.user;
const UserCasino = db.userCasino;
const Casino = db.casino;
const Game = db.games;
const Bets = db.bets;
const response = require('../utils/response');
const RouletteError = require('../errors/RouletteError');
const ErrorConstant = require('../errors/errorhandling');
const Enum = require('../utils/enums');
const Op = Sequelize.Op;

const GAME_STATUS =  Enum.GAMESTATUS;


exports.registerUser = async function (req, res) {

    let user = {
        userName: req.body["user_name"]
    };

    await User.create(user)
        .then(user => {
            response.responseWriter(res, 200, { user_id: user.getUserID(), user_name: user.getUserName() });
        })
        .catch(err => {
            //Unique Constraint fails
            if (err instanceof Sequelize.ValidationError) {
                throw new RouletteError(ErrorConstant.userNameAlreadyTaken(), 400);
            }

        });
};


exports.rechargeBalance = async function (req, res) {

    //Using transactions to prevent parallel updates
    //Sequelize ORM return only number of rows updated in MySQL due to its limitation hence making two retrieve calls

    const t = await db.sequelize.transaction();

    try {

        const id = parseInt(req.params.id, 10);
        let user = await User.findByPk(id);

        if (!user) {
            throw new RouletteError(ErrorConstant.userNotFoundMsg(), 404);
        }

        //Input validate balance amount

        await User.update({
            BalanceAmount: user.getBalanceAmount() + req.body["balance_amount"]
        }, {
            where: {
                userID: id
            }
        }, { transaction: t })
            .then(async result => {
                let updatedUser = await User.findByPk(id);
                return response.responseWriter(res, 200, { user_id: updatedUser.getUserID(), balance_amount: updatedUser.getBalanceAmount() });
            });
        await t.commit();

    } catch (error) {

        //Catch block is added for rollback purpose
        await t.rollback();
        throw error;
    }

};


exports.enterCasino = async function (req, res) {

    const id = parseInt(req.params.id, 10);
    const casinoID = parseInt(req.params["casino_id"], 10);


    await verifyUserAndCasino(req,res,id,casinoID);

    const userCasino = await UserCasino.findAll({
        where: {
            userID: id,
            userStatus: true
        }
    });

    if (userCasino.length>0) {
        let userCasinoID =  userCasino[0].getCasinoID();

        if(userCasinoID !== casinoID)
        {
            throw new RouletteError(ErrorConstant.userPresentInDifferentCasino(), 400);
        }
        else
        {
            throw new RouletteError(ErrorConstant.userIsAlreadyPresentInCasino(), 400);
        }
        
    }

    await UserCasino.create({
        userID: id,
        casinoID: casinoID
    })
        .then(result => {
            return response.responseWriter(res, 200, { user_id: result.getUserID(), casino_id: result.getCasinoID(), message : "Casino Entered Successfully" });
        });
};



exports.getGamesList = async function (req, res) {

    const id = parseInt(req.params.id, 10);
    const casinoID = parseInt(req.params["casino_id"], 10);

    await verifyUserAndCasino(req,res,id,casinoID);

    //Only bettable games must be listed

    let games =  await Game.findAll({
        attributes : ['gameID'],
        where : {casinoID : casinoID, status: GAME_STATUS.START }
    });

    response.responseWriter(res,200,{games : games});


};



const verifyUserAndCasino = async function (req,res,id,casinoID) {

    let user = await User.findOne({
        where: { userID: id }
    });

    if (!user) {
        throw new RouletteError(ErrorConstant.userNotFoundMsg(), 404);
    }
    const casino = await Casino.findByPk(casinoID);
    if (!casino) {
        throw new RouletteError(ErrorConstant.casinoNotFoundMsg(), 404);
    }
};

//Verify if it is a valid game

const verifyAndGetGameCasino = async function (gameID,casinoID) {

    let game = await Game.findByPk(gameID);


    if(!game)
    {
        throw new RouletteError(ErrorConstant.invalidGame(),400);
    }


    let gamecasinoID = game.getCasinoID();

    //Checking whether game belongs to same casino as user

    if(casinoID !== gamecasinoID)
    {
        throw new RouletteError(ErrorConstant.gameBelongsToDifferentCasino(), 400);
    }

    let gameStatus = game.getGameStatus();


    if(gameStatus === GAME_STATUS.STOPPED)
    {
        throw new RouletteError(ErrorConstant.cannotBetOnStoppedGame(),400);
    }
    else if(gameStatus === GAME_STATUS.COMPLETED)
    {
        throw new RouletteError(ErrorConstant.cannotBetOnCompletedGame(),400);
    }

    return gamecasinoID;

};



exports.betOnGame = async function (req,res) {

    const id = parseInt(req.params.id, 10);
    const casinoID = parseInt(req.params["casino_id"], 10);

    await verifyUserAndCasino(req,res,id,casinoID);

    let gameID = req.body['game_id'];


    let gamecasinoID = await verifyAndGetGameCasino(gameID,casinoID);

    //Check if user is already present in a game

    await checkIfUserhasActiveGame(req,res,id);

    return await placeBet(req,res,id,gameID,gamecasinoID);


};







const placeBet = async function (req,res,userID,gameID,gameCasinoID) 
{
    res.send("Bet has been added");
};


const checkIfUserhasActiveGame = async function (req,res,userID)
{
    let user = await User.findAll({
        where : {
            userID : userID
        },
        include : {
            model  : Game,
            as: 'games',
            where : {
                status: {
                    [Op.in]: [GAME_STATUS.START,GAME_STATUS.STOPPED]
                }
            }
        }

    });

    if(user)
    {
        if(user.length>0)
        {
            throw new RouletteError(ErrorConstant.userAlreadyBelongToALiveGame(),400);
        }
    }
};




