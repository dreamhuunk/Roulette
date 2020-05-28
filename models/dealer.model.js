const Casino = require('./casino.model');

module.exports = function (sequelize, DataTypes) {

    const Dealer = sequelize.define('dealer', {
        dealerID: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        name: 
        {
            type: DataTypes.STRING,
            allowNull: false,
        },
      }
    );

    Dealer.prototype.getCasinoID = function () {
      return this.casinoID;
    };

    Dealer.prototype.getDealerID = function () {
      return this.dealerID;
    };
    return Dealer;
};