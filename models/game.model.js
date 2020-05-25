module.exports = function (sequelize, Sequelize) {

    const Games = sequelize.define('game', {
        gameID: {
          type: Sequelize.DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        status: {
            type: Sequelize.DataTypes.INTEGER(2),
            defaultValue: '0',
            allowNull: false,
        },
        startTime: {
            type: Sequelize.DataTypes.DATE,   
            allowNull: false,
            defaultValue: Sequelize.fn('now')

        },
        endTime : {
            type: Sequelize.DataTypes.DATE,
            defaultValue: null
        },

        winningNumber:{
            type: Sequelize.DataTypes.INTEGER,
            defaultValue: null
        }
       
    },
    {
        timestamps: false
    }
    );

    Games.prototype.getGameID = function () {
        return this.gameID;
      };

    Games.prototype.getCasinoID = function () {
        return this.casinoID;
      };

    Games.prototype.getGameStatus = function() {
        return this.status;
    };    

    return Games;

};