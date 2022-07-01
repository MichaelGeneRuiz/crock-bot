// Creates a CurrencyShop model
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('currency_shop', {
        // Shop item
        name: {
            type: DataTypes.STRING,
            unique: true,
        },
        // Cost of shop item
        cost: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        // Icon
        icon: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {
        timestamps: false,
    });
};