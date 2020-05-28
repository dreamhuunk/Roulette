
module.exports = function (sequelize, DataTypes) {

    const Casino = sequelize.define('casino', {
        casinoID: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        name: 
        {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        BalanceAmount: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
          defaultValue: '0.00'
        },
      }

    );

    Casino.prototype.getBalanceAmount = function () {
      return parseFloat(this.BalanceAmount);
    };

    Casino.prototype.getCasinoID = function() {
      return this.casinoID;
    };

    return Casino;

};