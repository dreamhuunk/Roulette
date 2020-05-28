const db = require('../config/db.config');

const Sequelize = db.Sequelize;

const Dealer = db.dealer;
const Game = db.games;

const BetSummary = db.betSummary;

const response = require('../utils/response');
const RouletteError = require('../errors/RouletteError');
const ErrorConstant = require('../errors/errorhandling');

const Enums = require('../utils/enums');

const GAME_ACTION = Enums.GAMEACTION;

const GAME_STATUS = Enums.GAMESTATUS;


//TO DO any one knowing the Dealer ID can create game have to implement permissions

exports.createGame = async function (req, res) {

    //TODO node name has to be changed

    let dealerID = req.body.DealerID;

    let dealer = await Dealer.findByPk(dealerID);

    if (!dealer) {
        throw new RouletteError(ErrorConstant.dealerNotFound(), 404);
    }

    let casinoID = dealer.getCasinoID();

    await Game.create({ casinoID: casinoID })
        .then(game => {
            return response.responseWriter(res, 200, {
                game_id: game.getGameID(),
                message: "Game has been created & started sucessfully"
            });
        });

};


exports.updateGame = async function (req, res) {


    let gameAction = req.body.action;
    let gameID = req.params.id;


    //Checking if the dealer is valid

    let dealerID = req.body.DealerID;

    let dealer = await Dealer.findByPk(dealerID);

    if (!dealer) {
        throw new RouletteError(ErrorConstant.dealerNotFound(), 404);
    }

    //Getting the game to check if it exits

    let game = await Game.findByPk(gameID);

    if (!game) {
        throw new RouletteError(ErrorConstant.gameNotFound(), 404);
    }

    let dealerCasinoID = dealer.getCasinoID();

    let gameCasinoID = game.getCasinoID();


    let isFromSameCasino = dealerCasinoID === gameCasinoID;

    if (!isFromSameCasino) {
        throw new RouletteError(ErrorConstant.dealerGameCasinoMismatch(), 400);
    }

    switch (gameAction) {
        case GAME_ACTION.STOP: {
            return stopGame(req, res, game, gameID);
        }
        case GAME_ACTION.THROW_NUMBER: {
            return throwNumber(req, res, game, gameID);
        }
        default: {
            throw new RouletteError(ErrorConstant.incorrectAction(), 400);
        }
    }
};


const stopGame = async function (req, res, game, gameID) {

    let gameStatus = game.getGameStatus();

    if (gameStatus === GAME_STATUS.STOPPED) {
        throw new RouletteError(ErrorConstant.gameAlreadyStopped(), 400);
    }

    else if (gameStatus === GAME_STATUS.COMPLETED) {
        throw new RouletteError(ErrorConstant.gameAlreadyEnded(), 400);
    }


    //Using transaction so that partial status are rolled back

    const t = await db.sequelize.transaction();

    try {
        await Game.update({
            status: 1
        }, {
            where: {
                gameID: gameID
            },
            transaction: t
        })
            .then(async result => {
                return response.responseWriter(res, 200, { game_id: gameID, message: "Game has been Stopped Successfully" });
            });

        await t.commit();
    }
    catch (error) {
        //Catch block is added for rollback purpose
        await t.rollback();
        throw error;
    }

};



const throwNumber = async function (req, res, game, gameID) {

    let gameStatus = game.getGameStatus();

    if (gameStatus === GAME_STATUS.COMPLETED) {
        throw new RouletteError(ErrorConstant.gameAlreadyEnded(), 400);
    }

    else if (gameStatus !== GAME_STATUS.STOPPED) {
        throw new RouletteError(ErrorConstant.gameIsStillInProgress(), 400);
    }

    const t = await db.sequelize.transaction();

    //TO-DO handling for calculating winners

    try {

        let thrownNumber = Math.floor(Math.random() * 36) + 1;



        const updatedRows = await Game.update({
            status: 2,
            winningNumber: thrownNumber,
            endTime: db.sequelize.literal('CURRENT_TIMESTAMP')
        }, {
            where: {
                gameID: gameID
            },
            transaction: t
        });

        if(!updatedRows)
        {
            throw Error();
        }

        //Game has ended so get the value from Bet Summary Table for the given gameID and thrown number double the value and update in DB

        const winnerBets = await BetSummary.findAll({
            where: {
                gameID: gameID,
                betNumber: 1 //Testing replace with random number
            }
        });


        if (winnerBets && winnerBets.length ==0) {
            console.log("winner Summarry is empty");
            response.responseWriter(res,200,{message : "Guess no luck today for anyone casino won it all"});
            await t.commit();  
        }

        else
        {

            winnerBets.forEach(
                (bet) => {

                    const userID = bet.getUserID();
                    const totalBetAmount = bet.getTotalBetAmount();

                    let updatedTotal = 2 * totalBetAmount;

                    let updatedRows = 1;



                }
            );

            await t.commit();
        }


        


    }
    catch (error) {
        //Catch block is added for rollback purpose
        await t.rollback();
        throw error;
    }
};