
module.exports = function (sequelize, DataTypes) {


    //TODO Password authentication
    
    const User = sequelize.define('user', {
        userID: {
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

    return User;

};