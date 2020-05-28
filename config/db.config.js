

//Intializing the DB Connection values

const Sequelize = require("sequelize");

const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    pool: {
        max: parseInt(process.env.POOL_MAX, 10),
        min: parseInt(process.env.POOL_MIN, 10),
        acquire: parseInt(process.env.POOL_ACQUIRE, 10),
        idle: parseInt(process.env.POOL_IDLE, 10)
    }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

const Casino = require('../models/casino.model')(sequelize, Sequelize.DataTypes);
const Dealer = require('../models/dealer.model')(sequelize, Sequelize.DataTypes);
const Games = require('../models/game.model')(sequelize, Sequelize);
const User = require('../models/user.model')(sequelize, Sequelize.DataTypes);
const Bets = require('../models/bet.model')(sequelize, Sequelize);
const UserGames = require('../models/user.games.model')(sequelize, Sequelize);
const BetSummary = require('../models/bet.summary.model')(sequelize,Sequelize);

const UserCasino = require('../models/user.casino.model')(sequelize,Sequelize);


//Relationships


Dealer.belongsTo(Casino, { foreignKey: 'casinoID', sourceKey: 'casinoID' });
Casino.hasMany(Dealer, { foreignKey: 'casinoID', sourceKey: 'casinoID' });



Games.belongsTo(Casino, { foreignKey: 'casinoID', sourceKey: 'casinoID' });
Casino.hasMany(Games, { foreignKey: 'casinoID', sourceKey: 'casinoID' });



//User can be present in one casino at a time
//CurrentCasino has to be tracked as per provided resources hence opting for this


/*
   ORM Frame work limitation it adds an unwanted unqiue key constraint between user ID and casino meaning user can't enter same casino after cashout
   No resoultion for this issue for 4 years
   https://github.com/sequelize/sequelize/issues/3493
*/

// User.belongsToMany(Casino, {unique: false,through : UserCasino, foreignKey: 'userID', otherKey: 'casinoID'});

// Casino.belongsToMany(User, {unique: false,through : UserCasino, foreignKey: 'casinoID', otherKey: 'userID'});

//Work Around

User.hasMany(UserCasino,{ foreignKey: {name: 'userID', allowNull : false}, sourceKey: 'userID', onDelete: 'CASCADE'});
Casino.hasMany(UserCasino,{ foreignKey: {name: 'casinoID', allowNull : false}, sourceKey: 'casinoID', onDelete: 'CASCADE'});



Bets.belongsTo(Games, { foreignKey:  {name : 'gameID',allowNull: false}, sourceKey: 'gameID', onDelete: 'CASCADE' });
Games.hasMany(Bets, { foreignKey: {name: 'gameID', allowNull : false}, sourceKey: 'gameID', onDelete: 'CASCADE' });


Bets.belongsTo(User, { foreignKey:  {name : 'userID',allowNull: false}, sourceKey: 'userID', onDelete: 'CASCADE' });
User.hasMany(Bets, { foreignKey: {name: 'userID',allowNull: false } , sourceKey: 'userID', onDelete: 'CASCADE' });


User.belongsToMany(Games, { through: UserGames, foreignKey: 'userID', otherKey: 'gameID' });
Games.belongsToMany(User, { through: UserGames, foreignKey: 'gameID', otherKey: 'userID' });


 BetSummary.belongsTo(User, { foreignKey:  {name : 'userID',allowNull: false}, sourceKey: 'userID', onDelete: 'CASCADE' });
 User.hasMany(BetSummary, { foreignKey: {name: 'userID',allowNull: false } , sourceKey: 'userID', onDelete: 'CASCADE' });


BetSummary.belongsTo(Games, { foreignKey:  {name : 'gameID',allowNull: false}, sourceKey: 'gameID', onDelete: 'CASCADE' });
Games.hasMany(BetSummary, { foreignKey: {name: 'gameID', allowNull : false}, sourceKey: 'gameID', onDelete: 'CASCADE' });


db.casino = Casino;
db.dealer = Dealer;
db.games = Games;
db.user = User;
db.bets = Bets;
db.userGames = UserGames;
db.userCasino = UserCasino;
db.betSummary = BetSummary;

module.exports = db;

