//This Model could be avoided by using current casino ID as a column in user however this will lead to a loss of data
//What if in future we want to build a dashboard of famous casinos when won't be having any user record to fill up the dashboard



module.exports = function (sequelize, Sequelize) {

    const casinoUser = sequelize.define('casinoUser', {
        id: {
            type: Sequelize.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        userStatus: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        }
    },
        {
            timestamps: false
        }
    );


    casinoUser.prototype.getUserID = function () {
        return this.userID;
    };

    casinoUser.prototype.getCasinoID = function () {
        return this.casinoID;
    };


    return casinoUser;

};