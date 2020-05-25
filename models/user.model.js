
module.exports = function (sequelize, DataTypes) {


    //TODO Password authentication
    
    const User = sequelize.define('user', {
        userID: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        userName: 
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

    User.prototype.getUserID = function () {
      return this.userID;
    };

    User.prototype.getUserName = function() {
      return this.userName;
    };

    User.prototype.getBalanceAmount = function () {
      return parseFloat(this.BalanceAmount);
    };

    return User;

};