'use strict';
const {
    Model,
    DataTypes // Import DataTypes from sequelize
} = require('sequelize');

module.exports = (sequelize) => {
    class Sale extends Model {
        static associate(models) {
            Sale.belongsTo(models.user, {
                foreignKey: 'userId',
                onDelete: 'CASCADE',
            });
        }
    }

    // Initialize the Sale model
    Sale.init({
        productName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        saleAmount: {
            type: DataTypes.FLOAT, // Use FLOAT for monetary values
            allowNull: false,
        },
        costPrice: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        profit: {
            type: DataTypes.FLOAT, // Use FLOAT for profit as well
            allowNull: false,
        },
        userId: {
            type: DataTypes.INTEGER, // Foreign key for User
            references: {
                model: 'users', // Reference to the 'users' table
                key: 'id',
            },
            allowNull: false,
        },
    }, {
        sequelize,
        modelName: 'sale', // Lowercase model name
        tableName: 'sales', // Table name should be lowercase and plural
        timestamps: true, // Enable createdAt and updatedAt fields
    });

    return Sale;
};
