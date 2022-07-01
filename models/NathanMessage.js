// Creates a NathanMessage model
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('nathan_message', {
        // Message id
        message_id: DataTypes.STRING,
        // Message
        message: DataTypes.STRING,
    }, {
        timestamps: false,
    });
};