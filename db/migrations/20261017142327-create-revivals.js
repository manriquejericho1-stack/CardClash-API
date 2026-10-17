'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('revivals', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      aid_request_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'aid_requests',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      aiding_participant_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'participants',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      outcome: {
        type: Sequelize.STRING(30),
        allowNull: false,
      },

      revival_cost: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      points_before_revival: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      points_retained: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      points_transferred: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      processed_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('revivals');
  },
};