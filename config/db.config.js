

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
const Bets = require('../models/bet.model')(sequelize,Sequelize);
const UserGames = require('../models/user.games.model')(sequelize,Sequelize);


//Relationships


Dealer.belongsTo(Casino, {foreignKey: 'casinoID', sourceKey: 'casinoID'});
Casino.hasMany(Dealer, {foreignKey: 'casinoID', sourceKey: 'casinoID'});



Games.belongsTo(Casino, {foreignKey: 'casinoID', sourceKey: 'casinoID'});
Casino.hasMany(Games, {foreignKey: 'casinoID', sourceKey: 'casinoID'});



//User can be present in one casino at a time
//CurrentCasino has to be tracked as per provided resources hence opting for this

User.belongsTo(Casino,{foreignKey: 'casinoID', sourceKey: 'casinoID'});

Casino.hasMany(User, {foreignKey: 'casinoID', sourceKey: 'casinoID'});


Bets.belongsTo(Games,{foreignKey: 'gameID', sourceKey: 'gameID', onDelete: 'CASCADE'});
Games.hasMany(Bets,{foreignKey: 'gameID', sourceKey: 'gameID'});


Bets.belongsTo(User,{foreignKey: 'userID', sourceKey: 'userID', onDelete: 'CASCADE'});
User.hasMany(Bets,{foreignKey: 'userID', sourceKey: 'userID'});


User.belongsToMany(Games, { through: UserGames, uniqueKey: 'gameID' });
Games.belongsToMany(User, { through: UserGames, uniqueKey: 'userID' });




db.casino = Casino;
db.dealer = Dealer;
db.games = Games;
db.user = User;
db.bets = Bets;

module.exports = db;

