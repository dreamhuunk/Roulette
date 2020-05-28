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
const UserGames = db.userGames;

const GAME_STATUS = Enum.GAMESTATUS;

const Messenger = require('../utils/messenger');


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



const checkUserPresenceInCasino = async function (userID,casinoID,isFromBets)
{
    const userCasino = await UserCasino.findAll({
        where: {
            userID: userID,
            userStatus: true
        }
    });

    if (userCasino.length > 0) {
        let userCasinoID = userCasino[0].getCasinoID();

        if (userCasinoID !== casinoID) {
            throw new RouletteError(ErrorConstant.userPresentInDifferentCasino(), 400);
        }
        if(!isFromBets)
        {
            {
                throw new RouletteError(ErrorConstant.userIsAlreadyPresentInCasino(), 400);
            }
        }
    }


    //User has to be present in a casino to make bets

    else if(isFromBets)
    {
        throw new RouletteError(ErrorConstant.userNotPresentInTheCasino(), 400);
    }
};


exports.enterCasino = async function (req, res) {

    const id = parseInt(req.params.id, 10);
    const casinoID = parseInt(req.params["casino_id"], 10);


    await verifyUserAndCasino(req, res, id, casinoID);

    await checkUserPresenceInCasino(id,casinoID,false);

    await UserCasino.create({
        userID: id,
        casinoID: casinoID
    })
        .then(result => {
            return response.responseWriter(res, 200, { user_id: result.getUserID(), casino_id: result.getCasinoID(), message: "Casino Entered Successfully" });
        });
};



exports.getGamesList = async function (req, res) {

    const id = parseInt(req.params.id, 10);
    const casinoID = parseInt(req.params["casino_id"], 10);

    await verifyUserAndCasino(req, res, id, casinoID);

    //Only bettable games must be listed

    let games = await Game.findAll({
        attributes: ['gameID'],
        where: { casinoID: casinoID, status: GAME_STATUS.START }
    });

    response.responseWriter(res, 200, { games: games });


};



const verifyUserAndCasino = async function (req, res, id, casinoID) {

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

const verifyAndGetGameCasino = async function (gameID, casinoID) {

    let game = await Game.findByPk(gameID);


    if (!game) {
        throw new RouletteError(ErrorConstant.invalidGame(), 400);
    }


    let gamecasinoID = game.getCasinoID();

    //Checking whether game belongs to same casino as user

    if (casinoID !== gamecasinoID) {
        throw new RouletteError(ErrorConstant.gameBelongsToDifferentCasino(), 400);
    }

    let gameStatus = game.getGameStatus();


    if (gameStatus === GAME_STATUS.STOPPED) {
        throw new RouletteError(ErrorConstant.cannotBetOnStoppedGame(), 400);
    }
    else if (gameStatus === GAME_STATUS.COMPLETED) {
        throw new RouletteError(ErrorConstant.cannotBetOnCompletedGame(), 400);
    }

    return gamecasinoID;

};


const checkIfUserhasActiveGame = async function (req, res, userID, gameID) {
    let user = await User.findAll({
        where: {
            userID: userID
        },
        include: {
            model: Game,
            as: 'games',
            where: {
                status: {
                    [Op.in]: [GAME_STATUS.START, GAME_STATUS.STOPPED]
                }
            }
        }

    });


    if (user) {
        if (user.length > 0) {

            //Get the game Object
            let games = user[0].games;

            if (games && games.length > 0) {
                let game = games[0];

                //Check if he already belong to the same game
                let userGameID = game.getGameID();

                if (gameID !== userGameID) {
                    throw new RouletteError(ErrorConstant.userAlreadyBelongToALiveGame(), 400);
                }

                //he has already placed bets in the same game no entry in user game is needed
                return true;

            }


        }
    }

    //if he doesn't belong to any game we have to add an entry to user game
    return false;
};




const placeBet = async function (req, res, userID, gameID, gameCasinoID, hasUserPlacedBetBefore) {

    console.log("HAS USER PLACED BET BEFORE : " + hasUserPlacedBetBefore);

    const t = await db.sequelize.transaction();
    try {
        

        //Using a transaction here so that balanceAmount doesn't turn out to be inconsistent

        let user = await User.findOne(
            {
                where: {
                    userID: userID
                },
                transaction: t

            });


        //All validation are done  we can simply get the bet amount

        let userbalanceAmount = user.getBalanceAmount();
        let betAmount = req.body['bet_amount'];


        //user doesn't have sufficient balance to make the bet

        if (betAmount > userbalanceAmount) {
            throw new RouletteError(ErrorConstant.userDoesnotHaveSufficientBalance(), 400);
        }

        let updatedBalance = userbalanceAmount - betAmount;


        let bet = {
            betNumber: req.body['bet_number'],
            betAmount: betAmount,
            gameID: gameID,
            userID: userID
        };

        let updatedRows = await User.update({
            BalanceAmount: updatedBalance
        }, {
            where: {
                userID: userID
            },
            transaction: t
        });

        //If rows are updated successfully
        if (updatedRows) {
            let betRow = await Bets.create(bet, { transaction: t });

            if (betRow) {
                if (!hasUserPlacedBetBefore) {
                    let userGames = await UserGames.create({ userID: userID, gameID: gameID }, { transaction: t });
                    if (!userGames) {
                        throw new Error("Exception occurred while creating bets");
                    }
                }

               
                
                await Messenger.send("taskengine",{bet_id : betRow.getBetID(),
                     user_id: betRow.getUserID(),
                     game_id: betRow.getGameID(),
                     bet_number : betRow.getBetNumber()
                    });
                //If it has safely reached this point we can commit and return
                await t.commit();    
                return response.responseWriter(res, 200, { bet_amount: betRow.getBetAmount(), bet_number: betRow.getBetNumber() });

            }
            else {
                throw new Error("Exception occurred while creating bets");
            }
        }
        else {
            throw new Error("Exception occurred while creating bets");
        }

    }
    catch (err) {
        await t.rollback();
        throw err;
    }
};



exports.betOnGame = async function (req, res) {

    const id = parseInt(req.params.id, 10);
    const casinoID = parseInt(req.params["casino_id"], 10);

    await verifyUserAndCasino(req, res, id, casinoID);
    
    //We have to check if user exists in the casino he is issuing the bets on
    await checkUserPresenceInCasino(id,casinoID,true);

    let gameID = req.body['game_id'];


    let gamecasinoID = await verifyAndGetGameCasino(gameID, casinoID);

    //Check if user is already present in a game

    let hasUserPlacedBetBefore = await checkIfUserhasActiveGame(req, res, id, gameID);

    return await placeBet(req, res, id, gameID, gamecasinoID, hasUserPlacedBetBefore);
};





