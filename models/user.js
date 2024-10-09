'use strict';
const {
    Model,
    DataTypes // Import DataTypes from sequelize
} = require('sequelize');

module.exports = (sequelize) => {
    class User extends Model {
        static associate(models) {
            User.hasMany(models.sale, { foreignKey: 'userId' });
        }
    }

    // Initialize the User model
    User.init({
        name: {
            type: DataTypes.STRING,
            allowNull: false, // Make name required
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false, // Make email required
            unique: true, // Ensure email is unique
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false, // Make password required
        },
        role: {
            type: DataTypes.ENUM('admin', 'user'), // Define role with ENUM
            defaultValue: 'admin', // Default role
        },
        status: {
            type: DataTypes.ENUM('active', 'suspended', "deleted"),
            defaultValue: 'active', // Default status
        },
    }, {
        sequelize,
        modelName: 'user', // Use lowercase
        tableName: 'users', // Ensure the table name is lowercase
        timestamps: true, // Enable createdAt and updatedAt fields
    });

    return User;
};
