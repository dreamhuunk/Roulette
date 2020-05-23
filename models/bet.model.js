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

        },
        betStatus: {
            type: Sequelize.DataTypes.INTEGER(2),
            allowNull: false,
            defaultValue: '0'
        }

      },
      {
        timestamps: false
      }
    );

    return Bets;

};