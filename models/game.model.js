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
        endTime :{
            type: Sequelize.DataTypes.DATE,
            defaultValue: null
        },

        winningNumber:{
            type: Sequelize.DataTypes.INTEGER
        }
       
    }
    );

    return Games;

};