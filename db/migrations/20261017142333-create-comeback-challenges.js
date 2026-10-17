'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('comeback_challenges', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      revival_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'revivals',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      participant_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'participants',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      time_limit_sec: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      points_lost: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      points_recovered: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      status: {
        type: Sequelize.STRING(30),
        allowNull: false,
      },

      started_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      ended_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('comeback_challenges');
  },
};