// Creates a Users model
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('users', {
        // Primary key
        user_id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        // User's balance
        balance: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
    }, {
        timestamps: false,
    });
};