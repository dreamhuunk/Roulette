module.exports = function (sequelize, Sequelize) {

    const Bets = sequelize.define('bet', {
        betID: {
          type: Sequelize.DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        betNumber: 
        {
            type: Sequelize.DataTypes.INTEGER,
            allowNull: false,
        },
        betAmount: {
          type: Sequelize.DataTypes.DECIMAL(10, 2),
          allowNull: false,
          defaultValue: '0.00'
        },
        betTime: {
            type: Sequelize.DataTypes.DATE,
            allowNull: false,
            defaultValue: Sequelize.fn('now')

        }
      },
      {
        timestamps: false
      }
    );


    Bets.prototype.getBetID = function () {
      return this.betID;
    };

    Bets.prototype.getBetAmount = function() {
      return parseFloat(this.betAmount);
    };

    Bets.prototype.getBetNumber = function() {
      return this.betNumber;
    };

    Bets.prototype.getUserID = function() {
      return this.userID;
    };

    Bets.prototype.getGameID = function() {
      return this.gameID;
    };

    return Bets;

};