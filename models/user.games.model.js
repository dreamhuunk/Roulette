module.exports = function (sequelize, Sequelize) {

    const UserGames = sequelize.define('userGame', {
    },
    {
        timestamps: false
    }
    );
    return UserGames;

};