'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {  // Ensure the table name is lowercase
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,  // Make name required
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,  // Make email required
        unique: true,  // Ensure email is unique
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,  // Make password required
      },
      role: {
        type: Sequelize.ENUM('admin', 'user'),  // Define role with ENUM
        defaultValue: 'admin',  // Default role
      },
      status: {
        type: Sequelize.ENUM('active', 'suspended', 'deleted'),  // Status ENUM
        defaultValue: 'active',  // Default status
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),  // Automatically set createdAt
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),  // Automatically update on changes
      }


    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users');  // Drop the table on migration rollback
  }
};
