//This table is used for computing the summary of bets 
//We automate the task of computing via a task engine by sending a message via kafka

module.exports = function (sequelize, Sequelize) {

    const BetSummary = sequelize.define('betsummary', {
        betSummaryID: {
          type: Sequelize.DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        betNumber: 
        {
            type: Sequelize.DataTypes.INTEGER,
            allowNull: false,
        },
        totalBetAmount: {
          type: Sequelize.DataTypes.DECIMAL(10, 2),
          allowNull: false,
          defaultValue: '0.00'
        }
      },
      {
        indexes: [
          {
            name: 'user_bets',
            fields: ['userID','gameID','betNumber'] 
            // where: {
            //   betStatus: '0'             //Mysql doesn't support partial index fully hence this wont work
            // }                                                   
          }
          
        ]
      }
    );

    BetSummary.prototype.getTotalBetAmount = function() {
       return parseFloat(this.totalBetAmount);
    };

    BetSummary.prototype.getBetNumber = function() {
      return this.betNumber;
    };

    BetSummary.prototype.getUserID = function() {
        return this.userID;
    };

    return BetSummary;

};